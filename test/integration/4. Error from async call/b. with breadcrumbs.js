
'use strict';

var path = require('path');

var test = require('thehelp-test');
var expect = test.expect;
var supertest = require('supertest');
var core = require('thehelp-core');

var startProcess = require('../start_process');

var withBreadcrumbs =
  require('../../../demos/4. Error from async call/b. with breadcrumbs');


describe('4. Error from async call, a. with breadcrumbs', function() {

  it('error includes the step function name', function(done) {
    withBreadcrumbs(function(err, result) {

      expect(err).to.have.property('stack');

      console.log(core.breadcrumbs.toString(err));

      expect(err.stack.split('\n')).to.have.length(5);

      expect(err).to.have.property('userId').that.exist;
      expect(err).to.have.property('command').that.exist;

      done();
    });
  });

});
