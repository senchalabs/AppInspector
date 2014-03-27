/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * This is a model class containing information about recorded user actions
 */
Ext.define('Siesta.Recorder.RecordedEvent', {
    extend : 'Ext.data.Model',

    fields : [
        // just a number so we can keep track of the unique events
        'id',

        { name : 'index', type : 'int' },

        // event type
        'type',

        // event types
        'csq',
        'cq',
        'css',
        'domId',

        // EOF event types

        // timestamp
        'ts',

        // Alt, ctrl, meta, shift keys
        'options',

        'text',

        // The offset relative to the target DOM node
        'offset',

        // The offset for a drag target
        'toOffset',

        // the target initially proposed by Siesta, which user can later override
        'actionTarget',

        'xy',

        // the target initially proposed by Siesta, which user can later override
        'target',

        /*
         * The type of target, possible options:
         *
         *   - 'id'      DOM node id
         *   - 'css'     css selector
         *   - 'cq'      component query
         *   - 'csq'     composite query
         *   - 'xy'      XY coordinates
         *
         * */
        'targetType',

        // Queue refs
        'start',
        'tail',

        // drag refs
        'by',
        'to'
    ],

    resetValues : function () {
        this.set({
            'csq'          : null,
            'cq'           : null,
            'css'          : null,
            'domId'        : null,
            'options'      : null,
            'text'         : null,
            'offset'       : null,
            'actionTarget' : null,
            'targetType'   : null
        })
    },

    parseOffset : function (offsetString) {

        var vals = offsetString.split(',');

        if (vals.length < 2) {
            return;
        }

        if (!vals[0].match('%')) {
            vals[0] = parseInt(vals[0], 10);

            if (isNaN(vals[0])) {
                return;
            }
        }

        if (!vals[1].match('%')) {
            vals[1] = parseInt(vals[1], 10);

            if (isNaN(vals[1])) {
                return;
            }
        }

        return vals;
    },

    isMouseInputEvent : function () {
        var type = this.data.type;

        return type in {
            click        : 1,
            contextmenu  : 1,
            dblclick     : 1,
            drag         : 1,
            moveCursorBy : 1,
            moveCursorTo : 1
        };
    }
});
