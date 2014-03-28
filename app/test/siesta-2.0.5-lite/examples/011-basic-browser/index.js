var Harness = Siesta.Harness.Browser;

Harness.configure({
    title     : 'Awesome Test Suite',
    
    // no files to preload
    preload : [
    ]
});

Harness.start(
    '010_text_selection.t.js'
);

