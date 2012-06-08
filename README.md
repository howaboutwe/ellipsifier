Ellipsifier
===========

Ellipsifier is a Javascript library that truncates HTML. It will retain
the tag structure, counting only visible characters in the resulting
text.

Dependencies
------------

Ellipsifier requires [underscore.js](http://underscorejs.org/) and John
Resig's [htmlparser.js](http://ejohn.org/blog/pure-javascript-html-parser/).
Both can be found in the `vendor` directory.

Usage
-----

Creating a new Ellipsifier instance will set the `result` property to
have the ellipsified text. It will use a "&hellip;" character to
indicate that the text has been truncated.

    new Ellipsifier("to be or not to be", 5).result
    /* "to be&nbsp;&hellip;" */

It won't count HTML markup as part of the character limit, and if the
truncation occurs inside HTML tags, it will properly close those tags.

    new Ellipsifier('to <strong>be or</strong> not to be', 20).result
    /* 'to <strong>be or</strong> not to be' */

    new Ellipsifier('to <strong>be or</strong> not to be', 5).result
    /* 'to <strong>be</strong>&nbsp;&hellip;' */

Optionally, you can pass a `class` option, which will wrap an ellipsis
in a span with that class.

    new Ellipsifier("to be or not to be", 5, {class: 'ellipsified'}).result
    /* 'to be&nbsp;<span class=\'ellipsified\'>&hellip;</span>' */

Copyright
---------

Copyright (c) 2012 HowAboutWe. See MIT-LICENSE for further details.

