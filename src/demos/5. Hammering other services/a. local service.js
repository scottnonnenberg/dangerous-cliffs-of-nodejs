
'use strict';

var http = require('http');

var superagent = require('superagent');


var host = 'http://localhost:3000';

// start: 10 = 100 requests/second
// try this: 5 = 200 requests/second
var LAUNCH_DELAY = 10;
var EXPANSION = 1;

// ease up for a while if remote server gives us an error
var CANCEL_IF_RECENT_ERROR = false;
var RECENT_ERROR_DELAY = 2000;

// set to non-zero to limit concurrent requests
var MAX_CONCURRENT = 0;

// use these to tune the behavior of the sockets created (currently set to the defaults)
// details: https://iojs.org/api/http.html#http_new_agent_options
var agent = new http.Agent({
  maxSockets: Infinity,
  keepAlive: false,
  keepAliveBoolean: false,
  keepAliveMsecs: 1000
});


var concurrent = 0;
var completed = 0;
var errors = 0;
var cancelled = 0;
var recentError = false;

var callRemoteService = function() {
  if (CANCEL_IF_RECENT_ERROR && recentError) {
    cancelled += 1;
    return;
  }

  if (MAX_CONCURRENT && concurrent > MAX_CONCURRENT) {
    cancelled += 1;
    return;
  }

  concurrent += 1;

  superagent
    .get(host + '/doWork')
    .agent(agent)
    .end(function(err, res) {
      /* jshint unused: false */

      concurrent -= 1;
      completed += 1;

      if (err) {
        errors += 1;
        recentError = true;
        setTimeout(function() {
          recentError = false;
        }, RECENT_ERROR_DELAY);
      }

      // console.log('err:', err, 'response:', res.body);
    });
};

var writeStatus = function() {
  console.log('concurrent:', concurrent);
  console.log(' completed:', completed);

  if (CANCEL_IF_RECENT_ERROR || MAX_CONCURRENT) {
    console.log(' cancelled:', cancelled);
  }

  console.log('    errors:', errors);

  errors = 0;
  completed = 0;
  cancelled = 0;
};


setInterval(writeStatus, 250);
setInterval(function() {
  for (var i = 0; i < EXPANSION; i += 1) {
    callRemoteService();
  }
}, LAUNCH_DELAY);
