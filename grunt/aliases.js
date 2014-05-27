/**
 * Grunt aliases
 * @type {Object}
 */
module.exports = {
    docs    : [
        'clean:docs',
        'jsduck'
    ],
    dev     : [
        'jshint',
        'clean:dist',
        'exec:dev',
        'chromeManifest:dev',
        'changelog:dev',
        'copy:dev',
        'fileblocks:dist'
    ],
    test    : [
        'connect'
    ],
    build   : [
        'jshint',
        'clean:dist',
        'imagemin:resources',
        'exec:production',
        'imagemin:sencha',
        'chromeManifest:dist',
        'changelog:dist',
        'copy:dist',
        'compress',
        'docs'
    ],
    default : [
        'build'
    ]
};
