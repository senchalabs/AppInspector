/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Util.Queue', {
    
    has     : {
        // array of Objects, each containing arbitrary data about queue step. Possibly keys:
        // `processor` - an individual processor function for this step
        // can also be provided for whole queue
        // will receive the: (stepData, index, queue)
        // `isAsync` - when provided, the `next` function will be also embedded,
        // which should be called manually
        // `interval` - the delay after step (except for asynchronous)
        steps                   : Joose.I.Array,

        interval                : 100,
        callbackDelay           : 0,
        // setTimeout
        deferer                 : { required : true },
        // clearTimeout - only required when "abort" is planned / possible
        deferClearer            : null,
        
        processor               : null,
        processorScope          : null,
        
        currentTimeout          : null,
        callback                : null,
        scope                   : null,
        isAborted               : false,
        
        observeTest             : null,

        currentDelayStepId      : null
    },
    
    
    methods : {
        
        // step is an object with
        // { 
        //      processor : func, 
        //      processorScope : obj,
        //      next : func (in case of async step, will be populated by queue)
        // }
        
        addStep : function (stepData) {
            this.addSyncStep(stepData)
        },
        
        
        addSyncStep : function (stepData) {
            this.steps.push(stepData)
        },
        
        
        addAsyncStep : function (stepData) {
            stepData.isAsync = true
            
            this.steps.push(stepData)
        },

        addDelayStep : function (delayMs) {
            var origSetTimeout = this.deferer;
            var me = this;

            this.addAsyncStep({
                processor : function(data) {
                    me.currentDelayStepId = origSetTimeout(data.next, delayMs || 500);
                }
            });
        },
        
        
        run : function (callback, scope) {
            this.callback   = callback
            this.scope      = scope
            
            // abort the queue, if the provided test instance has finalized (probably because of exception)
            this.observeTest && this.observeTest.on('testfinalize', function () { this.abort(true) }, this, { single : true })
            
            this.doSteps(this.steps.slice(), callback, scope)
        },
        
        
        abort : function (ignoreCallback) {
            this.isAborted      = true
            
            var deferClearer    = this.deferClearer
            
            if (!deferClearer) throw "Need `deferClearer` to be able to `abort` the queue"

            deferClearer(this.currentDelayStepId);
            deferClearer(this.currentTimeout)
            
            if (!ignoreCallback) this.callback.call(this.scope || this)
        },
        
        
        doSteps : function (steps, callback, scope) {
            this.currentTimeout = null
            
            var me          = this
            var deferer     = this.deferer
            var step        = steps.shift()
            
            if (this.isAborted) return
            
            if (step) {
                var processor       = step.processor || this.processor
                var processorScope  = step.processorScope || this.processorScope
                
                var index           = this.steps.length - steps.length - 1
                
                if (!processor) throw new Error("No process function found for step: " + index)
                
                if (step.isAsync) {
                    var next = step.next = function () {
                        me.doSteps(steps, callback, scope)
                    }
                    
                    // processor should call `next` to continue
                    processor.call(processorScope || me, step, index, this, next)
                } else {
                    
                    processor.call(processorScope || me, step, index, this)
                    
                    if (this.isAborted) return
                    
                    var interval = step.interval || me.interval
                    
                    if (interval) 
                        this.currentTimeout = deferer(function () {
                            me.doSteps(steps, callback, scope)    
                        }, interval)
                    else
                        me.doSteps(steps, callback, scope)
                }
                
                
            } else {
                if (callback)
                    if (this.callbackDelay)
                        deferer(function () {
                            if (!me.isAborted) callback.call(scope || this)
                        }, this.callbackDelay)
                    else
                        callback.call(scope || this)
            }
        }
    }
})
