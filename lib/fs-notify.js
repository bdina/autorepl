const fs    = require('fs'),
      util  = require('util'),
      path  = require('path'),
      exec  = require('child_process').exec,
      watch = require('watch')

/** TYPES **/

const Types = ( function () {
    return {
        JAVASCRIPT: function () { return 'js' }
    }
} () )

/** FUNCTIONS **/

const exec_each_file = function (type, fn, path) {
    const file_ext = '\.' + type + '$'
    const find_then_grep = 'find ' + path + ' | grep ' + file_ext

    const apply_each_file = function (err, stdout, stderr) {
        const file_fn = function (file) {
            if (file) {
                util.puts('watching ' + file);
                fs.watchFile(file, function (curr, prev) {
                    util.puts('EVENT on: ' + file)
                    fn(file, fs.statSync(file))
                })
            } else { return }
        }

        if ( err ) { return } else { stdout.split('\n').forEach(file_fn) }
    }

    exec(find_then_grep, apply_each_file)
}

const lint_and_notify = function (fname, fstat) {
  const handleJshint = function(err, stdout, stderr) {
    util.puts(stdout)
    if ( err ) {
        exec('growlnotify -name "JSHint" -m "Linting found errors" Failure')
    } else {
        util.puts('No errors found.')
        exec('growlnotify -name "JSHint" -m "Linting found no errors" Success')
        exec('/usr/local/bin/ctags -f ' + process.cwd() + '/tags .')
    }
  }

  util.puts('detected event on file [' + fname + ']')

  if ( !fstat.isDirectory() ) {
    exec('jshint ' + fname, handleJshint)
  }
}

/** EXPORTS **/

exports.lint_js = exec_each_file.bind(null, Types.JAVASCRIPT(), lint_and_notify)
