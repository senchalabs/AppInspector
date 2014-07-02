/**
 * Grunt aliases
 * @type {Object}
 */
module.exports = {
    docs   : [
        'clean:docs',
        'jsduck'
    ],
    test   : [
        'connect'
    ],
    build  : [
        'jshint',
        'clean:dist',
        'imagemin:resources',
        'exec:dist',
        'imagemin:sencha',
        'chromeManifest:dist',
        'copy:dist',
        'compress',
        'docs',
        'changelog:dist'
    ],
    default: [
        'build'
    ]
};
