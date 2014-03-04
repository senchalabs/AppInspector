'use strict';

// monitor page refresh
chrome.extension.onConnect.addListener(function (port) {

    //when devtools-page connects (when App Inspector is actually opened)
    if (port.name === 'AppInspector') {

        //add event listener for tab refresh
        //NOTE: this fires across ALL tabs!
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

            //changeInfo has multiple statuses... only fire on complete
            if (changeInfo.status === 'complete') {
                port.postMessage({
                    tabId   : tabId,
                    message : 'refreshed!'
                });
            }
        });
    }
});