'use strict';

const chat = require('@googleapis/chat');
const { env } = require('../env.js');

const { Message } = require('../model/message');
const { InvalidTokenException } = require('../model/exceptions');

const { FirestoreService } = require('./firestore-service');
const { initializeOauth2Client } = require('./user-auth');

/**
 * Log estruturado em JSON (Cloud Run / Functions Gen2 friendly).
 */
function logJson(severity, payload) {
  if (!env?.logging) return;
  const line = JSON.stringify({ severity, ...payload });
  if (severity === 'ERROR') console.error(line);
  else if (severity === 'WARNING') console.warn(line);
  else console.log(line);
}

/**
 * Extrai info útil do erro (GaxiosError) sem circular.
 */
function safeError(err) {
  return {
    name: err?.name,
    message: err?.message,
    code: err?.code,
    httpStatus: err?.response?.status,
    httpStatusText: err?.response?.statusText,
    data: err?.response?.data,
  };
}

function isUnauthorized(err) {
  const s = err?.response?.status;
  return s === 401;
}

function isInsufficientScopes(err) {
  const s = err?.response?.status;
  const msg = (err?.response?.data?.error?.message || err?.message || '').toLowerCase();
  // Padrão comum: 403 + "insufficient authentication scopes"
  return s === 403 && msg.includes('insufficient') && msg.includes('scope');
}

/**
 * Inicializa um Chat client com OAuth do usuário.
 * @param {!string} userName Ex: "users/AAAA..."
 * @return {Promise<chat.chat_v1.Chat>}
 */
async function initializeChatClientWithUser(userName) {
  const tokens = await FirestoreService.getUserToken(userName);
  if (!tokens) {
    throw new InvalidTokenException('Token not found');
  }

  const oauth2Client = initializeOauth2Client({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  });

  return chat.chat({ version: 'v1', auth: oauth2Client });
}

exports.UserAuthChatService = {
  /**
   * Lista mensagens de um espaço usando credenciais do usuário (OAuth).
   *
   * @param {!string} spaceName Ex: "spaces/AAAA..."
   * @param {!string} userName  Ex: "users/AAAA..."
   * @param {{
   *   maxMessages?: number,
   *   pageSize?: number,
   *   filter?: string,
   *   includeBotMessages?: boolean
   * }} [opts]
   * @return {Promise<Message[]>} Mensagens (texto) em ordem cronológica (createTime asc).
   */
  listUserMessages: async function (spaceName, userName, opts = {}) {
    const maxMessages = Number.isFinite(opts.maxMessages) ? opts.maxMessages : 2000;
    const pageSizeDefault = Number.isFinite(opts.pageSize) ? opts.pageSize : 1000;
    const includeBotMessages = Boolean(opts.includeBotMessages);
    const filter = typeof opts.filter === 'string' ? opts.filter : undefined;

    const chatClient = await initializeChatClientWithUser(userName);

    const out = [];
    let pageToken = undefined;

    try {
      while (out.length < maxMessages) {
        const pageSize = Math.min(pageSizeDefault, maxMessages - out.length);

        const res = await chatClient.spaces.messages.list({
          parent: spaceName,
          pageSize,
          pageToken,
          filter, // opcional (ex.: 'createTime >= "2026-02-01T00:00:00Z"')
        });

        const messages = res?.data?.messages || [];
        for (const m of messages) {
          // Se você quiser armazenar só texto: (o sample normalmente usa apenas text)
          const text = (m?.text || '').trim();
          if (!text) continue;

          // Opcional: ignorar bots no seed do histórico (normalmente é melhor ignorar)
          if (!includeBotMessages && m?.sender?.type === 'BOT') continue;

          out.push(new Message(m.name, text, m.createTime));
        }

        pageToken = res?.data?.nextPageToken;
        if (!pageToken) break;
      }

      // Garante ordem cronológica para prompts e consultas.
      out.sort((a, b) => {
        const ta = new Date(a.createTime).getTime();
        const tb = new Date(b.createTime).getTime();
        return ta - tb;
      });

      logJson('INFO', {
        message: 'UserAuthChatService.listUserMessages ok',
        spaceName,
        count: out.length,
        usedFilter: Boolean(filter),
      });

      return out;
    } catch (err) {
      const details = safeError(err);

      logJson('ERROR', {
        message: 'UserAuthChatService.listUserMessages failed',
        spaceName,
        userName,
        details,
      });

      // Se token expirou/invalidou: força re-OAuth (mesmo padrão do seu EventsService)
      if (isUnauthorized(err) || isInsufficientScopes(err)) {
        await FirestoreService.removeUserToken(userName);
        throw new InvalidTokenException('Invalid token');
      }

      throw err;
    }
  },
};
