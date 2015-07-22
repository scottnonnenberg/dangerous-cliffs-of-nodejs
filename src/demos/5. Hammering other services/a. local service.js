
'use strict';

var async = require('async');
var superagent = require('superagent');


var host = 'http://localhost:3000';

// start: 10 = 100 requests/second
// try this: 5 = 200 requests/second
var LAUNCH_DELAY = 5;

var CANCEL_IF_RECENT_ERROR = false;
var RECENT_ERROR_DELAY = 2000;

var concurrent = 0;
var completed = 0;
var errors = 0;
var cancelled = 0;
var recentError = false;

var callRemoteService = function() {
  concurrent += 1;

  if (CANCEL_IF_RECENT_ERROR && recentError) {
    cancelled += 1;
  }

  superagent
    .get(host + '/doWork')
    .end(function(err, res) {
      concurrent -= 1;
      completed += 1;

      if (err) {
        errors += 1;
        recentError = true;
        setTimeout(function() {
          recentError = false;
        }, RECENT_ERROR_DELAY)
      }

      // console.log('err:', err, 'response:', res.body);
    });
};

var writeStatus = function() {
  console.log('concurrent:', concurrent);
  console.log(' completed:', completed);

  if (CANCEL_IF_RECENT_ERROR) {
    console.log(' cancelled:', cancelled);
  }

  console.log('    errors:', errors);

  errors = 0;
  completed = 0;
  cancelled = 0;
};


setInterval(writeStatus, 250);
setInterval(callRemoteService, LAUNCH_DELAY);
