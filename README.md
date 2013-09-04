App Inspector for Sencha™
=======================
Google Chrome™ Dev Tools extension for debugging Sencha applications.

This is a great tool to debug your Sencha Application. It allows you to better understand the component tree and get yourself
oriented faster.

<a href="https://chrome.google.com/webstore/detail/sencha-inspector/pbeapidedgdpniokbedbfbaacglkceae">![Available on Chrome Store](https://developers.google.com/chrome/web-store/images/branding/ChromeWebStore_BadgeWBorder_v2_206x58.png)</a>

Features
--------
 - Creates a new section on Dev Tools elements panel displaying properties of a given component if they match the selected DOM node.
 - Creates a new Sencha Panel displaying the component tree
 - Hovering the component tree will highlight the component on the screen
 - You can use the keyboard to navigate trough the component tree

Known Issues
------------
There are some APIs from Dev Tools that are not fully exposed, so the App Inspector uses some work arounds:
 - Component highlighting is executed by injecting a &lt;div&gt; into the page.
 - DOM modifications (add/remove/move components) do not reflect automatically on the App Inspector. That's why we have a "reload" icon on the side panel.

Contributing
------------
This is a community project, so feel free to fork it. Pull requests with bug fixes and new features are welcomed!

Since debugging the Sencha Panel is difficult, you can switch InspectorWindow.js by InspectorWindowMockup.js. This is the only
part that depends on the Chrome Dev Tools shell. All the rest is pure HTML, CSS & JS. After switching this file you can open
inspector.html and debug with Dev Tools itself.

Also, if you detach the Chrome Dev Tools and press Cmd+Alt+I or Ctrl+Alt+I, a new instance of the Chrome Dev Tools will open to inspect
the previously opened Dev Tools. This way you can inspect the Dev Tools with the Dev Tools. (sounds confusing but it works!)