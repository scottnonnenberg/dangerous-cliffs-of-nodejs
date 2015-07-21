
'use strict';

var express = require('express');
var morgan = require('morgan');
var timeout = require('connect-timeout');


var app = express();

app.use(timeout('1s', {respond: true}));
app.use(morgan('dev'));

var render = function(req, res, data) {
  if (req.timedout) {
    console.log('not rendering; request already timed out');
  }
  else {
    res.type('text');
    res.send(data);
  }
};

app.get('/', function(req, res) {
  res.send('<html><body>' +
    '<div><a href="/hang">/hang - Will not return</a></div>' +
    '<div><a href="/longAsyncTask">/longAsyncTask - Takes 2s; stop request</a></div>' +
    '</body></html>');
});

app.get('/hang', function() {
  // no callback!
});

app.get('/longAsyncTask', function(req, res) {
  console.log('long task: start');

  setTimeout(function() {
    console.log('long task: still working!');
  }, 1000);

  setTimeout(function() {
    console.log('long task: done!');
    render(req, res, 'success!');
  }, 2000);
});


var port = 3000;
app.listen(port, function() {
  console.log('express server listening on port 3000');
});
