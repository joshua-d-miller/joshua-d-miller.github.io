---
layout: post
published: true
comments: true
title: Munki Styling Part Deux
date: 2018-11-30 12:09:00 -4000
img: Munki.png
status: publish
categories:
- Configuration
- Munki
tags:
- CSS
- Javascript
- JQuery
---
This month with the recently released macOS Mojave, I noticed the app store had taken on an all new look. With this new look it got me thinking about the look of Managed Software Center. The CSS in my previous post [Munki Styling - Adding an Image Slider with Thumbnail Previews](https://joshua-d-miller.com/blog/2017/munki-styling-adding-an-image-slider-with-thumbnail-previews/), I showcased adding an Image Slider and an accordian style bulleted list. I also changed the colors of the **Install** and **Remove** buttons in Managed Software Center. These modfiications were great, but with the release of macOS Mojave a lot of my customizations were now not showing up properly. This was especially apparent in the newly showcased **Dark Mode**.

Once again, I dug into the CSS of Managed Software Center which we are able to override easily. So, I decided to work with our web programmer and designer [John Pater](https://github.com/jpat14), who was once again very helpful in determining the best way to fix a lot of the styling for **Dark Mode** as well as adding some new features.

The first new feature we added was a news ticker that will read Penn State's IT Alerts and showcase them as a sliding ticker using jQuery. We decided the best place for this ticker was at the bottom or the **footer_template** in order to showcase the alerts any time someone has Managed Software Center open. With this addition, it made sense to remove the bottom links so you will see the bottom links div is now empty. Listed below is the code that was needed in order to add the news ticker:

{% highlight html linenos %}
<div class="bottom-links">
</div>
<div class="footer-container">
    <img style="width:50px; margin-bottom:10px;" src="We Put a LOGO Here">
    <div class="ITAlerts">
        <div class="TheAlerts">
            <ul>
            </ul>
        </div>
        <div class="contact">
        <span class="contact-line1"><span class="CETC">Carrara Education Technology Center</span>
        <span class="contact-line2">231 Chambers Building<span class="sep-pipe">|</span>University Park, Pennsylvania 16802<span class="sep-pipe">|</span>1.814.865.0626<span class="sep-pipe">|</span><a href="https://help.educ.psu.edu/">help.educ.psu.edu</a></span>
        </div>
    </div>
</div>
{% endhighlight %}

You will see we created a two **<div>** classes for the ITAlerts. This allows us to display the RSS Feed as list items and then through the power of jQuery with some CSS Styling, we can then show only one item at a time and create a fade effect. We decided to take the code shown here at [jQuery Easy Ticker](https://www.aakashweb.com/demos/jquery-easy-ticker/) and then apply it to our **footer_template** as shown below:

{% highlight html linenos %}
<!-- jQuery ITS ALerts Status Bar Ticker -->
<script type="text/javascript">
    $.ajax({
        url: 'https://cors.io/?http://alerts.its.psu.edu/alerts.rss',
        dataType: 'xml',
        success: function(data){
            $(data).find('item').each(function() {
                var linkUrl = $(this).find("link").text();
                var title= $(this).find('title').text();
                $('.TheAlerts ul').append('<li><a href="' + linkUrl + '">' + title + '</li>');
                });
            $('.TheAlerts').easyTicker({
            	interval: 4000,
            	visible: 1,
            });
        },
        error: function(data) {
        }
    });
</script>
<style type="text/css" scoped>
/* CSS Styling for the Ticker */
.ITAlerts {
    width:750px;
    float:left;
	border: 1px solid #03527f;
    border-radius: 5px;
}
.TheAlerts {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	margin: auto;
	position: relative !important;
	padding: 0 0 0 80px;
	border-radius: 5px 5px 0 0;
    font-size: small;
    line-height: 1.5em !important;

}
.TheAlerts:before {
    content: "IT Alerts";
    display: inline-block;
	font-weight: bold !important;
	background: rgb(17, 106, 255);
	padding: 5px;
	color: #FFF;
	font-weight:bold;
	position: absolute;
	top: 0;
	left: 0;
}
.TheAlerts:after {
    content: '';
    display: block;
    top: 0;
    left: 80px;
    height: 20px;
}
.TheAlerts ul li {
    list-style: none;
    padding: 5px;
}
/* Footer CSS Sylting */
.footer-container img {
    float: left;
    display: block;
    position: relative;
    margin-top: 15px;
    margin-right: 10px;
}
.footer-container {
    padding-top: 0.75em;
    display: table;
    margin: 0 auto;
}
.contact-line1, .contact-line2 {
    margin-top: 0 !important;
    display: inline-block;
    list-style: none;
    color: white;
    width: 100%;
    text-align: center;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    line-height: 1.5em !important;
    font-size: small !important;
}
.contact-line1 {
    padding-top: 8px !important;
}
.contact-line2 a{
    color:white;
}
.sep-pipe {
    margin-left: 1.0em;
    margin-right: 1.0em;
}
.CETC {
    font-weight: bold;
}
.contact {
    background: rgb(17, 106, 255);
}
.installation [data-text-truncate-lines] a.text-truncate-toggle {
    visibility: hidden;
}
</style>
{% endhighlight %}

The next thing we added was a feedback button which creates a modal window that can take name, email and comments or concerns. This is also accomplished with jQuery and just takes a small bit of code. We decided to place the feedback button on the sidebar next to our RSS feed which is also jQuery. I will highlight the RSS feed after the feedback button. Here is the html code you will need in the sidebar to add your feedback button. I went with Purple to really make it stand out. You will also need to write a PHP file that can email the data posted from this. Listed below is the code we put into the **sidebar_template**:

{% highlight html linenos %}
<!-- Load jQuery and Bootstrap into the sidebar_template -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<style type="text/css" scoped>
.modal-backdrop {
    display:none !important;
}
.modal {
    top: 13em !important;
}
/* CSS for Bootstrap */
div.lockup-container .title h2, div.titled-container .title h2 {
    line-height: 2px !important;
}
.btn-success:hover {
    background-color: #56449d !important;
    border-color: #523984 !important;
}
.btn-success:focus {
    background-color: #433b86 !important;
    border-color: #2f2556 !important;
}
.btn-success {
    background-color: #735cb8 !important;
    border-color: #5b4cae !important;
}
.btn {
    line-height: 0.85 !important;
}
.modal-header {
    background-color: #735cb8 !important;
    color: white !important;
}
.close {
    color: #ffffff !important;
    font-size: 22px !important;
}
textarea.form-control {
    height: 10em !important;
}
body {
    background-color: transparent !important;
    color: var(--text-color-normal) !important;
    line-height: 1.0em !important;
}
</style>
<!-- jQuery for the modal Contact Form -->
<script>
function submitContactForm(){
    var reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var name = $('#inputName').val();
    var email = $('#inputEmail').val();
    var message = $('#inputMessage').val();
    if(name.trim() == '' ){
        alert('Please enter your name.');
        $('#inputName').focus();
        return false;
    }else if(email.trim() == '' ){
        alert('Please enter your email.');
        $('#inputEmail').focus();
        return false;
    }else if(email.trim() != '' && !reg.test(email)){
        alert('Please enter valid email.');
        $('#inputEmail').focus();
        return false;
    }else if(message.trim() == '' ){
        alert('Please enter your message.');
        $('#inputMessage').focus();
        return false;
    }else{
        $.ajax({
            type:'POST',
            url:'Your URL Here for the PHP',
            data:'contactFrmSubmit=1&name='+name+'&email='+email+'&message='+message,
            beforeSend: function () {
                $('.submitBtn').attr("disabled","disabled");
                $('.modal-body').css('opacity', '.5');
            },
            success:function(msg){
                if(msg == 'Message has been sent'){
                    $('#inputName').val('');
                    $('#inputEmail').val('');
                    $('#inputMessage').val('');
                    $('.statusMsg').html('<span style="color:green;">Thank you for your feedback!</span>');
                }else{
                    $('.statusMsg').html('<span style="color:red;">Some problem occurred, please try again.</span>');
                }
                $('.submitBtn').removeAttr("disabled");
                $('.modal-body').css('opacity', '');
            }
        });
    }
}
</script>

<!-- This code goes into your list items for the sidebar links -->
<li class="button" style="padding: 1em;">
<!-- Modal Window FTW -->
<!-- Button to trigger modal -->
<button target="_blank" class="btn btn-success btn-lg" data-toggle="modal" data-target="#modalForm">
    Submit Feedback
</button>

<!-- Modal -->
<div class="modal fade" id="modalForm" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                    <span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title" id="myModalLabel">Managed Software Center Feedback</h4>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
                <p class="statusMsg"></p>
                <form role="form">
                    <div class="form-group">
                        <label for="inputName">Name</label>
                        <input type="text" class="form-control" id="inputName" placeholder="Please enter your name"/>
                    </div>
                    <div class="form-group">
                        <label for="inputEmail">Email</label>
                        <input type="email" class="form-control" id="inputEmail" placeholder="Please enter your preferred email"/>
                    </div>
                    <div class="form-group">
                        <label for="inputMessage">Comments or Concerns</label>
                        <textarea class="form-control" id="inputMessage" placeholder="Enter your comments or concerns here..."></textarea>
                    </div>
                </form>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary submitBtn" onclick="submitContactForm()">Submit</button>
            </div>
        </div>
    </div>
</div></li>
{% endhighlight %}

You will notice that there is some CSS specifically aimed at bootstrap because loading the Bootstrap CSS will mess with some aspects of Managed Software Center. These settings will make sure that does not happen.

Next I will show you how to add an RSS feed to your sidebar. The RSS feed we have is from our website where we post news articles about updates on licensing or Apple apps. We should get better at updating the articles....  Here is the code for RSS reader:

{% highlight html linenos %}
<style type="text/css" scoped>
.RSS {
    padding:1em;
}
.rss-title{
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    font-size:1.25em;
    font-weight:bold;
    background: rgb(17, 106, 255);
    color:#ffffff;
    text-align:center;
    padding-top:0.5em;
    padding-bottom:0.5em;
    display:block;
    font-smooth: always;
    -webkit-font-smoothing: antialiased;
    border-radius: 5px;
    margin-bottom: 0.75em;
    width: 102%;
}
.rss-item{
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    margin-top:0.7em;
    font-size:0.95em;
    font-smoothing: always;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5em;
}
.rss-link{
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    font-size:1.1em;
    font-weight:bold;
    padding-bottom:.25em;
    border-bottom:0;
    font-smooth: always;
    -webkit-font-smoothing: antialiased;
    line-height:1.25em;
}
.rss-date{
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    font-size:0.75em;
    display:block;
    position:relative;
    font-smooth: always;
    -webkit-font-smoothing: antialiased
}
.newslist li {
    border-bottom:2px solid rgb(17, 106, 255);
    padding-bottom:0.5em;
    margin-bottom:1.0em;
}
</style>
<!-- jQuery for RSS Reader -->
<script type="text/javascript">
    $.ajax({
        url: 'Your RSS XML Here',
        dataType: 'xml',
        success: function(data){
            $(data).find('item:lt(5)').each(function() {
                var linkUrl = $(this).find("link").text();
                var title= $(this).find('title').text();
                var description= $(this).find('description').text();
                var date= $(this).find('pubDate').text();
                var formattedDate = new Date(date);
                formattedDate = formattedDate.toDateString();
                $('.CETCNews ul').append('<li><span><a class="rss-link" href="' + linkUrl +
                     '">' + title + '</a></span>' + '<span class="rss-date">' +
                         formattedDate + '</span><p class="rss-item">' +
                             description + '</p></li>');
                });
                $('.newslist li:last-of-type').css("border-bottom", "none");
        },
        error: function(data) {
            $('.CETCNews ul').html('<li>Unable to retreieve news at this time</li>');
        }
    });
</script>
<!-- Code to link CSS to the RSS Feed -->
<li class="RSS">
<div class="CETCNews">
    <span class="rss-title">CETC News</span>
    <ul class="newslist"></ul>
</div>
</li>
{% endhighlight %}

Lastly, we made some modifications to the buttons so that they would be Blue for Install, Red for Uninstall, Have white text in the middle and turn Green to install. Here is that CSS:

{% highlight html linenos %}
<style type="text/css" scoped>
/* 10.14 Mojave Dark mode fix for buttons */
div.msc-button-inner {
    color: white !important;
    -webkit-border-radius: 25px !important;
    height: 25px;
    border: none !important;
    display: inline-flex !important;
    align-items: center !important;
    text-align: center !important;
}
/* Install Button */
div.msc-button-inner.not-installed {
    background: rgb(17, 106, 255);
}

div.msc-button-inner.not-installed:hover {
    background: rgb(48, 212, 59);
}

div.msc-button-inner.large.not-installed {
    background: rgb(17, 106, 255);
}

div.msc-button-inner.large.not-installed:hover {
    background: rgb(48, 212, 59);
}

/* Uninstall Button */
div.msc-button-inner.installed {
    background: rgb(204, 0 , 0);
}

div.msc-button-inner.installed:hover {
    background: rgb(255, 0 , 0);
}
div.msc-button-inner.large.installed {
    background: rgb(204, 0 , 0);
}

div.msc-button-inner.large.installed:hover {
    background: rgb(255, 0 , 0);
}

/* Update Available */
div.msc-button-inner.update-available {
    background: rgb(17, 106, 255);
}

div.msc-button-inner.update-available:hover {
    background: rgb(48, 212, 59);
}

div.msc-button-inner.large.update-available {
    background: rgb(17, 106, 255);
}

div.msc-button-inner.large.update-available:hover {
    background: rgb(48, 212, 59);
}

/* Install all button */
div#install-all-button-text {
    background: rgb(17, 106, 255);
    display: block !important;
}
div#install-all-button-text:hover {
    background: rgb(48, 212, 59);
    display: block !important;
}

/* My Items Installed */
div.msc-button-inner.install-updates.installed {
    background: rgb(204, 0 , 0);
    display: block !important;
}
div.msc-button-inner.install-updates.installed:hover {
    background: rgb(255, 0 , 0);
    display: block !important;
}
/* Installed Not Removable Button Main */
div.msc-button-inner.installed-not-removable {
    -webkit-border-radius: 25px !important;
    height: 25px !important;
    border: none !important;
    display: inline-flex !important;
    align-items: center !important;
    background-color: aliceblue;
    text-transform: uppercase;
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 5px;
    color: var(--text-color-subdued) !important;
}
/* Remove Extra Installed */
li.installed {
    visibility: hidden;
}
li.installed-not-removable {
    visibility: hidden;
}
/* Install Not Removaled Button My Items */
div.msc-button-inner.install-updates.installed-not-removable {
    display: block !important;
    background-color: aliceblue !important;
    color: var(--text-color-subdued) !important;
}
</style>
{% endhighlight %}

With all this CSS you can now see the embededed GIF that showcases our RSS Feed, News Ticker and Feedback Form as well as the other CSS Changes we made. All these changes are compatible with macOS Mojave's Dark Mode as well.

![Managed Software Center - With CSS](https://joshua-d-miller.com/images/feedback_and_ticker.gif)

If you have any additional questions or comments please feel free to message me in the MacAdmins Slack or send me an email or add a comment below. Once again, I'd like to thank [John Pater](https://github.com/jpat14) for assisting me with this process and helping me make Managed Software Center really shine. Also, a big thank you to [Greg Neagle](https://twitter.com/gregneagle) for making such a fantastic product that is cusomtizable like this.
