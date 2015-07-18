
'use strict';

var bluebird = require('bluebird');
bluebird.longStackTraces();

var multistep = require('./e. promises via bluebird.js');

multistep()
  .then(function() {
    console.log('success!');
  })
  .catch(function(err) {
    console.log(err.stack);
  });
