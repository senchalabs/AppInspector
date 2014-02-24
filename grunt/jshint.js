module.exports = {
    options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
    },
    // lint task files
    grunt: [
        'Gruntfile.js',
        'grunt/**/*.js'
    ],
    // lint app files
    app: [
        '<%= yeoman.app %>/AppInspector/app.js',
        '<%= yeoman.app %>/AppInspector/app/**/*.js'
    ]
};
