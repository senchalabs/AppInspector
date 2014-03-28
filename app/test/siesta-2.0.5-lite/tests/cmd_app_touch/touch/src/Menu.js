Ext.define('Ext.Menu', {
    extend: 'Ext.Sheet',
    xtype: 'menu',
    requires: ['Ext.Button'],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'menu',

        /**
         * @cfg
         * @inheritdoc
         */
        left: 0,

        /**
         * @cfg
         * @inheritdoc
         */
        right: 0,

        /**
         * @cfg
         * @inheritdoc
         */
        bottom: 0,

        /**
         * @cfg
         * @inheritdoc
         */
        height: 'auto',

        /**
         * @cfg
         * @inheritdoc
         */
        width: 'auto',

        /**
         * @cfg
         * @inheritdoc
         */
        defaultType: 'button',

        /**
         * @hide
         */
        showAnimation: null,

        /**
         * @hide
         */
        hideAnimation: null,

        /**
         * @hide
         */
        centered: false,

        /**
         * @hide
         */
        modal: true,

        /**
         * @hide
         */
        hidden: true,

        /**
         * @hide
         */
        hideOnMaskTap: true,

        /**
         * @hide
         */
        translatable: {
            translationMethod: null
        }
    },

    constructor: function() {
        this.config.translatable.translationMethod = Ext.browser.is.AndroidStock2 ? 'cssposition' : 'csstransform';
        this.callParent(arguments);
    },

    platformConfig: [{
        theme: ['Windows']
    }, {
        theme: ['Blackberry'],
        ui: 'context',
        layout: {
            pack: 'center'
        }
    }],

    updateUi: function(newUi, oldUi) {
        this.callParent(arguments);

        if (newUi != oldUi && Ext.theme.name == 'Blackberry') {
            if (newUi == 'context') {
                this.innerElement.swapCls('x-vertical', 'x-horizontal');
            }
            else if (newUi == 'application') {
                this.innerElement.swapCls('x-horizontal', 'x-vertical');
            }
        }
    },

    updateHideOnMaskTap : function(hide) {
        var mask = this.getModal();

        if (mask) {
            mask[hide ? 'on' : 'un'].call(mask, 'tap', function() {
                Ext.Viewport.hideMenu(this.$side);
            }, this);
        }
    },

    /**
     * Only fire the hide event if it is initialized
     */
    doSetHidden: function() {
        if (this.initialized) {
            this.callParent(arguments);
        }
    }
});
