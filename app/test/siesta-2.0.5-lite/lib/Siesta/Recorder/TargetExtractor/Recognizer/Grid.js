/*

Siesta 2.0.5
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 @class Siesta.Recorder.TargetExtractor.Recognizer.Grid
 *
 * A class recognizing the Ext JS grid cell/row markup
 **/
Class('Siesta.Recorder.TargetExtractor.Recognizer.Grid', {

    methods : {
        recognize : function (node) {
            var cell = node.className.match(/x-grid-cell$/) ? $(node) : $(node).closest('.x-grid-cell');

            if (cell.length === 0) return;

            var result = this.meta.superClass.prototype.getCssSelectors.call(this, node);
            var row = cell.closest('tr');
            var cellSelector, rowSelector;

            var cellCss = this.getCustomCssClass(cell[0]);
            var rowCss = row[0] && this.getCustomCssClass(row[0]);

            // If a custom non-Ext CSS cell class is found we grab it, if not we fall back to nth-child
            if (cellCss) {
                cellSelector = '.' + cellCss;
            } else {
                var cellIndex = this.getNthPosition(node, 'x-grid-cell');
                cellSelector = '.x-grid-cell:nth-child(' + (cellIndex + 1) + ')';
            }

            // If a custom non-Ext CSS row class is found we grab it, if not we fall back to nth-child
            if (rowCss) {
                rowSelector = '.' + rowCss;
            } else {
                var rowIndex = this.getNthPosition(node, 'x-grid-row');
                rowSelector = '.x-grid-row:nth-child(' + (rowIndex + 1) + ')';
            }

            var nestedRule = rowSelector + ' > ' + cellSelector;
            if (result[0].length > 0) {
                // Something was found inside the grid cell (we ignore x-grid-cell-inner, so could be tree-arrow, checkbox etc)
                nestedRule += ' ' + result[0][0];
            }

            // Scoped rule goes first, best match
            result[0].splice(0, 0, nestedRule, cellSelector);

            result[1].push(rowSelector);

            return result;
        }
    }
});
