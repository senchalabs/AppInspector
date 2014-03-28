Class('YourTestClass', {

    isa     : Siesta.Test,
    
    has     : {
        attribute1    : null,
        attribute2    : 'foo',
        attribute3    : 11,
        
        attribute4    : {
            init    : {
                foo     : 'bar'
            }
        },
        
        // will be initialized with empty array
        attribute5    : Joose.I.Array,
        
        // will be initialized with empty object
        attribute6    : Joose.I.Object
    },
    
    
    methods: {
        
        getFooBar : function () {
            return this.getFoo() + this.getBar()
        },
        
        
        getFoo : function () {
            return 'foo'
        },
        
        
        getBar : function () {
            return 'bar'
        }
    }
});

if (typeof module != 'undefined') module.exports = YourTestClass