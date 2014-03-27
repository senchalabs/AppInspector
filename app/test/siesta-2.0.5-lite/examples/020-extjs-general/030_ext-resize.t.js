StartTest(function(t) {
    
    t.diag("Testing resizing on one of the online Sencha examples.");
    
    t.waitForComponent(Ext.draw.Component, true, function(components) {
        var drawComponent = components[0],
            origSize = drawComponent.getSize(),
            seHandle = drawComponent.getEl().down('.x-resizable-handle-southeast');
    
        t.dragBy(seHandle, [-100, -100], function() {
            var newSize = drawComponent.getSize();
            t.is(newSize.width, origSize.width - 100, 'Width decreased by 100px');
            t.is(newSize.height, origSize.height - 100, 'Height decreased by 100px');
        });
    });
});