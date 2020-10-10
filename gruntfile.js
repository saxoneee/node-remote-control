module.exports = function(grunt) {
	grunt.initConfig({});

	require('grunt-task-loader')(grunt);
	grunt.loadNpmTasks('gruntify-eslint');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		app: {
			server: 'src/serv',
			tmp: '.tmp',
			frontend: 'src/www',
			build: 'build',
			cordova: 'cordova',
			android: {
				root: 'cordova',
				build: '<%= app.android.root %>/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk'
				// build: '<%= app.android.root %>/platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk'
			}
		},

		copy: {
			android: {
				src: ['<%= app.android.build %>'],
				dest: '<%= app.build %>/<%= pkg.name %>.apk'
			}
		},

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
					'<%= app.server %>/app.js',
					'<%= app.server %>/rest/**/*.js',
					'<%= app.server %>/base/**/*.js',
					'<%= app.server %>/modules/**/*.js',
					'<%= app.server %>/utils/**/*.js'
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
				cmd: 'node <%= app.server %>/app.js'
			},

			emulator: {
				cmd: '"%ANDROID_SDK_ROOT%/emulator/emulator.exe" -avd Nexus_5X_API_29 -netdelay none -netspeed full'
			},

			emulate: {
				cwd: '<%= app.android.root %>',
				cmd: '"'+__dirname+'/node_modules/.bin/cordova" run android'
			},

			buildAndroid: {
				cwd: '<%= app.android.root %>',
				cmd: '"'+__dirname+'/node_modules/.bin/cordova" build android --release'
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
					'<%= app.android.root %>/www/**/*.*'
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
					// 'exec:app',
					'watch:frontendStyles',
					'connect:browser'
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
		},

		connect: {
			browser: {
				options: {
					base: [
						'<%= app.tmp %>',
						'<%= app.frontend %>',
						'bower', // deprecated
					],
					keepalive: true,
					port: 8000,
					hostname:'localhost',
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

	grunt.registerTask('build', [
		'exec:buildAndroid',
		'copy:android'
	]);

	grunt.registerTask('default', ['dev']);
};
