/**
 * Project environment settings.
 */
const env = {
  // Replace with your GCP project ID.
  project: 'project-id',

  // Replace with your GCP project location. Used for Vertex AI calls.
  location: 'us-central1',

  // Replace with the PubSub topic to receive events.
  // The topic must be in the same GCP project as the Chat app.
  topic: 'events-api',

  // Whether to log the request & response on each function call.
  logging: true,
};

exports.env = env;