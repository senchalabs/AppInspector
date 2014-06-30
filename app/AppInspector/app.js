// @require @packageOverrides
Ext.Loader.setConfig({
    enabled: true,
    paths : {
        d3xtjs : 'packages/d3xtjs/src/'
    }
});

Ext.application({
    name: 'AI',

    extend: 'AI.Application',

    autoCreateViewport: 'AI.view.main.Main'

    //-------------------------------------------------------------------------
    // Most customizations should be made to AI.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
