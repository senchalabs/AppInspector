/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Util.Rect', {
    
    has     : {
        left            : null,
        top             : null,
        width           : null,
        height          : null,
        
        right           : null,
        bottom          : null
    },
    
    
    methods : {
        
        initialize : function () {
            var left        = this.left
            var width       = this.width
            var right       = this.right
            
            if (right == null && left != null && width != null) this.right = left + width - 1
            
            if (width == null && left != null && right != null) this.width = right - left + 1
            
            var top         = this.top
            var height      = this.height
            var bottom      = this.bottom
            
            if (bottom == null && top != null && height != null) this.bottom = top + height - 1
            
            if (height == null && top != null && bottom != null) this.height = bottom - top + 1
        },
        
        
        isEmpty : function () {
            return this.left == null
        },
        
        
        intersect : function (rect) {
            if (
                rect.isEmpty() || this.isEmpty()
                    ||
                rect.left > this.right || rect.right < this.left
                    ||
                rect.top > this.bottom || rect.bottom < this.top
            ) return this.my.getEmpty()
            
            return new this.constructor({
                left        : Math.max(this.left, rect.left),
                right       : Math.min(this.right, rect.right),
                top         : Math.max(this.top, rect.top),
                bottom      : Math.min(this.bottom, rect.bottom)
            })
        },
        
        
        contains : function (left, top) {
            return this.left <= left && left <= this.right 
                    && 
                this.top <= top && top <= this.bottom
        },
        
        
        cropLeftRight : function (rect) {
            return this.intersect(new this.constructor({
                left        : rect.left,
                right       : rect.right,
                top         : this.top,
                bottom      : this.bottom
            }))
        },
        
        
        cropTopBottom : function (rect) {
            return this.intersect(new this.constructor({
                left        : this.left,
                right       : this.right,
                top         : rect.top,
                bottom      : rect.bottom
            }))
        },
        
        
        equalsTo : function (rect) {
            return this.left == rect.left && this.right == rect.right && this.top == rect.top && this.bottom == rect.bottom
        }
    },
    
    
    // static methods/props
    my : {
        has : {
            HOST        : null
        }, 
        
        methods : {
            
            getEmpty : function () {
                return new this.HOST()
            }
        }
    }
})
