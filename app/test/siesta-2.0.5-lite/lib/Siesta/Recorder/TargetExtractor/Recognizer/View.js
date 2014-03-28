/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 @class Siesta.Recorder.TargetExtractor.Recognizer.View
 *
 * A class recognizing the Ext JS View component
 **/
Class('Siesta.Recorder.TargetExtractor.Recognizer.View', {

    methods : {
        recognize : function (node) {
            var cmpRoot = $(node).closest('.x-component');

            if (cmpRoot.length === 0) {
                return;
            }

            var Ext = this.Ext();
            var cmp = Ext && Ext.getCmp(cmpRoot[0].id);

            if (!(cmp && cmp.is('dataview') && $(node).closest(cmp.itemSelector).length > 0)) {
                return;
            }

            var itemSelector = cmp.itemSelector;
            var itemNode = node;

            if (!$(node).is(itemSelector)) {
                itemNode = $(node).closest(itemSelector)[0];
            }

            var pos = Array.prototype.slice.apply(itemNode.parentNode.childNodes).indexOf(itemNode) + 1;
            var customCss = this.getCustomCssClass(node);

            var retVal = itemSelector + ':nth-child(' + pos + ')' + ' ';

            if (node !== itemNode) {
                retVal += customCss ? ('.' + customCss) : node.nodeName.toLowerCase();
            }

            return [retVal];
        }
    }
});
