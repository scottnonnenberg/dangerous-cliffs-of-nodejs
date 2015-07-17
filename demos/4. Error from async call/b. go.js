
'use strict';

var core = require('thehelp-core');
var breadcrumbs = core.breadcrumbs;

var multistep = require('./b. with breadcrumbs.js');
multistep(function(err) {
  console.log(breadcrumbs.toString(err));
});
