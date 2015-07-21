
'use strict';

var Hapi = require('hapi');


var server = new Hapi.Server({
  minimal: true
});

server.connection({
  port: 3000
});

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

server.route({
  method: 'GET',
  path: '/hang',
  config: {
    timeout: {
      server: 1000
    }
  },
  handler: function() {
    // no callback!
  }
});

server.route({
  method: 'GET',
  path: '/longAsyncTask',
  config: {
    timeout: {
      server: 1000
    }
  },
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
}, function(err) {
  if (err) {
    console.error(err.stack);
  }
  else {
    server.start(function() {
      console.info('Server started at ' + server.info.uri);
    });
  }
});
