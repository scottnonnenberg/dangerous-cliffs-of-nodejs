
'use strict';

var fs = require('fs');
var toobusy = require('toobusy-js');


var doSyncWork = function() {
  var start = new Date();
  var now = new Date();

  console.log('doSyncWork: start');
  while (now.getTime() - start.getTime() < 1000) {
    now = new Date();
  }
  console.log('doSyncWork: done');
};

var getFile = function() {
  var start = new Date();
  console.log('getFile: start');
  fs.readFile('nonexistent', function() {
    var now = new Date();
    var delta = now.getTime() - start.getTime()
    console.log('getFile: done,', delta + 'ms');
  });
};

var previous;
var writeInterval = function() {
  var delta;
  var now = new Date();
  if (previous) {
    delta = now.getTime() - previous.getTime();
  }
  console.log('writeInterval:', delta ? delta + 'ms' : '-');
  previous = now;
};


setInterval(writeInterval, 100);

setTimeout(getFile, 250)

setTimeout(function() {
  getFile();
  doSyncWork();
}, 500)

setTimeout(function() {
  process.exit();
}, 2000);
