/**
 * @class   AI.util.InspectedWindow
 * @singleton
 */
Ext.define('AI.util.InspectedWindow', {
    singleton: true,

    requires: [
        'AI.util.Error'
    ],

    /**
     * @param {String} id
     */
    highlight: function(id) {
        var cmp = Ext.getCmp(id),
            el = document.getElementById('_AppInspector'),
            box, cmpDom;

        if (cmp && cmp.rendered) {
            //Ext JS
            if (cmp.el) {
                box = cmp.el.getBox();
                cmpDom = cmp.el.dom;
            }

            //Touch
            else if (cmp.element) {
                box = cmp.element.getBox();
                cmpDom = cmp.element.dom;
            }

            Ext.apply(el.style, {
                height: box.height + 'px',
                width: box.width + 'px',

                visibility: '',
                zIndex: 99999
            });

            var getPosition = function(element) {
                var xPosition = 0;
                var yPosition = 0;

                while (element) {
                    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                    yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                    element = element.offsetParent;
                }
                return {
                    left: xPosition + 'px',
                    top: yPosition + 'px'
                };
            };

            Ext.apply(el.style, getPosition(cmpDom));

            window.setTimeout(function() {
                var el = document.getElementById('_AppInspector');

                el.style.visibility = 'hidden';
            }, 1000);
        }
    },

    /**
     * @param {Function} closure
     * @param {String/Array} argString
     * @param {Function} callback  A callback function passed two parameters:
     *
     * - result {*}: Whatever the closure function returns
     *
     * - isException {Boolean}: whether-or-not the closure function encountered an exception
     */
    eval: function(closure, argString, callback) {
        var callbackFn = callback,
            args = '';

        var encodeArg = function(arg) {
            switch (typeof arg) {
                case 'string':
                    return '"' + arg + '"';

                case 'number':
                    return arg;

                default:
                    break;
            }
        };

        //handle arrays and variable data types
        if (argString && typeof argString !== 'object') {
            args = encodeArg(argString);
        } else if (argString) {
            Ext.Array.each(argString, function(x) {
                if (args !== '') {
                    args += ', ';
                }

                args += encodeArg(x);
            });
        }

        chrome.devtools.inspectedWindow.eval(
            '(' + closure + ')(' + args + ')',
            function(result, isException) {
                if (isException) {
                    AI.util.Error.parseException(isException);
                    return;
                }

                callbackFn(result, isException);
            }
        );
    },

    /**
     * Function to get details about the application and framework including version.
     */
    getAppDetails: function() {
        if (!window.Ext) {
            return false;
        }

        //helper class
        Ext.define('Ext.ux.AppInspector', {
            singleton: true,

            //for the Event Monitor
            eventCache: null,
            eventCaptureFn: null,

            //for the Layout Run monitor
            layoutRunTotal: null,
            layoutCollection: null,
            layoutCaptureFn: null,

            //for the right-click menu
            contextRef: null,
            contextFn: function(evt, target) {
                var cmp = Ext.getCmp(target.id);

                if (cmp) {
                    this.contextRef = cmp.getId();
                } else {
                    this.contextRef = null;
                }
            }
        });

        //hack to access right-click menu
        Ext.getBody().on('contextmenu', Ext.ux.AppInspector.contextFn, Ext.ux.AppInspector);

        if (!document.getElementById('_AppInspector')) {
            //create a highlighting DIV for use later
            var div = document.createElement('div'),
                style = div.style;

            div.setAttribute('id', '_AppInspector');

            style.backgroundColor = 'rgba(121, 154, 5, 0.5)';
            style.visibility = 'hidden';
            style.position = 'absolute';

            document.body.appendChild(div);
        }

        if (!Ext.Loader || (Ext.Loader && Ext.Loader.isLoading)) {
            return {
                isLoading: true
            };
        }

        var data = {
            isMVC: false,
            versions: {}
        },
            versions = Ext.versions,
            key;

        for (key in versions) {
            if (versions.hasOwnProperty(key)) {
                data.versions[key] = versions[key].version;
            }
        }

        if (Ext.app && Ext.app.Application) {
            var instance = Ext.app.Application.instance;

            if (!instance) {
                for (key in window) {
                    if (window.hasOwnProperty(key) && window[key] && window[key].app && window[key].app.$className) {
                        //get app instance, save on Ext.app.Application.instance like Ext JS 4+ does since it couldn't find it before
                        instance = Ext.app.Application.instance = window[key].app;
                        break;
                    }
                }
            }

            if (instance && instance instanceof Ext.app.Application) {
                //flag that it is an MVC app
                data.isMVC = true;

                //get app name
                data.name = instance.getName ? instance.getName() : instance.name;
            }
        }

        return data;
    }
});
