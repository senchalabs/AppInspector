/**
 * @constructor
 * @extends {SenchaInspector.HomePanel}
 */
SenchaInspector.HomePanel = function()
{
    var me = this;
    
    SenchaInspector.Panel.apply(me, arguments);
    me.element.addEventListener('click', me.onElementClick.bind(me), false);
};

SenchaInspector.HomePanel.prototype = {
    panelId: 'home',
    
    load: function() {
        
    },
    
    showFrameworkNotFound: function() {
        this.element.innerHTML = '<h1>Sencha Framework not detected.</h1>' +
                                 '<input type="button" class="btn" value="Update" id="check-framework-btn" />';
    },
    
    index: function() {
        this.element.innerHTML = '';
    },
    
    onElementClick: function(e) {
        if (e.target.id === 'check-framework-btn') {
            e.stopEvent();
            this.element.innerHTML = '<h1>Updating...</h1>';
            window.setTimeout(function() {
                SenchaInspector.EventBus.fireEvent('check-framework');
            }, 700);    
        }
    },
    
    __proto__: SenchaInspector.Panel.prototype
};