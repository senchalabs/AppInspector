StartTest(function(t) {
    
    // need to use own subscribe function, can't use Ext because of bug
    // can't use jquery because it uses different subscription method (see "simulateEventsWith")
    var subscribeToEvent = function (el, event, handler) {
        if (Ext.isIE9 || Ext.getVersion('extjs').isLessThan('4.2.2.1144')) {
            if (el.attachEvent)
                el.attachEvent('on' + event, handler)
            else
                if (el.addEventListener) 
                    el.addEventListener(event, handler, false)
        } else
            el.addEventListener(event, handler, false)
    } 
    
    
    var setupField = function (id) {
        var el              = document.getElementById(id)
        
        el.onkeydown        = function (e) { log.push("keydown/" + id) }
        el.onkeypress       = function (e) { log.push("keypress/" + id) }
        el.onkeyup          = function (e) { log.push("keyup/" + id) }
        el.onblur           = function (e) { log.push("blur/" + id) }
        el.onfocus          = function (e) { log.push("focus/" + id) }
        
        return el
    }
    
    var log = [], field1, field2, field3
    
    var doSetup     = function (next) {
        document.body.innerHTML = 
            '<input style="width:100px;" id="field1"></input>' +
            '<input style="width:100px;" id="field2"></input>' +
            '<input style="width:100px;" id="field3"></input>'
            
        field1    = setupField('field1')
        field2    = setupField('field2')
        field3    = setupField('field3')
        
        t.waitFor(50, function () {
            field1.focus()
            
            t.waitFor(50, function () {
                log = []
                
                next()
            })
        })
    }
    
    
    t.testExtJS(function (t) {
        t.it('Tabbing should cause `keydown/keyup` to be fired on different elements', function (t) {
            t.chain(
                function (next) {
                    doSetup(next)
                },
                { type: '[TAB]', target : '#field1' },
                function (next) {
                    t.isDeeply(log, Ext.isIE ? [
                        'keydown/field1',
                        'keypress/field1',
                        'keyup/field2',
                        // blur and focus are triggered after the keyp up
                        'blur/field1',
                        'focus/field2'
                    ] : [
                        'keydown/field1',
                        'keypress/field1',
                        'blur/field1',
                        'focus/field2',
                        'keyup/field2'
                    ])
                    
                    next()
                }
            )
        })
        
        t.it('Preventing `keydown` event should also prevent the focus change', function (t) {
            t.chain(
                function (next) {
                    doSetup(function () {
                        subscribeToEvent(field1, 'keydown', function (e) {
                            if (e.preventDefault) 
                                e.preventDefault()
                            else
                                e.returnValue = false
                        })
                        
                        next()
                    })
                },
                { type: '[TAB]', target : '#field1' },
                function (next) {
                    t.is(document.activeElement, field1, "Focus has not change")
                    
                    t.isDeeply(log, [
                        'keydown/field1',
                        'keypress/field1',
                        'keyup/field1'
                    ])
                    
                    next()
                }
            )
        })
    });
});

