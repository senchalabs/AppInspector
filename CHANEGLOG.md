
n.n.n / 2014-03-22 
==================

 * fix various JShint errors
 * Merge pull request #46 from kawanoshinobu/pullreq
 * Merge pull request #54 from arthurakay/master
 * Filter for Events list per issue #49.
 * Added some messages that were overlooked.
 * Add my name to the contributors list. I'm honored :)
 * Merge pull request #47 from arthurakay/master
 * Paging store records, fixing issue #41
 * Added i18n mechanism and locale file of Japanese.
 * Merge pull request #44 from stoe/feature/locales
 * Merge pull request #45 from stoe/develop
 * filtering done. Closes #39
 * filtering done. #39
 * mockup data removed
 * added filtering. #39
 * added filtering. #39
 * locales added
 * Merge pull request #36 from stoe/develop
 * Move LICENSE file back to project root and updated copy task instead.
 * Move LICENSE file back to project root and updated copy task instead.
 * Merge remote-tracking branch 'upstream/master' into develop
 * Merge pull request #37 from arthurakay/master
 * initial load Components, Stores and Layout tabs
 * Merge pull request #34 from arthurakay/master
 * Merge pull request #32 from arthurakay/master
 * Merge pull request #31 from arthurakay/master
 * Merge pull request #30 from arthurakay/master

2.0.3 / 2014-03-11
==================

 * Moving license so that it gets copied in Grunt build
 * Fixed JSHint error
 * Updated license
 * initial load Components, Stores and Layout tabs
 * Fixing page reload on hash change bug. Added helper class for inspectedWindow, refactoring the Event monitor logic Attempting to implement right-click menu, but no success yet
 * needed to fix Grunt in order for new release to publish in CWS
 * correctly monitoring page refresh
 * better bug fix for Ext JS 5 (issue #29)
 * Correcting README
 * Fix for Ext JS 5 Component Manager bug (issue #29)
 * Fixing the Chrome manifest so running unpacked extension locally is easier
 * UI updates on About tab
 * formatting
 * added indicator on disabled devtools when no Sencha framework found
 * meh. mergefiles be gone
 * ui facelift
 * ui facelift
 * new grunt tasks (dev, watch) + updated GrundJS.md
 * added empty node_modules folder with README instructions
 * move PHPstorm code style settings to new seetings/ dir
 * unpublish node_modules/
 * Fixing Ext JS event captures. I think Touch might be okay...
 * Fixed #22 - store inspector bug on TreeStores
 * Fixed #21 - component tree resizing bug
 * We cannot publish with experimental permissions
 * Fixing issue #16
 * lodash needs to be local or it throws errors?
 * PHP Storm settings.. don't know how to transform this into .editorconfig
 * ran npm update
 * replaced node.js fs.* calls with grunt.file.*
 * added documentation to grunt tasks
 * exec task test
 * Updating manifest files
 * Trying to get the contextMenu to work, but failing hardcore
 * Updating docs to better instruct devs on running the code
 * Update to README
 * Fixing buggered merge
 * grunt tasks made easy
 * grunt task updated & refactored
 * grunt update \n grunt tasks split into subfolders
 * upgrade SenchaCMD > 4.0.2.67
 * pre pull-request changes
 * more cleanup
 * further cleanup
 * bump Sencha CMD version
 * JSDuck
 * app/AppInspector/ext/ sources deleted
 * include locales in copy task
 * contributors
 * cleanup
 * Some icon and style updates
 * Rewritng Event recorder to work for both Touch and Ext.
 * adding git pre-commit-hook via grunt-githooks
 * better output for jshint task
 * jshint enabled for AppInspector
 * project refactored
 * Minor updates
 * Fixing display of XTYPE in component treegrid
 * create deploy directory if it does not exist
 * Better element highlighting, and used across Ext & Touch
 * Build script for minified Chrome app, with necessary resources.
 * Renaming so Chrome can load the extension.
 * Updating the README
 * Adding documentation via JSDuck
 * Adding additional info for Layouts panel. Also linking contributor names to websites.
 * More Ext/Touch normalization
 * Normalizing some logic across Ext and Touch
 * Upgrade of Architect. Also beginning to separete Ext/Touch logic.
 * Basic "event" monitor implementation.
 * Adding base views for events and performance
 * Added "about" page starter
 * Changing color to black because I dislike the Neptune blue.
 * Adding theme (so I can modify later). Also added some icons and placeholder buttons for new functionality.
 * Removing SASS/CSS that I don't need
 * Added component introspection, some other cleanup
 * Fixed LintRoller setup to pass
 * Removing old workspace
 * Adding Main controller
 * App profiles added. Functionality almost completely back.
 * Porting store inspector to Architect
 * First pass with Architect
 * Setting up LintRoller
 * Initial start of API documentation
 * Removing all of Bruno's original app since I have duplicated the functionality.
 * Moving inspectedWindow logic into utility classes to clean up controllers. This should also allow me to extend them for other frameworks/versions.
 * Utility class for running code inside inspected window.
 * Better component tree
 * Refreshing store list
 * Fixing check for box layout nesting
 * Trying to diagnose nested box layouts
 * Highlighting overnested components
 * Overnesting utility!
 * Inspection of models inside stores.
 * Grabbing basic app info to display. This probably only works in Ext 4.x right now.
 * App Inspector can read what stores are currently loaded in the app.
 * A bit of cleanup before moving forward.
 * Ext JS is loading inside Chrome DevTools, replacing original UI. Zero functionality yet.

1.1.1 / 2013-09-11
==================

 * Update README link to Chrome Store
 * Cleanup for CSS and SidePanel class
 * New Component Properties Inspector + Project Cleanup
 * Rename namespace, make it work with Ext 3
 * Update inspector when switching from Sencha Application to non-application
 * Update extension when inspected window reloads or changes
 * Remove unused ComponentPropertiesSection.js
 * Fix readme message
 * Initial commit
