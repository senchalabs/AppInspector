module.exports = {
    dist: {
        options: {
            buildnumber: false, // change to »true« to increase build number
            background: {
                target: 'background.js'
            }
        },
        src: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>'
    }
};
