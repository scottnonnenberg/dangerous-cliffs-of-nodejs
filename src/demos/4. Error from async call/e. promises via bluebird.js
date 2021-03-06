
'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');


Bluebird.longStackTraces();

var callRemoteService = function callRemoteService() {
  return new Bluebird(function(resolve, reject) {
    setTimeout(function() {
      if (_.random(0, 10) < 3) {
        return reject(new Error('Incorrect arguments supplied'));
      }
      return resolve();
    });
  });
};

var step1 = function step1() {
  return callRemoteService()
    .then(function() {
      // do domain-specific stuff
    });
};

var step2 = function step2() {
  return callRemoteService()
    .then(function() {
      // do domain-specific stuff
    });
};

var step3 = function step3() {
  return callRemoteService()
    .then(function() {
      // do domain-specific stuff
    });
};

var step4 = function step3() {
  return callRemoteService()
    .then(function() {
      // do domain-specific stuff
    });
};

var step5 = function step3() {
  return callRemoteService()
    .then(function() {
      // do domain-specific stuff
    });
};

var multistep = module.exports = function() {
  var steps = [
    step1(),
    step2(),
    step3(),
    step4(),
    step5()
  ];

  return Bluebird.all(steps)
    .then(function() {
      // do domain-specific stuff
    });
};

if (require.main === module) {
  multistep()
    .then(function() {
      console.log('success!');
    })
    .catch(function(err) {
      console.log(err.stack);
    });
}
