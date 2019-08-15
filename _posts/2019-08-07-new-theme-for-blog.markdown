---
layout: post
published: true
comments: true
title: "New Theme for Blog"
date: "2019-08-07 22:35:50 -0400"
img: Jekyll.png
tags:
    - Jekyll
    - GitHub
    - Web Design
    - CSS
    - HTML5
    - Markdown
---
Today I decided that I wanted to give my Jekyll blogging site a fresh coat of paint as I've been using the same theme for a few years. After some experimentation and relearning some of the basics of **Jekyll** I was able to switch to the [Flexible Jekyll](https://github.com/artemsheludko/flexible-jekyll) theme. After applying the theme it became increasingly apparent, however that I would once again have to make my own CSS modifications in order for everything to display correctly. I also wanted to add some nice little touches like highlight colors and the search mechanism I had in my previous theme.

## Custom CSS

So once again I had issues with Syntax highlighting with a new theme. Seems to be a trend with all the Jekyll themes. The GitHub Gist other line highlights were two loud and the line numbers were not lined up right with the code itself. These were for the most part simple fixes but it just goes to show that any time you add a theme in Jekyll it is probably best to apply your own custom CSS to the theme for the pieces that may not suit you. These themes are *NOT* one size fits all. One thing I did differently this time however was instead of downloading the theme directly into my GitHub Website repository, I am now using the new Jekyll Gem **jekyll-remote-theme**. This allows you to load the theme when the site is built and I believe keep it up to date. I also when applying my CSS to the built in copied down the main CSS and then added the following lines at the top to load the main CSS and allow me to customize said CSS:

```css
@import "main.css";
@import "custom.css";
```
Now that we can use custom CSS, I can make changes to how things behave on the site. If you are interested in just pulling my CSS Styles and adjusting them for your site feel free to copy the *custom.css* code below:

{% highlight html linenos %}

/* Fix Code Blocks */
pre {
    white-space: pre !important;
}
.lineno {
    user-select: none !important;
    margin: 0 auto !important;
}
.rouge-table td {
    padding:inherit !important;
}
.rouge-table td.gutter.gl {
    width:7% !important;
}
.rouge-table td.code {
    width:93% !important;
}
.rouge-table {
    width:inherit !important;
}
.article-page {
    width: 100% !important;
}
/* Shrink Cover Images */
.page-cover-image {
    max-height: none !important;
    max-width: 25% !important;
    margin: 0 auto !important;
    background-color: #fff !important;
}
/* Make Thumbnails a nice size */
.post-thumbnail {
    background-size: 65% !important;
    background-repeat: no-repeat !important;
}

/* Remove Facebook Icon */
.contact li:nth-child(2) {
    display: none !important;
}

/* Fix Gist Hightlighting */
table tr:nth-child(even) {
  background: #eee !important;
}

/* Center navigation */
.container {
    display: block !important;
    margin: 0 auto !important;
}

.pagination ul {
    display: inline-flex !important;
}
.pagination ul p {
    padding-left: 0.5em !important;
    padding-right:0.5em !important;
}

/* Format Projects List */
.projects-title {
    font-size:1.25em;
    font-weight:bold;
    background: cadetblue;
    color:#ffffff;
    text-align:center;
    margin-top: 5.0em;
    padding-top:0.25em;
    padding-bottom:0.25em;
    display:block;
    font-smooth: always;
    -webkit-font-smoothing: antialiased;
    border-radius: 5px;
    width: 102%;
}
.projects ul {
    list-style-type: none !important;
    padding-left: 0 !important;
    width: 100% !important;
}
.projects a {
    color: #263959;
    text-decoration: none;
}
.projects a:hover {
    color: cadetblue;
}

/* Format Search Results */
.sidebar {
    overflow: auto;
}

#search-input {
    width:100%;
    margin: 0 auto 2.0em;
    display: block;
}

#results-container {
  list-style-type:none;
  margin: 0 auto;
  margin-bottom: 5.0em;
  z-index:5;
  background-color: #fff;
}
.search-wrapper ul {
    padding-left: 0 !important;
}
.search-wrapper ul li a {
    color: #263959;
    text-decoration: none;
}
.search-wrapper ul a:hover {
    color: cadetblue;
}
.search-wrapper ul li:hover {
    -webkit-transform: translate(0px, -2px);
    -ms-transform: translate(0px, -2px);
    transform: translate(0px, -2px);
}
.search-wrapper ul li {
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5em;
    margin-bottom: 0.5em;
}

/* Format links in blog posts */
.wrap-content a {
    color: #263959 !important;
    text-decoration: none !important;
}
.wrap-content a:hover {
    color: cadetblue !important;
}

.about .author-name::after {
    display: none !important;
}
.about .author-name p {
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5em;
    margin-bottom: 0.5em;
}
.about .author-name p:nth-child(2) {
    font-size: 15px;
    margin: 0 0 10px;
    text-transform: none !important;
    font-weight: normal !important;
    text-align: left;
}
/* New Navigation Arrows */
i.fa.fa-arrow-circle-o-left {
    font-size:25px;
}
i.fa.fa-arrow-circle-o-left:hover {
    color: cadetblue;
}
i.fa.fa-arrow-circle-o-right {
    font-size:25px;
}
i.fa.fa-arrow-circle-o-right:hover {
    color: cadetblue;
}
/* Contact cadetblue highlight */
.contact i.fa.fa-twitter:hover {
    color: cadetblue;
}
.contact i.fa.fa-github:hover {
    color: cadetblue;
}
.contact i.fa.fa-linkedin:hover {
    color: cadetblue;
}
.contact i.fa.fa-envelope-o:hover {
    color: cadetblue;
}
/* Format Post Link Headings to cadetblue */
.post h2 a:hover {
    color: cadetblue !important;
}

.about .cover-author-image {
    background-color: cadetblue !important;
}
{% endhighlight %}

Now that everything is adjusted and looking pretty, it was time to begin pulling the search feature back into the layout

## Search

To add the search, we once again use the same files we had in the original theme which are from [Simple Jekyll Search](https://github.com/christian-fei/Simple-Jekyll-Search). I have kept these files intact as I didn't really need to make any changes but of course I'll probably update the search to the newer version soon.

Adding the search required us pulling down the *main.html* file as we are going to make changes to the default file. Remember, any files we place in our repository manually will **OVERRIDE** the remote version. Using the following code in our *main.html* and then combined with the Search json files and the CSS listed above we now have Search capabilities on the site.

{% highlight html linenos %}
<input type="text" id="search-input" placeholder="search...">
<div class="search-wrapper"><ul id="results-container"></ul>
</div>
<script src="{{ site.baseurl }}/js/jekyll-search.js" type="text/javascript"></script>
<script type="text/javascript">
SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: '{{ site.baseurl }}/search.json',
  searchResultTemplate: '<li style="display:block;"><a href="{url}" title="{title}">{title}</a></li>',
  noResultsText: 'No results found',
  limit: 10,
  fuzzy: true
})
</script>
{% endhighlight %}

## Finishing Touches

One thing I never did that I probably should have was add images for **ALL** posts so that all posts in the pagination lists looked consistent. Lastly, I had to go through all of my posts themselves to adjust image links and attachment links as these links needed updated for the new theme.

## Special Thanks

Once again [John Pater](https://github.com/jpat14) was great in assisting me with the trials and tribulations of CSS as it is always an adventure. If you have questions or comments please let me know.
