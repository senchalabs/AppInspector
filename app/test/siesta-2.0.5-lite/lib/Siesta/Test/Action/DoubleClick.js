/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.DoubleClick
@extends Siesta.Test.Action
@mixin Siesta.Test.Action.Role.HasTarget

This action will perform a {@link Siesta.Test.Browser#doubleClick double click} on the provided {@link #target}. 

This action can be included in the `t.chain` call with "doubleclick" or "doubleClick" shortcuts:

    t.chain(
        {
            action      : 'doubleclick',
            target      : someDOMElement,
            options     : { shiftKey : true } // Optionally hold shiftkey
        },
        // or
        {
            doubleclick : someDOMElement,
            options     : { shiftKey : true } // Optionally hold shiftkey
        }
        
    )


*/
Class('Siesta.Test.Action.DoubleClick', {
    
    isa         : Siesta.Test.Action,
    
    does        : Siesta.Test.Action.Role.HasTarget,
        
    has : {
        requiredTestMethod  : 'doubleClick'
    },

    
    methods : {
        
        process : function () {
            this.test.doubleClick(this.getTarget(), this.next, null, this.options, this.offset)
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('doubleclick', Siesta.Test.Action.DoubleClick)
Siesta.Test.ActionRegistry().registerAction('dblclick', Siesta.Test.Action.DoubleClick)
