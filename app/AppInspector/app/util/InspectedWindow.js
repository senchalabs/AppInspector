/**
 *
 */
Ext.define('AI.util.InspectedWindow', {
    singleton : true,

    requires : [
        'AI.util.Error'
    ],

    /**
     * @param {String} id
     */
    highlight : function (id) {
        var cmp = Ext.getCmp(id),
            el  = document.getElementById('_AppInspector'),
            box;

        if (cmp && cmp.rendered) {
            //Ext JS
            if (cmp.el) {
                box = cmp.el.getBox();
            }

            //Touch
            else if (cmp.element) {
                box = cmp.element.getBox();
            }

            el.style.height = box.height + 'px';
            el.style.width  = box.width + 'px';
            el.style.top  = box.top + 'px';
            el.style.left  = box.left + 'px';
            el.style.visibility = '';

            window.setTimeout(function() {
                var el  = document.getElementById('_AppInspector');

                el.style.visibility = 'hidden';
            }, 1000);
        }
    },

    /**
     * @param {Function} closure
     * @param {String} argString
     * @param {Function} callback  A callback function passed two parameters:
     *
     * - result {*}: Whatever the closure function returns
     *
     * - isException {Boolean}: whether-or-not the closure function encountered an exception
     */
    eval : function (closure, argString, callback) {
        var callbackFn = callback,
            args = '';

        if (argString) {
            args = '"' + argString + '"';
        }

        chrome.devtools.inspectedWindow.eval(
            '(' + closure + ')(' + args + ')',
            function (result, isException) {
                if (isException) {
                    AI.util.Error.parseException(isException);
                    return;
                }

                callbackFn(result, isException);
            }
        );
    },

    /**
     * Function to get the framework and version of the inspected app.
     */
    getAppVersion : function() {
        if (!window.Ext) {
            return false;
        }

        //helper class
        Ext.define('Ext.ux.AppInspector', {
            singleton : true,

            //for the Event Monitor
            eventCache     : null,
            eventCaptureFn : null,

            //for the right-click menu
            contextRef : null,
            contextFn  : function(evt, target, eOpts) {
                var cmp = Ext.getCmp(target.id);

                if (cmp) {
                    this.contextRef = cmp.getId();
                }
                else {
                    this.contextRef = null;
                }
            }
        });

        //hack to access right-click menu
        Ext.getBody().on('contextmenu', Ext.ux.AppInspector.contextFn, Ext.ux.AppInspector);

        if (!document.getElementById('_AppInspector')) {
            //create a highlighting DIV for use later
            var div = document.createElement('div');

            div.setAttribute('id', '_AppInspector');
            div.style.backgroundColor = '#f00';
            div.style.opacity = 0.5;
            div.style.visibility = 'hidden';
            div.style.position = 'absolute';

            document.body.appendChild(div);
        }

        var data = {},
            key;

        for (key in Ext.versions) {
            if (Ext.versions.hasOwnProperty(key)) {
                data[key] = Ext.versions[key].version;
            }
        }

        return data;
    }
});