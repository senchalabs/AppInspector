/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.RightClick
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action will perform a {@link Siesta.Test.Browser#rightClick right click} on the provided {@link #target}. 

This action can be included in the `t.chain` call with "rightclick" or "rightClick" shortcuts:

    t.chain(
        {
            action      : 'rightclick',
            target      : someDOMElement,
            options     : { shiftKey : true } // Optionally hold shiftkey
        },
        // or
        {
            rightclick  : someDOMElement,
            options     : { shiftKey : true } // Optionally hold shiftkey
        }
    )


*/
Class('Siesta.Test.Action.RightClick', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
        
    has : {
        requiredTestMethod  : 'rightClick'
    },

    
    methods : {
        
        process : function () {
            this.test.rightClick(this.getTarget(), this.next, null, this.options, this.offset)
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('rightclick', Siesta.Test.Action.RightClick)
Siesta.Test.ActionRegistry().registerAction('contextmenu', Siesta.Test.Action.RightClick)
