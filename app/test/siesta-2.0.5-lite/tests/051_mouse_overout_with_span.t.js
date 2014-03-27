StartTest(function(t) {
    
    // no "mouseenter/leave" events except the IE, and frameworks tends to emulate them
    // so we use a "raw" DOM subscription
    var subscribeToEvent = function (el, event, handler) {
        
        if (el.addEventListener) 
            el.addEventListener(event, handler, false)
        else
            if (el.attachEvent)
                el.attachEvent('on' + event, handler)
            else
                throw "Can't subscribe to event"
    } 
    
    var isChrome            = /Chrome\/(\d+)\./.exec(navigator.userAgent)
    var hasMouseEnter       = $.browser.msie || $.browser.mozilla && parseInt($.browser.version) >= 10 || isChrome && Number(isChrome[ 1 ]) >= 30
    
    t.testJQuery(function (t) {
        var parent = Ext.getBody().createChild({
            id : 'parent',
            tag : 'div',
            style: 'width:200px;height:200px;background:#ccc;margin:20px;',
            html    : '<br><br><span id="child" style="background:#666;">Some wide content, yes, real wide</span>'
        });

        var child = Ext.get('child');
        var firedParent = {mouseover : 0, mouseout : 0, mouseenter : 0, mouseleave : 0},
            firedChild = {mouseover : 0, mouseout : 0, mouseenter : 0, mouseleave : 0};
        
        subscribeToEvent(parent.dom, 'mouseover', function () {  firedParent.mouseover++; })
        subscribeToEvent(parent.dom, 'mouseout', function () {  firedParent.mouseout++; })
        subscribeToEvent(parent.dom, 'mouseenter', function () {  firedParent.mouseenter++; })
        subscribeToEvent(parent.dom, 'mouseleave', function () {  firedParent.mouseleave++; })

        subscribeToEvent(child.dom, 'mouseover', function () {  firedChild.mouseover++; })
        subscribeToEvent(child.dom, 'mouseout', function () {  firedChild.mouseout++; })
        subscribeToEvent(child.dom, 'mouseenter', function () {  firedChild.mouseenter++; })
        subscribeToEvent(child.dom, 'mouseleave', function () {  firedChild.mouseleave++; })
        
        t.moveMouseTo([100, 0], function() {
            t.moveMouseTo([100, 250], function() {
                
                // no "mouseenter/leave" events except the IE
                t.isDeeply(firedChild, {mouseover : 1, mouseout : 1, mouseenter : hasMouseEnter ? 1 : 0, mouseleave : hasMouseEnter ? 1 : 0}, 'Correct events detected for child');
                t.isDeeply(firedParent, {mouseover : 3, mouseout : 3, mouseenter : hasMouseEnter ? 1 : 0, mouseleave : hasMouseEnter ? 1 : 0}, 'Correct events detected for parent');
            });
        });
    });
});
