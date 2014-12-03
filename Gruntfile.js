module.exports = function(grunt) {

  grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-jscs" );
  grunt.loadNpmTasks( "grunt-mocha-phantomjs" );



	grunt.initConfig({
			jshint: {
					options: {
							jshintrc: ".jshintrc"
					},
					all: [ "src/**/*.js" ]
			},
			jscs: {
        app: {
          options: {
            standard: "Jquery"
          },
          files: {
            src: [ "./src" ]
          }
        },
        test: {
          options: {
            standard: "Jquery",
            reportFull: true
          },
          files: {
            src: [ "./src" ]
          }
        }
      },
      mocha_phantomjs: {
        all: [ 'test/**/*.html' ]
      }
	});

  grunt.registerTask( "test", [ "jshint", "jscs:test", "mocha_phantomjs" ] );
  grunt.registerTask( "default", [ "test" ] );

};
