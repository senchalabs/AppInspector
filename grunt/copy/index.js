// Put files not handled in other tasks here

var copy = {
    dist: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
                '*.{html,js}', '_locales/**/*'
            ]
        }, {
            expand: true,
            cwd: '<%= yeoman.app %>/AppInspector/build/production/AI',
            dest: '<%= yeoman.dist %>/AppInspector',
            src: [
                '*.{html,js}',
                'resources/*.css'
            ]
        }]
    }
};

module.exports = copy;
