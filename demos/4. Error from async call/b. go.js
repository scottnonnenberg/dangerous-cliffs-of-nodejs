
'use strict';

var multistep = require('./b. with breadcrumbs.js');
multistep(function(err) {
  console.log(err.stack);
});
