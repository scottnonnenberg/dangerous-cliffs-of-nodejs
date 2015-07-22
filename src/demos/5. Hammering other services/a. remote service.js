
'use strict';

var http = require('http');

var _ = require('lodash');
var toobusy = require('toobusy-js');
var async = require('async');


var EXPANSION = 1;
var TASK_DELAY = 20;
var SYNC_WORK = 10;

// use this to keep this server from melting under heavy load
var REJECT_IF_TOOBUSY = false;

var PORT = 3000;
var BIND = 'localhost';


var concurrent = 0;
var completed = 0;
var rejected = 0;
var sockets = [];


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


var server = http.createServer(function(req, res) {
  if (REJECT_IF_TOOBUSY && toobusy()) {
    rejected += EXPANSION;

    res.writeHead(503, {'Content-Type': 'application/json'});
    res.end('{"error": "too busy!"}');
    return;
  }

  var tasks = [];

  for (var i = 0; i < EXPANSION; i += 1) {
    tasks.push(doTask);
  }

  async.parallel(tasks, function() {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('{"result": "done!"}');
  });
});

server.on('connection', function(socket) {
  if (_.contains(sockets, socket)) {
    return;
  }

  sockets.push(socket);

  socket.on('close', function() {
    sockets = _.without(sockets, socket);
  });
});

server.listen(PORT, BIND);

console.log('Server running at http://' + BIND + ':' + PORT + '/');


var writeStatus = function() {
  console.log('lag:', toobusy.lag());
  console.log(' concurrent:', concurrent);
  console.log('  completed:', completed);
  console.log('    sockets:', sockets.length);
  completed = 0;

  if (REJECT_IF_TOOBUSY) {
    console.log('   rejected:', rejected);
    rejected = 0;
  }
};

setInterval(writeStatus, 250);
