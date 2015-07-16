
'use strict';

var express = require('express');
var app = express();

var fs = require('fs');

app.get('/handlerCrash', function(req, res) {
  var x = 4;
  x.split();
});

app.get('/asyncCrash', function(req, res) {
  fs.readFile('nonexistent', function(err, result) {
    var length = result.length;
  });
});

// register error handler
app.use(function(err, req, res, next) {
  console.log('express error handler run!', err.stack);
  res.status(500);
  res.send('express error handler ' + err.stack);
});

// catch top-level exception
process.on('uncaughtException', function(err) {
  console.log('Top-level exception!', err.stack);
  process.exit();
})

var port = 3000;
app.listen(port, function() {
  console.log('express server listening on port 3000');
});
