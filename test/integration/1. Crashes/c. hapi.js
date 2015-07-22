
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

describe('1. Crashes, c. hapi', function() {
  var child, agent;
  var entrypoint = path.join(__dirname, '../../../demos/1. Crashes/c. hapi.js');

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    child = startProcess(entrypoint);

    setTimeout(done, 1000);
  });

  it('returns 200 for root', function(done) {
    agent
      .get('/')
      .expect(200, done);
  });

  it('returns error for crash in route handler', function(done) {
    agent
      .get('/normalError')
      .expect(/Something went wrong/)
      .expect(422, done);
  });

  it('returns error for crash in route handler, shuts down', function(done) {
    agent
      .get('/handlerCrash')
      .expect(/Internal Server Error/)
      .expect(500, function(err) {
        if (err) {
          done(err);
        }
      });

    child.on('close', function() {
      expect(child).to.have.property('result');

      expect(child.result).to.match(/Crash! Shutting down gracefully!/);

      done();
    });
  });

  it('start up process again', function(done) {
    child = startProcess(entrypoint);
    setTimeout(done, 1000);
  });

  it('returns error for async crash', function(done) {
    this.timeout(4000);

    agent
      .get('/longAsyncTask')
      .expect('success!')
      .expect(200, function(err) {
        if (err) {
          done(err);
        }
      });

    agent
      .get('/asyncCrash')
      .expect(/Internal Server Error/)
      .expect(500, function(err) {
        if (err) {
          done(err);
        }
      });

    child.on('close', function() {
      expect(child).to.have.property('result');

      expect(child.result).to.match(/Crash! Shutting down gracefully!/);

      done();
    });
  });

});
