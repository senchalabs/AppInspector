StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setup')

    Ext.define('Task', {
        extend  : 'Ext.data.Model',
        
        idProperty  : 'Id',
        
        fields      : [
            { name : 'StartDate', type : 'date', dateFormat : 'MS'}, 
            { name : 'EndDate', type : 'date', dateFormat : 'MS'},
            'Name',
            'Id'
        ]
    });
    
    Ext.define('Dependency', {
        extend  : 'Ext.data.Model',
        
        fields      : [
            "From",
            "To",
            "Id",
            "Type"
        ]
    });
    
    
    t.expectGlobals('Task', 'Dependency');
    
    
    var taskStore = Ext.create("Ext.data.Store", {
        model       : 'Task',
        
        proxy       : {
            type    : 'ajax',
            
            api     : {
                create  : 'crud/create-tasks.aspx',
                read    : 'crud/get-tasks.aspx',
                update  : 'crud/update-tasks.aspx',
                destroy : 'crud/delete-tasks.aspx'
            },
            
            actionMethods : {
                create  : 'GET',
                read    : 'GET',
                update  : 'GET',
                destroy : 'GET'
            },
            
            reader  : {
                type    : 'json'
            }
        }
    });
    
    var dependencyStore = Ext.create("Ext.data.Store", {
        model       : 'Dependency',
        
        proxy       : {
            type    : 'ajax',
            url     : 'crud/get-dependencies.aspx',
            method  : 'GET',
            reader  : {
                type    : 'json'
            }
        }
    });
    
    
    
    t.loadStoresAndThen(taskStore, dependencyStore, function () {

        t.is(taskStore.getCount(),  7, '7 tasks loaded')
        t.isGreater(dependencyStore.getCount(), 0, 'There are some dependencies')
        
        t.ok(!taskStore.getById(122), 'No new record yet')
        
        // doing CREATE operation
        taskStore.add({
            StartDate       : new Date(1266872400000),
            EndDate         : new Date(1266958800000)
        })
        
        t.is(taskStore.getNewRecords().length, 1, '1 records has been added')
        
        var async1 = t.beginAsync()
        
        // CREATE listener
        taskStore.on('write', function (store, operation) {
            
            t.is(operation.action, 'create', 'Correct operation completed')
            t.is(operation.getRecords().length, 1, 'A single record was created')
            
            
            t.ok(taskStore.getById(122), 'New record appeared in store')
            
            t.endAsync(async1)
            
            next1()
            
        }, null, { single : true })
        
        taskStore.sync()
    })
    
    
    var next1 = function () {
        // now doing UPDATE operation
        taskStore.getById(121).set('StartDate', new Date(2010, 01, 8))
        
        var async2 = t.beginAsync()
        
        // UPDATE listener
        taskStore.on('write', function (store, operation) {
            
            t.is(operation.action, 'update', 'Correct operation completed')
            
            t.endAsync(async2)
            
            next2()
            
        }, null, { single : true })
        
        taskStore.sync()
    }
    
    
    var next2 = function () {
        // now doing DELETE operation
        taskStore.remove(taskStore.getById(122))
        
        var async3 = t.beginAsync()

        // DESTROY listener
        taskStore.on('write', function (store, operation) {
            
            t.is(operation.action, 'destroy', 'Correct operation completed')
            t.is(operation.getRecords().length, 1, '1 record was removed')
            
            t.ok(!taskStore.getById(122), 'Record was removed')
            
            t.endAsync(async3)
            
        }, null, { single : true })
        
        taskStore.sync()
    }
})    
