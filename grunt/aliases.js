/**
 * Grunt aliases
 * @type {Object}
 */
module.exports = {
    docs: [
        'clean:docs',
        'jsduck',
    ],
    build: [
        'jshint',
        'clean:dist',
        'chromeManifest:dist',
        'imagemin:resources',
        'exec:production',
        'imagemin:sencha',
        'copy',
        'compress',
        'docs'
    ],
    default: [
        'build'
    ]
};
