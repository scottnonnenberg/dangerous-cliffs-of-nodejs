
'use strict';

var async = require('async');
var toobusy = require('toobusy-js');
var _ = require('lodash');

// all these in milliseconds
var LAUNCH_DELAY = 100;
var TASK_DELAY = 20;
var SYNC_WORK = 50;

var REJECT_IF_TOOBUSY = false;
var EXPANSION = 1;

var concurrent = 0;

var doSync = function() {
  var start = new Date();
  var now = new Date();

  while (now.getTime() - start.getTime() < SYNC_WORK) {
    now = new Date();
  }

  return _.random(0, 10);
}

var handle = function() {
  var tasks = [];

  if (REJECT_IF_TOOBUSY && toobusy()) {
    return;
  }

  for (var i = 0; i < EXPANSION; i += 1) {
    tasks.push(function(cb) {
      concurrent += 1;
      setTimeout(function() {
        concurrent -= 1;
        return cb(null, doSync());
      }, TASK_DELAY);
    });
  }

  async.parallel(tasks, function(err, result) {
    // console.log('got results!', result);
  });
};

setInterval(function() {
  console.log('current lag:', toobusy.lag());
  console.log('current concurrent:', concurrent);
}, 250);

setInterval(function() {
  handle();
}, LAUNCH_DELAY)
