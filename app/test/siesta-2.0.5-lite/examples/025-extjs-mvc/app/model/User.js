Ext.define('AM.model.User', {
    extend: 'Ext.data.Model',
    fields: ['id', 'firstname', 'lastname', 'email'],

    getFullName : function() {
        return this.get('firstname') + ' ' + this.get('lastname');
    },

    validateEmail : function() {
        return this.get('email');
    }
});
