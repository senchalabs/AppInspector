# Running the Tests

To test App Inspector for Sencha, we have chosen to use Siesta because:

* It's amazing
* It easily allows us to run tests against multiple versions of the Sencha frameworks

...plus it's a web-based tool written in Ext JS.

## Setup

In order to run the tests, you'll first need to setup a local server with the following architecture:

    sencha.local (local hostname)

        /AppInspector/
            /app/
                /test/
                    index.html (view the test suite here)
                
        /_ext/
            /ext-4.2.1.883/ (the fully unpacked ZIP)
            /ext-5.0.0/ (eventually)
            
        /_touch/
            /touch-2.3.1/ (the fully unpacked ZIP)

We are testing App Inspector's *AI.util* classes against the examples which ship with the Sencha frameworks. Because of
cross-domain issues, these examples must be run on the same domain as our test code... hence creating *sencha.local*
on your local machine.

## Run the Tests

In your browser you should now be able to view http://sencha.local/AppInspector/app/test/index.html, which loads the
Siesta test suite.

You can run the tests individually or batched simultaneously - though the latter sometimes reports false errors.