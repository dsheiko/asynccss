module.exports = function(grunt) {

  grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-jscs" );
  grunt.loadNpmTasks( "grunt-mocha-phantomjs" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );



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
      pkg: grunt.file.readJSON( "package.json" ),
      uglify: {
        options: {
          banner: "/*! \n<%= pkg.name %> v<%= pkg.version %> | (c) 2014-2015 Dmitry Sheiko  | MIT " +
            "    <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n\n"
        },
        all: {
          files: {
            "./build/asynccss.js": [ "./src/asynccss.js" ]
          }
        }
      },
      mocha_phantomjs: {
        all: [ 'test/**/*.html' ]
      }
	});

  grunt.registerTask( "test", [ "jshint", "jscs:test", "mocha_phantomjs" ] );
  grunt.registerTask( "default", [ "test", "uglify" ] );

};
