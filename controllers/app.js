/**
 * @fileoverview The main application logic. Processes the
 * [Chat event](https://developers.google.com/workspace/add-ons/chat/build#event-objects).
 */

const {env} = require('../env.js');
const {AppAuthEventsService} = require('../services/app-auth-events-service');
const {FirestoreService} = require('../services/firestore-service');
const {UserAuthChatService} = require('../services/user-auth-chat-service');
const {UserAuthEventsService} = require('../services/user-auth-events-service');
const {generateAuthUrl} = require('../services/user-auth.js');

/**
 * Chat application logic.
 */
class ChatApp {
  /**
   * Instantiates the Chat app.
   * @param {!Object} event The
   * [event](https://developers.google.com/workspace/add-ons/concepts/event-objects#chat-event-object)
   * received from Google Chat.
   */
  constructor(event) {
    this.event = event;
    this.userName = event.chat.user.name;
  }

  /**
   * Executes the Chat app and returns the resulting action.
   * @return {Promise<Object>} The action to execute as response.
   */
  async execute() {
    if (this.event.chat.addedToSpacePayload) {
      this.spaceName = this.event.chat.addedToSpacePayload.space.name;
      this.configCompleteRedirectUrl =
        this.event.chat.addedToSpacePayload.configCompleteRedirectUri;
      return this.handleAddedToSpace();
    }

    if (this.event.chat.messagePayload) {
      this.spaceName = this.event.chat.messagePayload.space.name;
      this.configCompleteRedirectUrl =
        this.event.chat.messagePayload.configCompleteRedirectUri;
      return this.handleMessage();
    }

    if (this.event.chat.removedFromSpacePayload) {
      this.spaceName = this.event.chat.removedFromSpacePayload.space.name;
      return this.handleRemovedFromSpace();
    }

    return {};
  }

  /**
   * Runs one-time setup when the app is added to a space.
   * - Stores the space
   * - Reads existing messages (history) and stores them
   * - Creates the Workspace Events subscription
   * - Sends a single welcome message
   */
  async handleAddedToSpace() {
    if (env.logging) {
      console.log(JSON.stringify({
        message: 'AddedToSpace: saving message history and subscribing.',
        spaceName: this.spaceName,
        userName: this.userName,
      }));
    }

    await FirestoreService.createSpace(this.spaceName);

    try {
      // List and save the previous messages from the space (one-time).
      const messages = await UserAuthChatService.listUserMessages(
        this.spaceName, this.userName);
      await FirestoreService.createOrUpdateMessages(this.spaceName, messages);

      // Create space subscription (idempotent; may return ALREADY_EXISTS).
      await UserAuthEventsService.createSpaceSubscription(
        this.spaceName, this.userName);

    } catch (e) {
      if (e.name === 'InvalidTokenException') {
        return {
          basicAuthorizationPrompt: {
            authorizationUrl: generateAuthUrl(
              this.userName,
              this.configCompleteRedirectUrl
            ),
            resource: 'AI Knowledge Assistant'
          }
        };
      }
      throw e;
    }

    // Welcome message only ONCE (added to space).
    const text = 'Olá! Eu sou o cwayassistant. Eu ajudo a responder perguntas com base no histórico de conversas.'
      + 'Em espaços, me mencione com @cwayassistant e faça uma pergunta ou dê uma instrução (ex.: "@cwayassistant resuma a conversa de hoje").'
      + 'Em mensagens diretas, é só perguntar.';

    return {
      hostAppDataAction: {
        chatDataAction: {
          createMessageAction: {
            message: {text: text}
          }
        }
      }
    };
  }

  /**
   * Handles normal message events (mentions / DMs).
   * IMPORTANT: do NOT send the welcome message again.
   * Only ensures subscription exists OR prompts OAuth if missing token.
   */
  async handleMessage() {
    if (env.logging) {
      console.log(JSON.stringify({
        message: 'MessagePayload: received message event (no welcome).',
        spaceName: this.spaceName,
        userName: this.userName,
      }));
    }

    await FirestoreService.createSpace(this.spaceName);

    try {
      // Keep it lightweight. No message history scan here.
      await UserAuthEventsService.createSpaceSubscription(
        this.spaceName, this.userName);
    } catch (e) {
      if (e.name === 'InvalidTokenException') {
        return {
          basicAuthorizationPrompt: {
            authorizationUrl: generateAuthUrl(
              this.userName,
              this.configCompleteRedirectUrl
            ),
            resource: 'AI Knowledge Assistant'
          }
        };
      }
      throw e;
    }

    // No direct response here; eventsApp will post the answer.
    return {};
  }

  /**
   * Handles the removed from space event by deleting subscriptions and storage.
   */
  async handleRemovedFromSpace() {
    if (env.logging) {
      console.log(JSON.stringify({
        message: 'RemovedFromSpace: deleting subscriptions and message history.',
        spaceName: this.spaceName,
      }));
    }
    await AppAuthEventsService.deleteSpaceSubscriptions(this.spaceName);
    await FirestoreService.deleteSpace(this.spaceName);
    return {};
  }
}

module.exports = {
  execute: async function (event) {
    return new ChatApp(event).execute();
  }
};
