var exec = require('child_process').exec,
    fs = require('fs');

module.exports = function (grunt) {

  var checks = {
    compilerPath:
      'Specify path to compiler.jar as the ' + 'compilerPath'.red + ' property\n' +
      'grunt-commonjs-compiler uses Closure Compiler to compile and optimize CommonJS modules\n' +
      'You can obtain it at ' + 'http://dl.google.com/closure-compiler/compiler-latest.zip'.blue.underline,
    entryModule : 'Specify ' + 'entryModule'.red + ' property (e.g. \'main.js\').',
    output      : 'Specify ' + 'output'.red + ' property (e.g. \'build.js\').'
  };

  grunt.registerMultiTask('commonjs-compiler', 'Build CommonJS modules tree, compile it', function () {
    var options = this.data;

    for (var property in checks) {
      if (!options[property]) {
        grunt.log.error(checks[property]);
        return false;
      }
    }

    options.cwd = options.cwd || '.';
    options.maxBuffer = options.maxBuffer || 500;

    var output = options.cwd + '/' + options.output;
    grunt.file.write(output, '');

    var done = this.async(),
        command =
        'java -jar "' + options.compilerPath + '/compiler.jar"' +
        ' --js="' + getRequiredModules(options.entryModule, options.cwd).join('" --js="') + '"' +
        ' --js_output_file="' + options.output + '"' +
        ' --compilation_level=ADVANCED_OPTIMIZATIONS' +
        ' --process_common_js_modules' +
        ' --common_js_entry_module="' + options.entryModule + '"' +
        ' --output_wrapper="(function(){%output%})();"';

    if (options.externs) command += ' --externs="' + options.externs.join('" --externs="') + '"';
    if (options.define) command += ' --define=\'' + options.define + '\'';

    exec(command, {
      cwd      : options.cwd,
      maxBuffer: options.maxBuffer << 10
    }, onCompile);

    function onCompile(error, stdout, stderr) {
      if (error) {
        grunt.log.error(error);
        done(false);
        return false;
      }

      grunt.log.writeln(
        'Modules compiled and saved in', output.green + ', file size',
        fs.readFileSync(output, 'utf8').length.toString().green, 'bytes'
      );

      if (stderr && options.report) {
        fs.writeFile(options.report, stderr, onReport);
      } else {
        done();
      }
    }

    function onReport(error) {
      if (error) {
        grunt.log.error(error);
        done(false);
      } else {
        grunt.log.writeln('Report saved in', options.report.green);
        done();
      }
    }

  });

  function getRequiredModules(entryModule, cwd) {
    grunt.log.writeln('Building dependency tree starting from module:', (cwd + '/' + entryModule).green);

    var stack = [entryModule],
        dependencies = {},
        dep;

    while (dep = stack.pop()) {
      if (dependencies[dep]) continue;
      dependencies[dep] = true;
      stack = stack.concat(getDependencies(cwd + '/' + dep));
    }

    dependencies = Object.keys(dependencies);
    grunt.log.writeln('Modules:', dependencies.join(' ').green);
    return dependencies;
  }

};

var newlineRE = /\n/,
    requireRE = /require\(['"]([^'"]+)['"]/;

function getDependencies(filename) {
  var lines = fs.readFileSync(filename, 'utf-8').split(newlineRE),
      dependencies = [],
      match;

  for (var i = 0; i < lines.length; ++i) {
    if (match = lines[i].match(requireRE)) {
      dependencies.push(match[1] + '.js');
    }
  }

  return dependencies;
}