    ____   ____ ______ ____    ___
    || \\ ||    | || | || \\  // \\
    ||_// ||==    ||   ||_// ((   ))
    || \\ ||___   ||   || \\  \\_//
    a personal, minimalistic forth

## Background

RETRO is a Forth dialect drawing influences from many sources. It uses
some, but not all of Chuck Moore's newer ideas. It's clean, elegant,
and tiny. It may not have many features, and it may not be particularly
useful by itself, but it's easy to grasp and easily adapted to various
uses.

This is the twelfth generation of the language and related programming
environment. It is a fresh start and is not compatible with the
previous generation.

## About This

This is a JavaScript implementation of Nga and Retro's UI. It's similar
to the interface used for the iOS implementation.

Try it at: [http://forthworks.com:8000/](http://forthworks.com:8000/)

Interface:

    +-------------+-------------+
    | editor area | toolbar     |
    |             +-------------+
    |             | output      |
    |             |             |
    |             |             |
    |             |             |
    |             |             |
    |             |             |
    |             |             |
    |             +-------------+
    |             | listener    |
    +-------------+-------------+

In the editor:

* Code goes in fenced regions (start and end with ````)
* Everything outside these is commentary
* This is cached as you work

Toolbar:

* Save / reload a snapshot of the editor contents
* Clear the output
* "Go" to evaluate the code in the editor

Listener:

* Type a line of code, hit enter to run immediately

Example:

    # Debugging Aids

    These display words with a particular class.


    ````
    :words:immediate (-)
      [ dup d:class fetch &class:macro eq?
        [ d:name puts sp ] [ drop ] choose ] d:for-each ;
    :words:normal    (-)
      [ dup d:class fetch &class:word eq?
        [ d:name puts sp ] [ drop ] choose ] d:for-each ;
    :words:data      (-)
      [ dup d:class fetch &class:data eq?
        [ d:name puts sp ] [ drop ] choose ] d:for-each ;
    ````

    # Tests

    ````
    #3 #2 #1 '%n+%n=%n s:with-format puts nl
    $a $b $c .s nl reset
    #12 n:square putn nl
    ````

## Legalities

Permission to use, copy, modify, and/or distribute this software for
any purpose with or without fee is hereby granted, provided that the
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL
DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR
PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.

Retro 12 is:

    Copyright (c) 2008 - 2017, Charles Childers

Portions of the code derive from Retro 11, which is:

    Copyright (c) 2008 - 2016, Charles Childers
    Copyright (c) 2012 - 2013, Michal J Wallace
    Copyright (c) 2009 - 2011, Luke Parrish
    Copyright (c) 2009 - 2010, JGL
    Copyright (c) 2010 - 2011, Marc Simpson
    Copyright (c) 2011 - 2012, Oleksandr Kozachuk
    Copyright (c) 2010,        Jay Skeer
    Copyright (c) 2010,        Greg Copeland
    Copyright (c) 2011,        Aleksej Saushev
    Copyright (c) 2011,        Foucist
    Copyright (c) 2011,        Erturk Kocalar
    Copyright (c) 2011,        Kenneth Keating
    Copyright (c) 2011,        Ashley Feniello
    Copyright (c) 2011,        Peter Salvi
    Copyright (c) 2011,        Christian Kellermann
    Copyright (c) 2011,        Jorge Acereda
    Copyright (c) 2011,        Remy Moueza
    Copyright (c) 2012,        John M Harrison
    Copyright (c) 2012,        Todd Thomas
