'use strict';

var path = require('path');

module.exports = function (grunt) {

  var _ = grunt.util._;

  grunt.registerMultiTask('chromeManifest', '', function () {
    var options = this.options({
      buildnumber: false,
      background: 'background.js',
      uglify: 'uglify',
      cssmin: 'cssmin',
      indentSize: 4
    });

    this.files.forEach(function (file) {
      var src = file.src[0];
      var dest = file.dest;
      var manifest = grunt.file.readJSON(path.join(src, 'manifest.json'));
      var background = path.join(dest, options.background.target);
      var exclude = options.background.exclude;
      var concat = grunt.config('concat') || {};
      var uglify = grunt.config(options.uglify) || {};
      var cssmin = grunt.config(options.cssmin) || {};
      var buildnumber = manifest.version.split('.');

      // update concat config for scripts in background field.
      concat.background = {
        src: [],
        dest: background
      };

      _.each(manifest.background.scripts, function (script) {
        if (_.indexOf(exclude, script) === -1) {
          concat.background.src.push(path.join(src, script));
        }
      });

      // remove file in manifest.json
      _.each(exclude, function(script) {
        manifest.background.scripts = _.without(manifest.background.scripts, script);
      })

      // update uglify config for concated background.js.
      uglify[background] = background;

      // update uglify and css config for content scripts field.
      _.each(manifest.content_scripts, function (contentScript) {
        _.each(contentScript.js, function (js) {
          uglify[path.join(dest, js)] = path.join(src, js);
        });

        _.each(contentScript.css, function (css) {
          cssmin[path.join(dest, css)] = path.join(src, css);
        });
      });

      // update grunt configs.
      grunt.config('concat', concat);
      grunt.config(options.cssmin, cssmin);
      grunt.config(options.uglify, uglify);

      // set updated build number to manifest on dest.
      if (options.buildnumber) {
        var versionUp = function (numbers, index) {
          if (!numbers[index]) {
            throw 'Build number overflow.' + numbers;
          }
          if (numbers[index] + 1 <= 65535) {
            numbers[index]++;
            return numbers.join('.');
          } else {
            versionUp(numbers, ++index);
          }
        };
        manifest.version = versionUp(buildnumber, buildnumber.length - 1);
        grunt.file.write(path.join(src, 'manifest.json'), JSON.stringify(manifest, null, options.indentSize));
      }

      // set updated background script list to manifest on dest.
      manifest.background.scripts = [options.background.target];

      // write updated manifest to dest path
      grunt.file.write(path.join(dest, 'manifest.json'), JSON.stringify(manifest, null, options.indentSize));
    });
  });
};
