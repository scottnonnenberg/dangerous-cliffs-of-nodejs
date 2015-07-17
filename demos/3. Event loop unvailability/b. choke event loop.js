
'use strict';

var async = require('async');
var toobusy = require('toobusy-js');
var _ = require('lodash');

// all these in milliseconds
var LAUNCH_DELAY = 1;
var EXPANSION = 3;
var TASK_DELAY = 20;
var SYNC_WORK = 40;

var REJECT_IF_TOOBUSY = true;

var concurrent = 0;
var completed = 0;

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
        completed += 1;
        return cb(null, doSync());
      }, TASK_DELAY);
    });
  }

  async.parallel(tasks, function(err, result) {
    // console.log('got results!', result);
  });
};

setInterval(function() {
  console.log('lag:', toobusy.lag());
  console.log('concurrent:', concurrent);
  console.log('completed:', completed);
  completed = 0;
}, 250);

var go = function() {
  setTimeout(function() {
    handle();
    go();
  }, LAUNCH_DELAY)
};

go();
