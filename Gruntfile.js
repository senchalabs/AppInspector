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
        clean: require('./grunt/clean'),
        jshint: require('./grunt/jshint'),
        imagemin: require('./grunt/imagemin'),
        exec: require('./grunt/exec'),
        copy: require('./grunt/copy'),
        chromeManifest: require('./grunt/manifest'),
        compress: require('./grunt/compress'),
        jsduck: require('./grunt/jsduck'),
        // NOTE: run the »githooks« task only once or when adding new hooks
        githooks: {
            all: {
                'pre-commit': 'jshint'
            }
        }
    });

    grunt.registerTask('docs', [
        'clean:docs',
        'jsduck'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'chromeManifest:dist',
        'imagemin:resources',
        'exec:production',
        'imagemin:sencha',
        'copy',
        'compress',
        'docs'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};
