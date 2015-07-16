
'use strict';

var fs = require('fs');

var express = require('express');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.send('<html><body>'
    + '<div><a href="/hang">Will not return</a></div>'
    + '</body></html>');
});

app.get('/hang', function(req, res) {
  // no callback!
});

// normal request
// GET / 200 3.668 ms - 72

// chrome attempted to load the page multiple times!
// GET /hang - - ms - -
// GET /hang - - ms - -
// GET /hang - - ms - -
// GET /hang - - ms - -

// this is what it looks like if user cancels navigation
// GET /hang - - ms - -

var port = 3000;
app.listen(port, function() {
  console.log('express server listening on port 3000');
});
