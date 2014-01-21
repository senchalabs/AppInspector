/*jshint camelcase: false*/
'use strict';

module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/AppInspector/app.js',
                '<%= yeoman.app %>/AppInspector/app/**/*.js'
            ]
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/AppInspector/build/production/AI/resources/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/AppInspector/resources/images'
                }]
            }
        },
        exec: {
            build: {
                cwd: '<%= yeoman.app %>/AppInspector/',
                command: 'sencha -q app build -e production -c'
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{html,js}'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/AppInspector/build/production/AI',
                    dest: '<%= yeoman.dist %>/AppInspector',
                    src: [
                        '*.{html,js}',
                        'resources/*.css'
                    ]
                }]
            }
        },
        chromeManifest: {
            dist: {
                options: {
                    buildnumber: false,
                    background: {
                        target: 'background.js'
                    }
                },
                src: '<%= yeoman.app %>',
                dest: '<%= yeoman.dist %>'
            }
        },
        compress: {
            dist: {
                options: {
                    archive: 'package/AppInspector.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: ''
                }]
            }
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'chromeManifest:dist',
        'exec:build',
        'imagemin',
        'copy',
        'compress'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};
