module.exports = {
    dist: {
        options: {
            archive: 'package/AppInspector.zip'
        },
        files: [{
            expand: true,
            cwd: 'dist/',
            src: ['**'],
            dest: ''
        }]
    }
};
