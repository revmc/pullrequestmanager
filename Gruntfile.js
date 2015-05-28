module.exports = function(grunt) {

  grunt.initConfig(
    {
      pkg: grunt.file.readJSON('package.json'),
      jshint: {
        all: ['app/js/**/*.js']
      },
      sass: {
        dist: {
          files: {
            'app/styles/main.css' : 'app/styles/main.scss'
          }
        }
      },
      uglify: {
        minifyrepomanager: {
          src: 'app/js/views/repomanagerapp.js',
          dest: 'app/js/views/repomanagerapp.min.js',
          options: {
              sourceMap: true
          }
        },
      },
      watch: {
        css: {
          files: 'app/styles/*.scss',
          tasks: ['sass']
        }
      }
    }
  );
  
  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.loadNpmTasks('grunt-contrib-sass');
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Default task(s).
  grunt.registerTask('default', ['jshint']);
  
};