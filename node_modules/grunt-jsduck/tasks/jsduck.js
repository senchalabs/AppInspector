/*
 * grunt-jsduck
 * https://github.com/dpashkevich/grunt-jsduck
 *
 * Copyright (c) 2012 Dmitry Pashkevich, contributors.
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';
    grunt.registerMultiTask('jsduck', 'Compile JSDuck documentation', function(outDir) {
        var helpers = require('grunt-lib-contrib').init(grunt),
            cmd = 'jsduck',
            options = helpers.options(this),
            src = this.filesSrc,
            dest = outDir || (this.hasOwnProperty('dest') ? this.file.dest : this.data.dest),
            args,
            done = this.async(),
            jsduck;

        grunt.verbose.writeflags(options, 'Options');

        args = src.concat([
                '--output', dest
               ],
               helpers.optsToArgs(options));

        jsduck = grunt.util.spawn({
            cmd: cmd,
            args: args
        }, function(error, result, code) {
            if(code == 127) {   // 'command not found'
                return grunt.warn(
                          'You need to have Ruby and JSDuck installed and in your PATH for ' +
                          'this task to work. ' +
                          'See https://github.com/dpashkevich/grunt-jsduck for details.'
                );
            }
            done(error);
        });

        jsduck.stdout.pipe(process.stdout);
        jsduck.stderr.pipe(process.stderr);
    });
};
