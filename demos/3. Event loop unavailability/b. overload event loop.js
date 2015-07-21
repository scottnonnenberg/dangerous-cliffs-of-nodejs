
'use strict';

var async = require('async');
var toobusy = require('toobusy-js');

// all in milliseconds

var LAUNCH_DELAY = 10;
  // start: 10 = 100 requests/second
  // try this: 5 = 200 requests/second
var EXPANSION = 1;
var TASK_DELAY = 20;
var SYNC_WORK = 10;

var REJECT_IF_TOOBUSY = false;
  // then: turn this on, see if it helps

var concurrent = 0;
var completed = 0;
var rejected = 0;


var doSyncWork = function() {
  var start = new Date();
  var now = new Date();

  while (now.getTime() - start.getTime() < SYNC_WORK) {
    now = new Date();
  }
};

var doTask = function(cb) {
  concurrent += 1;
  setTimeout(function() {
    concurrent -= 1;
    completed += 1;
    return cb(null, doSyncWork());
  }, TASK_DELAY);
};

var launchTasks = function() {
  var tasks = [];

  if (REJECT_IF_TOOBUSY && toobusy()) {
    rejected += EXPANSION;
    return;
  }

  for (var i = 0; i < EXPANSION; i += 1) {
    tasks.push(doTask);
  }

  async.parallel(tasks, function() {
    // console.log('launchTasks: tasks complete!');
  });
};

var writeStatus = function() {
  console.log('lag:', toobusy.lag());
  console.log(' concurrent:', concurrent);
  console.log('  completed:', completed);
  completed = 0;

  if (REJECT_IF_TOOBUSY) {
    console.log('   rejected:', rejected);
    rejected = 0;
  }
};


setInterval(writeStatus, 250);

var previous;
var go = function() {
  setTimeout(function() {
    var now = new Date();
    var count = 1;
    if (previous) {
      // we're limited by event loop, so here we replicate lots of
      // events coming in while event loop blocked
      var delta = now.getTime() - previous.getTime();
      count = Math.floor(delta / LAUNCH_DELAY);
      // console.log('go: catch-up multipler:', count)
    }
    for (var i = 0; i < count; i+= 1) {
      launchTasks();
    }
    previous = now;

    go();

  }, LAUNCH_DELAY)
};

go();
