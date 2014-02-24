module.exports = {
    dist: {
        options: {
            buildnumber: false,
            background: {
                target: 'background.js'
            }
        },
        src: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>'
    }
};
