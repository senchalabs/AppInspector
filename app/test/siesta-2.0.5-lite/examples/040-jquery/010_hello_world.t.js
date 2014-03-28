StartTest(function(t) {
    t.diag('Testing jQuery...');

    $('body').html('JQuery was here');

    t.like(document.body.innerHTML, 'JQuery was here', 'Found correct text in DOM');
});