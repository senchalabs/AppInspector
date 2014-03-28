describe('isElementVisible', function (t) {
    
    t.it('Should correctly detect an SVG element as the top element', function(t) {
        if (Ext.supports.Svg) {
            document.body.innerHTML = '<svg><circle id="circle" cx="50" cy="50" r="40" stroke="red" fill="blue" stroke-width="4"></circle></svg>';
            var circle = document.getElementById('circle');

            t.ok(t.isElementVisible(circle), 'Should handle SVG')

            circle.style.display = 'none';
            t.notOk(t.isElementVisible(document.getElementById('circle')), 'Should handle hidden SVG')
        }
    })
});

