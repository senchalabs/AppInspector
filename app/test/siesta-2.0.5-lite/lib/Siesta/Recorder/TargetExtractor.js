/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 @class Siesta.Recorder.TargetExtractor

 */

Class('Siesta.Recorder.TargetExtractor', {

    has        : {

        lookUpUntil : 'HTML',

        // using node name as a CSS selector optional
        skipNodeNameForCSS : false,

        maxSuggestions : 3,

    //    ignoreIdRegEx: /ext-gen(?:\d+)/,

        /*
         *   Ignore all irrelevant or generic classes which will generate unstable selectors
         **/
        ignoreClasses : Joose.I.Array
    },

    methods : {

        initialize : function () {
            var classes = this.ignoreClasses;

//            for (var i = 0; i < classes.length; i++) {
//                classes[i] = this.regExpEscape(classes[i]);
//            }

            this.ignoreRe = new RegExp(this.ignoreClasses.join('|'));
        },

        pluckCssClasses : function(classes) {
            return classes;
        },

        getIds : function (node) {
            var ids = [];

            // Bubble up parent tree to find parent ids
            while (ids.length < this.maxSuggestions && node.nodeName.toUpperCase() !== this.lookUpUntil) {
                if (node.id) {
                    ids.push(node.id);
                }
                node = node.parentNode;
            }

            return ids;
        },

        getTargetOptions : function (event) {
            var options = {};
            var target = event.target;
            var doc = target.ownerDocument;
            var best;
            var bestType;

            options.xy = [event.pageX, event.pageY];

            // first of all, try to find some ids
            var ids = this.getIds(target);

            if (ids.length > 0) {
                options.domNodeId = '#' + ids[0];

                bestType = 'id';
                best = options.domNodeId;
            }

            var selectors = this.getCssSelectors(target);

            options.cssSelector = selectors[0] && selectors[0][0];
            options.cssSelector2 = selectors[1] && selectors[1][0];
            options.cssSelector3 = selectors[2] && selectors[2][0];

            if (ids.length === 0) {
                bestType = 'css';
                best = options.cssSelector;
            }

            options.actionTarget = best;
            options.targetType = bestType;

            return options;
        },

        getCssSelectors : function (node) {
            var doc = node.ownerDocument;
            var win = doc.defaultView || doc.parentWindow;
            var selectors = [];
            var i = 0;

            while (selectors.length < this.maxSuggestions && node.nodeName.toUpperCase() !== this.lookUpUntil) {
                var trimmed = node.className.trim();

                if (trimmed && node !== doc.body) {
                    var classes = [];

                    trimmed.split(' ').forEach(function (cls) {
                        cls = cls.trim();

                        if (cls && !this.ignoreRe.test(cls)) {
                            classes[classes.length] = cls;
                        }
                    }, this);

                    selectors[selectors.length] = this.pluckCssClasses(classes).map(function(cls) { return '.' + cls });
                } else if (node.nodeName.toLowerCase() === 'body' || !this.skipNodeNameForCSS){
                    // Not great, very generic
                    selectors.push([node.nodeName.toLowerCase()]);
                }
                node = node.parentNode;
                i++;
            }

            return selectors;
        },

        regExpEscape : function (s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }

//        ,
//
//        getXPath: function (el) {
//            var me = this,
//                good = false,
//                xpath = [],
//                count,
//                sibling,
//                t,
//                tag;
//
//            for (t = el; t; t = t.parentNode) {
//                if (t == me.attachTo.document.body) {
//                    xpath.unshift('~');
//                    good = true;
//                    break;
//                }
//                if (t.id && !me.ignoreIdRegEx.test(t.id)) {
//                    xpath.unshift('#' + t.id);
//                    good = true;
//                    break;
//                }
//
//                for (count = 1, sibling = t; !!(sibling = sibling.previousSibling); ) {
//                    if (sibling.tagName == t.tagName) {
//                        ++count;
//                    }
//                }
//
//                tag = t.tagName.toLowerCase();
//                if (count < 2) {
//                    xpath.unshift(tag);
//                } else {
//                    xpath.unshift(tag + '[' + count + ']');
//                }
//            }
//
//            return good ? xpath.join('/') : null;
//        }
    }
});
