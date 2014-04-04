# Running the Tests

To test App Inspector for Sencha, we have chosen to use Siesta because:

* It's amazing
* It easily allows us to run tests against multiple versions of the Sencha frameworks

...plus it's a web-based tool written in Ext JS.

## Setup

In order to run the tests, you'll first need to understand the project architecture:

    ~/parent_folder/

        /AppInspector/ (the Git repo)
            /app/
                /test/
                    index.html (view the test suite here)
                
        /_ext/ (can be a symlink)
            /ext-4.2.1.883/ (the fully unpacked ZIP)
            /ext-5.0.0/ (eventually)
            
        /_touch/ (can be a symlink)
            /touch-2.3.1/ (the fully unpacked ZIP)

We are testing App Inspector's *AI.util* classes against examples which ship with the Sencha frameworks for simplicity.
Because of cross-domain issues, these examples must be run on the same domain as our test code... so we use Node.js/Grunt to start a localhost.

The */_ext/* and */_touch/* folders can be symbolic links, but their placement and naming is key to the testing architecture.

## Run the Tests

From your terminal, run the command:

    `grunt test`

...which loads the Siesta test suite in your browser running on a localhost.

You can run the tests individually or batched simultaneously - though the latter sometimes reports false errors.