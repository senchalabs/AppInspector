/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ActionTarget

This class exists only for documentation purposes and does not contain any actual code.

It describes how Siesta resolves the targets for various methods (like "click", "type" etc) from values of different types
to DOM elements.
Framework specific testing classes enhances these rules with additional logic (see below).


Siesta.Test.Browser
-------------------

This is a generic browser testing class. On this level, Siesta.Test.ActionTarget can be:

- An `HTMLElement`. Action will be performed with this element. When coordinates are involved, the center of element will be used.

- An array with 2 elements: `[ x, y ]`. Will be converted to the DOM element at the specified screen coordinates.

        t.click([ 100, 100 ], function () { ... })

- A string, denoting a DOM query with CSS selector: 

        t.click('.x-grid', function () { ... })
    
  Only the first element from the query results will be used.
 
 
Siesta.Test.ExtJS and Siesta.Test.SenchaTouch
-------------------

These classes both extends Siesta.Test.Browser with additional logic, specific for testing ExtJS and Sencha Touch applications.

When using these classes, in addition to the rules above, Siesta.Test.ActionTarget can also be:

- An instance of Ext.dom.Element (or the like class in Sencha Touch)

- An instance of Ext.Component. Will be converted to the DOM element using its `getEl()` method or similar

- A string, containing {@link Siesta.Test.ExtJS#compositeQuery composite query}

        t.click('gridpanel[title=foo] => .x-grid-body', function () { ... })
    
  Only the first element from the query results will be used
  
- A string, starting with ">>" and containing the ExtJS component query (see [Ext.ComponentQuery.query](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.ComponentQuery-method-query)):

        t.click('>> gridpanel[title=foo]', function () { ... })
    
  Will be resolved to the first matching component, and then to DOM element.
  
Just to summarize, you can pass a string to various siesta methods and depending from your testing class and the format it will mean
different type of query:

- String, starting with `>>` - ExtJS [component query](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.ComponentQuery-method-query)
- String, containng `=>` - {@link Siesta.Test.ExtJS#compositeQuery composite query}
- Other strings - regular CSS query
  
 
 
*/