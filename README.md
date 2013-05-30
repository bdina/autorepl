AutoREPL
========

Simple program that launches a REPL with a few perks. The directory where the REPL is brought up from as well as its subdirectories are watched for changes to JavaScript sources. When a file is changed it is auto-linted and then scanned for ctags.

Requirements
------------

This program was developed and tested on a Mac running OS X 10.8.x.

    This program requires the following programs to be in the shells execution path:
        * find
        * grep
        * jshint

    This program also requires that the following program(s) are located in /usr/local/bin:
        * ctags
