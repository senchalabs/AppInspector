"use strict";

describe('LintRoller - jsHint module', function () {
    var JSHINT = require('../../../src/linters/jshint');

    //SETUP / TEARDOWN
//    beforeEach(function () {
//
//    });

//    afterEach(function () {
//
//    });

    //SPECS

    it('should pass this sanity test', function () {
        expect(JSHINT).toNotEqual(undefined);
    });

    describe('applyLintOptions()', function () {

        //SETUP / TEARDOWN
        beforeEach(function () {
            JSHINT.options = {};
            JSHINT.globals = {};
        });

//        afterEach(function () {
//
//        });

        var options = {
            strict : true,
            node   : true,

            globals : {
                'describe'   : true,
                'beforeEach' : true,
                'afterEach'  : true,
                'it'         : true,
                'expect'     : true,
                'spyOn'      : true
            }
        };

        it('should apply normal JSHint configs', function () {
            expect(JSHINT.options.node).toEqual(undefined);

            JSHINT.applyLintOptions(options);

            expect(JSHINT.options.node).toEqual(true);
        });

        it('should apply "globals" to a different internal object', function() {
            expect(JSHINT.globals).toEqual({});

            JSHINT.applyLintOptions(options);

            expect(JSHINT.globals).toEqual(options.globals);
        });

    });

});