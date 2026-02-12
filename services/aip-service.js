'use strict';

const { VertexAI } = require('@google-cloud/vertexai');
const { env } = require('../env.js');

/**
 * Objetivo deste serviço:
 * 1) routeMessage(): classifica a intenção SEM histórico (modelo barato).
 * 2) smallTalk(): responde SEM histórico (modelo barato).
 * 3) capabilities(): descreve capacidades SEM histórico (modelo barato).
 * 4) answerWithContextOrSentinel(): responde usando APENAS o histórico fornecido;
 *    se não tiver base, retorna um sentinel.
 * 5) noInfoVariation(): gera uma variação natural PT-BR de "não tenho base" SEM histórico.
 */

// Sentinel obrigatório para a etapa "responder com base no histórico".
const SENTINEL_NO_INFO = '__NO_INFO__';

// Modelos padrão (você pode sobrescrever em env.models.* sem mexer no código).
// Exemplo em env.js (se você quiser):
// env.models = {
//   router: 'gemini-2.5-flash-lite',
//   smallTalk: 'gemini-2.5-flash-lite',
//   answer: 'gemini-2.5-flash',
//   noInfo: 'gemini-2.5-flash-lite',
// };
const MODELS = {
  router: env?.models?.router || 'gemini-2.5-flash-lite',
  smallTalk: env?.models?.smallTalk || 'gemini-2.5-flash-lite',
  answer: env?.models?.answer || 'gemini-2.5-flash',
  noInfo: env?.models?.noInfo || 'gemini-2.5-flash-lite',
};

function logJson(severity, payload) {
  if (!env?.logging) return;
  const line = JSON.stringify({ severity, ...payload });
  if (severity === 'ERROR') console.error(line);
  else if (severity === 'WARNING') console.warn(line);
  else console.log(line);
}

function oneParagraph(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

/**
 * Extrai um JSON de um texto caso o modelo "vaze" texto antes/depois.
 * Estratégia: pega do primeiro "{" ao último "}".
 */
function extractJsonObject(text) {
  const s = String(text || '');
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a === -1 || b === -1 || b <= a) return null;
  return s.slice(a, b + 1);
}

/**
 * Cache do VertexAI por instância.
 */
let vertexPromise = null;
function getVertex() {
  if (vertexPromise) return vertexPromise;
  vertexPromise = Promise.resolve(new VertexAI({ project: env.project, location: env.location }));
  return vertexPromise;
}

async function callGemini(modelId, prompt, generationConfig = {}) {
  const vertexAI = await getVertex();
  const generativeModel = vertexAI.getGenerativeModel({ model: modelId });

  const request = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: generationConfig.temperature ?? 0,
      maxOutputTokens: generationConfig.maxOutputTokens ?? 512,
    },
  };

  const result = await generativeModel.generateContent(request);
  const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (env?.logging) {
    logJson('INFO', {
      message: 'callGemini',
      modelId,
      promptChars: String(prompt || '').length,
      preview: oneParagraph(text).slice(0, 200),
    });
  }

  return text;
}

exports.AIPService = {
  /**
   * Classifica a mensagem SEM histórico.
   *
   * Saída esperada (JSON):
   * {
   *   "category": "SMALL_TALK" | "CAPABILITIES" | "STRUCTURED_QUERY" | "QUESTION_OR_INSTRUCTION",
   *   "historyPlan": { "mode": "NONE"|"TODAY"|"THIS_WEEK"|"ALL", "maxMessages": 120 },
   *   "structured": { "kind": "FIRST_MESSAGE_TODAY"|"LAST_MESSAGE_TODAY"|"COUNT_MESSAGES_TODAY" }
   * }
   */
  routeMessage: async function (userText, ctx = {}) {
    const prompt = [
      'Você é um roteador de intenções para um bot do Google Chat (PT-BR).',
      'Sua tarefa é CLASSIFICAR a mensagem do usuário e devolver SOMENTE um JSON válido.',
      '',
      'Categorias possíveis:',
      '- SMALL_TALK: cumprimento/papo curto (ex.: "bom dia", "como vai?").',
      '- CAPABILITIES: pedido do tipo "o que você faz?", "demonstre suas capacidades".',
      '- STRUCTURED_QUERY: pergunta objetiva que pode ser respondida via contagem/primeira/última mensagem do dia.',
      '- QUESTION_OR_INSTRUCTION: todo o resto (pergunta/instrução que exige interpretação do histórico).',
      '',
      'Também defina historyPlan:',
      '- Para SMALL_TALK e CAPABILITIES: mode=NONE.',
      '- Para STRUCTURED_QUERY: mode=TODAY e maxMessages pequeno.',
      '- Para QUESTION_OR_INSTRUCTION: escolha TODAY/THIS_WEEK/ALL e maxMessages razoável.',
      '',
      'Se não tiver certeza, use QUESTION_OR_INSTRUCTION com historyPlan THIS_WEEK.',
      '',
      `Contexto: isDm=${ctx?.isDm ? 'true' : 'false'}`,
      `Mensagem do usuário: """${oneParagraph(userText)}"""`,
      '',
      'Responda APENAS com JSON (sem markdown).',
      'Formato:',
      '{',
      '  "category": "SMALL_TALK|CAPABILITIES|STRUCTURED_QUERY|QUESTION_OR_INSTRUCTION",',
      '  "historyPlan": { "mode": "NONE|TODAY|THIS_WEEK|ALL", "maxMessages": 120 },',
      '  "structured": { "kind": "FIRST_MESSAGE_TODAY|LAST_MESSAGE_TODAY|COUNT_MESSAGES_TODAY" }',
      '}',
    ].join('\n');

    const raw = await callGemini(MODELS.router, prompt, { temperature: 0, maxOutputTokens: 256 });
    const jsonText = extractJsonObject(raw);
    if (!jsonText) {
      return { category: 'QUESTION_OR_INSTRUCTION', historyPlan: { mode: 'THIS_WEEK', maxMessages: 150 } };
    }

    try {
      const obj = JSON.parse(jsonText);
      if (!obj?.category || !obj?.historyPlan) {
        return { category: 'QUESTION_OR_INSTRUCTION', historyPlan: { mode: 'THIS_WEEK', maxMessages: 150 } };
      }
      return obj;
    } catch {
      return { category: 'QUESTION_OR_INSTRUCTION', historyPlan: { mode: 'THIS_WEEK', maxMessages: 150 } };
    }
  },

  /**
   * Small talk SEM histórico (modelo barato).
   */
  smallTalk: async function (userText) {
    const prompt = [
      'Você é um assistente em PT-BR em um chat corporativo.',
      'Responda de forma curta, simpática e natural.',
      'Não mencione "histórico" e não invente fatos.',
      '',
      `Mensagem: """${oneParagraph(userText)}"""`,
    ].join('\n');

    return callGemini(MODELS.smallTalk, prompt, { temperature: 0.7, maxOutputTokens: 120 });
  },

  /**
   * Capacidades SEM histórico (modelo barato).
   * Importante: você pediu “sem respostas fixas”, então aqui é gerado.
   */
  capabilities: async function (ctx = {}) {
    const prompt = [
      'Você é um assistente em PT-BR dentro do Google Chat.',
      'Explique em 1 parágrafo curto o que você consegue fazer.',
      'Inclua 3 exemplos de perguntas/comandos que as pessoas podem mandar.',
      'Regras: sem markdown; tom direto; sem inventar fatos; não prometa acessar coisas fora do chat.',
      '',
      `Contexto: isDm=${ctx?.isDm ? 'true' : 'false'}`,
    ].join('\n');

    return callGemini(MODELS.smallTalk, prompt, { temperature: 0.4, maxOutputTokens: 180 });
  },

  /**
   * Responde usando APENAS o histórico passado.
   * Se não houver base suficiente, deve retornar exatamente o sentinel __NO_INFO__.
   */
  answerWithContextOrSentinel: async function (userText, messages) {
    const history = (messages || [])
      .map(m => oneParagraph(m?.text || ''))
      .filter(Boolean)
      .join('\n');

    const prompt = [
      'Você é um assistente em PT-BR.',
      'Você só pode responder usando o HISTÓRICO fornecido abaixo.',
      'Regras obrigatórias:',
      '- Não invente, não suponha, não complete lacunas.',
      `- Se o histórico NÃO contiver informação suficiente para responder, responda EXATAMENTE: ${SENTINEL_NO_INFO}`,
      '- A resposta (quando houver) deve ser um único parágrafo, sem markdown.',
      '',
      'HISTÓRICO:',
      '"""',
      history,
      '"""',
      '',
      'PERGUNTA/COMANDO:',
      '"""',
      oneParagraph(userText),
      '"""',
    ].join('\n');

    const out = oneParagraph(await callGemini(MODELS.answer, prompt, { temperature: 0, maxOutputTokens: 512 }));

    if (!out) return SENTINEL_NO_INFO;

    // Segurança: se o modelo vazar o sentinel dentro de frase, normaliza.
    if (out === SENTINEL_NO_INFO) return SENTINEL_NO_INFO;
    if (out.includes(SENTINEL_NO_INFO)) return SENTINEL_NO_INFO;

    return out;
  },

  /**
   * Gera UMA variação natural PT-BR de “não tenho base no histórico”.
   * (Sem respostas fixas; gerado pelo modelo barato.)
   */
  noInfoVariation: async function (userText, hint = '') {
    const prompt = [
      'Você é um assistente em PT-BR.',
      'Gere UMA resposta curta e natural dizendo que você não tem base suficiente no histórico disponível',
      'para responder com segurança.',
      'Regras: não invente fatos; sem markdown; tom humano e direto.',
      '',
      `Pergunta do usuário: """${oneParagraph(userText)}"""`,
      hint ? `Dica opcional: ${oneParagraph(hint)}` : '',
    ].filter(Boolean).join('\n');

    return callGemini(MODELS.noInfo, prompt, { temperature: 0.8, maxOutputTokens: 90 });
  },

  SENTINEL_NO_INFO,
};
