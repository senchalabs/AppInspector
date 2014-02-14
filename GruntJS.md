## Grunt.js

### Getting Started
This project requires [Grunt](http://gruntjs.com/) to use the requirerd [Grunt Plugins](http://gruntjs.com/plugins) and run the specified tasks.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

### Tasks

#### `grunt docs`
Generate the projects documentation. Subsequently running `clean:docs` and `jsduck` tasks.

#### `grunt build`
Build the project. Subsequently running `clean:dist`, `chromeManifest:dist`, `exec:build`, `imagemin`, `copy`, `compress`,  and `docs` tasks.

#### `grunt` (default)
See [grunt build](#grunt-build) task.

#### Subtasks

* The `clean` task

    * target `clean:dist` cleans the `dist/` directory. Automatically run for `build` task.
    * target `clean:docs` cleans the `docs/` directory. Automatically run for `docs` and `build` tasks.

    __NOTE__: You don't need to run this task or its targets manually.

    Read more on:
    * https://www.npmjs.org/package/grunt-contrib-clean

* The `jshint` task

    Lint `Gruntfile.js`, `app/AppInspector/app.js` and all *.js files in `app/AppInspector/app/`.
    It uses the `.jshintrc` file containing the linting rules.

    Read more on:
    * https://www.npmjs.org/package/grunt-contrib-jshint
    * http://www.jshint.com/docs/

* The `imagemin` task

    Optimise, compress and copy image assets.

    Read more on:
    * https://www.npmjs.org/package/grunt-contrib-imagemin

* The `exec` task

    Cli task to run `sencha -q app build -e production -c` command.

    Read more on:
    * http://docs.sencha.com/extjs/4.2.1/#!/guide/command_reference
    * https://www.npmjs.org/package/grunt-exec

* The `copy` task

    Copy resources from `app/` and `app/AppInspector/build/production/AI` to `dist/`.

    Read more on:
    * https://www.npmjs.org/package/grunt-contrib-copy

* The `compress` task

    Compress `dist/` to `package/AppInspector.zip`.

    Read more on:
    * https://www.npmjs.org/package/grunt-grunt-contrib-compress

* The `githooks` task

    Generates a git pre-commit hook to run the *grunt jshint task* on every commit, aborting the commit if any linting errors exist.

    __NOTE__: Only run this task once manually using `grunt githooks` or if adding new hooks.

    Read more on:
    * http://git-scm.com/book/en/Customizing-Git-Git-Hooks
    * https://www.npmjs.org/package/grunt-githooks

* The `jsduck` task

    Read more on:
    * https://github.com/senchalabs/jsduck
    * https://www.npmjs.org/package/grunt-jsduck
