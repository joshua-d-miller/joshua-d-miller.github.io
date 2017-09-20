---
title: macOSLAPS - Update
layout: post
type: post
published: true
comments: true
date: 2017-09-20 12:35:25 -0400
image:
status: publish
categories:
- Security
- Automation
tags:
- macOS
---
Another long absence from posting but I'm hoping to rectify that situation and start posting some of the new things I've been working on. We are here to talk about macOSLAPS, so let's get to that.

Over the last few months, I have been tasked with changing the language that macOSLAPS is coded in as Penn State would like to sign the code. When I presented at the [2017 MacAdmins Conference](https://macadmins.psu.edu) at Penn State in July, I revealed the new version of macOSLAPS written in Swift. This version of LAPS can be signed when you build the code or you can install it using the package from [GitHub](https://github.com/joshua-d-miller/macOSLAPS/releases). Once installed this version will function exactly like the Python version and write to the **macOSLAPS.log** file. There is now also a **#macoslaps** channel in the [MacAdmins](https://macadmins.slack.com) Slack that you can join to ask questions or disclose issues with the executable as I am very open to feedback. So far, the feedback on the Swift version has been very positive. I have retired the Python version of macOSLAPS but it can still be used on macOS clients running 10.9 or older.

One thing remained with macOSLAPS though: I still had to log into a Windows box via RDP to retrieve said passwords. So late the other night I decided to see if I could somehow come up with a command line utility that can retrieve the passwords from Active Directory. Reusing a lot of the macOSLAPS Python code I was able to connect to Active Directory and pull computer information but not the password. This is due to the fact that the password can only be viewed by an Active Directory account delegated to do so. Upon digging into the Open Directory code I discovered the [setCredentialsWithRecordType](https://developer.apple.com/documentation/opendirectory/odnode/1427290-setcredentialswithrecordtype?language=objc) function in the Open Directory node. After working to figure out the correct way to call the function in pyObjC (Thanks [@frogor](https://www.twitter.com/mikeymikey)) I was able to set the user credentials for pulling the computer record from Active Directory to a user that can read the LAPS password. Success!

Next I wanted to add some customization to the application so that users could request multiple passwords and reset the password by changing the date to an expired date. Once the machine checked in at its predefined run time with macOSLAPS (9:00 AM, 1:00 PM and 4:00 PM are the defaults), the password would then change. I stumbled upon a way to make a menu in Python using a while loop and print statements which allowed me to construct a menu where the user can select what they would like to do which you can see below:

![macOSLAPS-Utility](/images/macOSLAPS-Utility%20Menu.png)

Now that the menu was constructed we setup the function for Active Directory to handle it accordingly. Also before you get to this menu you will be asked for Active Directory credentials.

Now completed, I was able to retrieve passwords from Active Directory for machines as well as reset the password expiration date. Listed below is the code for this script which is available on GitHub. I welcome any feedback!

{% gist joshua-d-miller/01bf3900d3a02c4e3927b2a2bcf39100 %}
