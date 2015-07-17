
'use strict';

var async = require('async');
var _ = require('lodash');
var core = require('thehelp-core');
var breadcrumbs = core.breadcrumbs;


var callRemoteService = function callRemoteService(cb) {
  setTimeout(function() {
    if (_.random(0, 10) < 6) {
      return cb(new Error('Incorrect arguments supplied'));
    }
    return cb();
  });
};

var step1 = function step1(cb) {
  callRemoteService(function(err, result) {
    if (breadcrumbs.add(err, cb)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

var step2 = function step2(cb) {
  callRemoteService(function(err, result) {
    if (breadcrumbs.add(err, cb)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

var step3 = function step3(cb) {
  callRemoteService(function(err, result) {
    if (breadcrumbs.add(err, cb)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

var step4 = function step4(cb) {
  callRemoteService(function(err, result) {
    if (breadcrumbs.add(err, cb)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

var step5 = function step5(cb) {
  callRemoteService(function(err, result) {
    if (breadcrumbs.add(err, cb)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

module.exports = function(cb) {
  async.series([
    step1,
    step2,
    step3,
    step4,
    step5
  ], function(err, result) {
    if (breadcrumbs.add(err, cb, {userId: 5, command: 'save'})) {
      return;
    }

    // do domain-specific stuff

    return cb();
  });
};
