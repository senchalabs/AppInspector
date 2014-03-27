StartTest(function(t) {

    function setup() {
        Ext.define("Post", {
            extend: 'Ext.data.Model',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'topics',
                    totalProperty: 'totalCount'
                },
                data : {"totalCount":"10","topics":[{"post_id":"604220","topic_title":"Status bar error with IFrames","topic_id":"134120","author":"Daz","post_time":"1305857168","post_text":"Ext version tested:\n\n Ext 3.3.3\n\nAdapter used:\next\n \ncss used:\ndefault ext-all.css\n \nBrowser versions tested against:\nFF4 (firebug 1.7.1 installed)\n \n...","forum_title":"Ext 3.x: Bugs","forumid":"41","reply_count":"0"},{"post_id":"604153","topic_title":"Using XTemplate to send XML","topic_id":"134102","author":"cayenne_08","post_time":"1305841170","post_text":"This is what I am trying to do to post custom XML on editor form submit:\r\n\r\n\n\r\n(function() {\r\n Q.dxi.QXmlWriter = Ext.extend(Ext.data.XmlWriter, ...","forum_title":"Ext 3.x: Help","forumid":"40","reply_count":"0"},{"post_id":"604114","topic_title":"Open Source Development - The people you interact with....","topic_id":"134093","author":"watrboy00","post_time":"1305837814","post_text":"Wanted to share a good article related to open source development and the shades of people you might interact with...\r\n\r\nEnjoy!\r\n\r\nhttp:\/\/goo.gl\/BwDaF","forum_title":"Community Discussion","forumid":"68","reply_count":"0"},{"post_id":"604102","topic_title":"What widgets are missing most in the ExtJs library?","topic_id":"134091","author":"Andrew.Golik","post_time":"1305837033","post_text":"What are the most missed widgets in ExtJs library?\r\nI really like the ExtJs library but I feel like there is gap between jQuery and ExtJs libraries in...","forum_title":"Community Discussion","forumid":"68","reply_count":"0"},{"post_id":"604100","topic_title":"What widgets are missing most in the ExtJs library?","topic_id":"134090","author":"Andrew.Golik","post_time":"1305836975","post_text":"What are the most missed widgets in ExtJs library?\r\nI really like the ExtJs library but I feel like there is gap between jQuery and ExtJs libraries in...","forum_title":"Community Discussion","forumid":"68","reply_count":"0"},{"post_id":"604099","topic_title":"What widgets are missing most in the ExtJs library?","topic_id":"134089","author":"Andrew.Golik","post_time":"1305836900","post_text":"What are the most missed widgets in ExtJs library?\r\nI really like the ExtJs library but I feel like there is gap between jQuery and ExtJs libraries in...","forum_title":"Community Discussion","forumid":"68","reply_count":"0"},{"post_id":"604097","topic_title":"GridPanel Scroll doesn't work","topic_id":"134088","author":"daniel_","post_time":"1305836704","post_text":"hello\n\nAutoScroll doesn't work with the gridPanel. if i specify a specific height and the content is bigger i get just the name of the columns\n26148 (...","forum_title":"Ext 3.x: Help","forumid":"40","reply_count":"0"},{"post_id":"604088","topic_title":"Expand child node in tree after context menu click","topic_id":"134084","author":"TheBigOnion","post_time":"1305835440","post_text":"Hello all,\n I am trying to expand a child node in a tree after I reload it. The only information I have when I click the context menu is the node url...","forum_title":"Ext 3.x: Help","forumid":"40","reply_count":"0"},{"post_id":"604086","topic_title":"ItemSelector issue","topic_id":"134083","author":"yga","post_time":"1305835064","post_text":"Selected item in left pane wont show correctly in rigth pane\n\nCODE:\nvar dataRecordCentroP = new Ext.data.Record.create([\n ...","forum_title":"Ext 3.x: Help","forumid":"40","reply_count":"0"},{"post_id":"604083","topic_title":"Dynamically add item to viewport region","topic_id":"134080","author":"FoobarusMaximus","post_time":"1305834734","post_text":"Let's say I have a JS in one file that creates a `Viewport`:\n\n\n Ext.create('Ext.container.Viewport', {\n layout: 'border',\n items: [\n ...","forum_title":"Ext: Open Discussion","forumid":"6","reply_count":"0"}]}
            },

            fields: [
                {name: 'id', mapping: 'post_id'},
                {name: 'title', mapping: 'topic_title'},
                {name: 'topicId', mapping: 'topic_id'},
                {name: 'author', mapping: 'author'},
                {name: 'lastPost', mapping: 'post_time', type: 'date', dateFormat: 'timestamp'},
                {name: 'excerpt', mapping: 'post_text'}
            ]
        });

        var ds = Ext.create('Ext.data.Store', {
            model: 'Post'
        });


        var panel = Ext.create('Ext.panel.Panel', {
            renderTo: Ext.getBody(),
            title: 'Search the Ext Forums',
            width: 600,
            bodyPadding: 10,
            layout: 'anchor',

            items: [{
                xtype: 'combo',
                store: ds,
                displayField: 'title',
                typeAhead: false,
                hideLabel: true,
                hideTrigger:true,
                anchor: '100%',

                listConfig: {
                    loadingText: 'Searching...',
                    emptyText: 'No matching posts found.',

                    // Custom rendering template for each item
                    getInnerTpl: function() {
                        return '<div class="search-item">' +
                            '<h3><span>{[Ext.Date.format(values.lastPost, "M j, Y")]}<br />by {author}</span>{title}</h3>' +
                            '{excerpt}' +
                            '</div>';
                    }
                },

                // override default onSelect to do redirect
                listeners: {
                    select: function(combo, selection) {
                        var post = selection[0];
                        if (post) {
                            window.location =
                                Ext.String.format('http://www.sencha.com/forum/showthread.php?t={0}&p={1}', post.get('topicId'), post.get('id'));
                        }
                    }
                }
            }, {
                xtype: 'component',
                style: 'margin-top:10px',
                html: 'Live search requires a minimum of 4 characters.'
            }]
        });
    }

    setup();

    t.diag("Testing one of the Ext JS examples.");
    var loadTriggered;

    t.chain(
        {
            waitFor : 'xType',
            args : 'combobox'
        },

        function(next, foundComponents) {
            var combo = foundComponents[0],
                store = combo.store;

            t.is(store.getCount(), 0, 'Store is empty before we start typing');

            store.on('beforeload', function() {
                loadTriggered = true;
            });

            next();
        },

        { click : '>>combobox' },

        // 'gri' is not enough to trigger a load
        { type  : 'gri', target : '>>combobox' },

        function(next) {
            t.notOk(loadTriggered, 'Store load not triggered when typing < 4 chars');

            next();
        },

        { type  : 'd', target : '>>combobox' },

        // Waiting for the custom drop down list to appear
        { waitFor : 'selector', args : '.x-boundlist-item' },

        // move cursor to the 2nd item in the list
        { moveCursorTo : '.x-boundlist-item:nth-child(2)' }
    );
});