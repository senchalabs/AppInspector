StartTest(function(t) {
    t.diag('Testing simple Carousel widget');

    var items = [], j, ln, category;

    for (j = 1; j <= 5; j++) {
        items.push({
            xtype: 'image',
            cls: 'my-carousel-item-img',
            src: 'photos/' + j + '.jpg'
        });
    }

    var carousel = new Ext.carousel.Carousel({
        direction: 'horizontal',
        items: items
    });

    t.is(carousel.getActiveIndex(), 0, 'Index 0');

    Ext.Viewport.add(carousel);
            
    var width = Ext.Viewport.element.getWidth();
    var start = [width-50, 100],
        end = [20, 100];

    var leftSwipe   = { action : 'swipe', direction : 'left', target : Ext.Viewport.element };
    var rightSwipe  = { action : 'swipe', direction : 'right', target : Ext.Viewport.element };

    t.chain(
        leftSwipe,
        leftSwipe,

        { action : 'wait', delay : 500 },   // Let the animation complete
        function(next) {    
            t.is(carousel.getActiveIndex(), 2, 'Index increased to 2'); 
            next(); 
        },

        rightSwipe,
        rightSwipe,

        { action : 'wait', delay : 500 },   // Let the animation complete
        function() { t.is(carousel.getActiveIndex(), 0, 'Index decreased to 0'); }
    );
});
