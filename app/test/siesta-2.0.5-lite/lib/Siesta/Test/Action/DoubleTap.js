/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.DoubleTap
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action will perform a {@link Siesta.Test.Browser#doubleClick double tap} on the provided {@link #target}. 

This action can be included in the `t.chain` call with "doubletap" or "doubleTap" shortcuts:

    t.chain(
        {
            action      : 'doubletap',
            target      : someDOMElement
        },
        // or
        {
            doubletap   : someDOMElement,
            offset      : [20,20] // click 20px from the left/top corner of the element
        }
    )


*/
Class('Siesta.Test.Action.DoubleTap', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
        
    has : {
        requiredTestMethod  : 'doubleTap'
    },

    
    methods : {
        
        process : function () {
            this.test.doubleTap(this.getTarget(), this.next, null, this.offset)
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('doubletap', Siesta.Test.Action.DoubleTap)
