
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');
var core = require('thehelp-core');

var startProcess = require('../start_process');

var multistep =
  require('../../../demos/4. Error from async call/d. when and breadcrumbs');

describe('4. Error from async call, d. when and breadcrumbs', function() {

  it('returns an error', function(done) {
    multistep()
      .then(function() {
        done(new Error('was supposed to return error!'));
      })
      .catch(function(err) {
        expect(err).to.have.property('stack');

        console.log(core.breadcrumbs.toString(err));

        expect(err.stack.split('\n')).to.have.length(5);

        expect(err).to.have.property('userId').that.exist;
        expect(err).to.have.property('command').that.exist;

        done();
      })
      .catch(done);
  });

});
