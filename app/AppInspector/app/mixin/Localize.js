/**
 * @class   AI.mixin.Localize
 * @extends Ext.Mixin
 */
Ext.define('AI.mixin.Localize', {
    extend: 'Ext.Mixin',

    requires: [
        'AI.util.i18n'
    ],

    mixinConfig: {
        id: 'localize'
    },

    config: {},

    /**
     * @param  {Ext.Component}  view
     *
     * localize view title
     */
    localize: function(view) {
        var title = view.getTitle(),
            locale;

        if (title) {
            locale = AI.util.i18n.getMessage(title);

            // <debug>
            console.log('localize:', title, '>', locale);
            // </debug>

            view.setTitle(locale);
        }
    }
});
