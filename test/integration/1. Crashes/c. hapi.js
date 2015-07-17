
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

      expect(child.result).to.match(/crash! shutting down!/);

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
      .expect(200, done);

    agent
      .get('/asyncCrash')
      .expect(/Internal Server Error/)
      .expect(500, function(err, result) {
        if (err) {
          done(err);
        }
      });
  });

  it('process shuts down afterwards', function(done) {
    child.on('close', function() {
      expect(child).to.have.property('result');

      expect(child.result).to.match(/crash! shutting down!/);

      done();
    });
  });

});
