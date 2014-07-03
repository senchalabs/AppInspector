'use strict';

/**
 * Grunt task to update CHANGELOG.md
 * @param   {Object} grunt
 * @type    {Object}
 *
 * @see     https://www.npmjs.org/package/grunt-templated-changelog
 */
module.exports = function (grunt) {
    var config = {},
        version, tmpVersion;

    config.manifest = grunt.file.readJSON('./app/manifest.json');

    // we need to manually bump the version, because the version string is already loaded from
    // '../app/manifest.json' before it gets updated from the `chromeManifest` task
    tmpVersion = config.manifest.version.split('.');

    version = [
        tmpVersion[0],                  // major
        tmpVersion[1],                  // minor
        parseInt(tmpVersion[2]) + 1     // patch
    ].join('.');

    return {
        dist: {
            options: {
                version  : version,
                changelog: 'CHANGELOG.md',
                template : 'labeled',
                write    : false
            }
        }
    };
};
