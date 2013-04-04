module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    regarde: {
      coffee: {
        files: 'src/coffee/*.coffee',
        tasks: ['coffee']
      },
      scss: {
        files: 'src/scss/*.scss',
        tasks: ['compass']
      },
      livereload: {
        files: ['www/js/*', 'www/css/*', 'www/img/*', 'www/**/*.html'],
        tasks: ['livereload']
      }
    },

    compass: {                  // Task
      dist: {                   // Target
        options: {              // Target options
          sassDir: 'src/scss',
          cssDir: 'www/css'
        }
      }
    },

    coffee: {
      compileWithMaps: {
        options: {
          sourceMap: true
        },
        files: {
          'www/js/application.js': ['src/coffee/*.coffee'] // concat then compile into single file
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
            // jquery mobile files directly in www/js/folder because
            // they suck with bower
            'components/jquery/jquery.js',
            'components/underscore/underscore.js',
            'components/underscore.string/dist/underscore.string.min.js',
            'components/backbone/backbone.js'
        ],
        dest: 'www/vendor/vendor.js'
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'www'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'livereload-start', 'connect', 'regarde']);
};
