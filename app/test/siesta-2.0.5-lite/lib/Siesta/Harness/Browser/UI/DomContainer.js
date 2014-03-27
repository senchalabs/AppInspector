/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.DomContainer', {
    extend : 'Ext.Panel',
    alias  : 'widget.domcontainer',
    cls    : 'siesta-domcontainer',

    test          : null,
    testListeners : null,

    maintainViewportSize : true,

    canManageDOM            : true,
    suspendAfterLayoutAlign : false,
    padding                 : 10,
    title                   : 'DOM Panel',
    inspecting              : false,

    initComponent : function () {
        this.testListeners = []

        this.addEvents(
            'startinspection',
            'componenthover',
            'componentselected',
            'stopinspection'
        )

        Ext.apply(this, {
            header       : false,
            collapsible  : true,
            animCollapse : false,

            dockedItems : this.consoleCt = new Ext.Component({
                dock      : 'bottom',
                hidden    : true,
                height    : 20,
                cls       : 'domcontainer-console',
                renderTpl : '<div><input type="text" /></div>'
            })
        });

        this.callParent()

        this.on({
            afterlayout : this.onAfterLayout,
            expand      : this.onExpand,
            collapse    : this.onCollapse,

            scope : this
        })
    },

    afterRender : function () {
        this.callParent(arguments);

        var input = this.consoleInput = this.el.down('.domcontainer-console input');

        this.on('componenthover', function (dc, cmp) {
            input.dom.value = 'Ext.getCmp("' + cmp.id + '").';
        });

        this.on('componentselected', function (dc, cmp) {
            input.focus(true);
        });

        input.on({
            keyup : function (e, t) {
                var val = input.dom.value;

                if (e.getKey() === e.ENTER && val) {
                    var frame = this.getIFrame();
                    try {
                        var retVal = frame.contentWindow.eval(val);
                        if (console) {
                            console.log(retVal);
                        }
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            },
            scope : this
        });
    },

    setCanManageDOM : function (value) {
        if (value != this.canManageDOM) {
            this.canManageDOM = value

            if (value && !this.hidden) this.alignIFrame()
        }
    },


    getIFrameWrapper : function () {
        var test = this.test;

        if (test)
            return this.canManageDOM && test.scopeProvider && test.scopeProvider.wrapper || null
        else
            return null;
    },


    getIFrame : function () {
        var test = this.test;

        if (test)
            return this.canManageDOM && test.scopeProvider && test.scopeProvider.iframe || null
        else
            return null;
    },


    onAfterLayout : function () {
        if (!this.suspendAfterLayoutAlign) this.alignIFrame();
    },


    alignIFrame : function () {
        var wrapper = this.getIFrameWrapper();

        if (!this.isFrameVisible() || !wrapper) return

        Ext.fly(wrapper).removeCls('tr-iframe-hidden')
        Ext.fly(wrapper).removeCls('tr-iframe-forced')

        var box = this.body.getBox()

        Ext.fly(wrapper).setBox(box)

        if (!this.maintainViewportSize) {
            Ext.fly(this.getIFrame()).setSize(this.body.getSize())
        }

        var test = this.test

        test && test.fireEvent('testframeshow')
    },


    onCollapse : function () {
        this.hideIFrame();
    },


    onExpand : function () {
        this.alignIFrame();
    },


    hideIFrame : function () {
        var iframe = this.getIFrameWrapper()

        iframe && Ext.fly(iframe).setLeftTop(-10000, -10000)

        var test = this.test

        test && test.fireEvent('testframehide')
    },


    isFrameVisible : function () {
        return !(this.hidden || this.collapsed)
    },


    showTest : function (test, assertionsStore) {
        this.stopInspection();

        if (this.test) {
            Joose.A.each(this.testListeners, function (listener) {
                listener.remove()
            })

            this.testListeners = []

            this.hideIFrame()
        }

        this.test = test

        this.testListeners = [
            test.on('testfinalize', this.onTestFinalize, this)
        ]

        // when starting the test with forcedIframe - do not allow the assertion grid to change the location of the iframe
        // (canManageDOM is set to false)
        this.setCanManageDOM(!test.hasForcedIframe())

        this.alignIFrame();
    },


    onTestFinalize : function (event, test) {
        this.setCanManageDOM(true)

        // this prevents harness from hiding the iframe, because "test.hasForcedIframe()" will return null
        // we've moved the iframe to the correct position, and it can never be "forced" again anyway
        if (this.isFrameVisible()) test.forceDOMVisible = false
    },


    destroy                 : function () {
        // just in case
        this.hideIFrame()

        Joose.A.each(this.testListeners, function (listener) {
            listener.remove()
        })

        this.test = null

        this.callParent(arguments)
    },

    // BEGIN Inspection related code
    // -----------------------------
    inspectedComponent      : null,
    inspectedComponentXType : null,

    toggleInspectionMode : function (on) {
        if (!this.test) return;

        if (on) {
            this.startInspection();
        } else {
            this.stopInspection();
        }
    },

    startInspection : function (showConsole) {
        if (!this.test) return;

        var frame = this.test.scopeProvider.iframe;
        var _Ext = frame.contentWindow.Ext;

        // This is only relevant for frames containing 'Ext'
        if (!_Ext) return;

        var me = this;
        var wrap = Ext.get(this.getIFrameWrapper());

        me.boxIndicator = me.boxIndicator || wrap.createChild({
            cls      : 'cmp-inspector-box',
            children : {
                tag    : 'a',
                cls    : 'cmp-inspector-label',
                target : '_blank'
            }
        });

        if (showConsole !== false) {
            this.consoleCt.show();
        }

        this.toggleMouseMoveListener(true);

        _Ext.getBody().on('click', this.onInspectionClick, this);
        wrap.on('mouseout', this.onMouseLeave, this);

        this.fireEvent('startinspection', this);

        this.addCls('inspection-mode');

        this.inspecting = true;
    },

    stopInspection : function (suppressEvent) {

        if (!this.inspecting) return;

        this.inspecting = false;

        var wrap = Ext.get(this.getIFrameWrapper());
        var frame = this.test.scopeProvider.iframe;
        var _Ext = frame.contentWindow.Ext;

        if (!_Ext) return;

        Ext.destroy(this.boxIndicator);
        this.boxIndicator = null;

        this.removeCls('inspection-mode');

        this.consoleCt.hide();

        wrap.un('mouseout', this.onMouseLeave, this);

        if (!suppressEvent) {
            this.fireEvent('stopinspection', this);
        }

        this.toggleMouseMoveListener(false);
        _Ext && _Ext.getBody().un('click', this.onInspectionClick, this);

        this.inspectedComponent = this.inspectedComponentXType = null;
    },

    onMouseLeave            : function (e, t) {
        if (!this.el.contains(e.relatedTarget) && !Ext.fly(this.getIFrameWrapper()).contains(e.relatedTarget)) {
            this.stopInspection();
        }
    },

    // Listen for mousemove in the frame and any direct iframe children too
    toggleMouseMoveListener : function (enabled) {
        var frame = this.test.scopeProvider.iframe;
        var _Ext = frame.contentWindow.Ext;
        var frames = _Ext.getBody().select('iframe');
        var fn = enabled ? 'on' : 'un';

        _Ext.getBody()[fn]('mousemove', this.onMouseMove, this, { buffer : 30 });

        for (var i = 0; i < frames.getCount(); i++) {
            var innerExt = frames.item(i).dom.contentWindow.Ext;
            innerExt && innerExt.getBody()[fn]('mousemove', this.onMouseMove, this, { buffer : 30 });
        }
    },

    onInspectionClick : function (e, t) {
        if (e.synthetic || !this.boxIndicator) return;

        this.toggleMouseMoveListener(false);

        // If user clicks on a non-component, or clicking outside currently selected component - we abort
        if (!this.inspectedComponent || this.findComponentByTarget(t) !== this.inspectedComponent) {
            this.stopInspection();
        } else {
            this.fireEvent('componentselected', this, this.inspectedComponent, this.inspectedComponentXType);
        }
    },

    onMouseMove : function (e, t) {
        if (e.synthetic || !this.boxIndicator) return;

        var cmp = this.findComponentByTarget(t);

        if (!cmp || cmp === this.inspectedComponent) return;

        var me = this;

        var xtype = this.resolveComponentXtype(cmp);

        this.inspectedComponent = cmp;
        this.inspectedComponentXType = xtype;

        me.highlightTarget(cmp.el);
        me.updateHighlightContent(cmp, xtype);

        this.fireEvent('componenthover', this, this.inspectedComponent, this.inspectedComponentXType);
    },

    resolveComponentXtype : function(cmp) {
        var xtype = (cmp.getXType && cmp.getXType()) || cmp.xtype;

        // If the found component doesn't have an own xtype, look up the superclass chain to find one
        if (!xtype) {
            var cls = cmp;
            for (var i = 0; i < 10 && !xtype; i++) {
                cls = cmp.superclass;
                xtype = cls.xtype;
            }
        }

        return xtype;
    },

    updateHighlightContent : function (cmp, xtype) {
        var html;
        var link = {
            tag    : 'a',
            cls    : 'cmp-inspector-label',
            href   : '#'
        };

        if (typeof cmp === 'string') {
            html = cmp;
        } else if (Ext.ClassManager) {

            // If recorder is visible, let's add some targeting suggestions
            var recorder = Ext.ComponentQuery.query('recorderpanel')[0];

            if (recorder && recorder.isVisible()) {
                html = '>>' + (recorder.extractor.getOptimalCQForComponent(cmp) || xtype);
            } else {
                var clsName = this.findExtAncestorClassName(cmp);

                if (clsName) {
                    var docsPath = 'http://docs.sencha.com/{0}/#!/api/{1}';
                    var framework;

                    if (Ext.versions.touch) {
                        framework = 'touch';
                    } else {
                        framework = 'extjs';
                    }

                    link.target = '_blank';
                    link.href = Ext.String.format(docsPath, framework, clsName);
                    link.title = 'View documentation for ' + clsName;

                    html = xtype;
                }
            }
        }

        if (html) {
            link.html = html;
            this.boxIndicator.update(Ext.DomHelper.createHtml(link));
        }
    },

    highlightTarget : function (target, content) {
        if (!this.inspecting) {
            this.startInspection();
        }

        var me = this;
        var el = Ext.get(this.test.normalizeElement(target));
        var node = el.dom;
        var boxStyle = me.boxIndicator.dom.style;
        var offsets = this.getOffsets(node);

        // Regular getWidth/getHeight doesn't work if another iframe is on the page
        boxStyle.left = (el.getX() - 1 + offsets[0]) + 'px';
        boxStyle.top = (el.getY() - 1 + offsets[1]) + 'px';
        boxStyle.width = ((el.getWidth() || (parseInt(node.style.width.substring(0, node.style.width.length - 2), 10))) + 2) + 'px';
        boxStyle.height = ((el.getHeight() || (parseInt(node.style.height.substring(0, node.style.height.length - 2), 10))) + 2) + 'px';

        if (content) {
            this.updateHighlightContent(content);
        }
    },

    clearHighlight : function () {
        this.stopInspection();
    },

    findComponentByTarget : function (t) {
        var test = this.test;
        var Ext = test.getExt();
        var testDoc = test.global.document;
        var cmp;

        // Handle potentially having another Ext copy loaded in another frame
        if (t.ownerDocument !== testDoc) {
            var innerFrame = (t.ownerDocument.parentWindow || t.ownerDocument.defaultView).frameElement;
            Ext = innerFrame.contentWindow.Ext;
        }

        while (!cmp && t && t.nodeName !== 'BODY') {
            cmp = Ext.getCmp(t.id);
            t = t.parentNode;
        }

        return cmp;
    },

    getOffsets : function (node) {
        var testDoc = this.test.global.document;
        var offsets = [0, 0];

        if (node.ownerDocument !== testDoc) {
            var innerFrame = (node.ownerDocument.parentWindow || node.ownerDocument.defaultView).frameElement;

            offsets = Ext.fly(innerFrame).getXY();
            offsets[0] -= node.ownerDocument.body.scrollLeft;
            offsets[1] -= node.ownerDocument.body.scrollTop;
        }

        return offsets;
    },

    findExtAncestorClassName : function (cmp) {
        while (cmp) {
            var name = Ext.ClassManager.getName(cmp);
            if (name.match(/^Ext./)) {
                return name;
            }

            cmp = cmp.superclass;
        }

        return '';
    },

    // END Inspection related code
    // -----------------------------

    onDestroy : function() {
        Ext.destroy(this.boxIndicator);
        this.boxIndicator = null;

        this.callParent(arguments);
    }
});