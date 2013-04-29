#! /usr/local/bin/node

var repl  = require('repl');
var fs    = require('fs');
var watch = require('node-watch');
var path  = require('path');
var proc  = require('child_process');

/** Functions */

function staticAnalysis(file) {
  console.log('detected event on file [' + file + ']\n');
  fs.exists(file, function(exists) {
    if ( exists ) {
      proc.exec('/usr/local/bin/jshint ' + file, function(err, stdout, stderr) { console.log(stdout); });
    } else {
      console.log('file was DESTROYED');
    }
  });
}

function filter(regex, fn) {
  return function(file) { if (regex.test(file)) { fn(file); } }
}

function js_filter(fn) { return filter(/\.js$/, fn) }

/** Now for the logic */

console.log('Starting to watch ' + process.cwd());
watch(/* current dir */ process.cwd(),
      /* listener    */ js_filter(staticAnalysis));

repl.start(" >> ", null, null, null, true);
