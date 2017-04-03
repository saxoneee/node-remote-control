module.exports = function(grunt) {
	grunt.initConfig({});

	require('grunt-task-loader')(grunt);
	grunt.loadNpmTasks('gruntify-eslint');

	grunt.initConfig({
		app: {
			www: 'www',
			tmp: '.tmp',
			frontend: 'www/frontend',
			build: 'build',
			android: 'cordova'
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
			},

			emulator: {
				cmd: '%ANDROID_HOME%/emulator/emulator.exe -avd Nexus_5X_API_23 -netdelay none -netspeed full'
			},

			emulate: {
				cwd: '<%= app.android %>',
				cmd: 'cordova run android'
			}
		},

		watch: {
			frontendStyles: {
				files: [
					'<%= app.frontend %>/styles/**/*.scss'
				],
				tasks: ['compass']
			},
			emulate: {
				files: [
					'<%= app.android %>/www/**/*.*'
				],
				tasks: ['exec:emulate']
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
			},
			emulate: {
				tasks: [
					'exec:app',
					'watch:frontendStyles',
					'exec:emulate',
					'watch:emulate'
				],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.registerTask('_prepare', [
		'clean:tmp',
		'compass',
		'eslint'
	]);

	grunt.registerTask('dev', [
		'_prepare',
		'concurrent:dev'
	]);

	grunt.registerTask('emulate', [
		'_prepare',
		'concurrent:emulate'
	]);

	grunt.registerTask('emulator', [
		'exec:emulator'
	]);

	// grunt.registerTask('build', [

	// ]);

	grunt.registerTask('default', ['dev']);
};
