
'use strict';

var fork = require('child_process').fork;

// Start a forked node.js process, both capturing stdout/stderr and piping
// them to this process's stdout/stderr.

module.exports = function startProcess(module) {
  var child = fork(module, {
    silent: true,
    stdio: 'pipe'
  });

  child.result = '';

  if (child.stdout) {
    child.stdout.on('data', function(data) {
      process.stdout.write(data.toString());
      child.result += data;
    });
  }
  if (child.stderr) {
    child.stderrResult = '';
    child.stderr.on('data', function(data) {
      process.stderr.write(data.toString());
      child.result += data;
    });
  }

  return child;
};
