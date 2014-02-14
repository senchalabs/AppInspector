# grunt-chrome-manifest

get scripts/css file list from manifest to handle, and initialize the grunt configuration appropriately, and automatically. then replaces references to non-optimized scripts into the transformed background scripts. and auto increment build version in manifest.json.

## Getting Started
If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install grunt-chrome-manifest --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-chrome-manifest');
grunt.registerTask('default', ['chromeManifest:dist']);
```

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md

## Workflow
chrome-manifest is composed of 3 steps:

- **prepare**: detects `background` and `content_script` javascript and css files in manifest and update the grunt config to run `concat` `cssmin` and `uglify`. but `content_scripts` javascript files and excluded 'background' javascript files does not perform the `concat` task.
- **buildnumber**: detects `buildnumber` and increased if set to true.
- **cleanup**: detects javascripts files for develop in manifest and remove them from manifest.json for distribution.

## Documentation

### Example usage
```javascript
chromeManifest: {
  dist: {
    options: {
      buildnumber: true,
      background: {
        target: 'scripts/background.js',
        exclude: [
          'background/scripts/chromereload.js'
        ]
      }
    },
    src: 'app',
    dest: 'dist'
  }
};
```

### Config

#### src
**Required**
Type: 'String'

Base directory where the origin source files

#### dest
**Required**
Type: 'String'

Base directory where the transformed files should be output.

### Options
#### buildnumber
Type: 'Boolean'

Flag of auto-increment build number.

#### background

##### target
Type: 'String'

Relative path of the transformed(`cssmin` and `uglify`) background script.

##### exclude
Type: 'String'

The paths of script in manifest.json that will be exclude.

## Tests

Grunt currently doesn't have a way to test tasks directly. You can test this task by running `grunt` and manually verify that it works.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php) and copyright Google
