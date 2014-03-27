Ext.define('My.Model.Employee', {
    extend          : 'My.Model.Resource',
    
    fields          : [
        'HourlyRate'
    ],
    
    
    calculateSalary : function (startDate, endDate) {
        return this.get('Salary') * (endDate - startDate) / 1000 * 60 * 60
    }
})