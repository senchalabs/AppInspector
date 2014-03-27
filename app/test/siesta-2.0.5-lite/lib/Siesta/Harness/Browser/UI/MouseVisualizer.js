/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.MouseVisualizer', {

    cursorEl                    : null,

    onEventSimulatedListener    : null,
    onTestFinishedListener      : null,
    
    harness                     : null,
    
    currentTest                 : null,
    currentContainer            : null,
    
    supportsTransitions         : null,

    clickEvents                 : {
        click       : 0,
        dblclick    : 0,
        touchstart  : 0,
        touchend    : 0,
        mousedown   : 0,
        contextmenu : 0
    },

    constructor : function (config) {
        config      = config || {}
        
        Ext.apply(this, config)
        this.supportsTransitions = (Ext.supports && Ext.supports.Transitions) || (Ext.feature && Ext.feature.has.CssTransitions);

        delete this.harness
        
        this.setHarness(config.harness)
    },
    
    
    getCursorEl : function () {
        if (this.cursorEl) return this.cursorEl
        
        var currentContainer    = this.currentContainer
        
        if (!currentContainer) throw "Need container for cursor"
        
        return this.cursorEl = Ext.fly(currentContainer).down('.ghost-cursor') || Ext.fly(currentContainer).createChild({
            tag     : 'div',
            cls     : 'ghost-cursor'
        })
    },
    
    
    setHarness : function (harness) {
        if (this.harness) {
            this.harness.un('testframeshow', this.onTestFrameShow, this);
            this.harness.un('testframehide', this.onTestFrameHide, this);
        }
        
        this.harness    = harness
    
        if (harness) {
            harness.on('testframeshow', this.onTestFrameShow, this);
            harness.on('testframehide', this.onTestFrameHide, this);
        }
    },

    
    reset : function () {
        if (this.onEventSimulatedListener)  {
            this.onEventSimulatedListener.remove()
            this.onEventSimulatedListener = null
        }
        
        if (this.onTestFinishedListener)    {
            this.onTestFinishedListener.remove()
            this.onTestFinishedListener = null
        }
        
        this.cursorEl           = null
        this.currentTest        = null
        this.currentContainer   = null
    },
    
    
    onTestFrameShow : function (event) {
        var test                            = event.source
        
        // do not react on re-positions of the same running test 
        if (test == this.currentTest) return
        
        this.reset()
        
        this.currentTest    = test
        
        if (this.harness.canShowCursorForTest(test)) {
            this.currentContainer           = test.scopeProvider.wrapper
            
            this.onEventSimulatedListener   = test.on('eventsimulated', this.onEventSimulated, this);
            this.onTestFinishedListener     = test.on('testfinalize', this.onTestFinished, this);
        }
    },

    
    onTestFrameHide : function (event) {
        // ideally, instead of this cleanup, we need to keep listening for the 
        // `testfinalize` event on all tests visualizer has been "attached" to
        // and cleanup only in that event
        this.cleanupCursor()
        this.reset()
    },
    
    
    // this method can be called already after the test has been finalized and cursor element fade out
    // during that time, current test may change, so it needs to work in 2 modes
    // 1) "sync" mode, when its "attached" to the "this.currentTest"  
    // 2) "async" mode, when it cleans up the cursor of the "old" test
    cleanupCursor : function (cursorEl, currentContainer) {
        cursorEl            = cursorEl || this.cursorEl
        currentContainer    = currentContainer || this.currentContainer
        
        if (currentContainer) {
            try {
                Ext.fly(cursorEl).remove()
            } catch (e) {
                // catch potential exceptions for example
                // if iframe of test has been already removed
            }
            
            try {
                Ext.select('.ghost-cursor-click-indicator', false, currentContainer).remove()
            } catch (e) {
                // catch potential exceptions for example
                // if iframe of test has been already removed
            }
        }
    },
    

    onTestFinished : function (event, test) {
        var cursorEl            = this.cursorEl
        var currentContainer    = this.currentContainer
        
        this.reset()
        
        // if test was using cursor at all
        if (cursorEl) {
            var me              = this;
            
            setTimeout(function () {
                // ExtJS branch
                if (cursorEl.fadeOut) {
                    cursorEl.fadeOut({ duration : 2000, callback : function () {
                        me.cleanupCursor(cursorEl, currentContainer)
                    } });
                } else {
                    // ST branch
                    me.cleanupCursor(cursorEl, currentContainer)
                }
            }, 2000);
        }
    },

    
    onEventSimulated : function (event, test, el, type, evt) {
        if (type.match(/touch|mouse|click|contextmenu/) && Ext.isNumber(evt.clientX) && Ext.isNumber(evt.clientY)) {
            // this should never happen, but still happens sometimes
            if (!this.currentContainer) return
            
            var x               = test.currentPosition[0],
                y               = test.currentPosition[1];
                
            this.updateGhostCursor(type, x, y);

            if (this.supportsTransitions && type in this.clickEvents) {
                this.showClickIndicator(type, x, y);
            }
        }
    },

    // This method shows a fading circle at the position of click/dblclick/mousedown/contextmenu
    showClickIndicator : function(type, x, y) {
        var clickCircle = Ext.fly(this.currentContainer).createChild({
            cls     : 'ghost-cursor-click-indicator ' ,
            style   : 'left:' + x + 'px;top:' + y + 'px'
        });

        // need to a delay to make it work in FF
        setTimeout(function() {
            clickCircle.addCls('ghost-cursor-click-indicator-big');
        }, 5);
    },

    
    // This method updates the ghost cursor position and appearance
    updateGhostCursor: function (type, x, y) {
        var cursorEl        = this.getCursorEl(),
            translate3d     = 'translate3d(' + (x - 5) + 'px, ' + y + 'px, 0px)';
        
        cursorEl.setStyle({
            '-webkit-transform' : translate3d,
            '-moz-transform'    : translate3d,
            '-o-transform'      : translate3d,
            'transform'         : translate3d
        })
        
        switch(type) {
            case 'touchstart':
            case 'mousedown':
                cursorEl.addCls('ghost-cursor-press');
            break;

            case 'dblclick':
                cursorEl.addCls('ghost-cursor-press');
                Ext.Function.defer(cursorEl.removeCls, 40, cursorEl, ['ghost-cursor-press']);
            break;

            case 'touchend':
            case 'mouseup':
            case 'click':
                cursorEl.removeCls('ghost-cursor-press');
            break;
        
            case 'contextmenu' :
            break;
        }
    }
});
