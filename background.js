// monitor page refresh
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === 'app-inspector') {
        port.onMessage.addListener(function(msg) {
            if (msg.action === 'connect') {
                var onUpdated = function(tabId) {
                    if (tabId === msg.tabId) {
                        port.postMessage('refresh');
                    }
                };
                
                chrome.tabs.onUpdated.addListener(onUpdated);

                port.onDisconnect.addListener(function() {
                    chrome.tabs.onUpdated.removeListener(onUpdated);
                });
            }
        });
    }
});
