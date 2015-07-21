
'use strict';

var async = require('async');
var _ = require('lodash');


var callRemoteService = function callRemoteService(cb) {
  setTimeout(function() {
    if (_.random(0, 10) < 3) {
      return cb(new Error('Incorrect arguments supplied'));
    }
    return cb();
  });
};

var step1 = function step1(cb) {
  callRemoteService(function(err) {
    if (err) {
      return cb(err);
    }

    // do domain-specific stuff
    return cb();
  });
};

var step2 = function step2(cb) {
  callRemoteService(function(err) {
    if (err) {
      return cb(err);
    }

    // do domain-specific stuff
    return cb();
  });
};

var step3 = function step3(cb) {
  callRemoteService(function(err) {
    if (err) {
      return cb(err);
    }

    // do domain-specific stuff
    return cb();
  });
};

var step4 = function step3(cb) {
  callRemoteService(function(err) {
    if (err) {
      return cb(err);
    }

    // do domain-specific stuff
    return cb();
  });
};

var step5 = function step3(cb) {
  callRemoteService(function(err) {
    if (err) {
      return cb(err);
    }

    // do domain-specific stuff
    return cb();
  });
};

var multistep = module.exports = function(cb) {
  async.series([
    step1,
    step2,
    step3,
    step4,
    step5
  ], function(err) {
    if (err) {
      return cb(err);
    }

    // do domain-specific stuff

    return cb();
  });
};

if (require.main === module) {
  multistep(function(err) {
    console.log(err.stack);
  });
}
