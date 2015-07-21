
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');
var core = require('thehelp-core');

var startProcess = require('../start_process');

var multistep = require('../../../demos/4. Error from async call/c. promises via when');

describe('4. Error from async call, c. promises via when', function() {

  it('returns an error', function(done) {
    multistep()
      .then(function() {
        done(new Error('was supposed to return error!'));
      })
      .catch(function(err) {

        expect(err).to.have.property('stack');

        console.log(core.breadcrumbs.toString(err));

        expect(err.stack.split('\n')).to.have.length(3);

        done();
      });
  });

});
