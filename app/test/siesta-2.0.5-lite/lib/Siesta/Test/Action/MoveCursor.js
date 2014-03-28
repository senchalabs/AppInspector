/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.MoveCursor
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action can be included in the `t.chain` call with "moveCursor" shortcut:

    t.chain(
        {
            action      : 'moveCursor',
            to          : 'div.someClass'   // A div with class='someClass'
        },
        {
            action      : 'moveCursor',
            to          : [400, 300]        // Target pixel coordinates
        },
        {
            action      : 'moveCursor',
            by          : [20, 10]  // 20 px right, 10 px down
        }
    )

This action will perform a {@link Siesta.Test.Simulate.Mouse#moveCursorTo moveCursorTo} to the provided 'to' destination or the relative 'by' offset.

*/
Class('Siesta.Test.Action.MoveCursor', {
    
    isa         : Siesta.Test.Action,
    
    has : {
        requiredTestMethod  : 'moveMouseTo',
        
        /**
         * @cfg {Siesta.Test.ActionTarget/Function} to 
         * 
         * The target point the cursor should be moved to. Can be provided as a DOM element, an array with client coordinates: `[ x, y ]`, or a function
         * returning one of those. You can additionally pass an 'offset' array to click at a point relative to the XY position of the target.
         * 
         * Exactly one of the `to` and `by` configuration options should be provided for this action.
         */
        to                  : null,
        
        
        /**
         * @cfg {Array/Function} by 
         * 
         * The delta for moving cursor. Should be provided as the array with delta value for each coordinate: `[ dX, dY ]` or the function returning such.
         * 
         * Exactly one of the `to` and `by` configuration options should be provided for this action.
         */
        by                  : null,

        /**
         * @cfg {Array} offset
         *
         * An offset in X, Y coordinates from the targeted element (only applicable when using the 'to' target option.
         */
        offset : null
    },

    
    methods : {
        getTo : function () {
            if (this.test.typeOf(this.to) == 'Function')
                return this.to.call(this.test, this)
            else
                return this.to
        },
        
        
        getBy : function () {
            if (this.test.typeOf(this.by) == 'Function')
                return this.by.call(this.test, this)
            else
                return this.by
        },

        process : function () {
            var test = this.test;
            var next = this.next;

            if (this.to) {
                var to                  = this.getTo()
                
                var normalizedTarget    = test.normalizeActionTarget(to, false)
                
                test.moveMouseTo(to, function() { next(normalizedTarget); }, null, this.offset)
            } else {
                var by                  = this.getBy()
                var currentXY           = test.currentPosition
                
                var normalizedTarget    = test.normalizeActionTarget([ currentXY[ 0 ] + by[ 0 ], currentXY[ 1 ] + by[ 1 ] ]);

                test.moveMouseBy(by, function() { next(normalizedTarget); })
            }
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('moveCursor', Siesta.Test.Action.MoveCursor)
Siesta.Test.ActionRegistry().registerAction('moveMouse', Siesta.Test.Action.MoveCursor)
Siesta.Test.ActionRegistry().registerAction('moveFinger', Siesta.Test.Action.MoveCursor)
