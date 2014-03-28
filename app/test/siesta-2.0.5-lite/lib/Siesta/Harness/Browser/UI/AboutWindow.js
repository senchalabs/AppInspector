/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.AboutWindow', {
    extend      : 'Ext.Window',
    id          : 'aboutwindow',
    title       : 'ABOUT SIESTA (v.' + (Siesta.meta.VERSION || '1.0.0') + ')',
    bodyPadding : 20,
    modal       : true,
    width       : 500,
    height      : 380,
    closeAction : 'destroy',
    bodyStyle   : 'background: #fff',
    autoScroll  : true,

    html : '<img height="35" src="http://www.bryntum.com/bryntum-logo.png"/>\
         <p>Siesta is a JavaScript unit and functional test tool made by <a target="_blank" href="http://www.bryntum.com">Bryntum</a>. You can test any web page or JavaScript code, including Ext JS, jQuery or NodeJS. \
         \Siesta comes in two versions: <strong>Lite</strong> and <strong>Standard</strong>. With Lite, you can launch your tests in the browser UI. \
         \With the Standard version, you can also automate your tests and use the automation scripts together with tools like PhantomJS or Selenium WebDriver. </p>\
         Siesta would not be possible without these awesome products & libraries: <br>\
                 \<ul style="padding:0 0 0 30px">\
                 \  <li><a href="http://sencha.com/extjs">Ext JS</a></li> \
                 \  <li><a href="http://jquery.com">jQuery</a></li> \
                 \  <li><a href="http://http://alexgorbatchev.com/SyntaxHighlighter/">SyntaxHighlighter</a></li> \
                 \  <li><a href="http://joose.it/">Joose</a></li> \
                 \  <li><a href="https://github.com/gotwarlost/istanbul">Istanbul</a></li> \
                </ul>',

    buttons : {
        padding : '10 13',
        style   : 'background: transparent',

        items : [
            {
                hidden  : !Siesta.Harness.Browser.Automation,
                text    : 'Upgrade to Siesta Standard',
                handler : function () {
                    window.open('http://bryntum.com/store/siesta');
                }
            },
            {
                text    : 'Close',
                handler : function () {
                    this.up('window').close();
                }
            }
        ]
    }
});