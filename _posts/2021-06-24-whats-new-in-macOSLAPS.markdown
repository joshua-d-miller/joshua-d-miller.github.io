---
layout: post
published: true
comments: true
title: "What's New in macOSLAPS"
date: "2021-06-24 13:50:00 -0400"
img: LAPS.png
tags:
    - Active Directory
    - Mac Management
    - macOS
---
Today I presented on What's new in macOSLAPS at the MacAdmins Campfire Sessions. If you would like to see today's slides those can be downloaded [here]({{ site.baseurl }}/assets/attachments/whats-new-in-macoslaps.pdf)  

## New Features

New features available in macOSLAPS 2.0.0 are the following:
-   Better Active Directory error Checking
-   Storing the password via MDM
-   Password Grouping
-   Universal (Native support for ARM and x86/x64)

## AD Error Checking

A new method has been implemented in the Active Directory method to keep the machine from getting into an invalid state. If the password is changed and the machine is then unable to write the password back to Active Directory, then macOSLAPS will now revert to the original password and exit gracefully while logging that we were unable to write to Active Directory.

## Local Method

New in macOSLAPS **2.0.0 Build 713**, is the ability to keep the password local and write it to files when needs that an MDM like jamf Pro or WorkspaceOne could then read and report in a custom attribute. After the password change is perform the user can then run */usr/local/laps/macOSLAPS -getPassword* which will write the expiration date and password to the following files:
-   /var/root/Library/Application Support/macOSLAPS-password
-   /var/root/Library/Application Support/macOSLAPS-expiration
Now that these files exist, we can then read out the contents of these files into extension attributes in jamf. The next time macOSLAPS runs these files will be deleted to maintain security.

## Password Grouping

We now have the ability to perform password grouping which will allow you to have a password like the Safari or iCloud keychain style passwords in Active Directory or your MDM. Many thanks to [Per Oloffson](https://github.com/magervalp) for sending this pull request. For example: With <span style="color:red">**PasswordLength**</span> set to *12*, <span style="color:red">**PasswordGrouping**</span> set to *4* and <span style="color:red">**PasswordSeparator**</span> set to *-*
<span style="color:blue">*Ies3-#81n-@imd*</span>

## Extension Attribute and JSON for jamf Pro

As I am currently using jamf Pro, I'm able to test a bit easier with jamf Pro. I have created an Extension Attribute and a JSON Schema for getting the password to jamf Pro and for configuring macOSLAPS using their GUI via Custom Settings. You can acquire the schema [here](https://github.com/Jamf-Custom-Profile-Schemas/joshua-d-miller-schemas/blob/master/edu.psu.macoslaps.json) and the script for the extension attribute is listed below for your use:

## Special Thanks

I'd like to thank all of those in the #macoslaps Slack channel in the [MacAdmins Slack](https://macadmins.herokuapp.com) for reporting issues, helping others with deployment and just being a great community to work with. If you would like to download the latest version of macOSLAPS you can get it [here](https://github.com/joshua-d-miller/macOSLAPS/releases/tag/2.0.0(713))
