
'use strict';

var express = require('express');
var morgan = require('morgan');


var app = express();

app.use(morgan('dev'));

// log entry looks like this:
// GET / 200 3.668 ms - 72

app.get('/', function(req, res) {
  res.send('<html><body>' +
    '<div><a href="/hang">/hang - Will not return</a></div>' +
    '<div><a href="/longAsyncTask">/longAsyncTask - Takes 2s; stop request</a></div>' +
    '</body></html>');
});

// log entries for hangs have no timing:
// GET /hang - - ms - -

app.get('/hang', function() {
  // no callback!
});

// when user cancels request, looks same as hang:
// GET /longAsyncTask - - ms - -

app.get('/longAsyncTask', function(req, res) {
  console.log('long task: start');

  setTimeout(function() {
    console.log('long task: still working!');
  }, 1000);

  setTimeout(function() {
    console.log('long task: done!');
    res.type('text');
    res.send('success!');
  }, 2000);
});


var port = 3000;
app.listen(port, function() {
  console.log('express server listening on port ' + port);
});
