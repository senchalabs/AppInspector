StartTest({
    alsoPreload : [ '050_mouse_click2.t.css' ]
}, function(t) {
    
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
    
    
    var setupBox = function (id) {
        var el              = document.getElementById(id)
        
        el.onmousedown      = function (e) { log.push("mousedown/" + id) }
        el.onmouseup        = function (e) { log.push("mouseup/" + id) }
        el.onclick          = function (e) { log.push("click/" + id) }
        el.oncontextmenu    = function (e) { log.push("contextmenu/" + id) }
        el.ondblclick       = function (e) { log.push("dblclick/" + id) }
        el.onblur           = function (e) { log.push("blur/" + id) }
        el.onfocus          = function (e) { log.push("focus/" + id) }
        
        return el
    }
    
    var log, box1, box2, box3
    
    var doSetup     = function () {
        document.body.innerHTML = 
            '<div class="box" id="box1" style="left: 0px;top:0px"></div>' + 
            '<div class="box" id="box2" style="border-color:blue; left: 300px;top:0px"></div>' +
            '<div class="box" id="box3" style="border-color:red; left: 600px;top:0px"></div>'
            
        box1    = setupBox('box1')
        box2    = setupBox('box2')
        box3    = setupBox('box3')
        
        log     = []
    }
    
    
    t.testExtJS(function (t) {
        t.it('Changing the target should cancel the `click` event', function (t) {
            doSetup()
            
            subscribeToEvent(box1, 'mousedown', function (e) {
                box2.style.left = '50px';
            })
            
            t.chain(
                { click : '#box1' },
                function (next) {
                    t.isDeeply(log, [
                        'mousedown/box1',
                        'mouseup/box2'
                    ])
                    
                    next()
                }
            )
        })
        
        t.it('Changing the target should cancel the `click` event but not the 2nd one in the dblclick', function (t) {
            doSetup()
            
            subscribeToEvent(box1, 'mousedown', function (e) {
                box2.style.left = '50px';
            })
            
            t.chain(
                { dblclick : '#box1' },
                function (next) {
                    t.isDeeply(log, [
                        'mousedown/box1',
                        'mouseup/box2',
                        'mousedown/box2',
                        'mouseup/box2',
                        'click/box2',
                        'dblclick/box2'
                    ])
                    
                    next()
                }
            )
        })
        
        t.it('Changing the target in the 2nd phase of dblclick should still cancel the `click` and `dblclick`', function (t) {
            doSetup()
            
            subscribeToEvent(box1, 'mousedown', function (e) {
                box2.style.left = '50px';
            })
            
            subscribeToEvent(box2, 'mousedown', function (e) {
                box3.style.left = '100px';
            })
            
            t.chain(
                { dblclick : '#box1', offset : [ '90%', '50%' ] },
                function (next) {
                    t.isDeeply(log, [
                        'mousedown/box1',
                        'mouseup/box2',
                        'mousedown/box2',
                        'mouseup/box3'
                    ])
                    
                    next()
                }
            )
        })
    });
});

