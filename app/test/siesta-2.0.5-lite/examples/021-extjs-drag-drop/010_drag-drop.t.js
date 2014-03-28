StartTest(function(t) {
    
    t.diag("Setup");

    var foundCats = Ext.select('img.cat');

    t.is(foundCats.getCount(), 2, 'Two cats found in DOM');
    
    t.diag("Testing Drag...");

    new Ext.dd.DragZone(Ext.get('cat-zone'), {
        getDragData : function(e) {
            var t = e.getTarget('.cat');
            if (t) {
                return { ddel: t };
            }
        }
    });

    var dropTarget = new Ext.dd.DropTarget('catcontainer', {
        notifyDrop : function(source, e, data) {
            Ext.fly(this.getEl()).highlight();
            this.getEl().appendChild(data.ddel);
        }
    });
   
    t.chain(
        {
            action      : 'drag',
            source      : Ext.get('cat1'),              // Source el
            to          : Ext.get('catcontainer')       // Drag source el to this target el
        },
        function (next) {
            t.is(Ext.get('cat-zone').select('.cat').getCount(), 1, '1 cat disappeared somehow');
            
            next()
        },
        {
            action      : 'drag',
            source      : Ext.get('cat2'),              // Source el
            to          : Ext.get('catcontainer')       // Drag source el to this target el
        },
        function () {
            t.is(Ext.get('cat-zone').select('.cat').getCount(), 0, 'Both cats disappeared somehow');

            Ext.get('catcontainer').update('Cats gone!');
        }
    )
});