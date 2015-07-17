
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

describe('3. Event loop unavailability, a. block event loop', function() {
  var child, agent;

  before(function(done) {
    agent = supertest.agent('http://localhost:3000');

    var entrypoint = path.join(__dirname,
      '../../../demos/3. Event loop unavailability/a. block event loop.js');

    child = startProcess(entrypoint);

    setTimeout(done, 1000);
  });

  it('shuts down', function(done) {
    this.timeout(3000);

    child.on('close', function() {
      expect(child).to.have.property('result');

      var result = child.result;

      expect(result).to.match(/getFile\: start\ngetFile\: done/);

      var match = result.match(/writeInterval/g);
      expect(match).to.have.length(9);

      match = result.match(/getFile/g);
      expect(match).to.have.length(4);


      done();
    });
  });

});
