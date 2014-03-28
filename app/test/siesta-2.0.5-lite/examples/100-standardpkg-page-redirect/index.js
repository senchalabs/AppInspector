var Harness = Siesta.Harness.Browser.ExtJS

Harness.configure({
    title               : 'Awesome Test Suite',
    autoCheckGlobals    : true
})

Harness.start(
    {
        // make sure we'll reach the correct exit point
        needDone            : true,
        separateContext     : true,
        hostPageUrl         : 'source_page.html',         
        url                 : '010_page_redirect.t.js'
    }
)

