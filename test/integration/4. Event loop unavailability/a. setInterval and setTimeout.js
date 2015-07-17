
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

describe('3. Blocking event loop, a. setInterval and setTimeout', function() {
  var child, agent;

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    var entrypoint = path.join(__dirname,
      '../../../demos/3. Blocking event loop/a. setInterval and setTimeout.js');

    child = startProcess(entrypoint);

    setTimeout(done, 1000);
  });

  it('shuts down', function(done) {
    this.timeout(3000);

    child.on('close', function() {
      expect(child).to.have.property('result');

      var result = child.result;

      expect(result).to.match(/sync task start\nsync task done/);

      var match = result.match(/interval/g);
      expect(match).to.have.length(9);

      done();
    });
  });

});
