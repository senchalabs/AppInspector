var imagemin = {
    dist: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/images'
        }, {
            expand: true,
            cwd: '<%= yeoman.app %>/AppInspector/build/production/AI/resources/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/AppInspector/resources/images'
        }]
    }
};

module.exports = imagemin;
