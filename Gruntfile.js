module.exports = function(grunt) {

  grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-jscs" );


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
	});

  grunt.registerTask( "test", [ "jshint", "jscs:test" ] );
  grunt.registerTask( "default", [ "test" ] );

};
