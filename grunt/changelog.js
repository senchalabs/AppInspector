'use strict';

/**
 * Grunt aliases
 * @type {Object}
 */

var config = {};

config.manifest = require('../app/manifest.json');
config.package = require('../package.json');

module.exports = {
    dist: {
        options: {
            version  : config.manifest.version,
            changelog: 'CHANGELOG.md',
            template : 'labeled'
        }
    },
    dev : {
        options: {
            version  : config.manifest.version,
            changelog: 'CHANGELOG.md',
            template : 'labeled',
            write    : false
        }
    }
};
