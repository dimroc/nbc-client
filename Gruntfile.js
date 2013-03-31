module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {                  // Task
      dist: {                   // Target
        options: {              // Target options
          basePath: 'www',
          sassDir: 'scss',
          cssDir: 'css'
        }
      }
    },

    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        src:
          [
            'components/underscore/underscore.js',
            'components/underscore.string/dist/underscore.string.min.js',
            'components/jquery-mobile/underscore.string.js'
        ],
        dest: 'www/js/vendor.js'
      }
    },

    coffee: {
      compileWithMaps: {
        options: {
          sourceMap: true
        },
        files: {
          'www/js/application.js': ['www/coffee/*.coffee'] // concat then compile into single file
        }
      }

      //glob_to_multiple: {
        //expand: true,
        //cwd: 'path/to',
        //src: ['*.coffee'],
        //dest: 'path/to/dest/',
        //ext: '.js'
      //}
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['compass', 'coffee']);
};
