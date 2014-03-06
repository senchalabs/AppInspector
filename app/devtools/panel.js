'use strict';

var AI = {
    isReady     : false,
    contextMenu : null
};

/**
 * Create Sencha Panel
 * http://developer.chrome.com/extensions/devtools.html
 */
chrome.devtools.panels.create(
    'Sencha',
    'resources/images/panel_icon.png',
    'AppInspector/index.html',

    function (senchaPanel) {
        senchaPanel.onShown.addListener(function (panelWindow) {
            if (AI.isReady) { return; }
            AI.isReady = true;

            //connect to logic in background.js
            var port = chrome.runtime.connect({ name : 'AppInspector' }),
                tabId = chrome.devtools.inspectedWindow.tabId;

            //when messages are received from background.js
            port.onMessage.addListener(function (msg) {

                //we only care about the tab which we're debugging
                if (msg.tabId === tabId) {

                    //refresh AppInspector
                    panelWindow.location.reload(true);
                }
            });
        });
    }
);