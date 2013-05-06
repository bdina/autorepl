#! /usr/local/bin/node

// Standard Node.js Library Require
var repl = require('repl');
var fs   = require('fs');
var path = require('path');
var proc = require('child_process');

// 3rd Party Library Require
var watcher = require('fs-watch-tree');

/** Functions */

function lint_and_notify(e) {
  var handleJshint = function(err, stdout, stderr) {
    console.log(stdout);
    if ( err === null ) {
        console.log('No errors found.');
        proc.exec('growlnotify -name "JSHint" -m "Linting found no errors" Success');
        proc.exec('/usr/local/bin/ctags -f ' + process.cwd() + '/tags .');
    } else {
        proc.exec('growlnotify -name "JSHint" -m "Linting found errors" Failure');
    }
  };

  console.log('detected event on file [' + e.name + ']');

  if ( e.isModify() && !e.isDirectory() ) {
    proc.exec('jshint ' + e.name, handleJshint);
  }
}

/** Now for the logic */

console.log('Starting to watch ' + process.cwd());
watcher.watchTree(/* current dir */ process.cwd(),
                  /* options     */ { exclude: [ 'node_modules', '.git', /^((?!.js).)*$/ ] },
                  /* listener    */ lint_and_notify);

repl.start(" >> ", null, null, null, true);
