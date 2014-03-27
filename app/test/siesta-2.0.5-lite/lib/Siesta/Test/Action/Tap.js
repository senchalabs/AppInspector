/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.Tap
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action can be included in the `t.chain` call with "tap" shortcut:

    t.chain(
        {
            action      : 'tap',
            target      : someDOMElement
        },
        // or
        {
            tap         : someDOMElement
        }
    )

This action will perform a {@link Siesta.Test.Browser#tap tap} on the provided {@link #target}. 

*/
Class('Siesta.Test.Action.Tap', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
        
    has : {
        requiredTestMethod  : 'tap'
    },

    
    methods : {
        
        process : function () {
            this.test.tap(this.getTarget(), this.next)
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('tap', Siesta.Test.Action.Tap)