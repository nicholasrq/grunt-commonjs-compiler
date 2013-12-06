module.exports = function (grunt) {
  grunt.initConfig({
    'commonjs-compiler': {
      test: {
        cwd         : 'test/client',
        compilerPath: '../..',
        entryModule : 'main.js',
        output      : '../build.js',
        externs     : ['externs/file.js'],
        report      : 'build-report.txt'
      }
    },
    watch: {
      files: [
        'tasks/commonjs-compiler.js',
        'test/**/*.js'
      ],
      tasks: 'default'
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', function () {
    grunt.task.run('commonjs-compiler:test');
  });

  grunt.registerTask('default', 'test');
};