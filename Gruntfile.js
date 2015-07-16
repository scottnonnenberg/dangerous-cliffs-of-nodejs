module.exports = function(grunt) {

  grunt.initConfig({
    jade: {
      compile: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.jade',
          dest: 'dist/',
          ext: '.html'
        }]
      }
    },
    watch: {
      jade: {
        files: ['src/**/*.jade'],
        tasks: ['jade']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jade']);
};
