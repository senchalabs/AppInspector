
Ext.define('d3xtjs.CollapsibleTree', {
    extend : 'Ext.Panel',

    alias : 'widget.d3xtjs_collapsibletree',

//    controller : 'd3xtjs_collapsibletree',


    // Used for targeting the element to inject the SVG element into.
    // 'body' for Panel
    // 'el' for Component
    targetElement : 'body',

    // ID incrementor for nodes
    i : 0,

    // Used for name ellipses detection
    ellipsisRegex : /^\.\.\./,

    config : {
        scale     : 1,
        translate : [180, 0]
    },

    // Adding fit layout removes the extra DOM from auto layout
    layout : 'fit',

    listeners : {
        nodeclick        : 'onViewNodeClick',
//        codedependencies : 'onViewCodeDependencies',
        scope            : 'this'
    },

    applyScale : function(scale) {
        var me = this;

        me.setVisScaleTranslate(scale, me.getTranslate());

        return scale;
    },

    setVisScaleTranslate : function(scale, translate) {
        var vis = this.vis;

        if (!vis) {
            return;
        }



        vis.attr('transform', 'translate(' + translate + ') scale(' + scale + ')');
    },

    onResize : function(w, h) {
        this.callParent(arguments);
        if (this.vis) {
            Ext.get(this.vis[0][0].parentNode.parentNode).setSize(w, h);
        }
        if (this.tree) {
            this.tree.size([h, w]);
            this.updateTree(this.root)
        }
    },

    renderSvg : function() {

        var me = this,
            body = me[me.targetElement],
            w = body.getWidth(),
            h = body.getHeight(),
            diameter = w > h ? w : h,
            radius = diameter / 2,
            vis,
            zoomConfig;

        if (!me.vis) {
            zoomConfig = d3.behavior.zoom().scaleExtent([.5, 2]).on('zoom', function() {
                var scale = d3.event.scale,
                    translate = d3.event.translate,
                    originalTranslate = me.getTranslate();


                me.setScale(scale);

                translate[0] = originalTranslate[0] + translate[0];
                me.setVisScaleTranslate(scale, translate);
            });

            vis = me.vis = d3.select('#' + body.id)
                .append('svg')
                .attr("class", "Vizlorer-svg")
                .attr('width', w)
                .attr('height', h)
                .call(zoomConfig)
                .append('g')
                .append('g')
                .attr('transform', 'translate(' + me.getTranslate()[0] + ',' + 0 + ')');

//            me.setTranslate([radius, radius])
        }
        else {
            me.vis.empty();
            Ext.get(me.vis[0][0].parentNode.parentNode).destroy();
            delete me.vis;
            me.renderSvg();
        }

    },

    renderDiagram : function(root) {
//        debugger;

        var me = this,
            targetEl = me.targetElement;

        // If we are not rendered, then buffer the rendering
        if (!me[targetEl]) {
            me.on({
                single : true,
                buffer : 250, // just in case
                render : function() {
                    me.renderDiagram(root);
                }
            });
            return;
        }
        else {
            this.renderSvg();
        }

        var width = me[targetEl].getWidth(),
            height = me[targetEl].getHeight();


        var tree = d3.layout.tree()
            .size([height, width]);


        // configure as a sideways tree
        var diagonal = d3.svg.diagonal()
            .projection(function(d) {
                return [d.y, d.x];
            });

        me.root = root;
        me.tree = tree;
        me.diagonal = diagonal;

        function collapseAll(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapseAll);
                d.children = null;
            }
        }

        root.x0 = height / 2;
        root.y0 = 0;

        me.updateTree(root);
    },



    updateTree : function(source) {
        var me = this,
            vis = me.vis,
            diagonal = me.diagonal,
            tree = me.tree,
            root = me.root,
            duration = 750,
            matchRegex = me.ellipsisRegex;


        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse();

        // Normalize for fixed-depth. (horizontal distance)
        nodes.forEach(function(d) {
            d.y = d.depth * 130;
        });

        // Update the nodes…
        var node = vis.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++me.i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", function(d) {
                me.fireEvent('nodeclick', me, d);
            });
//            .on('contextmenu', Ext.Function.bind(me.onD3ContextMenu, me));




        nodeEnter.append("svg:circle")
            .attr("r", 1e-6)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });



        nodeEnter.append("svg:text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("data-qtip", function(d) {
                if (d.name.match(matchRegex)) {
//                    console.log('MATCH >> ', d.name);
                    return d.fullName;
                }
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 1e-6)

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });


        var nodeColorMatrix = {
            class      : '#000',
            superclass : '#3b8ede',
            mixin      : '#ff9016'
        };
        nodeUpdate.select("text")
            .style("fill-opacity", 1)
            .style('fill', function(d) {
//                console.log(d.name, d.type);
                return nodeColorMatrix[d.type];
            });

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function() {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = vis.selectAll("path.link")
            .data(tree.links(nodes), function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x : source.x0, y : source.y0};
                return diagonal({source : o, target : o});
            })
            .transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {x : source.x, y : source.y};
                return diagonal({source : o, target : o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

    },

    onD3ContextMenu : function(d) {
        var d3Event = d3.event;

        d3Event.preventDefault();
        d3Event.stopPropagation();

        if (!this.menu) {
            this.menu = new Ext.menu.Menu({
                items : {
                    text    : 'Show',
                    handler : this.onShowCodeButton,
                    scope   : this
                }
            });
        }

        this.contextMenuNode = d;

        this.menu.items.getAt(0).setText('<b>Show dependencies:</b> ' + (d.fullName || d.name));

        this.menu.showAt([d3Event.x, d3Event.y]);
    },

    onDestroy : function() {
        this.menu && this.menu.destroy();
        this.callParent(arguments);
    },

    onShowCodeButton : function() {
        this.fireEvent('codedependencies', this, this.contextMenuNode);
    },

    onViewNodeClick : function(view, d) {

        // Collapse node
        if (d.children) {

            d._children = d.children;
            d.children = null;
        }
        // Expand Node
        else if (d._children) {


            if (d._children.length < 1) {
                d._children = this.getNewNodes(d);
            }


            d.children = d._children;

            d._children = null;
        }

        view.updateTree(d);
    }
});