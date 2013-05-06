#! /usr/local/bin/node

// Standard Node.js Library Require
var repl  = require('repl');
var fs    = require('fs');
var path  = require('path');
var proc  = require('child_process');

// 3rd Party Library Require
var watch = require('node-watch');

/** Functions */

function staticAnalysis(file) {
  var handleJshint = function(err, stdout, stderr) {
    console.log(stdout);
    if ( err === null ) {
        console.log('No errors found.')
        proc.exec('growlnotify -name "JSHint" -m "Linting found no errors" Success');
        proc.exec('/usr/local/bin/ctags -f ' + process.cwd() + '/tags .');
    } else {
        console.log('Errors found!')
        proc.exec('growlnotify -name "JSHint" -m "Linting found errors" Failure');
    }
  };

  console.log('detected event on file [' + file + ']\n');
  fs.exists(file, function(exists) {
    if ( exists ) {
      proc.exec('jshint ' + file, handleJshint);
    } else {
      console.log('file was DESTROYED');
    }
  });
}

// Function called by the watch code to determine if the file needs watching
function filter(regex, fn) {
  return function(file) { if (regex.test(file)) { fn(file); } };
}

// Composing the filter
function js_filter(fn) { return filter(/\.js$/, fn); }

/** Now for the logic */

console.log('Starting to watch ' + process.cwd());
watch(/* current dir */ process.cwd(),
      /* listener    */ js_filter(staticAnalysis));

repl.start(" >> ", null, null, null, true);
