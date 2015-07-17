
'use strict';

var multistep = require('./a. multistep async.js');
multistep(function(err) {
  console.log(err.stack);
});
