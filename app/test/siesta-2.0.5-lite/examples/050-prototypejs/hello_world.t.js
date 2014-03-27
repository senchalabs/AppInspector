StartTest(function(t) {
    t.pass('PrototypeJS included in test page, no errors detected.');
    
    // the template (our formatting expression)
    var myTemplate = new Template('The TV show #{title} was created by #{author}.');
    
    var show = {
      title: 'The Simpsons',
      author: 'Matt Groening',
      network: 'FOX'
    };
    
    var text = myTemplate.evaluate(show);
    
    // Simple prototype CSS selector test
    $$('body')[0].update(text);

    t.like(document.body.innerHTML, text, 'Found correct text in DOM');
});
