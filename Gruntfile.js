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
					options: {
							"standard": "Jquery"
					},
					all: ["src"]
			}
	});

  grunt.registerTask( "test", [ "jshint", "jscs" ] );
  grunt.registerTask( "default", [ "test" ] );

};
