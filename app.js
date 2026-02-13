const functions = require('@google-cloud/functions-framework');

/**
 * HTTP Cloud Function for Google Chat.
 * This function responds to messages from Google Chat.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
functions.http('app', (req, res) => {
  // Verify the request is from Google Chat
  if (req.method === 'POST') {
    const message = req.body;

    // Log the message for debugging
    console.log('Received message:', JSON.stringify(message, null, 2));

    // Respond with a simple message
    const response = {
      text: `Hello! You said: ${message.message?.text || 'No message'}`,
    };

    res.json(response);
  } else {
    res.status(405).send('Method Not Allowed');
  }
});

module.exports = { app: functions };
