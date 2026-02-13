const { app } = require('./app');

/**
 * Main entry point for Google Cloud Functions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
module.exports.app = app;
