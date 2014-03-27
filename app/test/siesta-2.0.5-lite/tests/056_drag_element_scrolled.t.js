describe('If the target element center position is scrolled out of view, the test should first scroll it into view', function (t) {
    
    t.testExtJS(function (t) {
        t.it('should scroll element into view 1', function (t) {
            document.body.innerHTML = '<div id="container1"></div>'
            
            var resetDOM = function () {
                document.getElementById('container1').innerHTML =
                    '<div style="margin:20px; border:1px solid #ddd;width:200px;height:200px;overflow:auto">' +
                        '<div style="background:#aaa;margin-top:240px;width:40px;height:40px" id="inner">FOO</div>' +
                    '</div>';
            }

            resetDOM()
            
            t.chain(
                { drag : '#inner', by : [ 10, 10 ] },
                function (next) {
                    t.elementIsTopElement('#inner', "Element has been scrolled into view")
                    
                    resetDOM()
                    
                    next()
                },
                { drag : '#inner', to : [ 10, 10 ] },
                function (next) {
                    t.elementIsTopElement('#inner', "Element has been scrolled into view")
                    
                    next()
                }
            );
        });

        t.it('should scroll element into view 2', function (t) {
            document.body.innerHTML += '<div id="container2"></div>'
            
            var resetDOM = function () {
                document.getElementById('container2').innerHTML =
                    '<div style="margin:20px; border:1px solid #ddd;width:200px;height:150px;overflow:auto">' +
                        '<div style="background:#aaa;margin-top:160px;width:40px;height:100px"><div id="inner2" style="height:40px;width:40px;background:#666">FOO</div></div>' +
                    '</div>';
            }
            
            resetDOM()

            t.chain(
                { drag : '#inner2', by : [ 10, 10 ] },
                function (next) {
                    t.elementIsTopElement('#inner2', "Element has been scrolled into view")
                    
                    resetDOM()
                    
                    next()
                },
                { drag : '#inner2', to : [ 10, 10 ] },
                function (next) {
                    t.elementIsTopElement('#inner2', "Element has been scrolled into view")
                    
                    next()
                }
            );
        });

        t.it('should scroll element into view 2', function (t) {
            var tree = new Ext.tree.Panel({
                renderTo : document.body,
                height   : 200,
                width    : 100,
                store : new Ext.data.TreeStore({
                    root : {
                        expanded : true,
                        children : [
                            { cls : 't1' },
                            { cls : 't2' },
                            { cls : 't3' },
                            { cls : 't4' },
                            { cls : 't5' },
                            { cls : 't6' },
                            { cls : 't7' },
                            { cls : 't8' },
                            { cls : 't9' },
                            { cls : 't10' },
                            { cls : 't11' },
                            { cls : 't12' },
                            { cls : 't13' },
                            { cls : 't14' },
                            { cls : 't15' },
                            { cls : 't16' },
                            { cls : 't17' },
                            { cls : 't18' },
                            { cls : 't19' }
                        ]
                    }
                })
            })

            t.chain(
                { drag : Ext.getBody().down('.t9'), by : [ 10, 10 ] },
                function (next) {
                    t.elementIsTopElement('.t9', "Element has been scrolled into view")
                    
                    next()
                },
                { drag : Ext.getBody().down('.t19'), to : [ 10, 10 ] },
                function (next) {
                    t.elementIsTopElement('.t19', "Element has been scrolled into view")
                    
                    next()
                }
            );
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

            t.chain(
                { drag : container.down('textfield').el, by : [ 10, 10 ] },
                function (next) {
                    t.elementIsTopElement(container.down('textfield').el, "Element has been scrolled into view")
                    
                    next()
                }
            );
        })
    });


});

