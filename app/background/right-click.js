'use strict';

// right-click context menu
var CONTEXT_MENU = chrome.contextMenus.create({
    'title'    : 'App Inspector for Sencha',
    'contexts' : ['all'],
    'enabled'  : false,

    'onclick' : function (info, tab) {
        //TODO: get access to inspectedWindow
    }
});