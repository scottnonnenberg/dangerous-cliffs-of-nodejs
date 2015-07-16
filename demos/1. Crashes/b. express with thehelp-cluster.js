
'use strict';

var fs = require('fs');

var express = require('express');
var app = express();
var cluster = require('thehelp-cluster');

cluster.Graceful.start();

var gracefulExpress = new cluster.GracefulExpress();

app.use(gracefulExpress.middleware);

app.get('/handlerCrash', function(req, res) {
  var x = 4;
  x.split();
});

app.get('/asyncCrash', function(req, res) {
  fs.readFile('nonexistent', function(err, result) {
    var contents = result.toString();
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
  cluster.Graceful.instance.shutdown(err);
});

var port = 3000;
gracefulExpress.listen(app, port, function() {
  console.log('express server listening on port ' + port);
});
