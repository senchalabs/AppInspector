/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.Center', {
    extend              : 'Ext.Panel',
    alias               : 'widget.centerpanel',
    border              : false,
    style : 'background:transparent',
    bodyStyle : 'background:transparent',
    layout              : {
        type : 'hbox',
        align : 'stretch'
    },

    initComponent : function() {

        Ext.apply(this, {
            
            items : [
                {
                    style : 'background:transparent',
                    bodyStyle : 'background:transparent',
                    border : false,
                    flex : 1,
                    layout              : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    items : [
                        {
                            margins     : '20 5 10 20',
                            flex : 1,
                            title : 'Tips and tricks',
               
                            html : 'Tips....'
                        },
                        {
                            margins     : '10 5 20 20',
                            flex : 1,
                            cls : 'videos',
                            title : 'Siesta videos',
                            autoScroll : true,
                            html : '<dl><dt>' + 
                                            '<a href="http://www.bryntum.com/products/siesta/docs/#!/video/32559451" target="_blank"  class="video"></a>' + 
                                        '</dt>' + 
                                        '<dd>In this video we introduce Siesta - the stress-free JavaScript unit testing tool</dd>' +
                                    '</dl>' +
                                    '<dl><dt>' + 
                                            '<a href="http://www.bryntum.com/products/siesta/docs/#!/video/32559505" target="_blank"  class="video"></a>' + 
                                        '</dt>' + 
                                        '<dd>In this video we will show how to do a basic ExtJS UI test with Siesta</dd>' +
                                    '</dl>' +
                                    '<dl><dt>' + 
                                            '<a href="http://www.bryntum.com/products/siesta/docs/#!/video/32559560" target="_blank" class="video"></a>' + 
                                        '</dt>' + 
                                        '<dd>In this video we will show how to automate your test suite using PhantomJS or Selenium</dd>' +
                                    '</dl>' + 
                                    '<dl><dt>' + 
                                            '<a href="http://www.bryntum.com/products/siesta/docs/#!/guide/siesta_getting_started" target="_blank" class="book"></a>' + 
                                        '</dt>' + 
                                        '<dd>Getting started with Siesta</dd>' +
                                    '</dl>' +
                                    '<dl><dt>' + 
                                            '<a href="http://www.bryntum.com/products/siesta/docs/#!/guide/siesta_automation" target="_blank" class="book"></a>' + 
                                        '</dt>' + 
                                        '<dd>Siesta automation and continuous integration</dd>' +
                                    '</dl>' +
                                    '<dl><dt>' + 
                                            '<a href="http://www.bryntum.com/products/siesta/docs/#!/guide/testing_mvc_app" target="_blank" class="book"></a>' + 
                                        '</dt>' + 
                                        '<dd>Testing Ext JS MVC</dd>' +
                                    '</dl>' + 
                                    '<dl><dt>' + 
                                            '<a href="http://www.bryntum.com/products/siesta/docs/#!/guide/extending_test_class" target="_blank" class="book"></a>' + 
                                        '</dt>' + 
                                        '<dd>Extending Siesta</dd>' +
                                    '</dl>'
                        }
                    ]
                },
                {
                    style : 'background:transparent',
                    bodyStyle : 'background:transparent',
                    flex : 1,
                    border : false,
                    layout              : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    items : [
                        {
                            cls : 'splash-links',
                            margins     : '20 20 10 20',
                            flex : 1,
                            title : 'Useful links',
                            autoScroll : true,
                            html : '<ul>' +
                                        '<li>' + 
                                            '<a class="docs" href="http://www.bryntum.com/products/siesta/docs" target="_blank">API Documentation</a>' +
                                        '</li>' + 
                                        '<li>' + 
                                            '<a class="report-bug" href="http://www.assembla.com/spaces/bryntum/support/tickets" target="_blank">Report a bug</a>' +
                                        '</li>' + 
                                        '<li>' + 
                                            '<a class="forum" href="http://www.bryntum.com/forum/viewforum.php?f=20&sid=b18136bc962e28494e2e7614382b27d5" target="_blank">Community Forums</a>' +
                                        '</li>' + 
                                        '<li>' + 
                                            '<a class="buy" href="http://www.bryntum.com/store/siesta" target="_blank">Buy a license</a>' +
                                        '</li>' + 
                                    '</ul>'
                        },
                        {
                            flex : 1,
                            margins     : '10 5 20 20',
                            title : 'Change log for v.'+ (Siesta.meta.VERSION || "1.0.0"),
                            html : 'TODO'
                        }
                    ]
                }

            ]
        });
        this.callParent();
    }
})
