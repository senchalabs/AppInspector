/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**

@class Siesta.Test.Action.Done
@extends Siesta.Test.Action

This action can be included in the `t.chain` call with "done" shortcut:

    t.chain(
        {
            action      : 'done'
        }
    )

This action will just call the {@link Siesta.Test#done done} method of the test.

*/
Class('Siesta.Test.Action.Done', {
    
    isa         : Siesta.Test.Action,
    
    has : {
        /**
         * @cfg {Number} delay
         * 
         * An optional `delay` argument for {@link Siesta.Test#done done} call.
         */
        delay  :        null
    },

    
    methods : {
        
        process : function () {
            this.test.done(this.delay)
            
            this.next()
        }
    }
});


Siesta.Test.ActionRegistry().registerAction('done', Siesta.Test.Action.Done)