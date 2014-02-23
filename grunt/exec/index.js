var exec = {
    build: {
        cwd: '<%= yeoman.app %>/AppInspector/',
        command: 'sencha -q app build -e production -c'
    }
};

module.exports = exec;
