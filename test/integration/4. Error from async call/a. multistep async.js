
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');

var startProcess = require('../start_process');

var multistep = require('../../../demos/5. Error from async call/a. multistep async');

describe('5. Error from async call, a. multistep async', function() {

  it('returns an error', function(done) {
    multistep(function(err, result) {

      expect(err).to.have.property('stack');

      console.log(err.stack);
      expect(err.stack.split('\n')).to.have.length(3);

      done();
    });
  });

});
