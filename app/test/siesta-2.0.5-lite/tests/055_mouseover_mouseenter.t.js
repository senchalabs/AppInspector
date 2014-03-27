describe('After mouse interactions, the target el must be reevaluated', function(t) {
    if (typeof console === 'undefined') console = { log : Ext.emptyFn };

    document.body.innerHTML =
        '<div style="border:1px solid black;width:50px;height:50px" id="outer">' +
            '<div style="background:#aaa;position:absolute;top:0;left:0;width:40px;height:40px" id="lvl1">' +
            '</div>' +
    '</div>';

    var inner = Ext.get('lvl1');
    var outer = Ext.get('outer');

    outer.on('click', function(){ inner.hide(); });
    inner.on('mouseover', function(){ console.log('inner mouseover');  });
    inner.on('mouseout', function(){  console.log('inner mouseout'); });
    inner.on('mouseenter', function(){ console.log('inner mouseenter'); });
    inner.on('mouseleave', function(){ console.log('inner mouseleave'); });
    outer.on('mouseover', function(){ console.log('outer mouseover'); });
    outer.on('mouseenter', function(){ console.log('outer mouseenter'); });
    outer.on('mouseleave', function(){ console.log('outer mouseleave'); });

    t.willFireNTimes(inner, 'mouseover', 1, 'inner mouseover');
    t.willFireNTimes(inner, 'mouseout', 1, 'inner mouseout');
    t.willFireNTimes(inner, 'mouseenter', 1, 'inner mouseenter');
    t.willFireNTimes(inner, 'mouseleave', 1, 'inner mouseleave');
    t.willFireNTimes(outer, 'mouseenter', 1, 'outer mouseenter');

    t.chain(
        { action      : 'click', target : '#outer' },

        { waitFor : 500 },

        // Should trigger inner element 'mouseout' event + 'mouseleave' event (fired manually by Ext if browser doesn't support it)
        { action      : 'moveCursor', by : [2, 0] }
    );
});

