
'use strict';

var _ = require('lodash');
var express = require('express');
var morgan = require('morgan');
var toobusy = require('toobusy-js');
var createError = require('http-errors');
var bodyParser = require('body-parser');


var port = 3000;
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
    '<div><a href="/longSyncTask">/longSyncTask - open a few tabs; 503!</a></div>' +
    '<pre>curl -XPOST --header \'Content-Type: application/json\'' +
      ' -T \'demos/3. Event loop unavailability/data/(huge|large|small).json\'' +
      ' localhost:' + port + '/uploadData</pre>' +
    '</body></html>');
});

app.post('/uploadData', function(req, res) {
  var length = _.get(req, 'body.values.length') || 0;
  res.send({length: length});
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

app.get('/longSyncTask', function(req, res) {
  doSyncWork(2000);
  res.type('text');
  res.send('complete!');
});

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
  console.log('express server listening on port ' + port);
});
