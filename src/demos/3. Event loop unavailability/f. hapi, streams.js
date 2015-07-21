
// process incoming json with stream - parse JSON, count top-level keys
  // show chunks of stream

// send a file down the wire with stream
  // show chunks of stream

'use strict';

var fs = require('fs');
var path = require('path');

var Hapi = require('hapi');
var jsonStream = require('JSONStream');


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
      '<pre>curl -XPOST --header \'Content-Type: application/json\'' +
        ' -T \'demos/3. Event loop unavailability/data/(huge|large|small).json\'' +
        ' ' + server.info.uri + '/uploadData</pre>' +
      '<pre>curl ' + server.info.uri + '/downloadData</pre>' +
      '</body></html>');
  }
});

server.route({
  method: 'POST',
  path: '/uploadData',
  config: {
    payload: {
      output: 'stream',
      parse: false
    }
  },
  handler: function(request, reply) {
    var length = 0;
    var parse = jsonStream.parse('values.*');

    // request.payload.on('data', function(chunk) {
    //   console.log('raw chunk:' + chunk.toString());
    // });

    request.payload.on('end', function() {
      reply({length: length});
    });

    parse.on('data', function(data) {
      /* jshint unused: false */
      // console.log('data:', data);
      length += 1;
    });

    request.payload.pipe(parse);
  }
});

// Note: not the ideal way to serve files; this is just showing a streamed response
// Better: CDNs, nginx, reply.file(), etc.

server.route({
  method: 'GET',
  path: '/downloadData',
  handler: function(request, reply) {
    var file = path.join(__dirname, 'data/huge.json');
    var readStream = fs.createReadStream(file);

    // readStream.on('data', function(chunk) {
    //   console.log('raw chunk:', chunk.toString());
    // });

    reply(readStream)
      .type('application/json');
  }
});


// Exercise for the reader: Implement a /proxy endpoint
//   url querystring parameter
//   pipe response from `request` or `superagent` through to original client
//   which headers should be piped through from target, which should remain from proxy?


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
