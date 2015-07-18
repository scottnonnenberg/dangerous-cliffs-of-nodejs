
'use strict';

var fs = require('fs');
var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
  port: 3000
});

// log entry looks like this:
// 150717/233429.805, [response], http://rev.local:3000: get / {} 200 (16ms)

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply('<html><body>' +
      '<div><a href="/hang">/hang - Will not return</a></div>' +
      '<div><a href="/longAsyncTask">/longAsyncTask - Takes 2s; stop request</a></div>' +
      '</body></html>');
  }
});

// no log entry for hang!

server.route({
  method: 'GET',
  path: '/hang',
  handler: function(request, reply) {
    // no callback!
  }
});

// you do get a log entry for cancelled request:
// 150717/234654.272, [response], http://rev.local:3000: get /longAsyncTask {} 200 (2004ms)

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

var options = {
  opsInterval: 1000,
  reporters: [{
    reporter: require('good-console'),
    events: {
      log: '*',
      response: '*'
    }
  }]
};

server.register({
  register: require('good'),
  options: options
}, function (err) {
  if (err) {
    console.error(err.stack);
  }
  else {
    server.start(function () {
      console.info('Server started at ' + server.info.uri);
    });
  }
});
