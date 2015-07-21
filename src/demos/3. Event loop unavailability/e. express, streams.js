
'use strict';

var fs = require('fs');
var path = require('path');

var express = require('express');
var morgan = require('morgan');
var jsonStream = require('JSONStream');


var port = 3000;
var app = express();

app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.send('<html><body>' +
    '<pre>curl -XPOST --header \'Content-Type: application/json\'' +
      ' -T \'demos/3. Event loop unavailability/data/(huge|large|small).json\'' +
      ' localhost:' + port + '/uploadData</pre>' +
    '<pre>curl localhost:' + port + '/downloadData</pre>' +
    '</body></html>');
});

app.post('/uploadData', function(req, res) {
  var length = 0;
  var parse = jsonStream.parse('values.*');

  // req.on('data', function(chunk) {
  //   console.log('raw chunk:' + chunk.toString());
  // });

  req.on('end', function() {
    res.send({length: length});
  });

  parse.on('data', function(data) {
    /* jshint unused: false */
    // console.log('data:', data);
    length += 1;
  });

  req.pipe(parse);
});

// Note: not the ideal way to serve files; this is just showing a streamed response
// Better: CDNs, nginx, express static middleware, res.download(), etc.

app.get('/downloadData', function(req, res) {
  var file = path.join(__dirname, 'data/huge.json');
  var readStream = fs.createReadStream(file);

  // readStream.on('data', function(chunk) {
  //   console.log('raw chunk:', chunk.toString());
  // });

  res.type('json');

  readStream.pipe(res);
});


// Exercise for the reader: Implement a /proxy endpoint
//   url querystring parameter
//   pipe response from `request` or `superagent` through to original client
//   which headers should be piped through from target, which should remain from proxy?


// register error handler
app.use(function(err, req, res, next) {
  /* jshint unused: false */
  // express error handlers need arity of four

  console.log('express error handler run!', err.stack);
  res.status(err.statusCode || 500);
  res.type('text');
  res.send('express error handler ' + err.stack);
});


app.listen(port, function() {
  console.log('express server listening on port 3000');
});
