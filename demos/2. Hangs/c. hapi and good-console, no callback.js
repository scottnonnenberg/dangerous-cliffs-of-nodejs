
'use strict';

var fs = require('fs');
var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
  port: 3000
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply('<html><body>'
      + '<div><a href="/hang">Will not return</a></div>'
      + '</body></html>');
  }
});

server.route({
  method: 'GET',
  path: '/hang',
  handler: function(request, reply) {
    // no callback!
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
