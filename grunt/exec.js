var fs = require('fs'),
    chalk = require('chalk'),
    senchadir = './app/AppInspector/.sencha/';

module.exports = function(grunt) {
    // look up if AppInspector was opened once in Sencha Architect
    // if so »./app/AppInspector/.sencha/« will exist containing build property files
    fs.exists(senchadir, function(exists) {
        var sa = {
                name: chalk.green('Sencha Architect'),
                path: chalk.yellow('./path/to/project/app/AppInspector/AppInspector.xds')
            };

        // if not, fail task
        if (!exists) {
            //
            grunt.fail.fatal([
                chalk.white(chalk.bold.blue(senchadir) + ' folder not found!'),
                '',
                '    To fix this, please open the project in ' + sa.name + ' first and save once.',
                '    You can find the ' + sa.name + ' project under ' + sa.path
            ].join('\n'));
        }
    });
    // else return task config
    return {
        testing: {
            cwd: '<%= yeoman.app %>/AppInspector/',
            command: 'sencha -q app build -e testing'
        },
        production: {
            cwd: '<%= yeoman.app %>/AppInspector/',
            command: 'sencha -q app build -e production'
        }
    };
};
