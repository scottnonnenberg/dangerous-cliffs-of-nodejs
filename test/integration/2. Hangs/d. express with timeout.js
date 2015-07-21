
'use strict';

var path = require('path');
var stripAnsi = require('strip-ansi');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

describe('2. Hangs, a. express with timeout', function() {
  var child, agent;

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    var entrypoint = path.join(__dirname,
      '../../../demos/2. Hangs/d. express with timeout.js');

    child = startProcess(entrypoint);

    setTimeout(done, 1000);
  });

  it('returns 200 for root', function(done) {
    agent
      .get('/')
      .expect(200, done);
  });

  it('request to /hang returns', function(done) {
    agent
      .get('/hang')
      .timeout(1500)
      .expect(503, done);
  });

  it('request to /longAsyncTask returns in less than 2 seconds', function(done) {
    this.timeout(4000);

    agent
      .get('/longAsyncTask')
      .timeout(1500)
      .expect(503, function(err) {
        if (err) {
          done(err);
        }

        setTimeout(done, 2000);
      });
  });

  it('shuts down', function(done) {
    child.kill();

    child.on('close', function() {
      expect(child).to.have.property('result');

      var result = stripAnsi(child.result);

      var match = result.match(/long task/g);
      expect(match).to.have.length(3);

      expect(result).not.to.match(/GET \/hang - - ms/);

      expect(result).not.to.match(/GET \/longAsyncTask - - ms/);

      done();
    });
  });

});
