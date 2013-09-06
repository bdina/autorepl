/** MODULE GLOBALS **/
const fs    = require('fs'),
      path  = require('path'),
      repl  = require('repl'),
      util  = require('util'),
      exec  = require('child_process').exec

const Script = process.binding('evals').Script || process.binding('evals').NodeScript

const context = repl.start( { prompt : ' >> ' }, null, null, null, true).context

const puts_and_prompt = function () {
  util.puts.apply(this, arguments)
  util.print(' >> ')
}

/** TYPES **/

const Types = ( function () {
  return {
    JAVASCRIPT: function () { return 'js' }
  }
} () )

/** FUNCTIONS **/

const object_name = function (fname) {
  const s = fname.split('/')
  return s[s.length-1].split('.')[0]
}

const load_code = function (fname) {
  const script = new Script(fs.readFileSync(fname, 'utf8'))
  try {
    script.runInNewContext(context);
  } catch (e) {
    util.puts('Error loading code: ' + e);
  }
}

const exec_each_file = function (type, fn, path) {
  const file_ext = '.' + type + '$'
    const find_then_grep = 'find ' + path + ' | grep ' + file_ext

    const apply_each_file = function (err, stdout) {
      const file_fn = function (file) {
        if (file) {
          load_code(file)
          puts_and_prompt('Watching ' + file);
          fs.watchFile(file, function () {
            fn(file, fs.statSync(file))
          })
        } else { return }
      }

      if ( err ) { return } else { stdout.split('\n').forEach(file_fn) }
    }

    exec(find_then_grep, apply_each_file)
}

const lint_load_and_notify = function (fname, fstat) {
  const handleJshint = function(err, stdout) {
    util.puts('\n' + stdout)
      if ( err ) {
        exec('growlnotify -n "JSHint" -m "Linting found errors" Failure')
      } else {
        load_code(fname)
        puts_and_prompt('No errors found.')
        exec('growlnotify -n "JSHint" -m "Linting found no errors" Success')
      }
  }

  util.puts('\nDetected event on file [' + fname + ']')
    exec('/usr/local/bin/ctags -R --c++-kinds=+p --fields=+iaS --extra=+q -f ' + process.cwd() + '/tags .')

    if ( !fstat.isDirectory() ) {
      exec('jshint ' + fname, handleJshint)
    }
}

/** EXPORTS **/

exports.lint_js = exec_each_file.bind(null, Types.JAVASCRIPT(), lint_load_and_notify)
