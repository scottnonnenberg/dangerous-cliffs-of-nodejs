
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

describe('1. Crashes, c. hapi', function() {
  var child, agent;

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    var entrypoint = path.join(__dirname, '../../../demos/1. Crashes/c. hapi.js');
    child = startProcess(entrypoint);

    setTimeout(done, 1000);
  });

  it('returns error for crash in route handler', function(done) {
    agent
      .get('/handlerCrash')
      .expect(/Internal Server Error/)
      .expect(500, done);
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
    child.kill();

    child.on('close', function() {
      expect(child).to.have.property('result');

      // expect(child.result).to.match(/Top-level exception/);

      done();
    });
  });

});
