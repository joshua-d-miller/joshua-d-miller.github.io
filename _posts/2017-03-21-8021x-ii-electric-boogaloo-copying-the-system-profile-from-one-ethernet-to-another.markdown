---
title: 802.1x II - Electric Boogaloo - Copying the System Profile from One Ethernet to Another
layout: post
type: post
published: true
comments: true
date: 2017-03-21 14:37:00 -0400
image: images/Network.png
status: publish
categories:
- Security
- Automation
- jamf
- MDM
tags:
- macOS
- Windows
- Group Policy
---
So it has been a while since I posted. I have been working very hard along with [frogor](https://twitter.com/mikeymikey) and [mosen](https://github.com/mosen) to determine why the **FirstActiveEthernet** option in an 802.1x Ethernet profile will only ever apply to one interface and will not switch from one to another. Many other MacAdmins have reported that upon submitting enterprise tickets to Apple that they are either "looking into it" or it is a "feature request" to use your 802.1x Profile as a System profile on all Ethernet interfaces attached to the system. This post will serve as a brain dump of all the information we have scoured and processes we have worked through to try to reach the end goal of seamless 802.1x integration.

In our college, we were working on deploying EAP-TLS for both Mac and PC as if you read the original 802.1x post [here](http://joshua-d-miller.com/blog/2016/8021x-project-college-of-education/); we were looking to remove the potential security risk of Ethernet dongles as with DHCP reservations whomever has the dongle has the reservation. Enter 802.1x which will authenticate the user every time they connect to the network and log this information to a RADIUS server. Having a RADIUS server will allow a Systems Administrator to set requirements on what can and cannot connect to the network.

Upon initial investigation I noticed that in the **System** keychain, an identity preference is made for the 802.1x Configuration profile that has a unique identifier at the end. Obviously there was no easy way to replicate this unique identifier. I also stumbled upon this small exchange on [Ask Different](http://apple.stackexchange.com/questions/193631/802-1x-management-on-the-command-line) and thought maybe we could copy or rename the identity preference to **com.apple.network.eap.system.identity.default** which would make it the default for all interfaces. Unfortunately that did not work. I then thought maybe we could create a copy of the identity preference and rename it from **com.apple.network.eap.system.identity.profileid.IDHere** to **com.apple.network.eap.user.identity.profileid.IDHere**. Well upon doing this all the interfaces would connect because when clicking Connect, the 802.1x profile defaults to User mode even though it is configured for System mode. Thus began creating a script to systematically copy the keychain entry. Thanks to mosen and frogor we were able to do just that and I thought this would be the best solution. You can see that script below:

{% gist joshua-d-miller/241cd83602cc33882ff9ab54ab92e425 %}

Upon some more rigorous testing though we quickly found that the other interfaces won't work at the logon screen. So if a user is logged out and using an Ethernet interface that was not connected at the time of install, then there would be no network connectivity. When using a System profile you want to be able to connect whether you are logged in or not so this unfortunately was not going to be a solution.

After working diligently with mosen and working through the **EAPOL** framework to find functions to manipulate the 802.1x profiles we had a breakthrough. Using the **EAPOLClientConfigurationGetSystemProfile** and **EAPOLClientConfigurationSetSystemProfile** we would be able to copy the configuration from one Ethernet to another. Of course in order for the changes to take effect, you would need to save after using the Set command with **EAPOLClientConfigurationSave**. These however are private Objective C functions that mosen worked hard to decipher so that they could be utilized in Python using pyObjc. We have devised this script which you can run on any system with your 802.1x profile configured and it will look for that configuration and copy it to the other interfaces. This script is obviously not perfect but it is a step in the right direction.

{% gist joshua-d-miller/046e434c51057dc9588762edd40199b1 %}

Once the System profile was copied to another Ethernet interface, that interface then connected automatically just like the original which is the behavior we are looking for. Now comes the fun part of testing all kinds of different environments using this script to see if it is a universal solution or would it need some tailoring in order to work for everyone. Now obviously the name I use is unique **Ethernet(COE)** which if you build the profile outside of jamf and then upload it to the JSS, it will actually retain that name even if you leave it unsigned. Unfortunately jamf's default 802.1x Ethernet profile name is **Network**. Now you are probably thinking is there a way I can monitor this inside the JSS and the answer is yes. I have gone ahead and devised another script that you can place in your JSS as an Extension Attribute that will poll the Ethernet interfaces on your system to determine if they have the System profile attached. If so then it will report True otherwise False. Of course jamf cannot do an Array or dictionary in an Extension Attribute so I have converted the Array to a String and separated the interfaces with ||. Then you can build a SMART Group that looks for **like False** which will then give you a Group you could scope out the Fix script as a policy. Here is that Extension Attribute:

{% gist joshua-d-miller/2ba2804be41cf60ae961805447961152 %}

On a side note - I have tested this script with both EAP-TLS and PEAP-MSCHAPV2 as unfortunately since we have a lot of remote users we might be moving to PEAP-MSCHAPV2 so that a client certificate which requires an AD connection to get isn't required. This makes the profile fail and jamf does not have a built in retry so clearing out a bunch of systems that did not receive the profile was getting repetitive.

Please take these scripts and test them in your environment and report back results to me either on Slack or Twitter. I'm hoping we can come to some kind of true made Enterprise solution for 802.1x so that it works the way most of us intend it to. I would like to give a big personal thanks to [mosen](https://github.com/mosen) as he was very instrumental in assisting with deciphering the EAPOL framework and working with me on getting the functions in Objective C. Without him this may not have been even a possibility.
