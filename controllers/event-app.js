/**
 * @fileoverview Application logic for Workspace Events (Google Chat).
 *
 * NOVO FLUXO (como você pediu):
 * 1) Identificar DM vs Space (spaces.get: singleUserBotDm / spaceType).
 * 2) Em Space: só responder quando houver @menção (determinístico via argumentText).
 * 3) Classificar tipo da mensagem (router, modelo barato, sem histórico).
 * 4) SMALL_TALK: responder com modelo barato, sem histórico.
 * 5) CAPABILITIES: responder com modelo barato, sem histórico (sem resposta fixa).
 * 6) STRUCTURED_QUERY: responder sem LLM, via Firestore.
 * 7) QUESTION_OR_INSTRUCTION: selecionar apenas a janela necessária do histórico e chamar modelo adequado.
 * 8) Se faltar base: gerar variação natural PT-BR “não tenho base” (modelo barato).
 *
 * Referências:
 * - message.argumentText remove menções ao app (determinístico para gating). (docs oficiais)
 * - spaces.messages.create aceita requestId (idempotência). (docs oficiais)
 */

'use strict';

const crypto = require('crypto');
const { env } = require('../env.js');
const { SubscriptionEventType } = require('../model/events');
const { Message } = require('../model/message');
const { AIPService } = require('../services/aip-service');
const { AppAuthChatService } = require('../services/app-auth-chat-service');
const { FirestoreService } = require('../services/firestore-service');
const { UserAuthEventsService } = require('../services/user-auth-events-service');

const SPACE_TYPE_DIRECT_MESSAGE = 'DIRECT_MESSAGE';

// Cache por instância para evitar spaces.get toda hora.
const spaceInfoCache = new Map(); // spaceName -> { isDm, spaceHistoryState, fetchedAtMs }

// Dedupe local (evita trabalho duplicado); idempotência real está no requestId do createMessage.
const processedMessageCache = new Set();

function logJson(severity, payload) {
  if (!env?.logging) return;
  const line = JSON.stringify({ severity, ...payload });
  if (severity === 'ERROR') console.error(line);
  else if (severity === 'WARNING') console.warn(line);
  else console.log(line);
}

/**
 * requestId determinístico e curto.
 * Obs: o requestId é por "criação de resposta", não por mensagem do usuário.
 */
function makeRequestId(prefix, seed) {
  const h = crypto.createHash('sha256').update(String(seed)).digest('hex').slice(0, 32);
  return `${prefix}-${h}`;
}

/**
 * Detecta se houve menção ao app (determinístico):
 * - argumentText é o texto com menções ao app removidas (output-only).
 *   Se argumentText existe e é diferente do text => houve menção.
 */
function wasBotMentioned(message) {
  const text = (message?.text || '').trim();
  if (typeof message?.argumentText === 'string') {
    const arg = (message.argumentText || '').trim();
    return arg !== text;
  }
  // Fallback (caso raro): se não vier argumentText, você pode usar annotations,
  // mas o determinístico “bom” mesmo é argumentText.
  return false;
}

/**
 * Texto “limpo” para intenção:
 * - Preferir argumentText (sem @).
 */
function getUserIntentText(message) {
  return (message?.argumentText ?? message?.text ?? '').trim();
}

/**
 * Descobre (e cacheia) se é DM via spaces.get.
 */
async function getSpaceContext(spaceName, inlineSpaceObj) {
  // Atalho se vier no payload
  const inlineType = inlineSpaceObj?.spaceType || inlineSpaceObj?.type;
  if (inlineType) {
    return { isDm: inlineType === SPACE_TYPE_DIRECT_MESSAGE, spaceHistoryState: null, source: 'inline' };
  }

  // Cache 5 min
  const cached = spaceInfoCache.get(spaceName);
  const now = Date.now();
  if (cached && (now - cached.fetchedAtMs) < 5 * 60 * 1000) {
    return { isDm: cached.isDm, spaceHistoryState: cached.spaceHistoryState, source: 'cache' };
  }

  try {
    const space = await AppAuthChatService.getSpace(spaceName);
    const isDm = Boolean(space?.singleUserBotDm) || (space?.spaceType === SPACE_TYPE_DIRECT_MESSAGE);
    const spaceHistoryState = space?.spaceHistoryState || null;

    spaceInfoCache.set(spaceName, { isDm, spaceHistoryState, fetchedAtMs: now });
    return { isDm, spaceHistoryState, source: 'api' };
  } catch (e) {
    logJson('WARNING', {
      message: 'getSpaceContext failed; defaulting to SPACE behavior',
      spaceName,
      err: e?.message || String(e),
    });
    spaceInfoCache.set(spaceName, { isDm: false, spaceHistoryState: null, fetchedAtMs: now });
    return { isDm: false, spaceHistoryState: null, source: 'error-default-space' };
  }
}

/**
 * Timezone “local” para o que é “hoje” (padrão: -03:00).
 * Você pode setar env.timezoneOffsetMinutes = -180.
 */
const TZ_OFFSET_MIN = Number.isFinite(env?.timezoneOffsetMinutes) ? env.timezoneOffsetMinutes : -180;

function startOfLocalDayMs(nowMs, offsetMin) {
  const shifted = nowMs + offsetMin * 60 * 1000;
  const d = new Date(shifted);
  const startShifted = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0);
  return startShifted - offsetMin * 60 * 1000;
}

function sortByCreateTimeAsc(messages) {
  return (messages || []).slice().sort((a, b) => {
    const ta = new Date(a?.createTime).getTime();
    const tb = new Date(b?.createTime).getTime();
    return ta - tb;
  });
}

/**
 * Seleciona apenas a janela necessária do histórico para mandar ao modelo.
 * (Sem mudar FirestoreService por enquanto.)
 */
function sliceHistoryForPlan(allMessages, plan) {
  const p = plan || { mode: 'THIS_WEEK', maxMessages: 150 };
  const sorted = sortByCreateTimeAsc(allMessages);

  if (p.mode === 'ALL') return sorted.slice(-p.maxMessages);
  if (p.mode === 'NONE') return [];

  const nowMs = Date.now();
  let fromMs = null;

  if (p.mode === 'TODAY') {
    fromMs = startOfLocalDayMs(nowMs, TZ_OFFSET_MIN);
  } else if (p.mode === 'THIS_WEEK') {
    // Semana local começando na segunda:
    const shifted = nowMs + TZ_OFFSET_MIN * 60 * 1000;
    const d = new Date(shifted);
    const day = d.getUTCDay(); // 0=Dom
    const diff = (day + 6) % 7; // segunda=0
    const mondayShifted = shifted - diff * 24 * 60 * 60 * 1000;
    fromMs = startOfLocalDayMs(mondayShifted - TZ_OFFSET_MIN * 60 * 1000, TZ_OFFSET_MIN);
  }

  const filtered = fromMs === null
    ? sorted
    : sorted.filter(m => {
      const t = new Date(m?.createTime).getTime();
      return Number.isFinite(t) && t >= fromMs;
    });

  return filtered.slice(-p.maxMessages);
}

/**
 * STRUCTURED_QUERY sem LLM (via Firestore).
 * Observação: como seu Message hoje não carrega "sender", isso responde sobre
 * as mensagens registradas (não “apenas do usuário”).
 */
function answerStructured(kind, allMessages) {
  const sorted = sortByCreateTimeAsc(allMessages);
  const todayStart = startOfLocalDayMs(Date.now(), TZ_OFFSET_MIN);
  const today = sorted.filter(m => new Date(m?.createTime).getTime() >= todayStart);

  if (kind === 'COUNT_MESSAGES_TODAY') {
    return `Hoje eu registrei ${today.length} mensagens neste chat.`;
  }
  if (kind === 'FIRST_MESSAGE_TODAY') {
    const first = today[0]?.text;
    return first ? `A primeira mensagem registrada hoje foi: "${first}".` : null;
  }
  if (kind === 'LAST_MESSAGE_TODAY') {
    const last = today[today.length - 1]?.text;
    return last ? `A última mensagem registrada hoje foi: "${last}".` : null;
  }
  return null;
}

class EventApp {
  constructor(eventType, event) {
    this.eventType = eventType;
    this.event = event;
  }

  async execute() {
    switch (this.eventType) {
      case SubscriptionEventType.MESSAGE_CREATED:
      case SubscriptionEventType.MESSAGE_UPDATED:
        return this.handleMessageEvent(this.event.message);

      case SubscriptionEventType.MESSAGE_DELETED:
        return this.handleMessageDeletedEvent(this.event.message);

      case SubscriptionEventType.BATCH_MESSAGE_CREATED:
      case SubscriptionEventType.BATCH_MESSAGE_UPDATED:
        return Promise.all(
          (this.event.messages || [])
            .map(payload => payload.message)
            .map(message => this.handleMessageEvent(message))
        );

      case SubscriptionEventType.BATCH_MESSAGE_DELETED:
        return Promise.all(
          (this.event.messages || [])
            .map(payload => payload.message)
            .map(message => this.handleMessageDeletedEvent(message))
        );

      case SubscriptionEventType.EXPIRATION_REMINDER:
        return this.handleExpirationReminderEvent(this.event.subscription);

      default:
        return;
    }
  }

  async handleMessageEvent(message) {
    // Ignora bots e vazio
    if (!message || message.sender?.type === 'BOT' || !message.text) {
      logJson('INFO', { message: 'Ignoring BOT or empty message.' });
      return;
    }

    const spaceName = message.space?.name;
    logJson('INFO', {
      message: 'Handling message event',
      type: this.eventType,
      spaceName,
      msgName: message.name,
      text: message.text,
    });

    // Sempre grava no Firestore
    await FirestoreService.createOrUpdateMessage(
      spaceName,
      new Message(message.name, message.text, message.createTime)
    );

    // Só responde em criação (evita duplicar em update)
    if (
      this.eventType === SubscriptionEventType.MESSAGE_CREATED ||
      this.eventType === SubscriptionEventType.BATCH_MESSAGE_CREATED
    ) {
      await this.routeAndRespond(message);
    }
  }

  async handleMessageDeletedEvent(message) {
    if (!message?.name) return;

    logJson('INFO', { message: 'Deleting message from storage', name: message.name });

    const spaceName = message.name.substring(0, message.name.indexOf('/messages'));
    await FirestoreService.deleteMessage(spaceName, message.name);
  }

  async handleExpirationReminderEvent(subscription) {
    await UserAuthEventsService.renewSpaceSubscription(subscription.authority, subscription.name);
  }

  async routeAndRespond(message) {
    const spaceName = message.space?.name;
    if (!spaceName) return;

    // Dedupe local
    if (processedMessageCache.has(message.name)) {
      logJson('INFO', { message: 'Duplicate message (local cache) - skipping', msgName: message.name });
      return;
    }
    processedMessageCache.add(message.name);

    // 1) DM vs Space
    const { isDm, spaceHistoryState } = await getSpaceContext(spaceName, message.space);

    // 2) Gating determinístico em Space: só responde com menção
    if (!isDm && !wasBotMentioned(message)) {
      logJson('INFO', { message: 'Space message without @mention - skipping', msgName: message.name });
      return;
    }

    // 3) Texto de intenção (sem @)
    const userText = getUserIntentText(message);
    if (!userText) return;

    // 4) Router (modelo barato, sem histórico)
    const route = await AIPService.routeMessage(userText, { isDm });

    logJson('INFO', {
      message: 'route',
      spaceName,
      isDm,
      category: route?.category,
      historyPlan: route?.historyPlan,
      structured: route?.structured,
    });

    const threadName = isDm ? null : message.thread?.name;

    // 5) SMALL_TALK (sem histórico)
    if (route.category === 'SMALL_TALK') {
      const out = await AIPService.smallTalk(userText);
      await this.createMessage(spaceName, out, threadName, makeRequestId('st', message.name));
      return;
    }

    // 6) CAPABILITIES (sem histórico, sem resposta fixa)
    if (route.category === 'CAPABILITIES') {
      const out = await AIPService.capabilities({ isDm });
      await this.createMessage(spaceName, out, threadName, makeRequestId('cap', message.name));
      return;
    }

    // Para STRUCTURED_QUERY e QUESTION_OR_INSTRUCTION precisamos do Firestore:
    const allMessages = await FirestoreService.listMessages(spaceName);

    // 7) STRUCTURED_QUERY (sem LLM)
    if (route.category === 'STRUCTURED_QUERY') {
      const kind = route?.structured?.kind;
      const computed = answerStructured(kind, allMessages);

      if (computed) {
        await this.createMessage(spaceName, computed, threadName, makeRequestId('sq', message.name));
        return;
      }

      // Se não conseguiu computar, cai no “sem base” gerado (sem texto fixo).
      const noInfo = await AIPService.noInfoVariation(
        userText,
        'Não encontrei esse dado específico no histórico disponível.'
      );
      await this.createMessage(spaceName, noInfo, threadName, makeRequestId('sq-no', message.name));
      return;
    }

    // 8) QUESTION_OR_INSTRUCTION: manda só a janela necessária do histórico ao modelo
    const needed = sliceHistoryForPlan(allMessages, route.historyPlan);

    const answer = await AIPService.answerWithContextOrSentinel(userText, needed);

    if (answer === AIPService.SENTINEL_NO_INFO) {
      // Sem “resposta fixa”: gerar variação natural.
      // Hint opcional (não é “installedAt”; é só um contexto técnico):
      const hint = spaceHistoryState && spaceHistoryState !== 'HISTORY_ON'
        ? 'O histórico deste espaço pode estar desativado, então mensagens antigas podem não estar disponíveis.'
        : '';

      const noInfo = await AIPService.noInfoVariation(userText, hint);
      await this.createMessage(spaceName, noInfo, threadName, makeRequestId('no', message.name));
      return;
    }

    await this.createMessage(spaceName, answer, threadName, makeRequestId('ans', message.name));
  }

  async createMessage(spaceName, messageText, threadName, requestId = null) {
    const cleanText = (messageText || '').replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    const msg = threadName
      ? { text: cleanText, thread: { name: threadName } }
      : { text: cleanText };

    await AppAuthChatService.createMessageInThread(spaceName, msg, requestId);
  }
}

module.exports = {
  execute: async function (eventType, event) {
    return new EventApp(eventType, event).execute();
  },
};