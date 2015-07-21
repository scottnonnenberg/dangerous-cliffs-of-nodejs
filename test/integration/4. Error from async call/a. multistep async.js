
'use strict';

var test = require('thehelp-test');
var expect = test.expect;
var core = require('thehelp-core');

var multistep = require('../../../demos/4. Error from async call/a. multistep async');


describe('4. Error from async call, a. multistep async', function() {

  it('returns an error', function(done) {
    multistep(function(err) {

      expect(err).to.have.property('stack');

      console.log(core.breadcrumbs.toString(err));

      expect(err.stack.split('\n')).to.have.length(3);

      done();
    });
  });

});
