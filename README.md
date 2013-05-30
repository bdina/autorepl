AutoREPL
========

Simple program that launches a REPL with a few perks!

It is an AutoREPL because it automates linting and ctag file generation for sources.

### How does it work?

The directory where the REPL is brought up from as well as its subdirectories are watched for changes to JavaScript sources. When a file is changed it is auto-linted and then scanned for ctags.

Requirements
------------

A POSIX-compliant directory structure is required because of the requirement on **ctags** and its location.

The following programs must be in the shells execution path:
* find
* grep
* jshint

The following program(s) must be located in /usr/local/bin:
* ctags
