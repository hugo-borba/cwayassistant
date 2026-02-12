const {getTestServer} = require('@google-cloud/functions-framework/testing');
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const request = require('supertest');

const getTestEnvironment = () => {
  const app = {
    execute: sinon.stub().returns({text: 'App executed.'}),
  };

  return {
    http_index: proxyquire('../http_index', {
      './controllers/app': app,
      './services/user-auth': {
        oauth2callback: async (_, res) => res.send('oauth2callback executed.')
      },
      './env.js': {
        env: {
          logging: false, // disable request/response logging during tests
        },
      }
    }),
    mocks: {app},
  };
};

describe('app', function () {
  it('should execute app and send response', async function () {
    const test = getTestEnvironment();
    const server = getTestServer('app');

    const response = await request(server)
      .post('/')
      .send({ chat: {}})
      .set('Content-Type', 'application/json');

    assert.ok(test.mocks.app.execute.calledOnceWith({ chat: {}}));
    assert.match(response.headers['content-type'], /json/);
    assert.equal(response.status, 200);
    assert.equal(response.body.text, 'App executed.');
  });

  it('should send status 400 if chat is undefined', async function () {
    const test = getTestEnvironment();
    const server = getTestServer('app');

    const response = await request(server)
      .post('/')
      .send({})
      .set('Content-Type', 'application/json');

    assert.ok(test.mocks.app.execute.notCalled);
    assert.equal(response.status, 400);
    assert.equal(
      response.text, 'This function is meant to be used in a Google Chat app.');
  });

  it('should send status 400 if request method is GET', async function () {
    const test = getTestEnvironment();
    const server = getTestServer('app');

    const response = await request(server).get('/');

    assert.ok(test.mocks.app.execute.notCalled);
    assert.equal(response.status, 400);
    assert.equal(
      response.text, 'This function is meant to be used in a Google Chat app.');
  });

  it('should execute oauth2callback', async function () {
    const test = getTestEnvironment();
    const server = getTestServer('app');

    const response = await request(server).get('/oauth2');

    assert.ok(test.mocks.app.execute.notCalled);
    assert.equal(response.status, 200);
    assert.equal(response.text, 'oauth2callback executed.');
  });
});
