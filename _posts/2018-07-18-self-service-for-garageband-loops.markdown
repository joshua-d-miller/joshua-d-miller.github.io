---
title: Self Service for GarageBand Loops
layout: post
published: true
comments: true
date: 2018-07-18 10:24:33 -0400
image: images/GarageBand.png
status: publish
categories:
-- Configuration
-- Munki
-- MDM
tags:
-- macOS Apps
---
With the move to Volume Purchasing for Apple Applications through MDM, I was left wondering how we could add the GarageBand loops to our systems if users wanted to use GarageBand. Before I would run the wonderful project [appleLoops](https://github.com/carlashley/appleLoops) and then package them to install when installing GarageBand with Munki. Well since GarageBand is now automatic that method would prompt the user afterwards to install the GarageBand loops and what we definitely saw with new systems was seeing the loops available when the application finally pushed down with the new MDM approach.

To rememdy this I got to thinking couldn't we just pull the *appleLoops* python script down to the system and then run it on demand now that Munki supports on Demand scripts? The answer is yes, and this way you are always pulling down the latest version of the script and getting the latest version of the loops so there is no need to run this periodically and import into your repo. To acoomplish this, I threw together a very simple bash script that will download the GitHub project and then extract and run the script through a Munki on demand nopkg script. This way users that actually want to use GarageBand can download the loops at their convienience. Here is the package info that you can copy and change to your repo's liking.

{% highlight xml linenos %}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>OnDemand</key>
    <true/>
    <key>catalogs</key>
    <array>
        <string>production</string>
    </array>
    <key>category</key>
    <string>Self Service</string>
    <key>description</key>
    <string>This script will install the GarageBand Loops needed to use GarageBand for macOS. This process can take some time as the loops are large packages.</string>
    <key>developer</key>
    <string>CETC</string>
    <key>display_name</key>
    <string>GargeBand Loops</string>
    <key>icon_name</key>
    <string>GarageBand.png</string>
    <key>installer_type</key>
    <string>nopkg</string>
    <key>minimum_os_version</key>
    <string>10.12.5</string>
    <key>name</key>
    <string>CETC - GarageBand Loops</string>
    <key>preinstall_script</key>
    <string>#!/bin/bash
# This script will download the appleLoops repo into
# the /tmp directory and then run the appleLoops.py
# file to download the GarageBand Loops that are required
# to use GarageBand
# Joshua D. Miller - josh@psu.edu
# The Pennsylvania State University
# Last Updated - July 17, 2018

# Download the Zip file of the GitHub Repository
/usr/bin/curl -o /tmp/appleLoops.zip -LO https://github.com/carlashley/appleLoops/archive/master.zip

# Extract it in our Temp Folder
/usr/bin/unzip -q /tmp/appleLoops.zip -d /tmp

# Run the tool to update GarageBand
/usr/bin/python /tmp/appleLoops-master/appleLoops.py --deployment --mandatory-only

# Cleanup
/bin/rm -rf /tmp/appleLoops-master
/bin/rm -f /tmp/appleLoops.zip
    </string>
    <key>version</key>
    <string>1.0</string>
</dict>
</plist>
{% endhighlight %}

As always, if you have any questions feel free to ping me on Slack or Twitter as I would be glad to assist. If you think this could be down even better please be sure to let me know.
