---
title: Munki Styling - Adding an Image Slider with Thumbnail Previews
layout: post
published: true
comments: true
date: 2017-11-02 15:35:05 -0400
image: images/Munki.png
status: publish
categories:
- Configuration
- Munki
tags:
- CSS
- Javascript
- JQuery
---
So over the past few days I decided I wanted to spice up the way Managed Software Center looks. Some of the things I wanted to change were the colors of the **Install** and **Remove** buttons. It seemed to me that blue for install and red for remove were reasonable. After looking through the very helpful link [Munki 2 Client Customization Showcase](https://groups.google.com/forum/#!searchin/munki-dev/showcase%7Csort:date/munki-dev/PwvrYaqKxGc/nCvIuK8coW0J), I noticed that [@bartreardon](https://twitter.com/bartreardon) had done some CSS in the footer to add some styling to Managed Software Center. This then gave me a great idea to style Munki further to give it more of a customized and tailored look for our users.

The great thing about the Managed Software Center interface is all the initial styling is done in CSS so you can change most of the CSS as long as you know what to reference. If you are going to customize Managed Software Center though I highly recommend visiting the Munki wiki via [Client Customization](https://github.com/munki/munki/wiki/Client-Customization) which does a very good job of showing the basics of customization. Now let's get into the good stuff.

First thing I did when customizing the CSS of Managed Software Center is I put it all in a common place which like @bartreardon](https://twitter.com/bartreardon), I used **footer_template.html**. To change the buttons throughout Managed Software Center for *Install*, *Remove*, *Update* *Check Again* we add the following CSS styling:

{% highlight css linenos %}
/* Install Button */
div.msc-button-inner.not-installed {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#2828A3), color-stop(100%,#1E1E7F));
}

div.msc-button-inner.not-installed:hover {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#000082), color-stop(100%,#000066));
}

div.msc-button-inner.large.not-installed {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#2828A3), color-stop(100%,#1E1E7F));
}

div.msc-button-inner.large.not-installed:hover {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#000082), color-stop(100%,#000066));
}

/* Uninstall Button */
div.msc-button-inner.installed {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#cc0000), color-stop(100%,#b20000));
}

div.msc-button-inner.installed:hover {
    background: -webkit-gradient(linear, left top, left bottom, 
        color-stop(0%,#b20000), color-stop(100%,#7f0000));
}
div.msc-button-inner.large.installed {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#cc0000), color-stop(100%,#b20000));
}

div.msc-button-inner.large.installed:hover {
    background: -webkit-gradient(linear, left top, left bottom, 
        color-stop(0%,#b20000), color-stop(100%,#7f0000));
}

/* Update Available */
div.msc-button-inner.update-available {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#2828A3), color-stop(100%,#1E1E7F));
}

div.msc-button-inner.update-available:hover {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#000082), color-stop(100%,#000066));
}

div.msc-button-inner.large.update-available {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#2828A3), color-stop(100%,#1E1E7F));
}

div.msc-button-inner.large.update-available:hover {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#000082), color-stop(100%,#000066));
}

/* Install all button */
div#install-all-button-text {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#2828A3), color-stop(100%,#1E1E7F));
}
div#install-all-button-text:hover {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#000082), color-stop(100%,#000066));
}

/* My Items Installed */
div.msc-button-inner.install-updates.installed {
    background: -webkit-gradient(linear, left top, left bottom,
        color-stop(0%,#cc0000), color-stop(100%,#b20000));
}
div.msc-button-inner.install-updates.installed:hover {
    background: -webkit-gradient(linear, left top, left bottom, 
        color-stop(0%,#b20000), color-stop(100%,#7f0000));
}
{% endhighlight %}

This code will color the *Install*, *Update* and *Check Again* buttons blue and will color the *Remove* button red if you just copy and paste it into your **footer_template.html** but you can easily change the colors. 

The next thing I wanted to do was make it so the showcase images did not cut off if the user resized the Managed Software Center window. This way the banner always display fully and did not get cut off the window was smaller than the banner size. To perform this it was just adding some simple CSS code into **showcase_template.html** since this had to do with the banners.

{% highlight css linenos %}
.stage img {
    max-width: 100%;
    height: auto !important;
}
{% endhighlight %}

Now that we have some nice touches to Managed Software Center, I wanted to add some real flair and allow users to click featured application banners and see a nice description with screen shots. After asking in the **#munki** channel about banners and seeing Erik Gomez's awesome examples located on his [blog](http://blog.eriknicolasgomez.com/2015/05/07/yosemite-style-banners-for-munki-2/) I decided to use a similar layout and make some featured banners. I also really believe in sharing so listed below are some of the banners I created for your use:

![Solstice](/images/Solstice.png)
![Zoom](/images/Zoom.png)
![Franz](/images/Franz.png)

Now that we have the banners for featured applications, let's go ahead and add the image slider. This one was a tough one because Munki in order to handle custom HTML in **pkginfo** files can strip out certain elements of HTML. Some particular ones I found were **div** and **script**. Luckily, Javascript can easily be put into one of the templates so it doesn't need to be part of the **pkginfo**. As for the **div** which we use to do CSS, we needed an alternative. Luckily, since what we were using the **div** for was horizontal it was very easy to substitute **span** for **div** which worked out great. Now to build the image slider, I first started out with CSS which I had a very hard time centering perfectly as the thumbnail images were outside the main image box using **float** which per the CSS documentation cannot be centered. The recommendation was to use **display: block** but when doing this I still could not center the thumbnails and an extra box around the elements was created. I really liked the look of this [CSS Image Slider with Thumbnails](http://thecodeplayer.com/walkthrough/css3-image-slider-with-stylized-thumbnails) but it just seemed way more trouble than it was worth.

At this point I asked our Programmer Analyst [John Pater](https://github.com/jpat14) for some advice on how to achieve a responsive and nice Image Slider in Managed Software Center and he recommended Javascript or JQuery. Well in the end we actually ended up using both. I stumbled upon [this](https://www.youtube.com/watch?v=Dc2WHsuiXos&t=1s) which was exactly what I was looking for however I was only adding three images which meant the thumbnails were not centered. Also I wanted to add some transition effects similar to the CSS example so that the slider was very nice looking. At this point John recommended adding **jQuery** into the mix with the javascript which allowed us to add and remove CSS effects from the elements easily. Once these changes were made we added the javascript and jquery elements to the **footer_template.html**. Now all we have to do is add the HTML elements to a **pkginfo** that we want an image slider on. We first selected **Adobe Creative Cloud**. The test was successful and we had a beautiful image slider in the description of the software. We can now add this slider to any item in Managed Software Center and all we have to do is change the links to the images. Below is the CSS Code, Javascript and jQuery code in order to achieve this. Once you add these elements you just need to add HTML code to the description of an application to utilize it. I will use our **Adobe Creative Cloud** description as our example.

**CSS**
{% highlight CSS linenos %}
.imgStyle {
    width:100px;
    border:3px solid grey;
}
#mainImage {
    display:block;
    margin:0 auto;
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.75);
}
#divID {
    display: block;
    padding-top: 18px;
    text-align:center;
    margin: 0 auto;
    border-color: #999;
}
#divID img {
    opacity: 0.6;
}
.scale-out {
    transform: scale(1.1);
    opacity: 0;
    transition:all 0.25s;
}
.scale-in {
    transform: scale(1);
    opacity: 1;
    transition:all 0.25s;
}
.thumb-select {
    opacity: 1 !important;
    border-color:#333;
}
{% endhighlight %}

**Javascript and jQuery**
{% highlight html linenos %}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript">

    var images = document.getElementById("divId")
                         .getElementsByTagName("img");

    function changeImageOnClick(event)
    {
        event = event || window.event;
        var targetElement = event.target || event.srcElement;

        if (targetElement.tagName == "IMG")
        {
            $('.imgStyle').removeClass('thumb-select')
            $(targetElement).toggleClass('thumb-select')
            $('#mainImage').removeClass('scale-in')
            $('#mainImage').addClass('scale-out')
            $(".scale-out").one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', 
            function() 
            {
                $('#mainImage').removeClass('scale-out')
                $('#mainImage').addClass('scale-in')
                mainImage.src = targetElement.getAttribute("src");
                
            });
        }
    }
</script>
{% endhighlight %}

**Example Description** - Keep in mind you have to escape HTML in XML
{% highlight xml linenos %}
&lt;html&gt;
&lt;body&gt;
&lt;p&gt;
Creative Cloud gives you the entire collection of Adobe desktop and mobile apps, from essentials like Photoshop CC to next generation tools like Adobe XD CC. You also get built-in templates to jump-start your designs and step-by-step tutorials to sharpen your skills and get up to speed quickly. It’s everything you need to create, collaborate, and get inspired.
&lt;/p&gt;
&lt;br /&gt;
&lt;img id="mainImage" src="Your Main Image/First" height="400px" width="100%"/&gt;
&lt;span id="divID" onclick="changeImageOnClick(event)"&gt;
    &lt;img class="imgStyle thumb-select" src="Your Main Image/First" /&gt;
    &lt;img class="imgStyle" src="Second Image" /&gt;
    &lt;img class="imgStyle" src="Third Image" /&gt;
&lt;/span&gt;
&lt;/body&gt;
&lt;/html&gt;
{% endhighlight %}

My images were **800px** wide and **400px** high. You can obviously change this to how you would like but with this code you should now have a beautiful image slider in Managed Software Center. Here is what it should look like:

![Adobe Creative Cloud](/images/Adobe Creative Cloud - Munki.png)

If you find ways to improve this code I would love to hear your feedback. So one last thing I'd like to do is place all the links in this article here at the bottom for easy consumption. Here they are:

**References**
- [Munki 2 Client Customization Showcase](https://groups.google.com/forum/#!searchin/munki-dev/showcase%7Csort:date/munki-dev/PwvrYaqKxGc/nCvIuK8coW0J)
- [Munki Client Customization](https://github.com/munki/munki/wiki/Client-Customization)
- [Managed Software Center Banners from Erik Gomez](http://blog.eriknicolasgomez.com/2015/05/07/yosemite-style-banners-for-munki-2/)
- [CSS Image Slider with Thumbnails](http://thecodeplayer.com/walkthrough/css3-image-slider-with-stylized-thumbnails)
- [Javascript Image Slider](https://www.youtube.com/watch?v=Dc2WHsuiXos&t=1s)
- [Bart Reardon's Twitter](https://twitter.com/bartreardon)
- [John Pater's GitHub](https://github.com/jpat14)


