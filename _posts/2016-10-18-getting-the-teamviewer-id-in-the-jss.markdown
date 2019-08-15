---
title: Getting the TeamViewer ID in the JSS
layout: post
type: post
published: true
date: 2016-10-18 16:41:45 -04:00
comments: true
img: Casper.png
status: publish
categories:
- Casper
- Configuration
tags:
- Extension Attributes
- Python
- TeamViewer
---
My college uses TeamViewer for remote support and in my previous posts I have highlighted how to deploy the software. The only remaining issue is getting the client ID so that we can remote into the system. Well to remedy this I built a python script that will extract the ID from either a **TeamViewer 8** plist file or a **TeamViewer 11** plist file. See below for the code you can plug into your extension attribute:

{% highlight python linenos %}
#!/usr/bin/python
# pylint:disable=C0103, E0611
'''TeamViewer ID'''
# This Extensions Attribute will pull the TeamViewer ID
# and report it to JAMF's JSS
# Joshua D. Miller - josh@psu.edu
# The Pennsylvania State University - September 2, 2016

from __future__ import print_function
from Foundation import CFPreferencesCopyAppValue
from os import listdir


def get_teamviewer_id():
    '''Retreives the TeamViewer ID of the current client'''
    # The directory to search for the TeamViewer PLIST file
    # Usually this is /Library/Preferences
    directory_to_search = '/Library/Preferences'
    # Account for all versions of TeamViewer from version 8 on...
    for plist_file in listdir(directory_to_search):
        if (plist_file.startswith("com.teamviewer") or
                plist_file.startswith("com.TeamViewer8")):
            # Read the ClientID from the PLIST using CFPref
            tv_id = CFPreferencesCopyAppValue('ClientID', plist_file)

            if str(tv_id) == 'None':
                continue
            else:
                # Report the ID to JAMF's JSS
                print('<result>{0:}</result>'.format(tv_id))
                exit(0)


if __name__ == '__main__':
    get_teamviewer_id()

{% endhighlight %}

The settings I used to display the TeamViewer ID in jamf are as follows:

- **Display Name** - TeamViewer ID
- **Data Type** - String
- **Invetory Display** - General
- **Input Type** - Script<br/><br/>

This allows us to manually put the TeamViewer ID into our list which I know is not ideal but at this time there is no way to automatically send the ID to our account without adding a prompt that bugs the user.
