---
title: TeamViewer 12 Deployment
layout: post
published: true
comments: true
date: 2016-12-06 10:16:17 -04:00
image: images/TeamViewer Host 12.png
status: publish
categories:
- Deployment
- Munki
- Automation
tags:
- TeamViewer
---
Over the past week our college purchased and began testing TeamViewer version 12. This version was to bring new deployment features and make a simple one click install to deploy host to all machines. Sounds easy right? Well unfortunately there are settings that are not set and you have to create some scripts in order to perform the assignment of the device to your account. In this post I will highlight the scripts I used and how I am now able to deploy TeamViewer 12 without requiring the user to log out.

So first if you haven't already you should create a Host deployment version so that you can download your prebuilt host package. Once downloaded go ahead and import it into Munki. Once imported we are going to make some changes. Firstly, we will need a preinstall script that performs the following:

- Sets your Unattended Access Password
- Sets your Password to change preferences
- Turns off the inital TeamViewer Dialog
- Allows connections to the system whether you are logged on or not
- Always Sends Crash Reports<br /><br />

The last one I added because I was tired of users always getting the crash reports. This way, TeamViewer gets these crash reports and the user is no longer bothered by them. We are also going to remove any old TeamViewer preference files from the system should they still exist. Listed below is my preinstall script that you can take and use in your environment:

<h3>PreInstall Script</h3>

{% gist joshua-d-miller/4dba3c9e231a819d73d0511b36858d69 %}

Once the installation completes we want to set our **attribute** that will allow the customization pieces we defined in the management console to download and be applied to the client. (**Note**: The attribute part is completely optional as if you import your package into Munki with the IDC attached in the name you do not need to use the **xattr** command.) These include:

- Logo
- Custom Text
- Custom Title<br /><br />

Before I was modifying the **MainMenuHost.nib** file to remove the ability to exit TeamViewer. This is definitely not best practice but we want to make sure TeamViewer continues to run in case a user decides to close it. When exiting TeamViewer it also stops the launch agents. In order to accomplish this I have added the creation of a **launchagent** in the postinstall script that will relaunch the TeamViewer services should they be closed. See below for the complete script:

<h3>PostInstall Script</h3>

{% gist joshua-d-miller/ecbaa65e3bb317144a56b3672f405469 %}

With the changes made above, we no longer need to require a logout to install TeamViewer. Thanks to [Greg Neagle](https://twitter.com/gregneagle) and [Michael Lynn](https://twitter.com/mikeymikey) it was recommended to use **CFPrefs** instead of **plistlib** when modifying the preferences of TeamViewer. This means that the changes we make are immediately committed to the system. Now we move to the activation that will assign the device to your account which includes:

- Policies
- Adding the ID to your Management Account folder<br /><br />

To perform the activation TeamViewer includes an executable that must be run to activate the client with your management account. Thankfully with Munki we are able to automate this process. First you will want to create a DMG file with the activation file in it. Once created, you can import this into Munki and use this **pkginfo** file for reference. In order to get the installer hash or md5 you will need the following commands:

- **md5** /Path/To Your File
- **shasum -a256** /Path/To Your DMG<br /><br />

<h3>PKGInfo File</h3>

{% highlight xml linenos %}

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>autoremove</key>
    <false/>
    <key>catalogs</key>
    <array>
        <string>testing</string>
    </array>
    <key>category</key>
    <string>Administrative Tools</string>
    <key>description</key>
    <string>This script will activate TeamViewer 12 for remote support from the Carrara Education Technology Center.</string>
    <key>developer</key>
    <string>CETC</string>
    <key>display_name</key>
    <string>TeamViewer Activation</string>
    <key>installer_item_hash</key>
    <string>Install Item Hash</string>
    <key>installer_item_location</key>
    <string>Image/TeamViewer Client/TeamViewer Activation-12.0.71483.dmg</string>
    <key>installer_item_size</key>
    <integer>4000</integer>
    <key>installer_type</key>
    <string>copy_from_dmg</string>
    <key>installs</key>
    <array>
        <dict>
            <key>md5checksum</key>
            <string>MD5 Here</string>
            <key>path</key>
            <string>/Library/Application Support/TeamViewer Host/TeamViewer_Assignment</string>
            <key>type</key>
            <string>file</string>
        </dict>
    </array>
    <key>items_to_copy</key>
    <array>
        <dict>
            <key>destination_path</key>
            <string>/Library/Application Support/TeamViewer Host/</string>
            <key>source_item</key>
            <string>TeamViewer_Assignment</string>
        </dict>
    </array>
    <key>minimum_os_version</key>
    <string>10.8.5</string>
    <key>installcheck_script</key>
    <string>#!/usr/bin/python
# pylint:disable=C0103, E0611
'''TeamViewer 12 Activation Check'''
# This script will check to see if preferences have been
# sent down to the machine after being assigned to an account.
# If that is not the case than the machine will be marked for
# reinstall.
# Joshua D. Miller - josh@psu.edu
# December 6, 2016 - The Pennsylvania State University

from Foundation import CFPreferencesCopyAppValue
from os import path


def main():
    '''Main function to check for assignment of TeamViewer
    client to our account.'''

    # TeamViewer Bundle Identifier
    tv_bundle = "com.teamviewer.teamviewer.preferences"

    # Path to Preference File
    tv_prefs = '/Library/Preferences/{0:}.plist'.format(tv_bundle)

    if path.isfile(tv_prefs):
        # Check for Policies downloaded to the machine
        policy = CFPreferencesCopyAppValue(
            'Remote_Settings_TVClientSetting_Policy', tv_bundle)
        if policy is not None:
            exit(1)
        else:
            exit(0)
    else:
        exit(0)


if __name__ == '__main__':
    main()

    </string>
    <key>postinstall_script</key>
    <string>#!/usr/bin/python
# pylint:disable=C0103, E0611, W0107, W0703
'''TeamViewer Activation'''
# This script will perform activation of TeamViewer 12 and
# assign it to our account. This will allow us to send policies
# to the machine for TeamViewer and grant us easy remote access
# Joshua D. Miller - josh@psu.edu
# Dec 2, 2016 - The Pennsylvania State University

from subprocess import (check_output, PIPE)
from SystemConfiguration import (SCPreferencesCreate,
                                 SCPreferencesGetValue)


def main():
    '''main function to perform activation and assignment of
    the TeamViewer 12 Client'''
    # Configuration ID
    config_id = 'Your Config ID from TeamViewer without the IDC'  # #gitignore
    # config_id = 'Your Config ID from TeamViewer without the IDC'
    # API Token
    api_token = '1851753-rcxWXTqOAQ8juF5nXaD9'  # #gitignore
    # api_token = 'Your API Token obtained from your custom module'
    # Datafile Path
    datafile_path = '{0:}{1:}{2:}'.format(
        '/Library/Application Support/TeamViewer Host/Custom Configurations/',
        config_id, '/AssignmentData.json')

    # Get Computer Name from socket
    # We are using a replace to remove the domain if it is attached
    sc_prefs = SCPreferencesCreate(None, "SystemConfiguration", None)
    computer_name = SCPreferencesGetValue(
        sc_prefs, "System")["System"]["ComputerName"]

    try:
        check_output(['/Library/Application Support'
                      '/TeamViewer Host/TeamViewer_Assignment',
                      '-apitoken', api_token, '-datafile', datafile_path,
                      '-devicealias', '{0:}'.format(computer_name)],
                     stderr=PIPE)
    except Exception as error:
        print error
        exit(1)


if __name__ == '__main__':
    main()

    </string>
    <key>name</key>
    <string>TeamViewer Activation</string>
    <key>unattendedinstall</key>
    <true/>
    <key>uninstall_method</key>
    <string>remove_copied_items</string>
    <key>uninstallable</key>
    <true/>
    <key>update_for</key>
    <array>
        <string>TeamViewer Host-12.0.71483</string>
    </array>
    <key>version</key>
    <string>12.0.71483</string>
</dict>
</plist>

{% endhighlight %}

Once completed, TeamViewer should be deployed on your systems without any user intervention. While working on this I asked TeamViewer how I could set certain preferences and of course I got this response:

>Dear Joshua, <br /><br />
Thank you for your message.<br /><br />
We are glad that you have found this feature useful. For the unattended access password with this new deployment method is not possible on any platform at this time.<br /><br />
With the other deployment method for windows only, they have the ability to export a registry file and import on the other windows machines, unfortunately, this ability does not exist on MAC.<br /><br />
The idea with this deployment is that you are given easy access as soon as the device is assigned. so that there is not a single password/point of failure, as far as security, with this new method.<br /><br />
I can submit a feature request on your behalf for this if you wish.
If you have any further questions, do not hesitate to contact us.<br /><br />
Best regards, <br/><br />
Support Engineer

Clearly it is possible but they still don't seem to make macOS deployment a priority. Please submit issues to TeamViewer and advise them to make even more strides towards a fully deployable piece of software.
