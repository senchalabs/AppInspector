Role('Siesta.Test.Self.ExtJS', {

    requires: ['typeOf'],

    has: {
    },


    methods: {
        isExt3: function () {
            return !this.Ext().versions;
        },

        isExt4: function () {
            return this.Ext().versions.extjs.major === 4;
        },

        getStore: function (config) {
            var Ext = this.Ext();

            if (this.isExt3()) {
                return new Ext.data.ArrayStore(Ext.apply({
                    fields: [
                        'bar'
                    ],
                    data: [
                        ['Foo']
                    ]
                }, config));
            } else {
                return new Ext.data.ArrayStore(Ext.apply({
                    fields: ['bar'],
                    data: [
                        ['Foo']
                    ]
                }, config));
            }

        },

        getLoadedStore: function (config) {
            var Ext = this.Ext();

            return this.getStore(Ext.apply({
                data: [
                    ['Foo']
                ]
            }, config));
        },

        getGrid: function (config) {
            var Ext = this.Ext();

            var store = this.getLoadedStore();

            var grid = new Ext.grid.GridPanel(Ext.apply({
                store: store,
                columns: [
                    {
                        text: 'F',
                        sortable: false,
                        dataIndex: 'bar'
                    }
                ],
                height: 100,
                width: 100,
                deferRowRender: false,
                renderTo: Ext.getBody()
            }, config || {}));

            return grid;
        },

        getDataView: function (config) {
            var Ext = this.Ext();

            var store = this.getStore();

            var tpl = new Ext.XTemplate(
		        '<tpl for=".">',
                    '<div class="thumb-wrap">{bar}</div>',
                '</tpl>'
	        );

            var view = new Ext.DataView({
                store: store,
                tpl: tpl,
                overClass: 'x-view-over',
                itemSelector: 'div.thumb-wrap',
                emptyText: 'No images to display'
            });

            var panel = new Ext.Panel({
                width: 255,
                height: 100,
                layout: 'fit',
                title: 'Simple DataView',
                renderTo : Ext.getBody(),
                items: view
            });
            return view;
        }
    }
})
