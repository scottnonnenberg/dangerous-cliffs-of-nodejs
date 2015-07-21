
'use strict';

var _ = require('lodash');
var Hapi = require('hapi');


var server = new Hapi.Server({
  load: {
    sampleInterval: 500
  },
  connections: {
    // if these are triggered, 503 is immediately returned
    load: {
      maxEventLoopDelay: 70
      // these more advanced options can also help prevent your servers from melting:
      // maxHeapUsedBytes: n,
      // maxRssBytes: m
    }
  },
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
      '<div><a href="/longSyncTask">/longSyncTask - open a few tabs; 503!</a></div>' +
      '<pre>curl -XPOST --header \'Content-Type: application/json\'' +
      ' -T \'demos/3. Event loop unavailability/data/(big|small).json\'' +
      ' ' + server.info.uri + '/uploadData</pre>' +
      '</body></html>');
  }
});

server.route({
  method: 'POST',
  path: '/uploadData',
  config: {
    payload: {
      output: 'data',
      parse: true,
      maxBytes: 1024, // default is 1048576 (1MB)
      timeout: 1000 // default is 10 seconds
    }
    // no built-in limits to reply payload size, but it does do schema validation
    // response: {
    //   schema: <Joi object hierarchy or function(value, options, next)>
    // }
  },
  handler: function(request, reply) {
    reply({keys: _.keys(request.payload).length});
  }
});

var doSyncWork = function(mil) {
  var start = new Date();
  var now = new Date();

  console.log('doSyncWork: start');
  while (now.getTime() - start.getTime() < mil) {
    now = new Date();
  }
  console.log('doSyncWork: done');
};

server.route({
  method: 'GET',
  path: '/longSyncTask',
  handler: function(request, reply) {
    doSyncWork(2000);

    reply('complete!')
      .type('text/plain');
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
