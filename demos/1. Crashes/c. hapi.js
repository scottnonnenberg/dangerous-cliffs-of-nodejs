
'use strict';

var fs = require('fs');
var _ = require('lodash');

var Hapi = require('hapi');

var server = new Hapi.Server();

server.on('log', function(event, tags) {
  // TODO: this is not working for some reason
  console.log('got log event!');

  if (tags.error && tags.implementation && tags.internal) {
    console.log('error!', event.tags);
    server.stop();
  }
});

server.connection({
  port: 3000
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply('<html><body>' +
      '<div><a href="/handlerCrash">/handlerCrash - Crash in route handler</a></div>' +
      '<div><a href="/longAsyncTask">/longAsyncTask - First, start in new tab</a></div>' +
      '<div><a href="/asyncCrash">/asyncCrash - Then crash server in new tab</a></div>' +
      '</body></html>');
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
