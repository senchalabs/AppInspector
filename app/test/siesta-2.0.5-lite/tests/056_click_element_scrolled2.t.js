StartTest(function (t) {
    /*
        This test reproduces a "click offset" bug, which appears in very specific environment
        It was caused by the jQuery bug - the "el.offset()" and "el.scrollTop()" methods were
        using different algorithms for calculating the scroll top of the page
        
        offset method was doing:
            scrollTop = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop,
            
        scrollTop method was doing:
            return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
            jQuery.support.boxModel && win.document.documentElement[method] ||
                win.document.body[method] :
            elem[method];
            
        Note the difference, how `offset` method continues the calculations if `pageYOffset` is 0 and `scrollTop` method
        stops if `pageYOffset` is in `window` properties.
     */
    
    var body         = document.body
    
    body.style.padding = '15px'
    
    var div         = document.createElement('div')
    div.innerHTML   = 'Some content'
    
    body.appendChild(div.cloneNode())
    body.appendChild(div.cloneNode())
    body.appendChild(div.cloneNode())
    body.appendChild(div.cloneNode())
    
    var viewport        = new Ext.container.Viewport({
        layout      : 'fit',
        items       : [
            new Ext.tree.Panel({
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
        ]
    })    
    
    
    t.chain(
        { waitFor : 100 },
        function () {
            var tree        = Ext.ComponentQuery.query('treepanel')[ 0 ]
            var nodes       = tree.getView().getNodes()
            
            var middleIndex = Math.round(nodes.length / 2)
            
            var middleNode  = nodes[ middleIndex ]
            
            t.firesOk(nodes[ middleIndex - 1 ], 'click', 0, "Previous node has not been clicked")
            t.firesOk(middleNode, 'click', 1, "Middle node has been clicked")
            t.firesOk(nodes[ middleIndex + 1 ], 'click', 0, "Next node has not been clicked")
                
            t.chain(
                {
                    click       : function () {
                        // debugger
                        return middleNode
                    }
                }
            )
        }
    )
});

