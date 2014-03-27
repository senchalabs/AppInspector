/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.Swipe
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action can be included in the `t.chain` call with "swipe" shortcut:

    t.chain(
        {
            action      : 'swipe',
            target      : someDOMElement
        },
        // or
        {
            swipe       : someDOMElement
        }
    )

This action will perform a {@link Siesta.Test.SenchaTouch#swipe swipe} on the provided {@link #target}. 

*/
Class('Siesta.Test.Action.Swipe', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
        
    has : {
        requiredTestMethod          : 'swipe',
         
        /**
         * @cfg {String} direction Either 'left', 'right', 'up' or 'down'
         */
        direction                  : 'left'
    },

    
    methods : {
        
        process : function () {
            this.test.swipe(this.getTarget(), this.direction, this.next)
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('swipe', Siesta.Test.Action.Swipe)
