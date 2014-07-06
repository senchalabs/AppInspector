/**
 * @class       AI.grid.property.Grid
 * @override    Ext.grid.property.Grid
 */
Ext.define('AI.grid.property.Grid', {
    override: 'Ext.grid.property.Grid',

    /**
     * @private
     *
     * @param   {Object}    value
     *
     * @returns {String}
     */
    valueRenderer: function (value) {
        var v = value,
            type = (typeof value),
            cls;

        if (value === null) {
            v = 'null';
        }

        if (value === undefined) {
            v = 'undefined';
        }

        cls = [
            'highlight',
            type,
            v
        ].join(' ');

        return '<span class="' + cls + '">' + v + '</span>';
    },

    setSource: function (source) {
        var me = this,
            renderer = me.valueRenderer,
            config = {};

        Ext.Object.each(source, function (key) {
            config[key] = {
                renderer: renderer
            };
        });

        me.callParent([source, config]);
    }
});
