grunt-commonjs-compiler
=======================

Grunt task for compiling client-side CommonJS modules into one file.

It takes only required files, not everything.

## Installing

```bash
npm install grunt-commonjs-compiler
```

Also you can add --save or --save-dev to save this dependency in package.json:
```bash
npm install grunt-commonjs-compiler --save-dev
```

## Adding Grunt task

Modify Gruntfile.js:
```javascript
module.exports = function (grunt) {
    
    grunt.initConfig({
        'commonjs-compiler': {
            main: {
                cwd         : 'js',                  // scripts path, optional
                compilerPath: '..',                  // compiler.jar location
                entryModule : 'main.js',
                output      : '../build.js',         // output file location
                externs     : ['externs/jquery.js'], // optional
                report      : 'build-report.txt'     // optional
                define      : 'SOME_VAR=true'        // @define, optional
            }
        }
	});

    grunt.loadNpmTasks('grunt-commonjs-compiler');

};
```

## compiler.jar
grunt-commonjs-compiler uses Closure Compiler to compile and optimize CommonJS modules.

You can obtain it [here](http://dl.google.com/closure-compiler/compiler-latest.zip)

## Quick example
To see it in action without smoking too much of documentation:

### Download stuff
```bash
git clone https://github.com/Indamix/grunt-commonjs-compiler.git .
npm install
curl http://dl.google.com/closure-compiler/compiler-20131014.tar.gz | tar zx
```

### Compile example project
```bash
grunt test
```
grunt-commonjs-compiler will build a CommonJS module tree starting from test/client/main.js and write the compiled code to test/build.js

Notice that the compiled build doesn't include test/client/unused.js as no module requires it.