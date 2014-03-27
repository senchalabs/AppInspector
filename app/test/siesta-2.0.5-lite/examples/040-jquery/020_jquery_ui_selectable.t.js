StartTest(function(t) {
    t.diag('Testing jQuery UI Selectable');

    $("#selectable").selectable();

    t.isGreater($( ".ui-widget-content").length, 0, 'Some list items found');
    
    t.is($( ".ui-selected").length, 0, 'No list items are selected');

    
    t.click($('.ui-widget-content:first-child'), function() {
        t.is($( ".ui-selected").length, 1, 'First items was selected');
    });
});