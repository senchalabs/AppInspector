StartTest(function(outerT) {
    
    outerT.testExtJS(function (t) {
        
        var viewport        = new Ext.Viewport({
            id              : 'viewport',
            
            items           : [
                {
                    id              : 'panel1',
                    title           : 'foo1',
                    height          : 50,
                    html            : '<div class="quix" id="test_div1"></div>'
                },
                {
                    id              : 'panel2',
                    title           : 'foo2',
                    html            : '<div class="quix" id="test_div2"></div>',
                    
                    height          : 50,
                    
                    items           : [
                        {
                            xtype           : 'button',
                            text            : 'test',
                            id              : 'test-button'
                        }
                    ]
                },
                {
                    xtype           : 'textfield',
                    cls             : 'test-field',
                    id              : 'test-field'
                }
            ]
        })

        t.is(t.normalizeElement('>>#panel1'), Ext.getCmp('panel1').body.dom, "Normalize element accept component query");
        t.is(t.normalizeElement('body'), document.body, 'body element is found with CSS selector');
        
        t.throwsOk(function () {
            t.compositeQuery('panel[title=foo]')
        }, '', 'Invalid composite query selector: panel[title=foo]')
        
        t.throwsOk(function () {
            t.compositeQuery('panel[title=barbaz] => div.quix', null, false)
        }, '', 'Component query selector should return at least one component')

        t.isDeeply(
            t.compositeQuery('viewport => div.quix'),
            [ Ext.get('test_div1').dom, Ext.get('test_div2').dom ], 
            'Found the div with class `quix` inside of whole viewport'
        )

        t.isDeeply(
            t.compositeQuery('panel[title=foo1] => div.quix'),
            [ Ext.get('test_div1').dom ], 
            'Found the div with class `quix` only inside of panel1'
        )
        
        t.isDeeply(
            t.compositeQuery('panel[title=foo1] => div.quix', Ext.getCmp('viewport')),
            [ Ext.get('test_div1').dom ], 
            'Same result with specified root'
        ) 
        
        t.isDeeply(
            t.compositeQuery('panel[title=foo1] => div.quix', Ext.getCmp('panel2'), true),
            [], 
            'Not found any results with `panel2` as root'
        )

        t.willFireNTimes(Ext.getCmp('test-button'), 'click', 1, 'A single click on this button should be detected')
        
        // not using `t.chain` on purpose - to verify that usual methods can accept the composite query
        t.type('viewport => .test-field input', 'Some text', function () {
            
            t.is(Ext.getCmp('test-field').getValue(), 'Some text', 'The result of the composite query, passed as argument to the `t.type` is correct')
            
            t.click('panel[title="foo2"] => .x-btn')
        })
    });    
});