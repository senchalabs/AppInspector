"use strict";

describe('LintRoller', function () {
    var LintRoller;

    //SETUP / TEARDOWN

    beforeEach(function () {
        LintRoller = require('../../src/LintRoller');
    });

    afterEach(function () {
        LintRoller = null;
    });

    //SPECS

    it('should pass this sanity test', function () {
        expect(LintRoller).toNotEqual(undefined);
    });

//    describe('init()', function () {
//        //TODO: can a useful test be written?
//    });

    describe('getVersion()', function () {
        it('should return a string version number', function () {
            expect(typeof LintRoller.getVersion).toEqual('function');
            expect(typeof LintRoller.getVersion()).toEqual('string');
        });
    });

    describe('initConfigs()', function () {

        afterEach(function () {
            LintRoller.verbose = true;
            LintRoller.linters = [];
            LintRoller.logFile = {
                name : 'error_log.txt',
                type : 'text'
            };
        });

        it('should assign generic configs to LintRoller', function () {
            expect(LintRoller.verbose).toEqual(true);

            LintRoller.initConfigs({ verbose : false });
            expect(LintRoller.verbose).toEqual(false);
        });

        it('should call setLinters() for the "linters" config', function () {
            expect(LintRoller.linters).toEqual([]);

            spyOn(LintRoller, 'setLinters');
            var spy = LintRoller.setLinters;

            var linters = [ { type : 'esprima' } ];
            LintRoller.initConfigs({ linters : linters });

            expect(spy).toHaveBeenCalled();
        });

        it('should only assign "name" and "type" properties to the "logFile" config', function () {
            expect(typeof LintRoller.logFile).toEqual('object');

            LintRoller.initConfigs({
                logFile : {
                    name : 'test.txt',
                    type : 'json',
                    foo  : 'bar'
                }
            });

            expect(LintRoller.logFile.name).toEqual('test.txt');
            expect(LintRoller.logFile.type).toEqual('json');
            expect(LintRoller.logFile.foo).toEqual(undefined);
        });

        it('should allow the "logFile" config to be a string instead of an object', function () {
            expect(typeof LintRoller.logFile).toEqual('object');

            LintRoller.initConfigs({
                logFile : 'foo.txt'
            });

            expect(LintRoller.logFile.name).toEqual('foo.txt');

            //default should remain the same
            expect(LintRoller.logFile.type).toEqual('text');
        });

        it('should allow the "logFile" config to be null, which deletes logFile entirely', function () {
            expect(typeof LintRoller.logFile).toEqual('object');

            LintRoller.initConfigs({
                logFile : null
            });

            expect(LintRoller.logFile).toEqual(undefined);
        });

    });

    describe('setLinters()', function () {
        it('should apply the appropriate linters to LintRoller', function () {
            expect(LintRoller.linters).toEqual([]);

            var linters = [ { type : 'esprima' } ];
            LintRoller.setLinters(linters);

            expect(LintRoller.linters.length).toEqual(1);
            expect(LintRoller.linters[0].name).toEqual('esprima');
        });
    });

//    describe('announceErrors()', function () {
//        //TODO: can a useful test be written?
//    });

//    describe('announceSuccess()', function () {
//        //TODO: can a useful test be written?
//    });

//    describe('getFiles()', function () {
//        //This method just returns the result of fs.readdirSync() and logs output to the terminal
//        //I probably don't need to test this
//    });

//    describe('parseTree()', function () {
//
//    });

//    describe('lintFiles()', function () {
//        //TODO: can a useful test be written? Or do we simply test the ACTUAL linters?
//    });

//    describe('logToFile()', function () {
//        //TODO: can a useful test be written?
//    });

//    describe('logToStdOut()', function () {
//        //TODO: can a useful test be written?
//    });

//    describe('formatTextOutput()', function () {
//
//    });

//    describe('clearLogFile()', function () {
//        //TODO: can a useful test be written?
//    });

    describe('log()', function () {

        it('should default to VERBOSE being true', function () {
            expect(LintRoller.verbose).toEqual(true);
        });

        it('should only log to console when VERBOSE is true or OVERRIDE is true', function () {
            spyOn(console, 'log');
            var spy = console.log;
            expect(spy.callCount).toEqual(0);

            //true, false (YES)
            LintRoller.log('test', false);
            expect(spy.callCount).toEqual(1);

            //true, true (YES)
            LintRoller.log('test', true);
            expect(spy.callCount).toEqual(2);

            LintRoller.verbose = false;

            //false, false (NO)
            LintRoller.log('test', false);
            expect(spy.callCount).toEqual(2);

            //false, true (YES)
            LintRoller.log('test', true);
            expect(spy.callCount).toEqual(3);
        });

    });

});