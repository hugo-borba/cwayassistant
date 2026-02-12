/**
 * @fileoverview Exception types used internally by the application logic.
 */

/**
 * The OAuth2 tokens for the user are not found in the database or are invalid.
 */
exports.InvalidTokenException = class extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidTokenException';
  }
}
