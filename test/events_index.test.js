const {getFunction} = require('@google-cloud/functions-framework/testing');
const {CloudEvent} = require('cloudevents');
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const getTestEnvironment = () => {
  const eventApp = {
    execute: sinon.stub().returnsThis()
  };

  return {
    http_index: proxyquire('../events_index', {
      './controllers/event-app': eventApp,
      './env.js': {
        env: {
          logging: false, // disable request/response logging during tests
        },
      }
    }),
    mocks: {eventApp},
  };
};

describe('eventsApp', function () {
  it('should execute event app', async function () {
    const test = getTestEnvironment();
    const aiSupportEvents = getFunction('eventsApp');
    const event = {};
    const message = {
      attributes: {
        'ce-type': 'google.workspace.chat.message.v1.created'
      },
      data: Buffer.from(JSON.stringify(event)).toString('base64')
    };

    await aiSupportEvents(new CloudEvent({
      type: 'google.cloud.pubsub.topic.v1.messagePublished',
      source: '//pubsub.googleapis.com/projects/test/topics/events',
      data: {message},
    }));

    assert.ok(test.mocks.eventApp.execute.calledOnceWith(
      'google.workspace.chat.message.v1.created', event));
  });
});
