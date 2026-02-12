/**
 * @fileoverview The main script for the project, which includes the exported
 * Cloud Functions from each respective script file. This project exports
 * multiple Cloud Functions, but each one should be deployed separately.
 */

// Exports a Function with an HTTP trigger and the entry point `app`.
require('./http_index.js');

// Exports a Function with a CloudEvent trigger and the entry point `eventsApp`.
require('./events_index.js');
