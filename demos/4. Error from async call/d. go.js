
'use strict';

var multistep = require('./d. when and breadcrumbs.js');

multistep()
  .then(function() {
    console.log('success!');
  })
  .catch(function(err) {
    console.log(err.stack);
  });
