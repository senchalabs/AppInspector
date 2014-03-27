describe('If the target element center position is scrolled out of view, the test should first scroll it into view', function (t) {
    
    t.testExtJS(function (t) {
        t.it('should scroll element into view 1', function (t) {
            document.body.innerHTML =
                '<div style="margin:20px; border:1px solid #ddd;width:200px;height:200px;overflow:auto">' +
                    '<div style="background:#aaa;margin-top:240px;width:40px;height:40px" id="inner">FOO</div>' +
                '</div>';

            t.willFireNTimes(document.getElementById("inner"), 'click', 1);

            t.chain(
                { action : 'click', target : '#inner' }
            );
        });

        t.it('should scroll element into view 2', function (t) {
            document.body.innerHTML +=
                '<div style="margin:20px; border:1px solid #ddd;width:200px;height:150px;overflow:auto">' +
                    '<div style="background:#aaa;margin-top:160px;width:40px;height:100px"><div id="inner2" style="height:40px;width:40px;background:#666">FOO</div></div>' +
                '</div>';

            t.willFireNTimes(document.getElementById("inner2"), 'click', 1);

            t.chain(
                { action : 'click', target : '#inner2' }
            );
        });

        t.it('should scroll element into view 2', function (t) {
            var tree = new Ext.tree.Panel({
                renderTo : document.body,
                height   : 111,
                width    : 100,
                store : new Ext.data.TreeStore({
                    root : {
                        expanded : true,
                        children : [
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true },
                            { leaf  : true }
                        ]
                    }
                })
            })
            
            var view        = tree.getView()
            var steps       = []
            
            Ext.Array.each(view.getNodes(), function (node, i) {
                t.firesOk(node, 'click', 1, "Node " + i + " clicked")
                
                steps.push(
                    {
                        click       : node
                    },
                    function (next) {
                        t.scrollVerticallyTo(view.el, 0, next)
                    }
                )
            })

            t.chain(steps)
        });

        t.it('should scroll element into view 3', function (t) {
            var container = new Ext.Panel({
                renderTo    : Ext.getBody(),
                height      : 200,
                width       : 300,
                autoScroll  : true,
                layout      : 'vbox',
                items       : [{
                    xtype   : 'component',
                    height  : 900
                }, {
                    xtype   : 'textfield'
                }]
            });

            t.willFireNTimes(container.down('textfield'), 'focus', 1);

            t.chain(
                { click : container.down('textfield').el }
            );
        })
    });


});

