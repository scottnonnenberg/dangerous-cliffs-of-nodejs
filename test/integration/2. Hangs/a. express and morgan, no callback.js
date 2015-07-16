
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

describe('2. Hangs, a. express and morgan, no callback', function() {
  var child, agent;

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    var entrypoint = path.join(__dirname,
      '../../../demos/2. Hangs/a. express and morgan, no callback.js');

    child = startProcess(entrypoint);

    setTimeout(done, 1000);
  });

  it('returns 200 for root', function(done) {
    agent
      .get('/')
      .expect(200, done);
  });

  it('request to /hang never returns', function(done) {
    var timeout = 4000;

    this.timeout(timeout + 2000);

    agent
      .get('/hang')
      .timeout(timeout)
      .end(function(err, res) {
        expect(err).to.have.property('timeout', timeout);
        setTimeout(done, 100);
      });
  });

  it('shuts down', function(done) {
    child.kill();

    child.on('close', function() {
      expect(child).to.have.property('result');

      expect(child.result).to.match(/- ms/);

      done();
    });
  });

});
