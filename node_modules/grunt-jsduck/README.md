# grunt-jsduck

Grunt task to compile [JSDuck](https://github.com/senchalabs/jsduck) documentation


## Getting Started

### Installation

**WARNING!** Starting from version `1.0.0`, the task is incompatible with Grunt `0.3`.
Use the legacy `0.1.x` version you still use Grunt `0.3`.

You need to have Ruby and JSDuck installed. Refer to project homepage for installation instructions.

Install this grunt plugin next to your project's [grunt.js gruntfile](http://gruntjs.com/getting-started) with: `npm install grunt-jsduck`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-jsduck');
```

### Configuration

Inside your `grunt.js` file add a section named `jsduck`.
Read the [JSDuck Guide](https://github.com/senchalabs/jsduck/wiki/Guide) for an overview of its features.

#### src

Input paths containing JavaScript code to document. You can use wildcards here (see example below).

#### dest

Output directory for generated documentation.

#### options

Additional options that will be passed to jsduck.  Run `jsduck --help` for a full list.


### Example configuration

```javascript
jsduck: {
    main: {
        // source paths with your code
        src: [
            'ext-4.1.1/src',
            'project1/js',
            'project2/**/*.js'  // globbing supported!
        ],

        // docs output dir
        dest: 'docs',

        // extra options
        options: {
            'builtin-classes': true,
            'warnings': ['-no_doc', '-dup_member', '-link_ambiguous'],
            'external': ['XMLHttpRequest']
        }
    }
}
```

### Running

Running the jsduck [multitask](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) without additional parameters will execute it with all specified targets:

```
grunt jsduck
```

Running

```
grunt jsduck:main
```

will execute the task with `main` target.

Sometimes it's useful to override the output directory at compile time. You can pass it as a second argument like this:

```
grunt jsduck:main:/var/www/my-awesome-project/docs
```


## Contributing

Please follow the existing coding style. Respect the [`.editorconfig`](http://editorconfig.org) and [`.jshintrc`](https://github.com/jshint/jshint/#within-your-projects-directory-tree) files.


## License

Copyright (c) 2012-2013 Dmitry Pashkevich, contributors. Licensed under the MIT license.
