/**
 * @fileoverview Service that calls the Workspace Events API using the user's
 * credentials to create or renew space subscriptions.
 */

const workspaceevents = require('@googleapis/workspaceevents');
const {env} = require('../env');
const {SubscriptionEventType} = require('../model/events');
const {InvalidTokenException} = require('../model/exceptions');
const {FirestoreService} = require('./firestore-service');
const {initializeOauth2Client} = require('./user-auth');

/**
 * Faz uma extração “segura” (sem circular) das informações relevantes
 * do erro retornado pelo client do Google (GaxiosError).
 */
function extractWorkspaceEventsError(err) {
  const httpStatus = err?.response?.status ?? null;
  const httpStatusText = err?.response?.statusText ?? null;

  // Normalmente, o body vem em err.response.data (com { error: {...} })
  const data = err?.response?.data ?? null;
  const apiError = data?.error ?? null;

  const googleStatus = apiError?.status ?? null;
  const googleMessage = apiError?.message ?? null;
  const googleDetails = apiError?.details ?? null;

  // Alguns erros também trazem info em err.errors / err.status, mas isso varia.
  return {
    name: err?.name ?? null,
    message: err?.message ?? null,
    code: err?.code ?? null,

    httpStatus,
    httpStatusText,

    googleStatus,
    googleMessage,
    googleDetails,

    // Mantém o body completo pra debug (se ficar grande, você pode remover depois).
    responseData: data,
  };
}

function isAlreadyExists(details) {
  return details.httpStatus === 409 || details.googleStatus === 'ALREADY_EXISTS';
}

/**
 * Token claramente inválido/expirado.
 */
function isTokenInvalid(details) {
  return details.httpStatus === 401 || details.googleStatus === 'UNAUTHENTICATED';
}

/**
 * Permissão negada (genérico).
 */
function isPermissionDenied(details) {
  return details.httpStatus === 403 || details.googleStatus === 'PERMISSION_DENIED';
}

/**
 * Caso MUITO comum após mudar scopes:
 * A API devolve 403 PERMISSION_DENIED com mensagem tipo:
 * "Request had insufficient authentication scopes."
 * -> nesse caso, precisa remover token e refazer OAuth.
 */
function isInsufficientScopes(details) {
  const msg = (details.googleMessage || details.message || '').toLowerCase();
  return (
    (details.httpStatus === 403 || details.googleStatus === 'PERMISSION_DENIED') &&
    (msg.includes('insufficient') && msg.includes('scope'))
  );
}

/**
 * Loga sempre em JSON 1-linha pra não “cortar” no Cloud Logging e pra filtrar fácil.
 * Cloud Run recomenda logs estruturados (JSON) no stdout/stderr. 
 */
function logJson(severity, payload) {
  const entry = {
    severity,          // INFO | WARNING | ERROR ...
    ...payload,
  };
  const line = JSON.stringify(entry);

  if (severity === 'ERROR') console.error(line);
  else if (severity === 'WARNING') console.warn(line);
  else console.log(line);
}

/**
 * Initializes the Workspace Events API client with user credentials.
 */
async function initializeWorkspaceEventsClient(userName) {
  const tokens = await FirestoreService.getUserToken(userName);
  if (tokens === null) {
    throw new InvalidTokenException('Token not found');
  }

  const credentials = {
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  };
  const oauth2Client = initializeOauth2Client(credentials);

  return workspaceevents.workspaceevents({
    version: 'v1',
    auth: oauth2Client
  });
}

/**
 * Service to create and renew space subscriptions in Google Chat.
 */
exports.UserAuthEventsService = {

  /**
   * Creates a space subscription for a Google Chat space by calling the
   * Workspace Events API with user credentials.
   *
   * Uses subscriptions.create from the Workspace Events REST API. :contentReference[oaicite:3]{index=3}
   */
  createSpaceSubscription: async function (spaceName, userName) {
    const workspaceEventsClient = await initializeWorkspaceEventsClient(userName);

    const subscription = {
      targetResource: "//chat.googleapis.com/" + spaceName,
      eventTypes: [
        SubscriptionEventType.MESSAGE_CREATED,
        SubscriptionEventType.MESSAGE_UPDATED,
        SubscriptionEventType.MESSAGE_DELETED,
      ],
      notificationEndpoint: {
        pubsubTopic: `projects/${env.project}/topics/${env.topic}`
      },
      payloadOptions: {
        includeResource: true
      },
    };

    try {
      const response = await workspaceEventsClient.subscriptions.create({
        requestBody: subscription
      });

      // Guardrail: em geral gaxios lança erro fora do 2xx, mas deixamos.
      if (!response || (response.status !== 200 && response.status !== 201)) {
        logJson('ERROR', {
          message: 'CreateSubscription: Non-2xx response',
          spaceName,
          userName,
          status: response?.status,
          statusText: response?.statusText,
          data: response?.data,
        });
        return;
      }

      logJson('INFO', {
        message: 'CreateSubscription: created/ok',
        spaceName,
        userName,
      });

      return response.data;

    } catch (err) {
      const details = extractWorkspaceEventsError(err);

      // 1) Caso esperado: já existe
      if (isAlreadyExists(details)) {
        logJson('INFO', {
          message: 'CreateSubscription: ALREADY_EXISTS (skipping create)',
          spaceName,
          userName,
          details,
        });
        return;
      }

      // 2) Mudou scope? 403 + insufficient scopes => precisa re-OAuth
      if (isInsufficientScopes(details)) {
        logJson('WARNING', {
          message: 'CreateSubscription: insufficient scopes (removing token to force OAuth)',
          spaceName,
          userName,
          details,
        });
        await FirestoreService.removeUserToken(userName);
        throw new InvalidTokenException('Invalid token');
      }

      // 3) Token inválido: remove e força OAuth
      if (isTokenInvalid(details)) {
        logJson('WARNING', {
          message: 'CreateSubscription: token invalid (removing token to force OAuth)',
          spaceName,
          userName,
          details,
        });
        await FirestoreService.removeUserToken(userName);
        throw new InvalidTokenException('Invalid token');
      }

      // 4) Permissão negada (genérica): loga (não remove token automaticamente)
      if (isPermissionDenied(details)) {
        logJson('ERROR', {
          message: 'CreateSubscription: PERMISSION_DENIED',
          spaceName,
          userName,
          details,
        });
        return;
      }

      // 5) Outros erros
      logJson('ERROR', {
        message: 'CreateSubscription: Workspace Events API call failed',
        spaceName,
        userName,
        details,
      });
      return;
    }
  },

  renewSpaceSubscription: async function (userName, subscriptionName) {
    const workspaceEventsClient = await initializeWorkspaceEventsClient(userName);

    const subscription = { ttl: '0s' };

    try {
      const response = await workspaceEventsClient.subscriptions.patch({
        name: subscriptionName,
        updateMask: 'ttl',
        requestBody: subscription,
      });

      if (!response || (response.status !== 200 && response.status !== 201)) {
        logJson('ERROR', {
          message: 'PatchSubscription: Non-2xx response',
          userName,
          subscriptionName,
          status: response?.status,
          statusText: response?.statusText,
          data: response?.data,
        });
        return;
      }

      logJson('INFO', {
        message: 'PatchSubscription: renewed/ok',
        userName,
        subscriptionName,
      });

      return response.data;

    } catch (err) {
      const details = extractWorkspaceEventsError(err);

      if (isInsufficientScopes(details)) {
        logJson('WARNING', {
          message: 'PatchSubscription: insufficient scopes (removing token to force OAuth)',
          userName,
          subscriptionName,
          details,
        });
        await FirestoreService.removeUserToken(userName);
        throw new InvalidTokenException('Invalid token');
      }

      if (isTokenInvalid(details)) {
        logJson('WARNING', {
          message: 'PatchSubscription: token invalid (removing token to force OAuth)',
          userName,
          subscriptionName,
          details,
        });
        await FirestoreService.removeUserToken(userName);
        throw new InvalidTokenException('Invalid token');
      }

      if (isPermissionDenied(details)) {
        logJson('ERROR', {
          message: 'PatchSubscription: PERMISSION_DENIED',
          userName,
          subscriptionName,
          details,
        });
        return;
      }

      logJson('ERROR', {
        message: 'PatchSubscription: Workspace Events API call failed',
        userName,
        subscriptionName,
        details,
      });
      return;
    }
  },
};
