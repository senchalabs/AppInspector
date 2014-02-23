var compress = {
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

module.exports = compress;
