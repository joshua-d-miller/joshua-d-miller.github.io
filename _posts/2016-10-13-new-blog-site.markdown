---
title: New Blog Site
layout: post
date: 2016-10-13 16:55:51
type: post
published: true
comments: true
status: publish
categories:
    - Web Design
    - CSS
    - HTML5
    - Markdown
tags:
    - Jekyll
    - GitHub
---
Over the last week I have been experimenting with Jekyll per the recommendation of my colleague [Nick Kline](https://github.com/ndkline "Nick's GitHub") to move away from WordPress and its ads. So far, things have been great and I'm liking the way Jekyll works. I was able to perform an export from WordPress of all my posts but I still had to do some cleanup of the posts in order for them to display properly. Here are some of the issues that were the most trying:

- A lot of line breaks that needed removed from the posts
- The code that was in wordpress needed restructured (Previous issue applies too)
- The metadata from the WordPress posts caused a bunch of useless information to display alongside the date<br/><br/>

After going through all of my individual posts and rectifying these issues I then chose to use the [end2end](https://github.com/nandomoreirame/end2end "End2End Theme") which presented its own challenged. Since the CSS is developed by someone else, I had to go through and determine how to make certain things display correctly such as using **rouge** instead of **pygments**. This was especially tricky as everything was being moved to one side. There were also some issues with the gist line numbers displaying. To remedy these issue, I modified the **_syntax.scss** file. I also changed the theme to the [Friendly](https://raw.githubusercontent.com/jwarby/pygments-css/master/friendly.css "Friendly Pygments Theme (Works with rouge)"). Listed below is my SCSS file for your use:

{% highlight scss linenos %}
.highlight {
  @extend %clearfix;
  padding: 0;
  margin: {
    top: 1.2em;
    bottom: 1.2em;
  };

  &, .hll, pre, code {
    border: none;
  }
  pre {
    margin: 0;
    white-space: pre;
    line-height: 23px;
    overflow-x: auto;
    overflow-y: hidden;
    margin-bottom: 0;
    word-break: inherit;
    word-wrap: inherit;

    code {
      white-space: pre;
      padding: 0;
    }
  }
  // lineno customization
  .lineno {
    background-color:#F0F8FF;
    font-weight:bold;
    width:3em;
    padding: 0.25em 0.25em 0.25em 0em;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Chrome/Safari/Opera */
    -khtml-user-select: none;    /* Konqueror */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;           /* Non-prefixed version, currently
                                  not supported by any browser */
  }
  // fix rouge lineno gutter
  td.gutter.gl {
    width:3em;
    padding-right:3.5em;
  }
  .hll { background-color: #ffffcc }
  .c { color: #60a0b0; font-style: italic } /* Comment */
  .err { border: 1px solid #FF0000 } /* Error */
  .k { color: #007020; font-weight: bold } /* Keyword */
  .o { color: #666666 } /* Operator */
  .cm { color: #60a0b0; font-style: italic } /* Comment.Multiline */
  .cp { color: #007020 } /* Comment.Preproc */
  .c1 { color: #60a0b0; font-style: italic } /* Comment.Single */
  .cs { color: #60a0b0; background-color: #fff0f0 } /* Comment.Special */
  .gd { color: #A00000 } /* Generic.Deleted */
  .ge { font-style: italic } /* Generic.Emph */
  .gr { color: #FF0000 } /* Generic.Error */
  .gh { color: #000080; font-weight: bold } /* Generic.Heading */
  .gi { color: #00A000 } /* Generic.Inserted */
  .go { color: #808080 } /* Generic.Output */
  .gp { color: #c65d09; font-weight: bold } /* Generic.Prompt */
  .gs { font-weight: bold } /* Generic.Strong */
  .gu { color: #800080; font-weight: bold } /* Generic.Subheading */
  .gt { color: #0040D0 } /* Generic.Traceback */
  .kc { color: #007020; font-weight: bold } /* Keyword.Constant */
  .kd { color: #007020; font-weight: bold } /* Keyword.Declaration */
  .kn { color: #007020; font-weight: bold } /* Keyword.Namespace */
  .kp { color: #007020 } /* Keyword.Pseudo */
  .kr { color: #007020; font-weight: bold } /* Keyword.Reserved */
  .kt { color: #902000 } /* Keyword.Type */
  .m { color: #40a070 } /* Literal.Number */
  .s { color: #4070a0 } /* Literal.String */
  .na { color: #4070a0 } /* Name.Attribute */
  .nb { color: #007020 } /* Name.Builtin */
  .nc { color: #0e84b5; font-weight: bold } /* Name.Class */
  .no { color: #60add5 } /* Name.Constant */
  .nd { color: #555555; font-weight: bold } /* Name.Decorator */
  .ni { color: #d55537; font-weight: bold } /* Name.Entity */
  .ne { color: #007020 } /* Name.Exception */
  .nf { color: #06287e } /* Name.Function */
  .nl { color: #002070; font-weight: bold } /* Name.Label */
  .nn { color: #0e84b5; font-weight: bold } /* Name.Namespace */
  .nt { color: #062873; font-weight: bold } /* Name.Tag */
  .nv { color: #bb60d5 } /* Name.Variable */
  .ow { color: #007020; font-weight: bold } /* Operator.Word */
  .w { color: #bbbbbb } /* Text.Whitespace */
  .mf { color: #40a070 } /* Literal.Number.Float */
  .mh { color: #40a070 } /* Literal.Number.Hex */
  .mi { color: #40a070 } /* Literal.Number.Integer */
  .mo { color: #40a070 } /* Literal.Number.Oct */
  .sb { color: #4070a0 } /* Literal.String.Backtick */
  .sc { color: #4070a0 } /* Literal.String.Char */
  .sd { color: #4070a0; font-style: italic } /* Literal.String.Doc */
  .s2 { color: #4070a0 } /* Literal.String.Double */
  .se { color: #4070a0; font-weight: bold } /* Literal.String.Escape */
  .sh { color: #4070a0 } /* Literal.String.Heredoc */
  .si { color: #70a0d0; font-style: italic } /* Literal.String.Interpol */
  .sx { color: #c65d09 } /* Literal.String.Other */
  .sr { color: #235388 } /* Literal.String.Regex */
  .s1 { color: #4070a0 } /* Literal.String.Single */
  .ss { color: #517918 } /* Literal.String.Symbol */
  .bp { color: #007020 } /* Name.Builtin.Pseudo */
  .vc { color: #bb60d5 } /* Name.Variable.Class */
  .vg { color: #bb60d5 } /* Name.Variable.Global */
  .vi { color: #bb60d5 } /* Name.Variable.Instance */
  .il { color: #40a070 } /* Literal.Number.Integer.Long */

  // .gh { } /* Generic Heading & Diff Header */
  .gu { color: #75715e; } /* Generic.Subheading & Diff Unified/Comment? */
  .gd { color: #f92672; } /* Generic.Deleted & Diff Deleted */
  .gi { color: #a6e22e; } /* Generic.Inserted & Diff Inserted */
}

// GitHub Linenos Fix
.gist {
  .blob-num {
    width:5% !important;
  }
}
{% endhighlight %}

I still have a few more things to fix as I migrated my WordPress comments to [Disqus](http://disqus.com "Disqus") but they don't seem to show up in the corresponding posts. Not a deal breaker but it would be nice to have a complete and full migration. Hopefully with this migration it will get me to actually makes posts more often as well as document.
