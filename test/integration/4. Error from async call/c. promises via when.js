
'use strict';

var test = require('thehelp-test');
var expect = test.expect;
var core = require('thehelp-core');

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
