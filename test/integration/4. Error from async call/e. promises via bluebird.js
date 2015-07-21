
'use strict';

var test = require('thehelp-test');
var expect = test.expect;
var core = require('thehelp-core');

var multistep =
  require('../../../demos/4. Error from async call/e. promises via bluebird');


describe('4. Error from async call, e. promises via bluebird', function() {

  it('returns an error', function(done) {
    multistep()
      .then(function() {
        done(new Error('was supposed to return error!'));
      })
      .catch(function(err) {
        expect(err).to.have.property('stack');

        console.log(core.breadcrumbs.toString(err));

        expect(err.stack).to.match(/From previous event/);
        expect(err.stack).to.match(/ step\d /);

        done();
      })
      .catch(done);
  });

});
