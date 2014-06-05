/**
 * @class   AI.model.mvc.Tree
 * @extends Ext.data.Model
 */
Ext.define('AI.model.mvc.Tree', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.data.Field'
    ],

    config : {
        fields : [
            {
                name : 'eventbus'
            },
            {
                name : 'type'
            },
            {
                name : 'text'
            },
            {
                name : 'children'
            },
            {
                name : 'expanded'
            },
            {
                name : 'count'
            },
            {
                name : 'qtip'
            }
        ]
    }
});
