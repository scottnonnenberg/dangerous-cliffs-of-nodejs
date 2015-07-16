
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

describe('1. Crashes, a. express', function() {
  var child, agent;

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    var entrypoint = path.join(__dirname, '../../../demos/1. Crashes/a. express.js');
    child = startProcess(entrypoint);

    setTimeout(done, 1000);
  });

  it('returns error for crash in route handler', function(done) {
    agent
      .get('/handlerCrash')
      .expect(/express error handler/)
      .expect(/x.split() is not a function/)
      .expect(500, done);
  });

  it('process crashes for async crash, socket disconnect', function(done) {
    agent
      .get('/longAsyncTask')
      .end(function(err) {
        expect(err).to.exist;
        expect(err).to.have.property('message').that.match(/socket hang up/);
      });

    agent
      .get('/asyncCrash')
      .end(function(err) {
        expect(err).to.exist;
        expect(err).to.have.property('message').that.match(/socket hang up/);
      });

    child.on('close', function() {
      expect(child).to.have.property('result');

      expect(child.result).to.match(/Top-level exception/);

      done();
    });
  });

});
