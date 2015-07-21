
'use strict';

var fs = require('fs');

var express = require('express');
var morgan = require('morgan');
var toobusy = require('toobusy-js');
var createError = require('http-errors');
var bodyParser = require('body-parser');


var app = express();

app.use(morgan('dev'));

app.use(function(req, res, next) {
  if (toobusy()) {
    var err = createError(503, 'Server too busy', {
      code: 'ETOOBUSY'
    });
    return next(err);
  }

  next();
});

app.use(bodyParser.json({
  limit: '1kb'
}));

app.get('/', function(req, res) {
  res.send('<html><body>' +
    '<pre>curl -XPOST --header \'Content-Type: application/json\'' +
      ' -T \'demos/3. Event loop unavailability/data/(big|small).json\'' +
      ' localhost:3000/uploadData</pre>' +
    '</body></html>');
});

app.post('/uploadData', function(req, res) {
  res.send(req.body);
});

// register error handler
app.use(function(err, req, res, next) {
  console.log('express error handler run!', err.stack);
  res.status(500);
  res.type('text');
  res.send('express error handler ' + err.stack);
});


var port = 3000;
app.listen(port, function() {
  console.log('express server listening on port 3000');
});
