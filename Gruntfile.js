module.exports = function(grunt) {


  grunt.initConfig(
    {
      // pkg: grunt.file.readJSON('package.json'),
      jshint: {
        all: ['app/js/**/*.js']
      },
      uglify: {
        minifyrepomanager: {
          src: 'app/js/views/repomanagerapp.js',
          dest: 'app/js/views/repomanagerapp.min.js',
          options: {
              sourceMap: true
          }
        },
      }
    }
  );
  
  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task(s).
  grunt.registerTask('default', ['jshint']);
  
};