
'use strict';

var Project = require('thehelp-project').GruntConfig;

module.exports = function(grunt) {
  var config = new Project(grunt);
  config.standardSetup();
  config.standardDefault();

  grunt.config('jade', {
    compile: {
      files: [{
        expand: true,
        cwd: 'src',
        src: '**/*.jade',
        dest: 'dist/',
        ext: '.html'
      }]
    }
  });

  grunt.config('watch.jade', {
    files: ['src/**/*.jade'],
    tasks: ['jade']
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
