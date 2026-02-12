/**
 * @fileoverview Definition of classes and enums related to the Workspace Events API.
 */

/**
 * Types of
 * [subscription events](https://developers.google.com/workspace/events/guides/events-chat).
 * @enum {string}
 */
exports.SubscriptionEventType = {
  MESSAGE_CREATED: 'google.workspace.chat.message.v1.created',
  MESSAGE_UPDATED: 'google.workspace.chat.message.v1.updated',
  MESSAGE_DELETED: 'google.workspace.chat.message.v1.deleted',
  BATCH_MESSAGE_CREATED: 'google.workspace.chat.message.v1.batchCreated',
  BATCH_MESSAGE_UPDATED: 'google.workspace.chat.message.v1.batchUpdated',
  BATCH_MESSAGE_DELETED: 'google.workspace.chat.message.v1.batchDeleted',
  EXPIRATION_REMINDER: 'google.workspace.events.subscription.v1.expirationReminder',
}
