module.exports = function(grunt) {
	grunt.initConfig({});

	require('grunt-task-loader')(grunt);
	grunt.loadNpmTasks('gruntify-eslint');

	grunt.initConfig({
		app: {
			www: 'www',
			tmp: '.tmp',
			frontend: 'www/frontend'
		},

		copy: {},

		clean: {
			tmp: '<%=app.tmp %>'
		},

		eslint: {
			node: {
				options: {
					configFile: '.eslintrc',
					silent: true
				},
				src: [
					'<%= app.www %>/app.js',
					'<%= app.www %>/rest/**/*.js',
					'<%= app.www %>/base/**/*.js',
					'<%= app.www %>/modules/**/*.js',
					'<%= app.www %>/utils/**/*.js'
				]
			},
			frontend: {
				options: {
					configFile: '.eslintrc',
					silent: true
				},
				src: [
					'<%= app.frontend %>/js/**/*.js'
				]
			}
		},

		exec: {
			app: {
				cmd: 'node <%= app.www %>/app.js'
			}
		},

		watch: {
			frontendStyles: {
				files: [
					'<%= app.frontend %>/styles/**/*.scss'
				],
				tasks: ['compass']
			}
		},

		compass: {
			frontend: {
				options: {
					sassDir: '<%= app.frontend %>/styles',
					specify: '<%= app.frontend %>/styles/remote-control.scss',
					cssDir: '<%= app.tmp %>/styles',
					outputStyle: 'compressed'
				}
			}

		},

		concurrent: {
			dev: {
				tasks: [
					'exec:app',
					'watch:frontendStyles'
				],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.registerTask('dev', [
		'clean:tmp',
		'compass',
		'eslint',
		'concurrent:dev'
	]);

	grunt.registerTask('default', ['dev']);
};
