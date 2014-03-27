StartTest(function(t) {
    
    t.testJQuery(function (t) {
        t.diag('Visibility tests');

        t.$('body').html('<div style="display:none;height:20px;width:20px"></div>');

        t.elementIsNotVisible(t.$('div'), 'Not visible');
        
        t.$('body').html('<div style="height:20px;width:20px"></div>');
        t.elementIsVisible(t.$('div'), 'Not visible');
        
        t.$('body').html('<div class="cls" style="height:20px;width:20px">foo</div>');
        t.elementIsVisible(t.$('div'), 'Not visible');

        t.diag('Content matching tests');
        
        t.contentLike(t.$('div'), 'foo', '"foo" found in div');
        t.contentNotLike(t.$('div'), 'foof', '"foof" not found in div');
        
        t.waitForContentLike(t.$('div'), 'bar', function() {
            t.pass('"bar" found in div');

            t.diag('CSS class and style detection');

            t.hasNotCls($('div'), 'abc', '"abc" CSS class not found');
            t.hasCls($('div'), 'cls', '"cls" CSS class found');
        
            t.hasNotStyle($('div'), "height", '21px', 'Height 21px not found');
            t.hasStyle($('div'), "height", '20px', 'Height 20px found');
        
            t.waitForSelectorAt([50, 50], 'div.bar', function() {
                t.pass('waitForSelectorAt did its job');

                t.$('body').html('');
                t.waitForSelector('.qwerty', document.body, function() {
                    t.pass('waitForSelector did its job');

                    t.$('body').html('<div class="z1" style="height:100px;width:100px;position:absolute;z-index:1">foo</div><div class="z2" style="height:100px;width:100px;position:absolute;z-index:2">foo2</div>');

                    t.waitForElementTop(t.$('div.z1'), function() {
                        
                        t.pass('waitForElementTop did its job');
        
                        t.waitForElementNotTop(t.$('div.z1'), function() {
                            t.pass('waitForElementNotTop did its job');

                            t.elementIsTopElement(t.$('.z2'), false, 'elementIsTopElement worked');
                            t.elementIsNotTopElement(t.$('.z1'), false, 'elementIsNotTopElement worked');

                            t.elementIsAt(t.$('.z2'), [20, 20], false, 'elementIsAt worked');
                            t.selectorIsAt(t.$('.z2'), [20, 20], 'selectorIsAt worked');

                            t.monkeyTest($('div'), 5, null, function() {
                                t.done();
                            });
                        });
                        t.$('.z1').css('z-index', 1);
                    });
                    t.$('.z1').css('z-index', 3);
                });
                
                t.$('body').html('<p class="qwerty"></p>');
            });
            t.$('body').html('<div class="bar" style="height:100px;width:100px">foo</div>');
        });
        t.$('div').html('bar');
    });
});
