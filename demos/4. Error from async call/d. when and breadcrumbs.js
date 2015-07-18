
'use strict';

var when = require('when');
var _ = require('lodash');
var core = require('thehelp-core');
var breadcrumbs = core.breadcrumbs;


var callRemoteService = function callRemoteService() {
  return when.promise(function(resolve, reject) {
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
    })
    .catch(function(err) {
      breadcrumbs.add(err);
      return when.reject(err);
    });
};

var step2 = function step2() {
  return callRemoteService()
    .then(function() {
      // do domain-specific stuff
    })
    .catch(function(err) {
      breadcrumbs.add(err);
      return when.reject(err);
    });
};

var step3 = function step3() {
  return callRemoteService()
    .then(function() {
      // do domain-specific stuff
    })
    .catch(function(err) {
      breadcrumbs.add(err);
      return when.reject(err);
    });
};

var step4 = function step3() {
  return callRemoteService()
    .then(function() {
      // do domain-specific stuff
    })
    .catch(function(err) {
      breadcrumbs.add(err);
      return when.reject(err);
    });
};

var step5 = function step3() {
  return callRemoteService()
    .then(function() {
      // do domain-specific stuff
    })
    .catch(function(err) {
      breadcrumbs.add(err);
      return when.reject(err);
    });
};

module.exports = function() {
  var steps = [
    step1(),
    step2(),
    step3(),
    step4(),
    step5()
  ];

  return when.all(steps)
    .then(function(result) {
      // do domain-specific stuff
    })
    .catch(function(err) {
      breadcrumbs.add(err);
      return when.reject(err);
    });
};
