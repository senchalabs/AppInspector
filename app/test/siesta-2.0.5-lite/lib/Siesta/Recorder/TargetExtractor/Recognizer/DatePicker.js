/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 @class Siesta.Recorder.TargetExtractor.Recognizer.DatePicker
 *
 * A class recognizing the Ext JS DatePicker component
 **/
Class('Siesta.Recorder.TargetExtractor.Recognizer.DatePicker', {

    methods : {
        recognize : function (node) {
            if (!node.className.match(/\bx-datepicker-date\b/)) {
                return;
            }

            return [
                ['.x-datepicker-date:contains(' + node.innerHTML + ')']
            ];
        }
    }
});
