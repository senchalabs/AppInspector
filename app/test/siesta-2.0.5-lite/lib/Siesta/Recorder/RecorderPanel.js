/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * The UI class containing an EventView .
 */
Ext.define('Siesta.Recorder.RecorderPanel', {
    extend : 'Ext.panel.Panel',

    alias : 'widget.recorderpanel',

    layout      : 'fit',
    buttonAlign : 'left',
    border      : false,

    newEventDefaults : {
        type : 'click'
    },

    test         : null,
    recorder     : null,
    bodyBorder   : false,
    harness      : null,
    domContainer : null,

    extractorClass       : Siesta.Recorder.TargetExtractor.ExtJS,
    extractorClassConfig : null,

    // ActionTarget to DOM el, used to highlight the active element
    resolveTarget        : function (target) {
        try {
            target = this.test.normalizeActionTarget(target, true);
        } catch (e) {
            // sizzle will break on = in the selector name (Composite Query foo => .bar)
            target = null;
        }
        return target && this.test.normalizeElement(target, true);
    },

    hideHighlighter : function () {
        if (this.test) {
            this.domContainer.clearHighlight();
        }
    },

    highlightTarget : function (target) {
        var test = this.test;
        var warning;

        if (!test) {
            return {
                success : true
            };
        }

        if (!target) {
            // Pass no target => simply hide highlighter
            this.hideHighlighter();
            return;
        }

        var el;

        if (target.match('>>')) {
            var result;

            try {
                result = test.cq(target.split('>>')[1]);
            } catch (e) {
            }

            if (!result || result.length === 0) {
                return {
                    success : true
                }
            }
            // Just use the containing element for the first component found
            el = result[0].el;

            if (result.length > 1) {
                // Warn user about a query that's matching too widely
                warning = 'Query matches multiple components';
            }
        } else {
            el = this.resolveTarget(target);
        }

        if (test.isElementVisible(el)) {
            this.domContainer.highlightTarget(el, '<span class="cmp-inspector-label">' + target + '</span>');
        } else {

            // If target was provided but no element could be located, return false so
            // caller can get a hint there is potential trouble
            if (target) {
                return {
                    success : false,
                    message : warning || 'No visible elements found for target'
                };
            }
        }

        return {
            success : !warning,
            message : warning
        };
    },

    initComponent : function () {
        var me = this;
        var extractorCfg = this.extractorClassConfig || {};

        // Help the extractor to get the test Ext instance to be able to accesss the current Ext object
        extractorCfg.Ext = function () {
            return me.test.Ext();
        };

        this.extractor = new this.extractorClass(extractorCfg);

        this.store = new Ext.data.JsonStore({
            sorters : 'index',
            proxy   : 'memory',
            model   : 'Siesta.Recorder.RecordedEvent'
        });

        me.createToolbars();

        me.items = this.eventView = new Siesta.Recorder.EventView({
            border          : false,
            style           : 'border-top:1px solid #ddd',
            xtype           : 'eventview',
            itemId          : 'eventView',
            store           : me.store,
            highlightTarget : me.highlightTarget.bind(me),
            resolveTarget   : me.resolveTarget.bind(me)
        });

        this.eventView.on({
            beforeedit : function (ed, ctx) {
                if (ctx.column.dataIndex === 'actionTarget') {
                    me.domContainer.startInspection(false);
                }
            }
        });

        this.eventView.on({
            afteredit : function () {
                if (!me.eventView.editing.getActiveEditor()) {
                    me.hideHighlighter();
                }
            },
            scope     : this,
            buffer    : 200
        });

        me.recorder = me.recorder || new Siesta.Recorder.Recorder({
            onNewEventRecorded : function (e, eventData) {
                if (e.type !== 'click') {
                    // Skip this info for click events since we're coalescing it anyway, getting
                    // the relevant context from 'mousedown'
                    //
                    // An interesting issue arises in tree/grid clicks, when the mousedown re-renders the row
                    // thereby, at the time of the 'click' event, leaving the 'click' target node without a DOM tree to traverse up.
                    // We still have all info we need from the mousedown event
                    $.extend(eventData, me.extractor.getTargetOptions(e));
                }
            }
        });

        me.recorder.on("start", function () {
            /**
             * @event startrecord
             * Fires when a recording is started
             * @param {Siesta.Recorder.RecorderManager} this
             */
            this.fireEvent('startrecord', this);

            this.addCls('recorder-recording');
        }, this);

        me.recorder.on("stop", function () {
            /**
             * @event stoprecord
             * Fires when a recording is stopped
             * @param {Siesta.Recorder.RecorderManager} this
             */
            this.fireEvent('stoprecord', this);
            this.removeCls('recorder-recording');
        }, this);

        me.callParent();

        Ext.getBody().on({
            mousedown : function (e, t) {
                var focusedEl = document.activeElement;

                if (Ext.fly(focusedEl).up('.siesta-targeteditor')) {
                    e.stopEvent();
                    e.preventDefault();
                    focusedEl.value = Ext.htmlDecode(t.innerHTML);
                }
            },

            delegate : '.cmp-inspector-label'
        })
    },

    createToolbars : function () {
        var me = this;

        me.tbar = [
            {
                iconCls     : 'recorder-tool-icon icon-record',
                action      : 'recorder-start',
                cls         : 'recorder-tool',
                whenIdle    : true,
                tooltip     : 'Record',
                tooltipType : 'title',
                handler     : me.onRecordClick,
                scope       : me
            },
            {
                iconCls     : 'recorder-tool-icon icon-stop-2',
                action      : 'recorder-stop',
                cls         : 'recorder-tool',
                handler     : me.stop,
                tooltip     : 'Stop',
                tooltipType : 'title',
                scope       : me
            },
            {
                iconCls     : 'recorder-tool-icon icon-play-2',
                action      : 'recorder-play',
                cls         : 'recorder-tool',
                handler     : me.onPlayClick,
                tooltip     : 'Play',
                tooltipType : 'title',
                scope       : me
            },
            {
                iconCls     : 'recorder-tool-icon icon-close',
                action      : 'recorder-remove-all',
                cls         : 'recorder-tool',
                handler     : function () {
                    if (this.store.getCount() === 0) return;

                    Ext.Msg.confirm('Remove all?', 'Do you want to clear the recorded events?', function (btn) {
                        if (btn == 'yes') {
                            // process text value and close...
                            me.clear();
                        }
                        this.close();
                    });
                },
                tooltip     : 'Clear all',
                tooltipType : 'title',
                scope       : me
            },
            '->',
            {
                text    : 'Generate code',
                handler : function () {

                    var win = new Ext.Window({
                        title      : 'Code',
                        layout     : 'fit',
                        height     : 400,
                        width      : 600,
                        autoScroll : true,
                        constrain  : true,
                        items      : {
                            mode  : 'text/javascript',
                            xtype : 'jseditor'
                        }
                    }).show();

                    win.items.first().setValue('t.chain(\n    ' + me.generateCodeForSteps().join(',\n\n    ') + '\n);')
                }
            },
            {
                text        : '+',
                action      : 'recorder-add-step',
                tooltip     : 'Add a new step',
                tooltipType : 'title',
                scope       : me,
                handler     : function () {
                    if (!me.test) {
                        Ext.Msg.alert('No test detected', 'Before creating recorder steps, you need to run a test');
                        return;
                    }
                    var grid = me.getEventView();
                    var selected = grid.getSelectionModel().selected.first();
                    var model = new me.store.model(this.newEventDefaults);

                    if (selected) {
                        me.store.insert(me.store.indexOf(selected) + 1, model);
                    } else {
                        me.store.add(model);
                    }

                    grid.editing.startEdit(model, 0);
                }
            },

            me.closeButton
        ];

        me.bbar = {
            xtype  : 'component',
            cls    : 'cheatsheet',
            height : 70,
            html   : '<table><tr><td class="cheatsheet-type">CSS Query:</td><td class="cheatsheet-sample"> .x-btn</td></tr>' +
                '<tr><td class="cheatsheet-type">Component Query:</td><td class="cheatsheet-sample"> &gt;&gt;toolbar button</td></tr>' +
                '<tr><td class="cheatsheet-type">Composite Query:</td><td class="cheatsheet-sample"> toolbar =&gt; .x-btn</td></tr></table>'
        };
    },

    // Attach to a test (and optionally a specific iframe, only used for testing)
    attachTo       : function (test, iframe) {
        var me = this;
        var doClear = me.test && me.test.url !== test.url;

        if (me.recorder) {
            me.mun(me.recorder, "eventrecorded", me.onEventRecorded, me, { buffer : 200 });
            me.mun(me.recorder, "mousecoalesce", me.onMouseEventCoalese, me, { buffer : 200 });
            me.mun(me.recorder, "keycoalesce", me.onEventRecorded, me);
        }

        this.setTest(test);

        me.mon(me.recorder, "eventrecorded", me.onEventRecorded, me, { buffer : 200 });
        me.mon(me.recorder, "mousecoalesce", me.onMouseEventCoalese, me, { buffer : 200 });
        me.mon(me.recorder, "keycoalesce", me.onEventRecorded, me);

        var frame = iframe || test.scopeProvider.iframe;

        if (frame) {
            me.recorder.attach(frame.contentWindow);
        }

        if (doClear) {
            me.clear();
        }
    },

    getEventView : function () {
        if (!this.eventView) {
            this.eventView = this.down('#eventView');
        }

        return this.eventView;
    },

    onRecordClick : function () {
        var test = this.test;

        if (this.recorder && test && test.global) {
            this.attachTo(test);
            this.recorder.start();
        } else {
            Ext.Msg.alert('Error', 'You need to run a test before activating the recorder.')
        }
    },

    onPlayClick : function () {
        var me = this;

        if (me.recorder && me.test) {
            me.recorder.stop();

            if (me.store.getCount() > 0) {
                var test = this.test;
                var harness = this.harness;

                harness.on('beforetestfinalizeearly', function (ev, test2) {

                    if (test2.url === test.url) {
                        // important, need to update our reference to the test
                        me.setTest(test2);

                        // Run test first, and before it ends - fire off the recorded steps
                        harness.getTestByURL(test.url).chain(me.generateSteps());
                    }
                }, null, { single : true });

                harness.launch([ harness.getScriptDescriptor(test.url) ]);
            }
        }
    },

    stop : function () {
        var me = this;

        if (me.recorder) {
            me.recorder.stop();
        }
    },

    closeRecorder : function () {
        this.stopRecorder();
    },

    clear : function () {
        if (this.recorder) {
            this.recorder.clear();
        }
        this.store.removeAll();
    },

    setTest : function(test) {
        this.test = test;

        this.eventView.test = test;
    },

    generateSteps : function (events) {
        var steps = [];

        this.store.each(function (ev) {
            var step = this.eventToStep(ev);

            // Can be empty if the line is empty and hasn't been filled out yet
            if (step) {
                steps.push(step);
            }
        }, this);

        return steps;
    },

    eventToStep : function (event) {
        var data = event.data;
        var target = data.actionTarget;
        var step = { action : data.type, target : target };

        if (!data.type.match('waitFor') && target && typeof target !== "string" && !target.length) {
            throw 'Invalid target for ' + data.type + ' action: ' + target;
        }

        if (data.options) {
            step.options = data.options;
        }

        if (data.type.match('waitFor')) {
            switch (data.type) {
                case 'waitForFn':
                    // After this statement, t will be available in the evaled function below just as a regular local variable
                    var t = this.test;
                    return { waitFor : eval("(function() {\n        " + data.actionTarget.replace(/\n/g, "\n        ") + "\n    })") };

                case 'waitForMs':
                    var val = parseInt(data.actionTarget, 10);

                    return { waitFor : 'Ms', args : val };

                default:
                    var obj = { waitFor : data.type.split('waitFor')[1], args : [] };

                    if (data.actionTarget) {
                        obj.args = data.actionTarget;
                    }

                    return obj;
            }
        } else {
            switch (data.type) {
                case 'click':
                case 'dblclick':
                case 'contextmenu':
                case 'mousedown':
                case 'mouseup':
                case 'moveCursorTo':
                    if (data.offset) {
                        step.offset = data.offset.slice();
                    }
                    break;

                case 'moveCursorBy':
                    if (data.actionTarget) {
                        delete step.target;

                        step.action = 'moveCursor';
                        step.by = data.actionTarget;
                    }
                    break;

                case 'type':
                    step.text = data.actionTarget;
                    delete step.target;

                    break;

                case 'drag':
                    step.by = event.data.by;

                    if (!step.by && event.data.to) {
                        step.to = event.data.to;
                        step.toOffset = event.data.toOffset;
                    }

                    if (data.offset) {
                        step.offset = data.offset;
                    }
                    break;

                case 'fn':
                    // After this statement, t will be available in the evaled function below just as a regular local variable
                    var t = this.test;

                    return eval("(function(next) {\n        " + data.actionTarget.replace(/\n/g, "\n        ") + "\n        next();\n    })");

                default:
                    return null;
            }
        }

        return step;
    },

    onEventRecorded : function (e, recorder, recordedEvent) {
        recordedEvent.index = this.store.getCount();

        var newEvent = new Siesta.Recorder.RecordedEvent(recordedEvent);
        var doAdd = true;
        var last = this.store.last();

        // Make sure meta thigs like start/tail are saved too
        $.extend(newEvent.data, recordedEvent);

        if (recordedEvent.modKeys && Object.keys(recordedEvent.modKeys).length > 0) {
            newEvent.data.options = recordedEvent.modKeys;
        }

        if (recordedEvent.type === 'mouseidle') {
            newEvent.data.type = 'moveCursorTo';
        } else if (recordedEvent.type === 'pageunload') {
            newEvent.data.type = 'waitForPageLoad';
        } else if (recordedEvent.type === 'type') {
            var KC = Siesta.Test.Simulate.KeyCodes();
            var isSpecial = KC.isSpecial(recordedEvent.keyCode) || KC.isNav(recordedEvent.keyCode);
            var text = isSpecial ? KC.fromCharCode(recordedEvent.charCode) : String.fromCharCode(recordedEvent.charCode);

            if (isSpecial) {
                var keys = KC.keys,
                    charCode = recordedEvent.charCode;

                for (var p in keys) {
                    if (keys[p] === charCode && p.length > 1) {
                        text = '[' + p + ']';
                        break;
                    }
                }
            }

            if (last && last.data.type === 'type') {
                last.set({
                    actionTarget : last.data.actionTarget + text
                });
                doAdd = false;
            } else {
                newEvent.data.actionTarget = text;
            }
        }

        if (doAdd) {
            this.store.add(newEvent);
            this.getEventView().scrollToBottom();
        }
    },

    onMouseEventCoalese : function (e, recorder, event) {
        var me = this;
        var count = this.store.getCount();

        if (event.start && event.tail !== event.start) {
            var old = me.store.getById(event.start.id);
            me.store.remove(old);
        }

        var last = this.store.last();

        // Drag needs some special treatment
        if (event.type === 'drag' &&
            last.data.type !== 'drag' &&
            last.data.type !== 'mousedown' &&
            last.data.type !== 'mouseup') {
            var d = $.extend({}, event);

            d.index = count++;
            d.type = 'moveCursorTo';
            me.store.add(d);

            d = $.extend({}, event);
            d.type = 'mouseup';
            d.index = count++;
            d.id = ++this.recorder.eventId
            me.store.add($.extend({}, d));
        } else {
            var data = $.extend({}, event);

            if (event.type === 'drag') {
                data.by = [event.xy[0] - event.start.xy[0], event.xy[1] - event.start.xy[1]];

                // Provide "to" only if it's relevant
                if (event.actionTarget !== 'body') {
                    data.to = event.actionTarget;
                    data.toOffset = event.offset;
                }

                data.actionTarget = event.start.actionTarget;
                data.offset = event.start.offset;
            }

            if (event.modKeys && Object.keys(event.modKeys).length > 0) {
                data.options = event.modKeys;
            }

            last.set(data);
        }
    },

    generateCodeForSteps : function () {
        var me = this;

        return this.generateSteps().map(function (action) {
            // No processing of function steps
            return action.call ? action : me.objectToSource(action);
        });
    },

    objectToSource : function (obj) {
        var me = this;

        var result = Object.keys(obj).map(function (o) {
            if (obj[o] instanceof Array) {
                return o + ' : [' + obj[o].join(', ') + ']';
            } else if (typeof obj[o] === 'object') {
                return o + ' : ' + me.objectToSource(obj[o]);
            } else {
                return o + ' : ' + (typeof (obj[o]) === 'string' ? '"' + obj[o] + '"' : obj[o]);
            }
        }).join(', ');

        return '{ ' + result + ' }';
    },

    onDestroy : function () {
        this.recorder.stop();

        this.callParent(arguments);
    }

});
