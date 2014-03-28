StartTest(function (t) {
    t.expectGlobals('frame', '0');

    t.it('Should find the same local/global XY when no iframes are involved', function (t) {
        document.body.innerHTML = '<div style="background:#aaa;width:50px;height:50px;"><div style="background:#666;width:40px;height:40px;" class="inner"></div></div>';

        var div         = document.body.firstChild;
        var innerDiv    = document.body.firstChild.firstChild;
        
        t.isDeeply(t.getNormalizedTopElementInfo(div), {
            el       : innerDiv,
            localXY  : [25, 25],
            globalXY : [25, 25]
        }, 'Targeting outer div results in the inner div');
    })

    t.it('Should find the local + global XY when targeting an element in a same domain iframe', function (t) {
        document.body.innerHTML += '<div style="width:200px;height:200px;"><iframe frameborder=0 id="frame"/></div>';

        var frame   = document.getElementById("frame");
        
        var doc     = frame.contentWindow.document;
        doc.open()

        doc.write([
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '</head>',
            '<body style="background: lightblue;margin:0">',
                '<div id="inner" style="background:red;height:50px;width:50px;margin:20px">INNER</div>',
            '</body>',
            '</html>'
        ].join(''))

        doc.close();

        var innerDiv    = doc.getElementById('inner');

        t.isDeeply(t.getNormalizedTopElementInfo(innerDiv), {
            el       : innerDiv,
            localXY  : [45, 45],
            globalXY : [45, 95]
        }, 'Targeting an element in a nested frame should result in different local and global coordinates');
        
        t.isDeeply(t.getNormalizedTopElementInfo([ 45, 95 ]), {
            el       : innerDiv,
            localXY  : [45, 45],
            globalXY : [45, 95]
        }, 'Targeting coordinates should result in different local and global coordinates');
        
    })
})