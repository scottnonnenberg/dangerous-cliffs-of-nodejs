
'use strict';

var multistep = require('./c. promises via when.js');

multistep()
  .then(function() {
    console.log('success!');
  })
  .catch(function(err) {
    console.log(err.stack);
  });
