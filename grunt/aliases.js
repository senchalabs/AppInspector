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
        'changelog:dist',
        'copy:dist',
        'compress',
        'docs'
    ],
    default: [
        'build'
    ]
};
