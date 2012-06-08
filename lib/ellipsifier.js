/*
Main class that handles ellipsifying
*/
Ellipsifier = function(text, charLimit, opts) {
  this.initialize(text, charLimit, opts);
}
Ellipsifier.prototype = {
  initialize: function(text, charLimit, opts) {
    if (!opts) opts = {};
    this.treeRoot = new Ellipsifier.TreeNode();
    if (text) this.parseHtml(text);
    var builder = new Ellipsifier.HtmlBuilder(this.treeRoot, charLimit);
    this.result = builder.html;
    if (builder.truncated) {
      this.result += "&nbsp;";
      var ellipsisClass;
      if (ellipsisClass = opts['class']) {
        this.result = this.result + "<span class='" + ellipsisClass +
                        "'>&hellip;</span>";
      } else {
        this.result = this.result + '&hellip;';
      }
    }
  },

  parseChars: function(text) {
    this.parseCursor.addChildText(text);
  },

  parseEndTag: function(tag) {
    this.parseCursor = this.parseCursor.parent; 
  },

  parseHtml: function(text) {
    this.parseCursor = this.treeRoot;
    if (text) {
      HTMLParser(
        text,
        {
          start: _.bind(this.parseStartTag, this),
          end: _.bind(this.parseEndTag, this),
          chars: _.bind(this.parseChars, this)
        }
      )
    }
  },

  parseStartTag: function(tag, attrs, unary) {
    var child = this.parseCursor.addChildTag(tag, attrs, unary);
    if (!unary) {
      this.parseCursor = child;
    }
  }
};

/*
Recursively visits each node of a tree and builds the html, keeping track of
visible characters and the overall limit as it goes. Doesn't add the &hellip;
at the end -- that's the job of the Ellipsifier itself.
*/
Ellipsifier.HtmlBuilder = function(treeNode, charLimit) {
  this.initialize(treeNode, charLimit);
}
Ellipsifier.HtmlBuilder.prototype = {
  html: '',
  truncated: false,
  visibleCharCount: 0,

  initialize: function(treeNode, charLimit) {
    this.treeNode = treeNode;
    this.charLimit = charLimit;
    if (treeNode.text) {
      this.buildText();
    } else {
      if (treeNode.tag) {
        this.buildTagStart();
      }
      var self = this;
      _.each(treeNode.children, function(child) {
        self.buildFromChild(child);
      });
      var tag;
      if ((tag = treeNode.tag) && !treeNode.unary) {
        this.html += "</" + tag + ">";
      }
    }
  },

  buildFromChild: function(child) {
    var childBuilder = new Ellipsifier.HtmlBuilder(
      child, this.charLimit - this.visibleCharCount
    );
    this.html += childBuilder.html;
    this.visibleCharCount += childBuilder.visibleCharCount;
    if (childBuilder.truncated) this.truncated = true;
  },

  buildTagStart: function() {
    this.html += "<" + this.treeNode.tag;
    var attrs = this.treeNode.attrs;
    for ( var i = 0; i < attrs.length; i++ )
      this.html += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
    if (this.treeNode.unary) {
      this.html += " />";
    } else {
      this.html += ">";
    }
  },

  buildText: function() {
    var text = this.treeNode.text
    if (text.length > this.charLimit) {
      this.truncated = true; 
      this.html = text.substr(0, this.charLimit);
    } else {
      this.html = text;
    }
    this.visibleCharCount = this.html.length;
  }
};

/*
Node to recursively store HTML of ellipsified text. Not responsible in any way
for counting total visible char length or truncating anything.
*/
Ellipsifier.TreeNode = function(parent) {
  this.initialize(parent);
}
Ellipsifier.TreeNode.prototype = {
  initialize: function(parent) {
    this.parent = parent;
    this.children = [];
  },

  addChildTag: function(tag, attrs, unary) {
    var child = new Ellipsifier.TreeNode(this);
    child.tag = tag;
    child.attrs = attrs;
    child.unary = unary;
    this.children.push(child);
    return child;
  },

  addChildText: function(text) {
    var child = new Ellipsifier.TreeNode(this);
    child.text = text;
    this.children.push(child);
    return child;
  }
};

