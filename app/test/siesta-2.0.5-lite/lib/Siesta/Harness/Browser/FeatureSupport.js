/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Singleton('Siesta.Harness.Browser.FeatureSupport', {
    
    has     : {
        supports    : Joose.I.Object,
        
        tests       : {
            init        : [
                {
                    id : "mouseEnterLeave",
                    fn : function() {
                        var el = document.createElement("div");
                        return 'onmouseenter' in el && 'onmouseleave' in el;
                    }
                },
        
                {
                    id : "enterOnAnchorTriggersClick",
                    fn : function() {
                        var sim     = this.simulator,
                            E       = Siesta.Test.Simulate.KeyCodes().keys.ENTER,
                            result  = false;
                            
                        var anchor = $('<a href="foo" style="display:none">test me</a>');
                        $('body').append(anchor);
        
                        anchor.focus();
                        anchor.click(function(e) {
                            result = true;
                            return false;
                        });
                
                        sim.simulateEvent(anchor, 'keypress', { keyCode : E, charCode : 0 }, true);
                 
                        anchor.remove();
                        return result;
                    }
                },
        
                {
                    id : "canSimulateKeyCharacters",
                    fn : function() {
                        var sim     = this.simulator;
                        
                        var input   = $('<input class="siesta-hidden" type="text" />'),
                            A       = Siesta.Test.Simulate.KeyCodes().keys.A;
                            
                        $('body').append(input);
                        
                        input.focus();
                        sim.simulateEvent(input, 'keypress', { keyCode : A, charCode : A }, true);
                        sim.simulateEvent(input, 'textInput', { text : "A" }, true);
                
                        var result  = input.val() === 'A';
                        
                        input.remove();
                        
                        return result;
                    }
                },
        
                {
                    id : "canSimulateBackspace",
                    fn : function() {
                        var sim     = this.simulator;
                        
                        var input   = $('<input class="siesta-hidden" type="text" />'),
                            BS      = Siesta.Test.Simulate.KeyCodes().keys.BACKSPACE,
                            A       = Siesta.Test.Simulate.KeyCodes().keys.A;
                            
                        $('body').append(input);
                        
                        input.focus();
                        sim.simulateEvent(input, 'keypress', { keyCode : A, charCode : A }, true);
                        sim.simulateEvent(input, 'keypress', { keyCode : A, charCode : A }, true);
                        sim.simulateEvent(input, 'keypress', { keyCode : BS, charCode : BS }, true);
                        
                        var result  = input.val() === 'A';
                 
                        input.remove();
                        
                        return result;
                    }
                },

                {
                    id : "enterSubmitsForm",
                    fn : function() {
                        var sim     = this.simulator,
                            E       = Siesta.Test.Simulate.KeyCodes().keys.ENTER,
                            result  = false;

                        var form = $('<form method="post"><input type="text"/></form>');
                        var input = $(form).find('input');
                        $('body').append(form);

                        form[0].onsubmit = function(e) {
                            result = true;
                            return false;
                        };

                        input.focus();
                        sim.simulateEvent(input, 'keypress', { keyCode : E, charCode : 0 }, true);

                        form.remove();
                        return result;
                    }
                }
            ]
        }
        
    },
    
    methods     : {
        
        initialize : function() {
            var emptyFn = function() {},
                foo = Class({
                    does    : [
                        Siesta.Test.Simulate.Event,
                        Siesta.Test.Simulate.Mouse,
                        Siesta.Test.Simulate.Keyboard
                    ],
                
                    has     : {
                        global      : null
                    },
                
                    methods : {
                        focusOnClick        : emptyFn,
                        getElementAtCursor  : emptyFn,
                        fireEvent           : emptyFn,
                        addResult           : emptyFn,
                        normalizeElement    : function(a) { return a[0]; },
                        findCenter          : function() { return [0,0]; },
                        valueIsArray        : function(arr) { return 'length' in arr; }
                    }
                });
            
            this.simulator = new foo({ global : window });
    
            for (var i = 0; i < this.tests.length; i++) {
                var test            = this.tests[i];
                var testId          = test.id;
                var detectorFn      = test.fn;
                
                // also save the results to "results" property - we'll use this in out own test suite
                // where we copy the feature testing results from the outer scope to inner
                this.supports[ testId ] = detectorFn.call(this);
            }
        }
    }
})
