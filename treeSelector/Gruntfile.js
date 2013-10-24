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
					{ src: ['src/module.js','src/directive.js','src/service.js'], dest: 'build/treeSelector.min.js' }
				]
			}
		},

		htmlmin: {
            options: {
                collapseWhitespace: true,
                removeComments: true,
                removeAttributeQuotes: true
            },
            dest: {
                files: {
                    'src/tmpl/_item.min.html' : 'src/tmpl/_item.html',
                    'src/tmpl/_treeSelector.min.html' : 'src/tmpl/_treeSelector.html'
                }
            }
        }

	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');

	// Default task(s)
	grunt.registerTask('default', ['jshint','uglify']);

	// custom task(s)
	grunt.registerTask('minify', ['uglify']);
	grunt.registerTask('checkMyCrappyJS', ['jshint']);
	grunt.registerTask('minifyhtml', ['htmlmin']);
};