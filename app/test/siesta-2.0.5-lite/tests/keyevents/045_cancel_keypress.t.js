StartTest(function(t) {

    var pureInput = document.createElement("input");
    document.body.appendChild(pureInput);

    pureInput.onkeypress = function(e){
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    };

    t.type(pureInput, 'F', function() {
        t.is(pureInput.value, '', 'Input element empty when returning false from keypress listener');

        pureInput.onkeypress = function(){ return true; };

        t.type(pureInput, 'OO', function() {
            t.is(pureInput.value, 'OO', 'Input element works normally after returning true instead');
        });
    });
});