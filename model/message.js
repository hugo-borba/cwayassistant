/**
 * @fileoverview Definition of classes and enums that the application services
 * use to store and pass message between functions. They set the data
 * model for the Firestore database.
 */

/**
 * A Chat message managed by the app.
 * @record
 */
exports.Message = class {
  /**
   * Initializes a new Message.
   * @param {!string} name The resource name of the message.
   * @param {!string} text The message text.
   * @param {!string} time The message timestamp.
   */
  constructor(name, text, time) {
    /** @type {!string} The resource name of the message. */
    this.name = name;
    /** @type {!string} The message text. */
    this.text = text;
    /** @type {!string} The message timestamp. */
    this.time = time;
  }
}
