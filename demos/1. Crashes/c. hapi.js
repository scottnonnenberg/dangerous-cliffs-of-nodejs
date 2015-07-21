
'use strict';

var fs = require('fs');
var _ = require('lodash');

var Hapi = require('hapi');
var Boom = require('boom');

var server = new Hapi.Server({
  minimal: true
});

server.on('request-error', function(event, err) {
  if (err.isDeveloperError) {
    console.log('Crash! Shutting down gracefully!');
    server.stop();
  }
});

process.on('SIGTERM', function() {
  console.log('SIGTERM! Shutting down gracefully!')
  server.stop();
});

server.connection({
  port: 3000
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply('<html><body>' +
      '<div><a href="/normalError">/normalError - Error returned, not crash</a></div>' +
      '<div><a href="/handlerCrash">/handlerCrash - Crash in route handler</a></div>' +
      '<div><a href="/longAsyncTask">/longAsyncTask - First, start in new tab</a></div>' +
      '<div><a href="/asyncCrash">/asyncCrash - Then crash server in new tab</a></div>' +
      '</body></html>');
  }
});

server.route({
  method: 'GET',
  path: '/normalError',
  handler: function(request, reply) {
    reply(Boom.badData(new Error('Something went wrong!')));
  }
});

server.route({
  method: 'GET',
  path: '/handlerCrash',
  handler: function(request, reply) {
    var x = 4;
    x.split();
  }
});

// try `sudo kill <pid>` while this process is running!

server.route({
  method: 'GET',
  path: '/longAsyncTask',
  handler: function(handler, reply) {
    console.log('long task: start');

    setTimeout(function() {
      console.log('long task: still working!');
    }, 1000);

    setTimeout(function() {
      console.log('long task: done!');
      reply('success!');
    }, 2000);
  }
});

server.route({
  method: 'GET',
  path: '/asyncCrash',
  handler: function(request, reply) {
    fs.readFile('nonexistent', function(err, result) {
      var length = result.length;
    });
  }
});

server.start(function() {
  console.log('Server running at:', server.info.uri);
});
