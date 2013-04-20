module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    regarde: {
      coffee: {
        files: 'src/**/*.coffee',
        tasks: ['coffee']
      },
      scss: {
        files: 'src/scss/*.scss',
        tasks: ['compass']
      },
      livereload: {
        files: [
          'www/js/*',
          'www/css/*',
          'www/img/*',
          'www/templates/*',
          'www/*.html',
          'www/**/*.html'
        ],
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
          sourceMap: false
        },
        files: {
          'www/js/application.js': [
            'src/coffee/initializers/*.coffee',
            'src/coffee/models/*.coffee',
            'src/coffee/observers/*.coffee',
            'src/coffee/views/*.coffee',
            'src/coffee/**/*.coffee'
          ] // concat then compile into single file
        }
      }
    },

    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src:
          [
            // jquery mobile files directly in www/js/folder because
            // they suck with bower
            'components/jquery/jquery.js',
            'components/underscore/underscore.js',
            'components/underscore.string/dist/underscore.string.min.js',
            'components/backbone/backbone.js',
            'components/cryptojs/lib/Crypto.js',
            'components/cryptojs/lib/CryptoMath.js',
            'components/cryptojs/lib/SHA1.js',
            'components/cryptojs/lib/HMAC.js'
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
  grunt.registerTask('default', [
                     'concat',
                     'compass',
                     'coffee',
                     'livereload-start',
                     'connect',
                     'regarde'
  ]);
};
