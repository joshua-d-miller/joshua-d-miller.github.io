---
layout: post
published: true
comments: true
title: "macOSLAPS Update with secureToken"
date: "2019-08-15 08:56:36 -0400"
img: LAPS.png
tags:
    - Active Directory
    - Mac Management
    - macOS
---
It's been a while since I talked about this GitHub project. I am excited to announced that the latest version of macOSLAPS now has **secureToken** support. What this means is that you can have a LAPS FileVault user and the password will update.

## Process

To achieve this we had to know the old password of the LAPS account. Thanks to [Joel Rennich](https://gitlab.com/Mactroll), I decided to save the LAPS password in the **System** keychain on the local system. This would allow us to read the keychain item when it is time for a password change and thus be able to change a secureToken user.

## What about a newly imaged machine?

This is where the new *firstPass* option comes in. I have added the new key to the confiuration profile that will allow you to place a **burner** password which is a password set initially by your MDM for the secureToken admin account. macOSLAPS will read this password in the first time to change the password. After this, it will use the *System* keychain one.

## Future

The current verison posted on GitHub **1.1.4 Build 230** will most likely be the **LAST** version that will be built with Xcode 10.1. This is significant because any newer verisons of Xcode **DO NOT** include the Swift binaries. What this means is that those users using macOSLAPS on 10.14.3 or lower will need to install the [Swift 5 Runtime Support for Command Line Tools](https://support.apple.com/kb/DL1998?viewlocale=en_US&locale=en_US). This will also be when I move macOSLAPS to Swift 5.

## Special Thanks

I'd like to thank all of those in the #macoslaps Slack channel in the [MacAdmins Slack](https://macadmins.herokuapp.com) for reporting issues, helping otheres with deployment and just being a great community to work with. If you would like to download the latest version of macOSLAPS you can get it [here](https://github.com/joshua-d-miller/macOSLAPS/releases/tag/1.1.4(230))
