StartTest(function (t) {

    // Detecting global overrides of Ext JS is easy and helps you keep you application clean.
    // Ideally, you'd of course like to have 0 overrides but in a real life scenario this is not likely to happen.
    // Keeping track of the overrides is really great when it's time to upgrade to a new Ext JS version.

    // Uncomment the 'patch' below to make this test fail
//    Ext.override(Ext.grid.View, {
//       render : function() {
//           // some patched version
//       }
//    });

    t.assertNoGlobalExtOverrides()
    t.assertMaxNumberOfGlobalExtOverrides(1, "This override is a last one, I promise")
})
