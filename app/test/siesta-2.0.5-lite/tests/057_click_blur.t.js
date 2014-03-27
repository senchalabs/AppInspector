describe('Simulating a click does not trigger blur automatically', function (t) {
    
    t.testExtJS(function (t) {
        
        t.it('should trigger focus/blur when clicking inside/outside of the text input', function (t) {
    
            // in FF default width of input is > 200px need provide explicit value
            document.body.innerHTML = '<input style="width:150px" id="inp" type="text" />'
    
            t.willFireNTimes(document.getElementById("inp"), 'focus', 1);
            t.willFireNTimes(document.getElementById("inp"), 'blur', 1);
    
            t.chain(
                { action : 'click', target : '#inp' },
                { action : 'click', target : [200, 10] }
            );
    
        });
        
        t.it('should not trigger extra blur event when clicking on another text input', function (t) {
    
            document.body.innerHTML = '<input id="inp1" type="text" /><input id="inp2" type="text" />'
    
            t.willFireNTimes(document.getElementById("inp1"), 'focus', 1);
            t.willFireNTimes(document.getElementById("inp1"), 'blur', 1);
            t.willFireNTimes(document.getElementById("inp2"), 'focus', 1);
    
            t.chain(
                { action : 'click', target : '#inp1' },
                { action : 'click', target : '#inp2' }
            );
    
        });
        
    })
});

