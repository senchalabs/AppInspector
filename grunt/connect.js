'use strict';

/**
 * Start a connect web server.
 * @type {Object}
 *
 * @see https://www.npmjs.org/package/grunt-contrib-connect
 */
module.exports = {
    server : {
        options : {
            hostname  : 'localhost',
            port      : 8333,
            base      : '../',
            keepalive : true,
            open      : {
                target : 'http://localhost:8333/appinspector/app/test'
            }
        }
    }
};
