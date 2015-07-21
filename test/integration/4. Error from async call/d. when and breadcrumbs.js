
'use strict';

var test = require('thehelp-test');
var expect = test.expect;
var core = require('thehelp-core');

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
