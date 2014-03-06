'use strict';

/**
 * TABS[123] = {
 *     url  : 'http://cdn.sencha.com/ext/priv/ext-5.0.0.470/build/examples/kitchensink/#locking-grid',
 *     hash : 'locking-grid'
 * }
 */
var TABS = {};

// monitor page refresh
chrome.extension.onConnect.addListener(function (port) {

    //when devtools-page connects (when App Inspector is actually opened)
    if (port.name === 'AppInspector') {

        //enable the right-click menu
//        chrome.contextMenus.update(CONTEXT_MENU, {
//            enabled : true
//        });

        /**
         * add event listener for tab refresh
         * NOTE: this fires across ALL tabs!
         */
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

                //changeInfo has multiple statuses... only fire on complete
                if (changeInfo.status === 'complete') {
                    var oldUrl = TABS[tabId],
                        hashLocation;

                    //cache the URL so we can compare it later
                    if (!oldUrl || tab.url !== oldUrl.url) {
                        var newTab = {
                            url  : tab.url,
                            hash : ''
                        };

                        hashLocation = tab.url.indexOf('#');

                        if (hashLocation) {
                            newTab.hash = tab.url.substr(hashLocation + 1);
                        }

                        TABS[tabId] = newTab;
                    }

                    if (oldUrl) {
                        hashLocation = tab.url.indexOf('#');

                        var hash = (hashLocation) ? tab.url.substr(hashLocation + 1) : '';

                        //don't refresh the page if only the hash changes
                        if (hash && oldUrl.hash !== hash) {
                            TABS[tabId].hash = hash;
                        }
                        //if the hash has not changed, assume the user has manually refreshed the browser
                        else {
                            port.postMessage({
                                tabId   : tabId,
                                message : 'refreshed!'
                            });
                        }
                    }

                }
            }
        );

    }
});