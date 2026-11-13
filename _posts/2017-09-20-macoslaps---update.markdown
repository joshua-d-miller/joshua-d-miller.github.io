---
title: macOSLAPS - Update
layout: post
type: post
published: true
comments: true
date: 2017-09-20 12:35:25 -0400
img: LAPS.png
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

![macOSLAPS-Utility]({{ site.baseurl }}/assets/img/macOSLAPS-Utility-Menu.png)

Now that the menu was constructed we setup the function for Active Directory to handle it accordingly. Also before you get to this menu you will be asked for Active Directory credentials.

Now completed, I was able to retrieve passwords from Active Directory for machines as well as reset the password expiration date. Listed below is the code for this script which is available on GitHub. I welcome any feedback!

{% highlight python %}
#!/usr/bin/python
'''Get LAPS password for AD Computers'''
# #################################################################
# This script will allow an admin user with
# the proper domain crednetials to get a LAPS
# password form Active Directory.
# ##################################################################
# Original script by barteardon
# https://github.com/bartreardon/macscripts/blob/master/lapssearch
# Updated script using pyObjC:
# Joshua D. Miller - josh@psu.edu
# The Pennsylvania State University - September 18, 2017
# #################################################################
from getpass import getpass
from os import system
from OpenDirectory import (ODSession, ODNode,
                           kODRecordTypeComputers)
from SystemConfiguration import (SCDynamicStoreCreate,
                                 SCDynamicStoreCopyValue)


class color:
    # From Stack Overflow
    # https://stackoverflow.com/questions/
    # 8924173/how-do-i-print-bold-text-in-python
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


def macOSLAPS_Utility(choice, ad_user_name, ad_password, computer_name):
        '''Function to connect and pull information from Active Directory
        some code borrowed from AD PassMon - Thanks @macmuleblog'''
        # Active Directory Connection and Extraction of Data
        try:
            # Create Net Config
            net_config = SCDynamicStoreCreate(None, "net", None, None)
            # Get Active Directory Info
            ad_info = dict(
                SCDynamicStoreCopyValue(
                    net_config, 'com.apple.opendirectoryd.ActiveDirectory'))
            # Create Active Directory Path
            adpath = '{0:}/{1:}'.format(ad_info['NodeName'],
                                        ad_info['DomainNameDns'])
            # Use Open Directory To Connect to Active Directory
            node, error = ODNode.nodeWithSession_name_error_(
                ODSession.defaultSession(), adpath, None)
            node.setCredentialsWithRecordType_recordName_password_error_(
                None, ad_user_name, ad_password, None)
            # Grab the Computer Record
            computer_record, error = node.\
                recordWithRecordType_name_attributes_error_(
                    kODRecordTypeComputers,
                    "{0:}$".format(computer_name), None, None)
            # Convert to Readable Values
            values, error = computer_record.\
                recordDetailsForAttributes_error_(None, None)
            # Get LAPS Password for machine
            if choice == "1":
                print "Password: {0:}{1:}{2:}".format(
                    color.BOLD,
                    values['dsAttrTypeNative:ms-Mcs-AdmPwd'][0],
                    color.END)
                raw_input("\n\nPress any key to continue....")
            elif choice == "2":
                computer_record.setValue_forAttribute_error_(
                    '126227988000000000',
                    'dsAttrTypeNative:ms-Mcs-AdmPwdExpirationTime',
                    None)
                raw_input("\n\nForce Expire time Set. Keep in mind that"
                          " macOSLAPS will need to run on the system before"
                          " the password is changed."
                          " Press any key to continue...")
        except StandardError as error:
            print error


def main():
    '''Main function of macOSLAPS Password retrieval utility'''
    print "Welcome to the macOSLAPS Utility"
    ad_user_name = raw_input("Please enter your username:")
    ad_password = getpass("Please enter your password:")
    choice = "0"
    while choice != "3":
        system('clear')
        print "macOSLAPS Utility"
        print "-----------------"
        print "1. Get LAPS Password"
        print "2. Reset LAPS Password"
        print "3. Exit"
        choice = raw_input("\n >>  ")
        if choice != "1" and choice != "2" and choice != "3":
            raw_input("\n\nPlease enter a valid choice"
                      " (Example \"1\", \"2\", \"3\")")
            continue
        if choice == "3":
            print "Thank you for using macOSLAPS Utility!"
            continue
        computer_name = raw_input("Computer Name: ")
        macOSLAPS_Utility(choice, ad_user_name, ad_password, computer_name)
        continue

    exit(0)


if __name__ == "__main__":
    main()
{% endhighlight %}
