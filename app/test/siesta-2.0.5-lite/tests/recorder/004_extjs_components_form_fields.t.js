StartTest(function (t) {
    
    // frame created by htmleditor
    t.expectGlobals('0')

    var extractorCls = Class('Siesta._foo', {
        isa : Siesta.Recorder.TargetExtractor.ExtJS,
        has : {
            componentIdentifiers : function () {
                return [
                    'my',
                    'id',
                    'itemId',
                    'iconCls',      // button/menuitem
                    'type',         // Panel header tools
                    'name'          // form fields
                ];
            }
        }
    });

    function getRecorderManager() {
        var recorderManager = new Siesta.Recorder.RecorderPanel({
            width          : 600,
            height         : 200,
            renderTo       : document.body,
            extractorClass : extractorCls
        });
        recorderManager.attachTo(t);

        var recorder = recorderManager.recorder;

        recorder.ignoreSynthetic = false;
        recorder.start();

        return recorderManager;
    }

    new Ext.form.Panel({
        id          : 'form-widgets',
        title       : 'Form Widgets',
        frame       : true,
        collapsible : true,
        width       : 500,
        renderTo    : document.body,
        tools       : [
            { type : 'toggle' },
            { type : 'close' }
        ],

        bodyPadding : '10 20',

        defaults : {
            anchor     : '98%',
            msgTarget  : 'side',
            allowBlank : false
        },

        items : [
            {
                xtype : 'label',
                text  : 'Plain Label'
            },
            {
                fieldLabel : 'TextField',
                xtype      : 'textfield',
                name       : 'someField',
                emptyText  : 'Enter a value'
            },
            {
                fieldLabel : 'ComboBox',
                xtype      : 'combo',
                my         : 'combo',
                store      : ['Foo', 'Bar']
            },
            {
                fieldLabel : 'DateField',
                xtype      : 'datefield',
                name       : 'date',
                value      : new Date()
            },
            {
                fieldLabel : 'TimeField',
                name       : 'time',
                xtype      : 'timefield'
            },
            {
                fieldLabel : 'NumberField',
                xtype      : 'numberfield',
                name       : 'number',
                emptyText  : '(This field is optional)',
                allowBlank : true
            },
            {
                fieldLabel : 'TextArea',
                xtype      : 'textareafield',
                name       : 'message',
                cls        : 'x-form-valid',
                value      : 'This field is hard-coded to have the "valid" style'
            },
            {
                fieldLabel : 'Checkboxes',
                xtype      : 'checkboxgroup',
                columns    : [100, 100],
                items      : [
                    {boxLabel : 'Foo', checked : true, id : 'fooChk', inputId : 'fooChkInput'},
                    {boxLabel : 'Bar'}
                ]
            },
            {
                fieldLabel : 'Radios',
                xtype      : 'radiogroup',
                columns    : [100, 100],
                items      : [
                    {boxLabel : 'Foo', checked : true, name : 'radios'},
                    {boxLabel : 'Bar', name : 'radios'}
                ]
            },
            {
                hideLabel    : true,
                id           : 'htmleditor',
                xtype        : 'htmleditor',
                name         : 'html',
                enableColors : false,
                value        : 'Mouse over toolbar for tooltips.<br /><br />',
                height       : 110
            },
            {
                xtype : 'fieldset',
                title : 'Plain Fieldset',
                items : [
                    {
                        hideLabel : true,
                        xtype     : 'radiogroup',
                        items     : [
                            {boxLabel : 'Radio A', checked : true, name : 'radiogrp2'},
                            {boxLabel : 'Radio B', name : 'radiogrp2'}
                        ]
                    }
                ]
            },
            {
                xtype       : 'fieldset',
                title       : 'Collapsible Fieldset',
                baa         : 'baa',
                collapsible : true,
                items       : [
                    { xtype : 'checkbox', boxLabel : 'Checkbox 1' },
                    { xtype : 'checkbox', boxLabel : 'Checkbox 2' }
                ]
            },
            {
                xtype          : 'fieldset',
                title          : 'Checkbox Fieldset',
                checkboxToggle : true,
                items          : [
                    { xtype : 'radio', boxLabel : 'Radio 1', name : 'radiongrp1' },
                    { xtype : 'radio', boxLabel : 'Radio 2', name : 'radiongrp1' }
                ]
            }
        ],

        buttons : [
            {
                text    : 'Toggle Enabled',
                handler : function () {
                    this.up('form').items.each(function (item) {
                        item.setDisabled(!item.disabled);
                    });
                }
            },
            {
                text    : 'Reset Form',
                handler : function () {
                    Ext.getCmp('form-widgets').getForm().reset();
                }
            },
            {
                text    : 'Validate',
                handler : function () {
                    Ext.getCmp('form-widgets').getForm().isValid();
                }
            }
        ]
    });

    t.it('Text field', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '>> textfield[name=someField]' },

            function () {
                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 1);
                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#form-widgets textfield[name=someField] => .x-form-text');
            }
        )
    })

    t.it('Combo field', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '>> combo[my=combo]' },
            { click : '[my=combo] => .x-form-arrow-trigger' },
            { click : '[my=combo].getPicker() => .x-boundlist-item:contains(Bar)' },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 3);
                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#form-widgets combo[my=combo] => .x-form-text');

                t.is(recorderEvents[1].type, 'click');
                t.is(recorderEvents[1].actionTarget, '#form-widgets combo[my=combo] => .x-form-trigger');

                t.is(recorderEvents[2].type, 'click');
                t.is(recorderEvents[2].actionTarget, /*#form-widgets */'combo[my=combo].getPicker() => .x-boundlist-item:contains(Bar)');
            }
        )
    })

    t.it('Date field', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '>> datefield' },
            { click : 'datefield => .x-form-trigger' },
            { click : 'datefield[name=date].getPicker() => .x-datepicker-cell:contains(27)' },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 3);
                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#form-widgets datefield[name=date] => .x-form-text');

                t.is(recorderEvents[1].type, 'click');
                t.is(recorderEvents[1].actionTarget, '#form-widgets datefield[name=date] => .x-form-trigger');

                t.is(recorderEvents[2].type, 'click');
                t.is(recorderEvents[2].actionTarget, 'datefield[name=date].getPicker() => .x-datepicker-date:contains(27)');
            }
        )
    })

    t.it('Time field', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '>> timefield' },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 1);
                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#form-widgets timefield[name=time] => .x-form-text');
            }
        )
    })

    t.it('Number field', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '>> numberfield' },
            { click : 'numberfield => .x-form-spinner-up' },
            { click : 'numberfield => .x-form-spinner-down' },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 3);

                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#form-widgets numberfield[name=number] => .x-form-text');

                t.is(recorderEvents[1].type, 'click');
                t.is(recorderEvents[1].actionTarget, '#form-widgets numberfield[name=number] => .x-form-spinner-up');

                t.is(recorderEvents[2].type, 'click');
                t.is(recorderEvents[2].actionTarget, '#form-widgets numberfield[name=number] => .x-form-spinner-down');
            }
        )
    })

    t.it('Text area', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '>> textareafield[name=message]' },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 1);

                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#form-widgets textareafield[name=message] => .x-form-text');
            }
        )
    })

    t.it('Checkboxes', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

//        Ext.get('fooChk').on({
//            mousedown : console.log,
//            mouseup   : console.log,
//            click     : console.log,
//            scope     : console
//        })

        t.chain(
            { click : '#fooChkInput' },

            // TODO BREAKS
//            { click : '#fooChk' },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 1);

                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, '#fooChkInput');
            }
        )
    })

    t.it('Radio', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : '>>[name=radios]' },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 1);

                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[0].actionTarget, 'radiogroup radiofield[name=radios] => .x-form-radio');
            }
        )
    })

    t.it('Field set', function (t) {

        var recorderManager = getRecorderManager();
        var recorder = recorderManager.recorder;

        t.chain(
            { click : 'fieldset tool[type=toggle] => .x-tool-img' },
            { waitFor : 300 },
            { click : 'fieldset tool[type=toggle] => .x-tool-img' },
            { waitFor : 300 },
            { click : '>>[baa] checkboxfield' },

            function () {

                var recorderEvents = recorder.getRecordedEvents();

                recorder.ignoreSynthetic = true;
                recorder.stop();

                t.is(recorderEvents.length, 3);

                t.is(recorderEvents[0].type, 'click');
                t.is(recorderEvents[1].type, 'click');
                t.is(recorderEvents[2].type, 'click');
                t.is(recorderEvents[0].actionTarget, 'fieldset tool[type=toggle] => .x-tool-img');
                t.is(recorderEvents[1].actionTarget, 'fieldset tool[type=toggle] => .x-tool-img');
                t.is(recorderEvents[2].actionTarget, 'fieldset checkbox => .x-form-checkbox');
            }
        )
    })
})