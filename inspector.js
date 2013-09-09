/**
 * Page Load
 */
window.addEventListener('DOMContentLoaded', function() {
    AppInspector.InspectedWindow.checkAPI(function() {
        new AppInspector.Viewport();
    });
});