// <debug>

//mock the APIs for debugging
if (!chrome.devtools) {
    chrome.devtools = {
        inspectedWindow: {
            //as a brilliant hack, let's just run the code on AppInspector itself!
            eval: function(contextFn, callback) {
                var result = eval(contextFn);

                callback(result, false);
            }
        }
    };
}

// </debug>
