/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.Simulate.Event

This is a mixin providing events simulation functionality.

*/

Role('Siesta.Test.Simulate.Event', {
    
    requires        : [ 
        'createTextEvent', 
        'createMouseEvent', 
        'createKeyboardEvent'
    ],
    
    has: {
        actionDelay             : 100,
        afterActionDelay        : 100,
        
        /**
         * @cfg {String} simulateEventsWith
         * 
         * This option is IE9-strict mode (and probably above) specific. It specifies, which events simulation function Siesta should use. 
         * The choice is between 'dispatchEvent' (W3C standard) and 'fireEvent' (MS interface) - both are available in IE9 strict mode
         * and both activates different event listeners. See this blog post for detailed explanations: 
         * <http://www.digitalenginesoftware.com/blog/archives/76-DOM-Event-Model-Compatibility-or-Why-fireEvent-Doesnt-Trigger-addEventListener.html>
         * 
         * Valid values are "dispatchEvent" and "fireEvent".
         * 
         * The framework specific adapters choose the most appropriate value automatically (unless explicitly configured).
         */
        simulateEventsWith      : {
            is          : 'rw',
            init        : 'dispatchEvent'
        }
    },

    methods: {
        
        /**
         * This method will simulate an event triggered by the passed element. If no coordinates are supplied in the options object, the center of the element
         * will be used. 
         * @param {Siesta.Test.ActionTarget} el
         * @param {String} type The type of event (e.g. 'mouseover', 'click', 'keypress')
         * @param {Object} the options for the event. See http://developer.mozilla.org/en/DOM/event for reference.
         * @param {Boolean} suppressLog true to not include this simulated event in the assertion grid.
         */
        simulateEvent: function (el, type, options, suppressLog) {
            var global      = this.global;
            options         = options || {};

            if (this.valueIsArray(el)) {
                if (!('clientX' in options)) {
                    options.clientX = el[0];
                }

                if (!('clientY' in options)) {
                    options.clientY = el[1];
                }
            }

            el              = this.normalizeElement(el);
            var evt         = this.createEvent(type, options, el);


            if (evt) {
                evt.synthetic = true;
                this.dispatchEvent(el, type, evt);

                // Let the outside world know that an event was simulated
                if (!suppressLog) {
                    this.fireEvent('eventsimulated', this, el, type, evt);
                }
            }

            return evt;
        },

        createEvent: function (type, options, el) {
            if (/^text(Input)$/.test(type)) {
                return this.createTextEvent(type, options, el);
            }
            if (/^mouse(over|out|down|up|move|enter|leave)|contextmenu|(dbl)?click$/.test(type)) {
                return this.createMouseEvent(type, options, el);
            }
            if (/^key(up|down|press)$/.test(type)) {
                return this.createKeyboardEvent(type, options, el);
            }

//            XXX should be implemented in the Mobile (SenchaTouch) test class
//            if (/^touch/.test(type)) {
//                return this.createTouchEvent(type, options, el);
//            }
            // use W3C standard when available and allowed by "simulateEventsWith" option

            return this.createHtmlEvent(type, options, el);
        },


        createHtmlEvent : function(type, options, el) {

            var doc = el.ownerDocument;

            if (doc.createEvent && this.getSimulateEventsWith() == 'dispatchEvent') {
                var evt = doc.createEvent("HTMLEvents");
                evt.initEvent(type, false, false);
                return evt;
            } else if (doc.createEventObject) {
                return doc.createEventObject();
            }
        },
        
        dispatchEvent: function (el, type, evt) {
            // use W3C standard when available and allowed by "simulateEventsWith" option            
            if (el.dispatchEvent && this.getSimulateEventsWith() == 'dispatchEvent') {
                el.dispatchEvent(evt);
            } else if (el.fireEvent) {
                // IE 6,7,8 can't dispatch many events cleanly - throws exceptions
                try {
                    // this is the serios nominant to the best-IE-bug-ever prize and its IE7 specific
                    // accessing the "scrollLeft" property on document or body triggers the synchronous(!) "resize" event on window
                    // ExtJS uses singleton for Ext.EventObj and its "target" property gets overwritten with "null"
                    // thus consequent event handlers fails
                    // doing an access to that property to cache it
                    var doc     = this.global.document.documentElement;
                    var body    = this.global.document.body;
                    
                    var xxx     = doc && doc.scrollLeft || body && body.scrollLeft || 0;
                    
                    el.fireEvent('on' + type, evt);
                } catch (e) {
                }
            } else
                throw "Can't dispatch event: " + type
            
            return evt;
        }

    }
});
