var dist = {
    files: [{
        dot: true,
        src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
        ]
    }]
};

module.exports = dist;
