# Grunt.js
http://gruntjs.com/

## Getting Started
This project requires [Grunt](http://gruntjs.com/) to use the requirerd [Grunt Plugins](http://gruntjs.com/plugins) and run the specified tasks.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

## Main tasks

### `grunt docs`
Generate the projects documentation. Subsequently running [`clean:docs`](#the-clean-task) and [`jsduck`](#the-jsduck-task) tasks.

### `grunt dev`
Build the project. Subsequently running [`jshint`](#the-jshint-task), [`clean:dist`](#the-clean-task), [`chromeManifest:dist`](#the-chromemanifest-task), [`exec:dev`](#the-exec-task) and [`copy:dev`](#the-copy-task) tasks.

### `grunt test`
Run the tests. Subsequently running [`connect`](#the-connect-) task.

### `grunt build`
Build the project. Subsequently running [`jshint`](#the-jshint-task), [`clean:dist`](#the-clean-task), [`chromeManifest:dist`](#the-chromemanifest-task), [`exec:production`](#the-exec-task), [`imagemin`](#the-imagemin-task), [`copy:dist`](#the-copy-task), [`compress`](#the-compress-task) and [`docs`](#grunt-docs) tasks.

### `grunt watch`
Watch the project for changes triggeering the [`grunt dev`](#grunt-dev) task.

### `grunt` (default)
See [`grunt build`](#grunt-build) task.

### Subtasks
Subtasks are split into seperate files inside `grunt/`.

#### The `chromeManifest` task

Create the Chrome Dev Tools `manifest.json` file.

Read more on:
* https://www.npmjs.org/package/grunt-chrome-manifest

#### The `clean` task

* target `clean:dist` cleans the `dist/` directory. Automatically run for [`build`](#grunt-build), [`dev`](#grunt-dev) and [`watch`](#grunt-watch) tasks.
* target `clean:docs` cleans the `docs/` directory. Automatically run for [`docs`](#grunt-docs) and [`build`](#grunt-build) tasks.

__NOTE__: You don't need to run this task or its targets manually.

Read more on:
* https://www.npmjs.org/package/grunt-contrib-clean

#### The `compress` task

Compress `dist/` to `package/AppInspector.zip`.

Read more on:
* https://www.npmjs.org/package/grunt-grunt-contrib-compress

#### The `copy` task

Copy resources from `app/` and `app/AppInspector/build/production/AI` to `dist/`.
* target `copy:dist` for [`grunt build`](#grunt-build) or [`grunt`](#grunt-default) tasks.
* target `copy:dev` for [`grunt:dev`](#grunt-dev) task.

Read more on:
* https://www.npmjs.org/package/grunt-contrib-copy

#### The `exec` task

Task to run
* target `exec:dev` `sencha -q app build -e testing -c`
* target `exec:production` `sencha -q app build -e production`
commands.

Read more on:
* http://docs.sencha.com/extjs/4.2.1/#!/guide/command_reference
* https://www.npmjs.org/package/grunt-exec

#### The `githooks` task

Generates a git pre-commit hook to run the [`jshint`](#the-jshint-task) task on every commit, aborting the commit if any linting errors exist.

__NOTE__: Only run this task once manually using `grunt githooks` or if adding new hooks.
![grunt githooks](http://f.cl.ly/items/2U0l471z363P3a0w0408/screenshot%202014-02-14%20at%2012.46.48.png)

Read more on:
* http://git-scm.com/book/en/Customizing-Git-Git-Hooks
* https://www.npmjs.org/package/grunt-githooks

#### The `imagemin` task

Optimise, compress and copy image assets.

Read more on:
* https://www.npmjs.org/package/grunt-contrib-imagemin

#### The `jsduck` task

Generate duckumentation!

![JSduck](https://raw.github.com/senchalabs/jsduck/master/opt/jsduck-logo-dark.png)

Read more on:
* https://github.com/senchalabs/jsduck
* https://www.npmjs.org/package/grunt-jsduck

#### The `jshint` task

![JShint](http://www.jshint.com/res/jshint.png)

Lint `Gruntfile.js`, `app/AppInspector/app.js` and all `*.js files in `app/AppInspector/app/`.
It uses the `.jshintrc` file containing the linting rules.

Read more on:
* https://www.npmjs.org/package/grunt-contrib-jshint
* http://www.jshint.com/docs/

#### The `connect` task

Start a connect web server for running the tests on Siesta Lite. It opens the Siesta's test page in your default browser.

The port number will be used in 8333, but if you have already used it, please change it as you like.

Read more on:
* https://www.npmjs.org/package/grunt-contrib-connect

