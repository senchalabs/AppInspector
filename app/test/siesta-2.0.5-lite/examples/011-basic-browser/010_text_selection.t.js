StartTest(function(t) {
    
    document.body.innerHTML = '<input type="text" style="width:200px" value="This field contains some text" /><textarea rows="3" cols="20">This textarea also contains some text blablablablablablabla</textarea>';
    
    var textInput = document.getElementsByTagName('input')[0],
        textArea  = document.getElementsByTagName('textarea')[0];
    t.selectText(textInput, 5, 10);
    t.is(t.getSelectedText(textInput), 'field', 'Correct textfield phrase selected');
    
    t.selectText(textArea, 0, 4);
    t.is(t.getSelectedText(textArea), 'This', 'Correct textarea phrase selected');
})    