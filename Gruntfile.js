
'use strict';

var Project = require('thehelp-project').GruntConfig;

module.exports = function(grunt) {
  var config = new Project(grunt);
  config.standardSetup();
  config.standardDefault();

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.config('jade', {
    compile: {
      files: [{
        expand: true,
        cwd: 'src/slides',
        src: '**/*.jade',
        dest: 'dist/',
        ext: '.html'
      }]
    }
  });

  // thehelp-project installs grunt-contrib-watch
  grunt.config('watch.jade', {
    files: ['src/slides/**/*.jade'],
    tasks: ['jade']
  });
};
