Intro
---------

This guide shows how you to use the event recorder in Siesta.

{@img images/recorder1.png}

What is the event recorder?
---------

The event recorder will help you save lots of time as you author your UI tests for your application or UI components.
After hitting the record button, it will record your interactions with the user interface and help you target the components in your application.
This means it will detect Sencha components such as grids, form fields and checkboxes etc. without you having to
manually type in each target in manually. Please note that the recorder will most likely **not** produce a perfect test case at once, in reality
you will need to tweak its output to be as stable as possible for your test scenario. Regardless, it'll definitely save you time!

Getting started
---------
First of all you should prepare a test case which will produce the UI that you want the test to interact with.
Either you load an HTML page from your application (using the  {@link Siesta.Harness.Browser#hostPageUrl hostPageUrl} config) or you create a test which creates and renders a UI component.
After creating your test skeleton, run it and make sure the rendering completes without errors.

At this point, your test skeleton produces the UI you want to start testing. Now you need to instruct the test to wait for a condition that proves the UI is ready to be
interacted with. This might be the presence of some CSS selector, or that a couple of Ext JS stores have been loaded. Below is a simple sample test
skeleton:

    StartTest(function (t) {

        var customerGrid = new App.grid.Customer({
            width    : 600,
            height   : 200,
            renderTo : document.body,
            cls      : 'myGrid'
        });

        t.chain(
            // Make sure some dummy test rows are rendered before test starts
            { waitFor : 'rowsVisible', args : customerGrid }
        );

    });

Now that we've instructed the test to wait for a stable condition, we can go back to the Siesta UI and activate the recorder panel by clicking the recorder icon.

{@img images/recorder2.png}


The event recorder interface
---------

The empty recorder looks like the below image. In the top left, the buttons are quite self explanatory: 'Record', 'Stop', 'Play' and 'Clear' allow you
to capture and playback the recorded actions. In the top right section, you can 'Generate code', add a custom step and 'Close' the recorder panel.

{@img images/recorder3.png}

The grid has 3 columns:

* The 'Action' column is the type of action.
* The 'Target/Value' column contains the either the target of a UI action, the value
(when typing text) or source code for the special function step.
* The 'Offset' column allows you to set an offset for your action so you can click
at a precise point on your button or text field for example.

Below the grid you can find a cheat sheet of the most common targets types (CSS query, Component Query and Composite Query).

Try hitting the record button and click somewhere in your application UI. You should see an entry show up in the recorder grid. The first thing to do
now is to verify that the recorder understood your intention. This means reading the target description and possibly adjusting it. The recorder
tries to understand your intention but it's **not** a mind reader (yet). Make sure to optimize the target to be the most stable. Having stable targets
is very important to keep tests passing as you modify your UI or upgrade to newer versions of the Sencha framework.

A simple example: Let's say you record a click on an Ext JS button, Siesta will suggest the following:

    Target : schedulergrid button[text=Seconds] => .x-btn-inner
    Offset : [27, 13]

This is a Composite Query, left side is a regular Sencha Component Query, and the part after => is a simple CSS selector. How do we make this the most stable
target selector? First of all, if all you wanted was to click anywhere on the button then the offset has no value so let's delete it. This makes
 sure that if the button dimensions change later (e.g. width lowered to 25px), the test will still work fine. The second thing to look at is the target itself. Unless you want to
 click at a specific HTML element inside the button, we don't really need the right side of the expression. This also protects you against the case where
 in a future Ext JS version, the .x-btn-inner class is renamed to something else (or removed). Converting the target to a Component Query is our best bet:

    Target : >>schedulergrid button[text=Seconds]
    Offset :

Now, Siesta will always click at the center of the Button component which normally is what you want for buttons anyway.
When you're done adjusting the target, try playing back the test to make sure all works fine. When playing back a recording, Siesta will first execute
the entire test (the skeleton you prepared) and after the test has finalized, the recorder actions will be played back.


Editing the target locator
---------
The fields in the grid are all editable, so it's easy for you to adjust the values inline. Clicking a **Target** cell allows you to either choose one of
the alternatives gathered by the recorder, or you can type any value you like. As you type, Siesta will try to highlight the target. You need to make sure
that you only target one thing on the screen, and make uour target selector specific to that target. If you have 5 Ext JS buttons on the page, just
typing ">> button" won't work because it's a too generic target locator (Siesta will warn you in this case).

{@img images/recorder-target-editor.png}


Waiting for async operations
---------
As you will see, just naively recording some clicks on the screen and playing them back won't always work. A lot of the times, a UI will contain
asynchronous behavior. A window might animate as it closes or a panel is collapsed with an animation etc. To make your tests aren't sensitive to these
async flows, you will need to wait - a lot. Siesta tries to help you as much as it can, by always waiting for a target to appear, and also for any
ongoing Ext JS animation to complete. So, in theory you should not need to worry about these two cases.

Let's look at a simple example:

    StartTest(function (t) {
        Ext.getBody().update('<div id="client_list"></div>');

        var btn = new Ext.Button({
            text        : 'Load data',
            renderTo    : document.body,
            handler     : function() {

                // This Ajax request is obviously async
                Ext.Ajax.request({
                    url     : 'Customers/Get',
                    success : function(response) {
                        // Assuming an array is returned by server
                        var clients = Ext.decode(response.responseText);

                        Ext.get('client_list').update(clients.join('<br/'));
                    }
                });
            }
        });
    });

Let's say the test scenario is to click the button, and after the Ajax request is done we also click on the rendered client list. A naive attempt would be
some thing like:

    // Click the button using a Component Query
    { click : ">> button[text=Load data]" },

    // Then click the populated client list
    { click : "#client_list" }

This **might** actually work if the Ajax request finishes really fast. But if it does, it's just luck and in any situation you should always wait to be sure.
For a situation like this, we can try using the {@link Siesta.Test.Element#waitForElementNotVisible waitForElementNotVisible} method. 
Click the '+' button to add a new custom step, and drag it in between the two click steps.

{@img images/recorder-wait-action.png}

After adding the wait step, this test sequence is now robust and it doesn't matter if the ajax request takes 5ms or 10 seconds.

The function step
---------
As you interact with your application UI you most likely want to perform some assertions along the way. While this is easier to do in your own IDE,
we've added a simple code editor to the recorder too. If we continue on the previous sample, it would be nice to assert that a certain text exists after
the loading is completed. To add such a function step, select the 'fn' action in the list and hit TAB. Now we can execute any regular JS, and of course
use any of the {@link Siesta.Test} assertion methods.

{@img images/recorder-fn-step.png}


When you feel done with the recorded events, you can simply hit the **Generate code** button and copy-paste the contents into your test skeleton.


{@img images/recorder_generated_code.png}

Recording a move-cursor-to step
---------
Sometimes you want to simply move the cursor to certain place on the screen without doing any further action. Since the recorder doesn't record every
mouse movement, there is a special way to signal to Siesta that you want to move the cursor somewhere. Simply move the mouse to where it should be and
leave it for 3 seconds, you'll then see a **moveCursorTo** action added to the list. This is useful in lots of scenarios, for example when triggering
a grid column menu to show. You cannot click the menu icon right away, since it's hidden until you move the cursor over the grid column header.


Buy this product
---------

Visit our store: <http://bryntum.com/store/siesta>


Support
---------

Ask question in our community forum: <http://www.bryntum.com/forum/viewforum.php?f=20>

Share your experience in our IRC channel: [#bryntum](http://webchat.freenode.net/?randomnick=1&channels=bryntum&prompt=1)

Please report any bugs through the web interface at <https://www.assembla.com/spaces/bryntum/support/tickets>


See also
---------

Web page of this product: <http://bryntum.com/products/siesta>

Other Bryntum products: <http://bryntum.com/products>


COPYRIGHT AND LICENSE
---------

Copyright (c) 2009-2013, Bryntum & Nickolay Platonov

All rights reserved.