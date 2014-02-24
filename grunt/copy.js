// Put files not handled in other tasks here
module.exports = {
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
