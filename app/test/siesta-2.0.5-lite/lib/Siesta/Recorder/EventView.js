/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * Event recorder.
 */
Ext.define('Siesta.Recorder.EventView', {
    extend : 'Ext.grid.Panel',
    alias  : 'widget.eventview',
    cls    : 'siesta-eventview',

    editing : null,
    test    : null,

    enableColumnMove : false,

    scrollToBottom  : function () {
        if (this.view.rendered) {
            this.view.el.dom.scrollTop = this.view.el.dom.firstChild.clientHeight;
        }
    },

    // Provided by instantiator
    highlightTarget : function () {
        return { success : true };
    },

    initComponent : function () {
        var me = this;

        me.plugins = me.plugins || [];

        me.editing = new Ext.grid.plugin.CellEditing({
            clicksToEdit : 1,

            startEdit : function (record, column) {
                this.completeEdit();

                column = typeof column === 'number' ? me.headerCt.items.getAt(column) : column;

                if (column.dataIndex === "actionTarget") {
                    record = typeof record === 'number' ? me.store.getAt(record) : record;

                    if (column.bindEditor(this.getEditor(record, column), record) === false) {
                        return;
                    }
                }

                return Ext.grid.plugin.CellEditing.prototype.startEdit.apply(this, arguments);
            }
        });

        me.editing.on({
            beforeedit   : me.onBeforeEdit,
            validateedit : me.onValidateEdit,
            edit         : me.afterEdit,
            canceledit   : me.afterEdit,
            scope        : me
        });

        me.editing.on({
            beforeedit : function () {
                // Can't populate until we have a test bound
                this.typeEditor.populate(me.test);
            },
            scope      : me
        });

        this.relayEvents(me.editing, ['beforeedit', 'afteredit'])

        me.plugins.push(me.editing);

        Ext.apply(me, {
            viewConfig : {
                forceFit   : true,
                markDirty  : false,
                stripeRows : false,
                allowCopy  : true,
                plugins    : {
                    ptype : 'gridviewdragdrop'
                }
            },

            columns : [
                {
                    header       : 'Action',
                    dataIndex    : 'type',
                    width        : 100,
                    sortable     : false,
                    menuDisabled : true,
                    tdCls        : 'eventview-typecolumn',
                    editor       : this.typeEditor = new Siesta.Recorder.TypeEditor()
                },
                new Siesta.Recorder.TargetColumn({
                    cellEditing     : me.editing,
                    highlightTarget : this.highlightTarget
                }),
                {
                    xtype        : 'templatecolumn',
                    header       : 'Offset',
                    width        : 50,
                    sortable     : false,
                    menuDisabled : true,
                    dataIndex    : 'offset',
                    tdCls        : 'eventview-offsetcolumn',
                    tpl          : '<tpl if="offset"><div class="eventview-clearoffset"></div></tpl>{offset}',
                    editor       : {}
                },
                {
                    xtype        : 'actioncolumn',
                    width        : 18,
                    sortable     : false,
                    menuDisabled : true,
                    tdCls        : 'eventview-actioncolumn',

                    items : [
                        {
                            iconCls : 'icon-delete',
                            handler : function (grid, rowIndex, colIndex) {
                                me.editing.completeEdit();

                                grid.store.removeAt(rowIndex);
                            }
                        }
                    ]
                }
            ]
        });

        this.callParent();
    },


    onBeforeEdit : function (cellEditing, e) {

        // Offset only relevant for mouseinput actions
        return e.field !== 'offset' || e.record.isMouseInputEvent();
    },

    afterEdit : function (plug, e) {
        // Offset is most likely not relevant if you switch action target
        if (e.field === 'actionTarget' && e.value !== e.originalValue) {
            e.record.set('offset');
        }

        if (e.field === 'type') {
            var store = e.column.field.store;
            store.clearFilter();

            if (store.getById(e.value).get('type') !== store.getById(e.originalValue).get('type')) {
                e.record.resetValues();
            }
        }
    },

    onValidateEdit : function (plug, e) {
        var value = e.value;

        if (value && e.field === 'offset') {
            e.cancel = true;

            var parsed = e.record.parseOffset(value);

            if (parsed) {
                e.record.set('offset', parsed);
            }
        }
    },

    afterRender : function () {
        this.callParent(arguments);

        this.view.el.on({
            mousedown : function (e, t) {
                var record = this.view.getRecord(this.view.findItemByChild(t));
                record.set('offset', null);
                e.stopEvent();
            },
            scope     : this,
            delegate  : '.eventview-clearoffset'
        })
    }
});
