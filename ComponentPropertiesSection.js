/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 * Copyright (C) 2009 Joseph Pecoraro
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @constructor
 * @extends {SenchaInspector.PropertiesSection}
 * @param {SenchaInspector.RemoteObject} object
 * @param {?string|Element=} title
 * @param {string=} subtitle
 * @param {?string=} emptyPlaceholder
 * @param {boolean=} ignoreHasOwnProperty
 * @param {Array.<SenchaInspector.RemoteObjectProperty>=} extraProperties
 * @param {function(new:TreeElement, SenchaInspector.RemoteObjectProperty)=} treeElementConstructor
 */
SenchaInspector.ComponentPropertiesSection = function(object, title, subtitle, emptyPlaceholder, ignoreHasOwnProperty, extraProperties, treeElementConstructor)
{
    this.emptyPlaceholder = (emptyPlaceholder || "No Properties");
    this.object = object;
    this.ignoreHasOwnProperty = ignoreHasOwnProperty;
    this.extraProperties = extraProperties;
    this.treeElementConstructor = treeElementConstructor || SenchaInspector.ObjectPropertyTreeElement;
    this.editable = true;
    this.skipProto = false;

    this.element = document.createElement("div");
    this.element.className = "section";
    this.element._section = this;

    this.headerElement = document.createElement("div");
    this.headerElement.className = "header";

    this.titleElement = document.createElement("div");
    this.titleElement.className = "title";

    this.subtitleElement = document.createElement("div");
    this.subtitleElement.className = "subtitle";

    this.headerElement.appendChild(this.subtitleElement);
    this.headerElement.appendChild(this.titleElement);

    this.headerElement.addEventListener("click", this.handleClick.bind(this), false);
    this.element.appendChild(this.headerElement);

    this.title = title;
    this.subtitle = subtitle;
    this._expanded = false;

    this.headerElement.addStyleClass("monospace");
    this.propertiesElement = document.createElement("ol");
    this.propertiesElement.className = "properties properties-tree monospace";
    this.propertiesTreeOutline = new TreeOutline(this.propertiesElement, true);
    this.propertiesTreeOutline.setFocusable(false);
    this.propertiesTreeOutline.section = this;

    this.element.appendChild(this.propertiesElement);
}

SenchaInspector.ComponentPropertiesSection._arrayLoadThreshold = 100;

SenchaInspector.ComponentPropertiesSection.prototype = {
    enableContextMenu: function()
    {
        this.element.addEventListener("contextmenu", this._contextMenuEventFired.bind(this), false);
    },

    _contextMenuEventFired: function(event)
    {
        var contextMenu = new SenchaInspector.ContextMenu(event);
        contextMenu.appendApplicableItems(this.object);
        contextMenu.show();
    },

    onpopulate: function()
    {
        this.update();
    },

    update: function()
    {
        var properties = [{
            enumerable: false,
            getter: {
                _description: "function __proto__() { [native code] }",
                _hasChildren: true,
                _objectId: '"{"injectedScriptId":38,"id":26}"',
                _preview: undefined,
                _subtype: undefined,
                _type: "function",
                description: "function __proto__() { [native code] }",
                hasChildren: true,
                objectId: '"{"injectedScriptId":38,"id":26}"',
                preview: undefined,
                subtype: undefined,
                type: "function"
            },
            isOwn: undefined,
            name: "__proto__",
            setter: {
                _description: "function __proto__() { [native code] }",
                _hasChildren: true,
                _objectId: '"{"injectedScriptId":38,"id":27}"',
                _preview: undefined,
                _subtype: undefined,
                _type: "function",
                description: "function __proto__() { [native code] }",
                hasChildren: true,
                objectId: '"{"injectedScriptId":38,"id":27}"',
                preview: undefined,
                subtype: undefined,
                type: "function"
            },
            wasThrown: false,
            writable: false,
            isAccessorProperty: function()
            {
                return this.getter || this.setter;
            }
        },{
            enumerable: true,
            isOwn: true,
            name: "NOTATION_NODE",
            value: {
                _description: "12",
                _hasChildren: true,
                _subtype: undefined,
                _type: "number",
                _value: 12,
                description: "12",
                hasChildren: false,
                subtype: undefined,
                type: "number",
                value: 12,
            },
            wasThrown: false,
            writable: false,
            isAccessorProperty: function()
            {
                return this.getter || this.setter;
            }
        }];
        
        this.updateProperties(properties, null);
    },

    updateProperties: function(properties, internalProperties, rootTreeElementConstructor, rootPropertyComparer)
    {
        
        
        
        if (!rootTreeElementConstructor)
            rootTreeElementConstructor = this.treeElementConstructor;

        if (!rootPropertyComparer)
            rootPropertyComparer = SenchaInspector.ComponentPropertiesSection.CompareProperties;

        if (this.extraProperties) {
            for (var i = 0; i < this.extraProperties.length; ++i)
                properties.push(this.extraProperties[i]);
        }

        this.propertiesTreeOutline.removeChildren();

        SenchaInspector.ObjectPropertyTreeElement.populateWithProperties(this.propertiesTreeOutline,
            properties, internalProperties,
            rootTreeElementConstructor, rootPropertyComparer,
            this.skipProto, this.object);

        this.propertiesForTest = properties;

        if (!this.propertiesTreeOutline.children.length) {
            var title = document.createElement("div");
            title.className = "info";
            title.textContent = this.emptyPlaceholder;
            var infoElement = new TreeElement(title, null, false);
            this.propertiesTreeOutline.appendChild(infoElement);
        }
    },

        get title()
    {
        return this._title;
    },

    set title(x)
    {
        if (this._title === x)
            return;
        this._title = x;

        if (x instanceof Node) {
            this.titleElement.removeChildren();
            this.titleElement.appendChild(x);
        } else
          this.titleElement.textContent = x;
    },

    get subtitle()
    {
        return this._subtitle;
    },

    set subtitle(x)
    {
        if (this._subtitle === x)
            return;
        this._subtitle = x;
        this.subtitleElement.textContent = x;
    },

    get subtitleAsTextForTest()
    {
        var result = this.subtitleElement.textContent;
        var child = this.subtitleElement.querySelector("[data-uncopyable]");
        if (child) {
            var linkData = child.getAttribute("data-uncopyable");
            if (linkData)
                result += linkData;
        }
        return result;
    },

    get expanded()
    {
        return this._expanded;
    },

    set expanded(x)
    {
        if (x)
            this.expand();
        else
            this.collapse();
    },

    get populated()
    {
        return this._populated;
    },

    set populated(x)
    {
        this._populated = x;
        if (!x && this._expanded) {
            this.onpopulate();
            this._populated = true;
        }
    },

    get firstSibling()
    {
        var parent = this.element.parentElement;
        if (!parent)
            return null;

        var childElement = parent.firstChild;
        while (childElement) {
            if (childElement._section)
                return childElement._section;
            childElement = childElement.nextSibling;
        }

        return null;
    },

    get lastSibling()
    {
        var parent = this.element.parentElement;
        if (!parent)
            return null;

        var childElement = parent.lastChild;
        while (childElement) {
            if (childElement._section)
                return childElement._section;
            childElement = childElement.previousSibling;
        }

        return null;
    },

    get nextSibling()
    {
        var curElement = this.element;
        do {
            curElement = curElement.nextSibling;
        } while (curElement && !curElement._section);

        return curElement ? curElement._section : null;
    },

    get previousSibling()
    {
        var curElement = this.element;
        do {
            curElement = curElement.previousSibling;
        } while (curElement && !curElement._section);

        return curElement ? curElement._section : null;
    },

    expand: function()
    {
        if (this._expanded)
            return;
        this._expanded = true;
        this.element.addStyleClass("expanded");

        if (!this._populated) {
            this.onpopulate();
            this._populated = true;
        }
    },

    collapse: function()
    {
        if (!this._expanded)
            return;
        this._expanded = false;
        this.element.removeStyleClass("expanded");
    },

    toggleExpanded: function()
    {
        this.expanded = !this.expanded;
    },

    handleClick: function(event)
    {
        this.toggleExpanded();
        event.consume();
    }
}

/**
 * @param {SenchaInspector.RemoteObjectProperty} propertyA
 * @param {SenchaInspector.RemoteObjectProperty} propertyB
 * @return {number}
 */
SenchaInspector.ComponentPropertiesSection.CompareProperties = function(propertyA, propertyB)
{
    var a = propertyA.name;
    var b = propertyB.name;
    if (a === "__proto__")
        return 1;
    if (b === "__proto__")
        return -1;
    return String.naturalOrderComparator(a, b);
}

/**
 * @constructor
 * @extends {TreeElement}
 * @param {SenchaInspector.RemoteObjectProperty} property
 */
SenchaInspector.ObjectPropertyTreeElement = function(property)
{
    this.property = property;

    // Pass an empty title, the title gets made later in onattach.
    TreeElement.call(this, "", null, false);
    this.toggleOnClick = true;
    this.selectable = false;
}

SenchaInspector.ObjectPropertyTreeElement.prototype = {
    onpopulate: function()
    {
        return SenchaInspector.ObjectPropertyTreeElement.populate(this, this.property.value);
    },

    ondblclick: function(event)
    {
        if (this.property.writable || this.property.setter)
            this.startEditing(event);
    },

    onattach: function()
    {
        this.update();
    },

    update: function()
    {
        this.nameElement = document.createElement("span");
        this.nameElement.className = "name";
        this.nameElement.textContent = this.property.name;
        if (!this.property.enumerable)
            this.nameElement.addStyleClass("dimmed");
        if (this.property.isAccessorProperty())
            this.nameElement.addStyleClass("properties-accessor-property-name");


        var separatorElement = document.createElement("span");
        separatorElement.className = "separator";
        separatorElement.textContent = ": ";

        if (this.property.value) {
            this.valueElement = document.createElement("span");
            this.valueElement.className = "value";
            var description = this.property.value.description;
            // Render \n as a nice unicode cr symbol.
            if (this.property.wasThrown)
                this.valueElement.textContent = "[Exception: " + description + "]";
            else if (this.property.value.type === "string" && typeof description === "string") {
                this.valueElement.textContent = "\"" + description.replace(/\n/g, "\u21B5") + "\"";
                this.valueElement._originalTextContent = "\"" + description + "\"";
            } else if (this.property.value.type === "function" && typeof description === "string") {
                this.valueElement.textContent = /.*/.exec(description)[0].replace(/ +$/g, "");
                this.valueElement._originalTextContent = description;
            } else if (this.property.value.type !== "object" || this.property.value.subtype !== "node")
                this.valueElement.textContent = description;

            if (this.property.wasThrown)
                this.valueElement.addStyleClass("error");
            if (this.property.value.subtype)
                this.valueElement.addStyleClass("console-formatted-" + this.property.value.subtype);
            else if (this.property.value.type)
                this.valueElement.addStyleClass("console-formatted-" + this.property.value.type);

            this.valueElement.addEventListener("contextmenu", this._contextMenuFired.bind(this, this.property.value), false);
            if (this.property.value.type === "object" && this.property.value.subtype === "node" && this.property.value.description) {
                SenchaInspector.DOMPresentationUtils.createSpansForNodeTitle(this.valueElement, this.property.value.description);
                this.valueElement.addEventListener("mousemove", this._mouseMove.bind(this, this.property.value), false);
                this.valueElement.addEventListener("mouseout", this._mouseOut.bind(this, this.property.value), false);
            } else
                this.valueElement.title = description || "";

            this.listItemElement.removeChildren();

            this.hasChildren = this.property.value.hasChildren && !this.property.wasThrown;
        } else {
            if (this.property.getter) {
                this.valueElement = document.createElement("span");
                this.valueElement.addStyleClass("properties-calculate-value-button");
                this.valueElement.textContent = "(...)";
                this.valueElement.title = "Invoke property getter";
                this.valueElement.addEventListener("click", this._onInvokeGetterClick.bind(this), false);
            } else {
                this.valueElement = document.createElement("span");
                this.valueElement.textContent = "<unreadable>"
            }
        }

        this.listItemElement.appendChild(this.nameElement);
        this.listItemElement.appendChild(separatorElement);
        this.listItemElement.appendChild(this.valueElement);
    },

    _contextMenuFired: function(value, event)
    {
        var contextMenu = new SenchaInspector.ContextMenu(event);
        this.populateContextMenu(contextMenu);
        contextMenu.appendApplicableItems(value);
        contextMenu.show();
    },

    /**
     * @param {SenchaInspector.ContextMenu} contextMenu
     */
    populateContextMenu: function(contextMenu)
    {
    },

    _mouseMove: function(event)
    {
        this.property.value.highlightAsDOMNode();
    },

    _mouseOut: function(event)
    {
        this.property.value.hideDOMNodeHighlight();
    },

    updateSiblings: function()
    {
        if (this.parent.root)
            this.treeOutline.section.update();
        else
            this.parent.shouldRefreshChildren = true;
    },

    renderPromptAsBlock: function()
    {
        return false;
    },

    /**
     * @param {Event=} event
     */
    elementAndValueToEdit: function(event)
    {
        return [this.valueElement, (typeof this.valueElement._originalTextContent === "string") ? this.valueElement._originalTextContent : undefined];
    },

    startEditing: function(event)
    {
        var elementAndValueToEdit = this.elementAndValueToEdit(event);
        var elementToEdit = elementAndValueToEdit[0];
        var valueToEdit = elementAndValueToEdit[1];

        if (SenchaInspector.isBeingEdited(elementToEdit) || !this.treeOutline.section.editable || this._readOnly)
            return;

        // Edit original source.
        if (typeof valueToEdit !== "undefined")
            elementToEdit.textContent = valueToEdit;

        var context = { expanded: this.expanded, elementToEdit: elementToEdit, previousContent: elementToEdit.textContent };

        // Lie about our children to prevent expanding on double click and to collapse subproperties.
        this.hasChildren = false;

        this.listItemElement.addStyleClass("editing-sub-part");

        this._prompt = new SenchaInspector.ObjectPropertyPrompt(this.editingCommitted.bind(this, null, elementToEdit.textContent, context.previousContent, context), this.editingCancelled.bind(this, null, context), this.renderPromptAsBlock());

        function blurListener()
        {
            this.editingCommitted(null, elementToEdit.textContent, context.previousContent, context);
        }

        var proxyElement = this._prompt.attachAndStartEditing(elementToEdit, blurListener.bind(this));
        window.getSelection().setBaseAndExtent(elementToEdit, 0, elementToEdit, 1);
        proxyElement.addEventListener("keydown", this._promptKeyDown.bind(this, context), false);
    },

    /**
     * @return {boolean}
     */
    isEditing: function()
    {
        return !!this._prompt;
    },

    editingEnded: function(context)
    {
        this._prompt.detach();
        delete this._prompt;

        this.listItemElement.scrollLeft = 0;
        this.listItemElement.removeStyleClass("editing-sub-part");
        if (context.expanded)
            this.expand();
    },

    editingCancelled: function(element, context)
    {
        this.editingEnded(context);
        this.update();
    },

    editingCommitted: function(element, userInput, previousContent, context)
    {
        if (userInput === previousContent)
            return this.editingCancelled(element, context); // nothing changed, so cancel

        this.editingEnded(context);
        this.applyExpression(userInput, true);
    },

    _promptKeyDown: function(context, event)
    {
        if (isEnterKey(event)) {
            event.consume(true);
            return this.editingCommitted(null, context.elementToEdit.textContent, context.previousContent, context);
        }
        if (event.keyIdentifier === "U+001B") { // Esc
            event.consume();
            return this.editingCancelled(null, context);
        }
    },

    applyExpression: function(expression, updateInterface)
    {
        expression = expression.trim();
        var expressionLength = expression.length;
        function callback(error)
        {
            if (!updateInterface)
                return;

            if (error)
                this.update();

            if (!expressionLength) {
                // The property was deleted, so remove this tree element.
                this.parent.removeChild(this);
            } else {
                // Call updateSiblings since their value might be based on the value that just changed.
                this.updateSiblings();
            }
        };
        this.property.parentObject.setPropertyValue(this.property.name, expression.trim(), callback.bind(this));
    },

    propertyPath: function()
    {
        if ("_cachedPropertyPath" in this)
            return this._cachedPropertyPath;

        var current = this;
        var result;

        do {
            if (current.property) {
                if (result)
                    result = current.property.name + "." + result;
                else
                    result = current.property.name;
            }
            current = current.parent;
        } while (current && !current.root);

        this._cachedPropertyPath = result;
        return result;
    },

    _onInvokeGetterClick: function(event)
    {
        /**
         * @param {?Protocol.Error} error
         * @param {RuntimeAgent.RemoteObject} result
         * @param {boolean=} wasThrown
         */
        function evaluateCallback(error, result, wasThrown)
        {
            if (error)
                return;
            var remoteObject = SenchaInspector.RemoteObject.fromPayload(result);
            this.property.value = remoteObject;
            this.property.wasThrown = wasThrown;

            this.update();
            this.shouldRefreshChildren = true;
        }

        event.consume();

        if (!this.property.getter)
            return;

        var functionText = "function(th){return this.call(th);}"
        var functionArguments = [ {objectId: this.property.parentObject.objectId} ]
        RuntimeAgent.callFunctionOn(this.property.getter.objectId, functionText, functionArguments,
            undefined, false, undefined, evaluateCallback.bind(this));
    },

    __proto__: TreeElement.prototype
}

/**
 * @param {TreeElement} treeElement
 * @param {SenchaInspector.RemoteObject} value
 */
SenchaInspector.ObjectPropertyTreeElement.populate = function(treeElement, value) {
    if (treeElement.children.length && !treeElement.shouldRefreshChildren)
        return;

    if (value.arrayLength() > SenchaInspector.ComponentPropertiesSection._arrayLoadThreshold) {
        treeElement.removeChildren();
        SenchaInspector.ArrayGroupingTreeElement._populateArray(treeElement, value, 0, value.arrayLength() - 1);
        return;
    }

    /**
     * @param {Array.<SenchaInspector.RemoteObjectProperty>=} properties
     * @param {Array.<SenchaInspector.RemoteObjectProperty>=} internalProperties
     */
    function callback(properties, internalProperties)
    {
        treeElement.removeChildren();
        if (!properties)
            return;
        if (!internalProperties)
            internalProperties = [];

        SenchaInspector.ObjectPropertyTreeElement.populateWithProperties(treeElement, properties, internalProperties,
            treeElement.treeOutline.section.treeElementConstructor, SenchaInspector.ComponentPropertiesSection.CompareProperties,
            treeElement.treeOutline.section.skipProto, value);
    }

    SenchaInspector.RemoteObject.loadFromObjectPerProto(value, callback);
}

/**
 * @param {!TreeElement|!TreeOutline} treeElement
 * @param {Array.<!SenchaInspector.RemoteObjectProperty>} properties
 * @param {?Array.<!SenchaInspector.RemoteObjectProperty>} internalProperties
 * @param {function(new:TreeElement, SenchaInspector.RemoteObjectProperty)} treeElementConstructor
 * @param {function (SenchaInspector.RemoteObjectProperty, SenchaInspector.RemoteObjectProperty): number} comparator
 * @param {boolean} skipProto
 * @param {?SenchaInspector.RemoteObject} value
 */
SenchaInspector.ObjectPropertyTreeElement.populateWithProperties = function(treeElement, properties, internalProperties, treeElementConstructor, comparator, skipProto, value) {
    properties.sort(comparator);

    for (var i = 0; i < properties.length; ++i) {
        var property = properties[i];
        if (skipProto && property.name === "__proto__")
            continue;
        if (property.isAccessorProperty()) {
            if (property.name !== "__proto__" && property.getter) {
                property.parentObject = value;
                treeElement.appendChild(new treeElementConstructor(property));
            }
            if (property.isOwn) {
                if (property.getter) {
                    var getterProperty = new SenchaInspector.RemoteObjectProperty("get " + property.name, property.getter);
                    getterProperty.parentObject = value;
                    treeElement.appendChild(new treeElementConstructor(getterProperty));
                }
                if (property.setter) {
                    var setterProperty = new SenchaInspector.RemoteObjectProperty("set " + property.name, property.setter);
                    setterProperty.parentObject = value;
                    treeElement.appendChild(new treeElementConstructor(setterProperty));
                }
            }
        } else {
            property.parentObject = value;
            treeElement.appendChild(new treeElementConstructor(property));
        }
    }
    if (value && value.type === "function") {
        // Whether function has TargetFunction internal property.
        // This is a simple way to tell that the function is actually a bound function (we are not told).
        // Bound function never has inner scope and doesn't need corresponding UI node.
        var hasTargetFunction = false;

        if (internalProperties) {
            for (var i = 0; i < internalProperties.length; i++) {
                if (internalProperties[i].name == "[[TargetFunction]]") {
                    hasTargetFunction = true;
                    break;
                }
            }
        }
        if (!hasTargetFunction)
            treeElement.appendChild(new SenchaInspector.FunctionScopeMainTreeElement(value));
    }
    if (internalProperties) {
        for (var i = 0; i < internalProperties.length; i++) {
            internalProperties[i].parentObject = value;
            treeElement.appendChild(new treeElementConstructor(internalProperties[i]));
        }
    }
}

/**
 * @constructor
 * @extends {TreeElement}
 * @param {SenchaInspector.RemoteObject} remoteObject
 */
SenchaInspector.FunctionScopeMainTreeElement = function(remoteObject)
{
    TreeElement.call(this, "<function scope>", null, false);
    this.toggleOnClick = true;
    this.selectable = false;
    this._remoteObject = remoteObject;
    this.hasChildren = true;
}

SenchaInspector.FunctionScopeMainTreeElement.prototype = {
    onpopulate: function()
    {
        if (this.children.length && !this.shouldRefreshChildren)
            return;

        function didGetDetails(error, response)
        {
            if (error) {
                console.error(error);
                return;
            }
            this.removeChildren();

            var scopeChain = response.scopeChain;
            if (!scopeChain)
                return;
            for (var i = 0; i < scopeChain.length; ++i) {
                var scope = scopeChain[i];
                var title = null;
                var isTrueObject;

                switch (scope.type) {
                    case "local":
                        // Not really expecting this scope type here.
                        title = "Local";
                        isTrueObject = false;
                        break;
                    case "closure":
                        title = "Closure";
                        isTrueObject = false;
                        break;
                    case "catch":
                        title = "Catch";
                        isTrueObject = false;
                        break;
                    case "with":
                        title = "With Block";
                        isTrueObject = true;
                        break;
                    case "global":
                        title = "Global";
                        isTrueObject = true;
                        break;
                    default:
                        console.error("Unknown scope type: " + scope.type);
                        continue;
                }

                var scopeRef;
                if (isTrueObject)
                    scopeRef = undefined;
                else
                    scopeRef = new SenchaInspector.ScopeRef(i, undefined, this._remoteObject.objectId);

                var remoteObject = SenchaInspector.ScopeRemoteObject.fromPayload(scope.object, scopeRef);
                if (isTrueObject) {
                    var property = SenchaInspector.RemoteObjectProperty.fromScopeValue(title, remoteObject);
                    property.parentObject = null;
                    this.appendChild(new this.treeOutline.section.treeElementConstructor(property));
                } else {
                    var scopeTreeElement = new SenchaInspector.ScopeTreeElement(title, null, remoteObject);
                    this.appendChild(scopeTreeElement);
                }
            }

        }
        DebuggerAgent.getFunctionDetails(this._remoteObject.objectId, didGetDetails.bind(this));
    },

    __proto__: TreeElement.prototype
}

/**
 * @constructor
 * @extends {TreeElement}
 * @param {SenchaInspector.RemoteObject} remoteObject
 */
SenchaInspector.ScopeTreeElement = function(title, subtitle, remoteObject)
{
    // TODO: use subtitle parameter.
    TreeElement.call(this, title, null, false);
    this.toggleOnClick = true;
    this.selectable = false;
    this._remoteObject = remoteObject;
    this.hasChildren = true;
}

SenchaInspector.ScopeTreeElement.prototype = {
    onpopulate: function()
    {
        return SenchaInspector.ObjectPropertyTreeElement.populate(this, this._remoteObject);
    },

    __proto__: TreeElement.prototype
}

/**
 * @constructor
 * @extends {TreeElement}
 * @param {SenchaInspector.RemoteObject} object
 * @param {number} fromIndex
 * @param {number} toIndex
 * @param {number} propertyCount
 */
SenchaInspector.ArrayGroupingTreeElement = function(object, fromIndex, toIndex, propertyCount)
{
    TreeElement.call(this, String.sprintf("[%d \u2026 %d]", fromIndex, toIndex), undefined, true);
    this._fromIndex = fromIndex;
    this._toIndex = toIndex;
    this._object = object;
    this._readOnly = true;
    this._propertyCount = propertyCount;
    this._populated = false;
}

SenchaInspector.ArrayGroupingTreeElement._bucketThreshold = 100;
SenchaInspector.ArrayGroupingTreeElement._sparseIterationThreshold = 250000;

/**
 * @param {TreeElement|TreeOutline} treeElement
 * @param {SenchaInspector.RemoteObject} object
 * @param {number} fromIndex
 * @param {number} toIndex
 */
SenchaInspector.ArrayGroupingTreeElement._populateArray = function(treeElement, object, fromIndex, toIndex)
{
    SenchaInspector.ArrayGroupingTreeElement._populateRanges(treeElement, object, fromIndex, toIndex, true);
}

/**
 * @param {TreeElement|TreeOutline} treeElement
 * @param {SenchaInspector.RemoteObject} object
 * @param {number} fromIndex
 * @param {number} toIndex
 * @param {boolean} topLevel
 */
SenchaInspector.ArrayGroupingTreeElement._populateRanges = function(treeElement, object, fromIndex, toIndex, topLevel)
{
    object.callFunctionJSON(packRanges, [{value: fromIndex}, {value: toIndex}, {value: SenchaInspector.ArrayGroupingTreeElement._bucketThreshold}, {value: SenchaInspector.ArrayGroupingTreeElement._sparseIterationThreshold}], callback.bind(this));

    /**
     * @this {Object}
     * @param {number=} fromIndex // must declare optional
     * @param {number=} toIndex // must declare optional
     * @param {number=} bucketThreshold // must declare optional
     * @param {number=} sparseIterationThreshold // must declare optional
     */
    function packRanges(fromIndex, toIndex, bucketThreshold, sparseIterationThreshold)
    {
        var ownPropertyNames = null;
        function doLoop(iterationCallback)
        {
            if (toIndex - fromIndex < sparseIterationThreshold) {
                for (var i = fromIndex; i <= toIndex; ++i) {
                    if (i in this)
                        iterationCallback(i);
                }
            } else {
                ownPropertyNames = ownPropertyNames || Object.getOwnPropertyNames(this);
                for (var i = 0; i < ownPropertyNames.length; ++i) {
                    var name = ownPropertyNames[i];
                    var index = name >>> 0;
                    if (String(index) === name && fromIndex <= index && index <= toIndex)
                        iterationCallback(index);
                }
            }
        }

        var count = 0;
        function countIterationCallback()
        {
            ++count;
        }
        doLoop.call(this, countIterationCallback);

        var bucketSize = count;
        if (count <= bucketThreshold)
            bucketSize = count;
        else
            bucketSize = Math.pow(bucketThreshold, Math.ceil(Math.log(count) / Math.log(bucketThreshold)) - 1);

        var ranges = [];
        count = 0;
        var groupStart = -1;
        var groupEnd = 0;
        function loopIterationCallback(i)
        {
            if (groupStart === -1)
                groupStart = i;

            groupEnd = i;
            if (++count === bucketSize) {
                ranges.push([groupStart, groupEnd, count]);
                count = 0;
                groupStart = -1;
            }
        }
        doLoop.call(this, loopIterationCallback);

        if (count > 0)
            ranges.push([groupStart, groupEnd, count]);
        return ranges;
    }

    function callback(ranges)
    {
        if (ranges.length == 1)
            SenchaInspector.ArrayGroupingTreeElement._populateAsFragment(treeElement, object, ranges[0][0], ranges[0][1]);
        else {
            for (var i = 0; i < ranges.length; ++i) {
                var fromIndex = ranges[i][0];
                var toIndex = ranges[i][1];
                var count = ranges[i][2];
                if (fromIndex == toIndex)
                    SenchaInspector.ArrayGroupingTreeElement._populateAsFragment(treeElement, object, fromIndex, toIndex);
                else
                    treeElement.appendChild(new SenchaInspector.ArrayGroupingTreeElement(object, fromIndex, toIndex, count));
            }
        }
        if (topLevel)
            SenchaInspector.ArrayGroupingTreeElement._populateNonIndexProperties(treeElement, object);
    }
}

/**
 * @param {TreeElement|TreeOutline} treeElement
 * @param {SenchaInspector.RemoteObject} object
 * @param {number} fromIndex
 * @param {number} toIndex
 */
SenchaInspector.ArrayGroupingTreeElement._populateAsFragment = function(treeElement, object, fromIndex, toIndex)
{
    object.callFunction(buildArrayFragment, [{value: fromIndex}, {value: toIndex}, {value: SenchaInspector.ArrayGroupingTreeElement._sparseIterationThreshold}], processArrayFragment.bind(this));

    /**
     * @this {Object}
     * @param {number=} fromIndex // must declare optional
     * @param {number=} toIndex // must declare optional
     * @param {number=} sparseIterationThreshold // must declare optional
     */
    function buildArrayFragment(fromIndex, toIndex, sparseIterationThreshold)
    {
        var result = Object.create(null);
        if (toIndex - fromIndex < sparseIterationThreshold) {
            for (var i = fromIndex; i <= toIndex; ++i) {
                if (i in this)
                    result[i] = this[i];
            }
        } else {
            var ownPropertyNames = Object.getOwnPropertyNames(this);
            for (var i = 0; i < ownPropertyNames.length; ++i) {
                var name = ownPropertyNames[i];
                var index = name >>> 0;
                if (String(index) === name && fromIndex <= index && index <= toIndex)
                    result[index] = this[index];
            }
        }
        return result;
    }

    /** @this {SenchaInspector.ArrayGroupingTreeElement} */
    function processArrayFragment(arrayFragment)
    {
        arrayFragment.getAllProperties(false, processProperties.bind(this));
    }

    /** @this {SenchaInspector.ArrayGroupingTreeElement} */
    function processProperties(properties, internalProperties)
    {
        if (!properties)
            return;

        properties.sort(SenchaInspector.ComponentPropertiesSection.CompareProperties);
        for (var i = 0; i < properties.length; ++i) {
            properties[i].parentObject = this._object;
            var childTreeElement = new treeElement.treeOutline.section.treeElementConstructor(properties[i]);
            childTreeElement._readOnly = true;
            treeElement.appendChild(childTreeElement);
        }
    }
}

/**
 * @param {TreeElement|TreeOutline} treeElement
 * @param {SenchaInspector.RemoteObject} object
 */
SenchaInspector.ArrayGroupingTreeElement._populateNonIndexProperties = function(treeElement, object)
{
    object.callFunction(buildObjectFragment, undefined, processObjectFragment.bind(this));

    /** @this {Object} */
    function buildObjectFragment()
    {
        var result = Object.create(this.__proto__);
        var names = Object.getOwnPropertyNames(this);
        for (var i = 0; i < names.length; ++i) {
            var name = names[i];
            // Array index check according to the ES5-15.4.
            if (String(name >>> 0) === name && name >>> 0 !== 0xffffffff)
                continue;
            var descriptor = Object.getOwnPropertyDescriptor(this, name);
            if (descriptor)
                Object.defineProperty(result, name, descriptor);
        }
        return result;
    }

    function processObjectFragment(arrayFragment)
    {
        arrayFragment.getOwnProperties(processProperties.bind(this));
    }

    /** @this {SenchaInspector.ArrayGroupingTreeElement} */
    function processProperties(properties, internalProperties)
    {
        if (!properties)
            return;

        properties.sort(SenchaInspector.ComponentPropertiesSection.CompareProperties);
        for (var i = 0; i < properties.length; ++i) {
            properties[i].parentObject = this._object;
            var childTreeElement = new treeElement.treeOutline.section.treeElementConstructor(properties[i]);
            childTreeElement._readOnly = true;
            treeElement.appendChild(childTreeElement);
        }
    }
}

SenchaInspector.ArrayGroupingTreeElement.prototype = {
    onpopulate: function()
    {
        if (this._populated)
            return;

        this._populated = true;

        if (this._propertyCount >= SenchaInspector.ArrayGroupingTreeElement._bucketThreshold) {
            SenchaInspector.ArrayGroupingTreeElement._populateRanges(this, this._object, this._fromIndex, this._toIndex, false);
            return;
        }
        SenchaInspector.ArrayGroupingTreeElement._populateAsFragment(this, this._object, this._fromIndex, this._toIndex);
    },

    onattach: function()
    {
        this.listItemElement.addStyleClass("name");
    },

    __proto__: TreeElement.prototype
}

/**
 * @constructor
 * @extends {SenchaInspector.TextPrompt}
 * @param {boolean=} renderAsBlock
 */
SenchaInspector.ObjectPropertyPrompt = function(commitHandler, cancelHandler, renderAsBlock)
{
    SenchaInspector.TextPrompt.call(this, SenchaInspector.runtimeModel.completionsForTextPrompt.bind(SenchaInspector.runtimeModel));
    this.setSuggestBoxEnabled("generic-suggest");
    if (renderAsBlock)
        this.renderAsBlock();
}