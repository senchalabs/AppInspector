"use strict";

var jasmine = require('jasmine-node'),
    sys = require('sys'),
    key;

for (key in jasmine) {
    if (jasmine.hasOwnProperty(key) && key !== 'undefined') {
        global[key] = jasmine[key];
    }
}

var isVerbose = true;
var showColors = true;
var specsLocation = [ __dirname + '/specs/' ];

process.argv.forEach(function (arg) {
    switch (arg) {
        case '--color':
            showColors = true;
            break;
        case '--noColor':
            showColors = false;
            break;
        case '--verbose':
            isVerbose = true;
            break;
    }
});

jasmine.executeSpecsInFolder({
    specFolders : specsLocation,

    isVerbose  : isVerbose,
    showColors : showColors,

    onComplete : function (runner) {
        if (runner.results().failedCount === 0) {
            process.exit(0);
        }
        else {
            console.log('Unit tests have failed!');
            process.exit(1);
        }
    }
});