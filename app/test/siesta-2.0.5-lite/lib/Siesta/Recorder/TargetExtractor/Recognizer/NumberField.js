/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 @class Siesta.Recorder.TargetExtractor.Recognizer.NumberField
 *
 * A class recognizing the Ext JS NumberField component
 **/
Class('Siesta.Recorder.TargetExtractor.Recognizer.NumberField', {

    methods : {
        recognize : function (node) {
            if (!node.className.match(/\bx-form-spinner-(?:up|down)/)) {
                return;
            }

            return [
                ['.' + node.className.match(/\bx-form-spinner-(?:up|down)/)[0]]
            ];
        }
    }
});
