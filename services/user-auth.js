/**
 * @fileoverview Utility functions to implement the
 * [OAuth2 authorization flow](https://developers.google.com/identity/protocols/oauth2/web-server)
 * for user credentials.
 */

const auth = require('google-auth-library');
const url = require('url');
const {env} = require('../env');
const {FirestoreService} = require('./firestore-service');

// The application's OAuth client credentials.
const keys = require('../credentials.json').web;

// Define the app's authorization scopes.
// NOTE: aligns with your consent screen and also works for Workspace Events message subscriptions.
const scopes = ['https://www.googleapis.com/auth/chat.messages'];

/**
 * Creates a new OAuth2 client with the configured keys.
 * @returns {auth.OAuth2Client} A client with the configured keys but without
 *     initialized credentials.
 */
function createClient() {
  return new auth.OAuth2Client(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0],
  );
}

/** Converts the provided data to a JSON string then encodes it with Base64. */
function base64encode(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

/** Decodes the provided Base64 JSON string into an object. */
function base64decode(data) {
  return JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
}

/**
 * Initializes an OAuth2 client with the provided credentials.
 * @param {!auth.Credentials} credentials The OAuth2 credentials to use for
 *     authentication.
 * @returns {auth.OAuth2Client} An initialized client.
 */
exports.initializeOauth2Client = function (credentials) {
  const oauth2Client = createClient();
  oauth2Client.setCredentials(credentials);
  return oauth2Client;
};

/**
 * Generates the URL to start the OAuth2 authorization flow.
 * @param {!string} userName The resource name of the Chat user requesting
 *     authorization.
 * @param {!string} configCompleteRedirectUrl The URL to redirect to after
 *     completing the flow.
 * @returns {string} The authorization URL to start the OAuth2 flow.
 */
exports.generateAuthUrl = function (userName, configCompleteRedirectUrl) {
  const oauth2Client = createClient();
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    state: base64encode({userName, configCompleteRedirectUrl}),
    prompt: 'consent'
  });
  return authorizeUrl;
}

/**
 * Handles an OAuth2 callback request.
 *
 * @param {!Object} req An Express-style HTTP request.
 * @param {!Object} res An Express-style HTTP response.
 * @returns {Promise<void>}
 */
exports.oauth2callback = async function (req, res) {
  const q = url.parse(req.url, true).query;

  if (q.error) {
    console.error('Error: ' + q.error);
    res.status(403).send('Error: ' + q.error);
    return;
  }
  if (typeof q.code !== 'string') {
    console.error('Error: Invalid OAuth2 code: ' + q.code);
    res.status(400).send('Error: Invalid OAuth2 code');
    return;
  }

  let state;
  try {
    state = base64decode(q.state);
  } catch {
    // Error ignored - invalid state caught by validation
    console.error('Error: Invalid request state: ' + q.state);
    res.status(400).send('Error: Invalid request state');
    return;
  }

  const oauth2Client = createClient();
  const {tokens} = await oauth2Client.getToken(q.code);

  if (env.logging) {
    console.log('Saving OAuth2 tokens for user ' + state.userName);
  }
  await FirestoreService.saveUserToken(
    state.userName, tokens.access_token, tokens.refresh_token);

  res.redirect(state.configCompleteRedirectUrl);
}
