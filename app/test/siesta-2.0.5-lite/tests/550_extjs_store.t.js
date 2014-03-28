StartTest(function (outer) {
    
    var store = outer.getStore({ proxy : new Ext.data.MemoryProxy() });
    store.removeAll();

    var store2 = outer.getStore({ proxy : new Ext.data.MemoryProxy() });
    var store3 = outer.getStore({ proxy : new Ext.data.MemoryProxy() });
    store3.proxy.data = [{ Foo : 'bar'}];

    outer.expectPass(function (t) {
        t.isStoreEmpty(store, 'PASS: Store empty');
        t.waitForStoresToLoad(store2, function () { });
        t.loadStoresAndThen(store3, function () { 
            t.pass('loadStoresAndThen worked ok');
        });
    });

    store2.proxy.data = [{ Foo : 'bar'}];
    store2.load();

    outer.expectFail(function (t) { 
        t.isStoreEmpty(store2, 'FAIL: Store empty');
        t.waitForStoresToLoad(store, function () { });
    }, null, { waitForTimeout : 500 });

});