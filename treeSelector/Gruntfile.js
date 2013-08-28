module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			// define the files to lint
			files: ['src/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// more options here if you want to override JSHint defaults
				globals: {}
			}
		},

		uglify: {
			options: {
				mangle: false,
				banner: '// IMS Brogan\n// Component: <%= pkg.name %>\n// Version: <%= pkg.version %>\n// Built date: <%= grunt.template.today("isoDateTime") %>\n'
			},
			js: {
				// uglify output directives file
				files: [
					{ src: ['src/module.js', 'src/service.js', 'src/directive.js'], dest: 'build/treeSelector.min.js' }
				]
			}
		}

	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s)
	grunt.registerTask('default', ['jshint','uglify']);

	// custom task(s)
	grunt.registerTask('checkMyCrappyJS', ['jshint']);
	grunt.registerTask('minify', ['uglify']);
};