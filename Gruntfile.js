'use strict';

module.exports = function (grunt) {
    // measures the time each task takes
    require('time-grunt')(grunt);

    // load grunt config
    require('load-grunt-config')(grunt, {
        config: {
            app: 'app',
            dist: 'dist',
            ai: 'app/AppInspector'
        }
    });
};
