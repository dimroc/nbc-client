module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    regarde: {
      coffee: {
        files: 'www/coffee/*.coffee',
        tasks: ['coffee']
      },
      scss: {
        files: 'www/scss/*.scss',
        tasks: ['compass']
      },
      livereload: {
        files: ['www/js/*.js', 'www/css/**/*.css', 'www/**/*.html'],
        tasks: ['livereload']
      }
    },

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

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'www'
        }
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
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['livereload-start', 'connect', 'regarde']);
};
