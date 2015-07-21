
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');


describe('1. Crashes, b. express with thehelp-cluster', function() {
  var child, agent;

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    var entrypoint = path.join(__dirname,
      '../../../demos/1. Crashes/b. express with thehelp-cluster.js');

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
      .expect(/express error handler/)
      .expect(/Something went wrong/)
      .expect(500, done);
  });

  it('returns error for crash in route handler', function(done) {
    agent
      .get('/handlerCrash')
      .expect(/express error handler/)
      .expect(/x.split() is not a function/)
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
      .expect(/express error handler/)
      .expect(/Cannot read property/)
      .expect(500, function(err) {
        if (err) {
          done(err);
        }
      });
  });

  it('process shuts down afterwards', function(done) {
    child.on('close', function() {
      expect(child).to.have.property('result');

      expect(child.result).to.match(/Master about to exit/);

      done();
    });
  });

});
