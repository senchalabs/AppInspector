/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Singleton('Siesta.Test.ActionRegistry', {
    
    has : {
        actionClasses       : Joose.I.Object,
        
        targetShortcuts     : function () {
            return [ 
                'waitFor', 
                'click', 
                'rightClick', 
                'doubleClick', 
                'dblClick',
                'doubleTap', 
                'drag', 
                'longpress', 
                'mouseDown', 
                'mouseUp', 
                'moveCursorTo', 
                'swipe', 
                'tap', 
                'type' 
            ]
        }
    },

    
    methods : {
        
        registerAction : function (name, constructor) {
            this.actionClasses[ name.toLowerCase() ] = constructor
        },

        
        getActionClass : function (name) {
            return this.actionClasses[ name.toLowerCase() ]
        },
        
        
        create : function (obj) {
            if (obj !== Object(obj)) throw "Action configuration should be an Object instance"
            
            if (!obj.action) {
                var lowerCasedKeys      = {}
                
                Joose.O.eachOwn(obj, function (value, key) {
                    lowerCasedKeys[ key.toLowerCase() ] = key
                })
                
                var me                  = this
                
                Joose.A.each(this.targetShortcuts, function (shortcut) {
                    shortcut            = shortcut.toLowerCase()
                    
                    if (lowerCasedKeys.hasOwnProperty(shortcut)) {
                        obj.action      = shortcut
                        
                        switch (shortcut) {
                            case 'waitfor'  : 
                            // do nothing 
                            break
                            
                            case 'type'     :
                                obj.text        = obj[ lowerCasedKeys[ shortcut ] ]
                            break
                                
                            default         : 
                                obj.target      = obj[ lowerCasedKeys[ shortcut ] ]
                        }
                        
                        return false
                    }
                })
            }
            
            if (!obj.action) throw "Need to include `action` property or shortcut property in the step config"
            
            var actionClass = this.getActionClass(obj.action)

            return new actionClass(obj)
        }
    }
});
