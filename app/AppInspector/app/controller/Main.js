/**
 * @class   AI.controller.Main
 * @extends Ext.app.Controller
 */
Ext.define('AI.controller.Main', {
    extend : 'Ext.app.Controller',

    requires : [
        'AI.util.InspectedWindow'
    ],

    views : [
        'MainView',
        'About'
    ],

    refs : [
        {
            ref      : 'mainView',
            selector : '#mainview'
        }
    ],

    init : function (application) {
        this.control({
            '#mainview' : {
                'afterrender' : this.onAppRender
            }
        });
    },

    onAppRender : function () {
        var me = this,
            args = Ext.Array.slice(arguments),
            app = me.getApplication(),
            main = me.getMainView(),
            tabpanel = main.child('tabpanel');

        main.setLoading('Getting application details...');

        AI.util.InspectedWindow.eval(
            AI.util.InspectedWindow.getAppDetails,
            null,
            function (data) {
                if (data) {
                    if (data.isLoading || !data.versions) {
                        //Need to wait till app has loaded so we can get any info we want
                        setTimeout(function () {
                            me.onAppRender.apply(me, args);
                        }, 75);
                    }
                    else {
                        var versions = data.versions,
                            source = Ext.apply({
                                name : data.name
                            }, versions);

                        app.info = {
                            isMVC     : data.isMVC,
                            framework : versions.extjs ? 'ext' : 'touch',
                            version   : versions.extjs ? versions.extjs : data.touch
                        };

                        tabpanel.down('#AppDetails').setSource(source);
                        tabpanel.child('mvc').setDisabled(!data.isMVC);
                        tabpanel.down('#LayoutRuns').setDisabled(app.info.framework === 'touch');

                        main.setLoading(false);
                    }
                }
                else {
                    // mask entire AppInspector body element
                    Ext.getBody().mask(
                        'No Sencha framework found!',
                        'no-framework-mask'
                    );
                }
            }
        );
    }

});
