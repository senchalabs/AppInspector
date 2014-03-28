/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.Drag
@extends Siesta.Test.Action

This action can be included in the `t.chain` call with the "drag" shortcut:

    t.chain(
        {
            action      : 'drag',
            target      : someDOMElementOrArray,
            to          : someDOMElementOrArray
        },
        {
            action      : 'drag',
            target      : someDOMElementOrArray,
            by          : [ 10, 10 ]
        },
        // or
        {
            drag        : someDOMElementOrArray,
            to          : someDOMElementOrArray
        }
    )

This action will perform a {@link Siesta.Test.Browser#dragTo dragTo} or {@link Siesta.Test.Browser#dragBy dragBy} actions on the provided {@link #target}. 

*/
Class('Siesta.Test.Action.Drag', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
    
    has : {
        requiredTestMethod  : 'dragTo',
        
        /**
         * @cfg {Siesta.Test.ActionTarget/Function} target
         * 
         * The initial point of dragging operation. Can be provided as Siesta.Test.ActionTarget or the function returning it. 
         * Will also be passed further to the next step.
         */
         
        /**
         * @cfg {Siesta.Test.ActionTarget/Function} source
         * 
         * Alias for {@link #target}. This may sound confusing, but "target" of "drag" action is its "source" in the same time.   
         */
         
        
        /**
         * @cfg {Siesta.Test.ActionTarget/Function} to 
         * 
         * The target point of dragging operation. Can be provided as the DOM element, the array with screen coordinates: `[ x, y ]`, or the function
         * returning one of those.
         * 
         * Exactly one of the `to` and `by` configuration options should be provided for this action.
         */
        to                  : null,

        /**
         * @cfg {Array} fromOffset
         *
         * An offset in X, Y coordinates from the source element. Can be also specified as `offset` config.
         */
        fromOffset          : null,

        /**
         * @cfg {Array} toOffset
         *
         * An offset in X, Y coordinates from the targeted element
         */
        toOffset            : null,

        /**
         * @cfg {Array/Function} by 
         * 
         * The delta for dragging operation. Should be provided as the array with delta value for each coordinate: `[ dX, dY ]` or the function returning such.
         * 
         * Exactly one of the `to` and `by` configuration options should be provided for this action.
         */
        by                  : null,
        
        
        /**
         * @cfg {Boolean} dragOnly
         * 
         * True to skip the mouseup and not finish the drop operation (one can start another drag operation, emulating the pause during drag-n-drop).
         */
        dragOnly            : false
    },

    
    override : {
        BUILD : function (config) {
            // allow "source" as synonym for "target"
            // sounds weird, but "target" in action domain means source point for dragging 
            if (config.source && !config.target) config.target = config.source
            
            return this.SUPER(config)
        }
    },
    
    
    methods : {
        
        initialize : function () {
            this.SUPER()
            
            if (!this.to && !this.by)   throw 'Either "to" or "by" configuration option is required for "drag" step' 
            if (this.to && this.by)     throw 'Exactly one of "to" or "by" configuration options is required for "drag" step, not both'
        },
        
        
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
            var next                = this.next;
            var test                = this.test
            var target              = this.getTarget();
            var normalizedTarget    = test.normalizeActionTarget(target, true)
            
            if (this.to) {
                test.dragTo(target, this.getTo(), function() { next(normalizedTarget || test.normalizeActionTarget(target)); }, null, this.options, this.dragOnly, this.fromOffset || this.offset, this.toOffset)
            } else {
                test.dragBy(target, this.getBy(), function() { next(normalizedTarget || test.normalizeActionTarget(target)); }, null, this.options, this.dragOnly, this.fromOffset || this.offset)
            }
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('drag', Siesta.Test.Action.Drag)