---
title: 802.1x II - Electric Boogaloo - Copying the System Profile from One Ethernet to Another
layout: post
type: post
published: true
comments: true
date: 2017-03-21 14:37:00 -0400
img: Network.png
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

{% highlight python %}
#!/usr/bin/python
# pylint: disable=C0103, W0612, E1101, E0602, E0611
# pylint: disable=W0101, W0110, W0141
''''Fix 802.1x When Using Config Profiles and EAP-TLS'''
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
# This script will determine the profile ID that was used when
# installing the 802.1x Ethernet Identity preference and make
# a copy of the keychain entry to be used as a user identity preference
# so that any Ethernet can be used when a user is logged in. As of 10.12.3
# there is currently a bug with the 802.1x System profile that will only
# allow the first Ethernet that was active at the time of profile install
# to be used.
#
#
# Joshua D. Miller - josh@psu.edu - The Pennsylvania State University
# Last Updated Friday February 23, 2016
#
# Many Many Thanks to Michael Lynn and Mosen for taking me down
# the rabbit hole that is PyObjC
#
# References
# https://gist.github.com/pudquick/8ad859f30438f3be149fe9751391d037
# https://gist.github.com/pudquick/4cf32c2b403bf0be23b268d6dd3cf803
# https://github.com/mosen/pudquick-pyobjc-framework-Security/
# blob/master/metadata/raw/x86_64-10.12.fwinfo
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
# Steps Performed in this script
#   - Determine Profile ID by reading /Library/Preferences/
#           SystemConfiguration
#           /com.apple.network.eapolclient.configuration.plist
#   - Find the keycahin entry
#         com.apple.network.eap.system.identity.profileid.UUID
#   - Create a copy named
#         com.apple.network.eap.user.identity.profileid.UUID
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Most of EAP 802.1x and Keychain PyObjC code from Michael Lynn
# Instructions on using SecIdentityCopyPreferred and SecIdentityPreferred
# provided by Mosen

from __future__ import print_function
from Foundation import NSBundle
import objc


def get_profile_uuid():
    '''Get the UUID of the Configuration Profiles 802.1x Identity
    Preference'''
    EAP8021X_bundle = NSBundle.bundleWithPath_(
        '/System/Library/PrivateFrameworks/EAP8021X.framework')

    E_functions = [
        ('EAPOLControlCopyStateAndStatus', 'i*o^io^@'),
        ('EAPOLClientConfigurationCreate', '@^@'),
        ('EAPOLClientConfigurationCopyProfiles', '@@'),
        ('EAPOLClientProfileGetUserDefinedName', '@@'),
        ('EAPOLClientProfileGetID', '@@'), ]

    objc.loadBundleFunctions(EAP8021X_bundle, globals(), E_functions)

    maximum_interfaces = 20
    interfaces = map(lambda x: 'en%s' % x, range(maximum_interfaces))

    for i in interfaces:
        result, status, eap_config = EAPOLControlCopyStateAndStatus(
            i, None, None)
        if result == 0:
            cfg = EAPOLClientConfigurationCreate(None)
            profiles = EAPOLClientConfigurationCopyProfiles(cfg)
            for n in profiles:
                display_name = EAPOLClientProfileGetUserDefinedName(n)
                if display_name == 'Ethernet - CoE':
                    profile_id = EAPOLClientProfileGetID(n)
                    return profile_id


def create_identity_preference():
    '''Time to modify the keychain and create the identity preference we need
    to fix Apple's issue - Still an issue as of 10.12.3'''
    # from CoreFoundation import CFGetTypeID

    Security_framework = NSBundle.bundleWithPath_(
        '/System/Library/Frameworks/Security.framework')

    # Objective C Functions we will use to accomplish our keychain
    # change
    keychain_functions = [
        ('SecKeychainGetTypeID', 'I'),
        ('SecIdentityGetTypeID', 'I'),
        ('SecKeychainSetUserInteractionAllowed', 'IZ'),
        ('SecKeychainCopyDomainDefault', 'IIo^^{__CFArray}'),
        ('SecKeychainOpen', 'I*o^^{__SecKeychain=}'),
        ('SecKeychainGetStatus', 'I^{__SecKeychain=}o^I'),
        ('SecKeychainUnlock', 'I^{__SecKeychain=}I*I'),
        ('SecIdentityCopyPreferred',
         '^{__SecIdentityRef=}^{__CFString}^{__CFArray}^{__CFArray}'),
        ('SecKeychainSetPreferenceDomain', 'II'),
        ('SecIdentitySetPreferred',
         'I^{__SecIdentityRef=}^{__CFString}^{__CFArray}'),
        ('SecKeychainLock', 'I^{__SecKeychain=}'), ]

    objc.loadBundleFunctions(Security_framework, globals(), keychain_functions)

    # Build out our CF type signatures
    objc.registerCFSignature(
        'SecKeychainRef', '^{__SecKeychain=}', SecKeychainGetTypeID())
    objc.registerCFSignature(
        'SecIdentityRef', '^{__SecIdentityRef=}', SecIdentityGetTypeID())

    kSecUnlockStateStatus = 1
    kSecPreferencesDomainSystem = 1

    system_profile_name = ('com.apple.network.eap.system'
                           '.identity.profileid.{0:}'.format(uuid))
    user_profile_name = ('com.apple.network.eap.user'
                         '.identity.profileid.{0:}'.format(uuid))

    # Turn off any prompts for a user to enter a password for keychain
    SecKeychainSetUserInteractionAllowed(False)
    # Let's Open the System Keychain
    err, keychains = SecKeychainCopyDomainDefault(
        kSecPreferencesDomainSystem, None)
    err, keychain = SecKeychainOpen('System.keychain', None)
    if err:
        return err
    # Check Status of the System Keychain (Should be locked)
    err, status = SecKeychainGetStatus(keychain, None)
    unlocked = status | kSecUnlockStateStatus == kSecUnlockStateStatus
    if not unlocked:
        # Unlock the System Keychain
        keychain = SecKeychainUnlock(keychain, 0, None, False)
    # Copy our Identity Preference and make the new one with
    # the same attributes
    keychain_item = SecIdentityCopyPreferred(
        system_profile_name, None, None)
    # Apply Change to the System Keychain
    SecKeychainSetPreferenceDomain(kSecPreferencesDomainSystem)
    err = SecIdentitySetPreferred(keychain_item, user_profile_name, None)
    if err:
        return err
    # Lock the System Keychain
    err = SecKeychainLock(keychain)
    return None


if __name__ == '__main__':
    uuid = get_profile_uuid()
    fin_code = create_identity_preference()
    if fin_code is not None:
        # Build the SecCopyErrorMessageString to read the error
        Security = NSBundle.bundleWithPath_(
            '/System/Library/Frameworks/Security.framework')

        functions = [
            ('SecCopyErrorMessageString', '^{__CFString}I^v'), ]

        objc.loadBundleFunctions(Security, globals(), functions)

        message = SecCopyErrorMessageString(fin_code, None)
        print("Error: {}".format(message))
{% endhighlight %}

Upon some more rigorous testing though we quickly found that the other interfaces won't work at the logon screen. So if a user is logged out and using an Ethernet interface that was not connected at the time of install, then there would be no network connectivity. When using a System profile you want to be able to connect whether you are logged in or not so this unfortunately was not going to be a solution.

After working diligently with mosen and working through the **EAPOL** framework to find functions to manipulate the 802.1x profiles we had a breakthrough. Using the **EAPOLClientConfigurationGetSystemProfile** and **EAPOLClientConfigurationSetSystemProfile** we would be able to copy the configuration from one Ethernet to another. Of course in order for the changes to take effect, you would need to save after using the Set command with **EAPOLClientConfigurationSave**. These however are private Objective C functions that mosen worked hard to decipher so that they could be utilized in Python using pyObjc. We have devised this script which you can run on any system with your 802.1x profile configured and it will look for that configuration and copy it to the other interfaces. This script is obviously not perfect but it is a step in the right direction.

{% highlight python %}
#!/usr/bin/python
# pylint: disable=E0611, E1101, E0602
''''Fix 802.1x When Using Config Profiles and PEAP-MSCHAPV2 or EAP-TLS'''
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
# This script will find the system profile that is attached to one ethernet
# interface from our configuration profile and then copy it to all other
# ethernet interfaces so that other ethernet interfaces can be used instead
# of just the FirstActiveEthernet at time of profile installation. This issue
# is still an issue as of 10.12.3
#
# Joshua D. Miller - josh@psu.edu - The Pennsylvania State University
# Last Updated Friday March 21, 2017
#
# References
# https://gist.github.com/pudquick/8ad859f30438f3be149fe9751391d037
# https://gist.github.com/pudquick/4cf32c2b403bf0be23b268d6dd3cf803
# https://github.com/mosen/moobjc-framework-Security/blob/
# master/metadata/Security.fwinfo
# https://github.com/mosen/meap/blob/master/meap/eap8021x/_metadata.py
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
# I'd like to give a very special thanks to Mosen who was so influencial
# in making this script a reality. Thank you so much for asssting with
# this project and it is my hope that this truly solves our 802.1x issue
# on the Mac side and allows us to move forward with the project. We
# decided to switch from EAP-TLS to PEAP-MSCHAPV2 because the user
# will still need a domain bound computer which can only be done by our
# IT Staff and will need the cert from our CA. This script does work with both
# protocols though
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

from Foundation import NSBundle
from SystemConfiguration import (
    SCNetworkServiceCopyAll, SCNetworkInterfaceGetBSDName,
    SCNetworkInterfaceGetInterfaceType, SCNetworkServiceGetInterface,
    SCPreferencesCreate)
import objc


def ethernet_services(services):
    '''function will pull any en(x) device that is truly an ethernet
    Special Thanks to @mosen for this little function that gets
    the job done'''
    for service in services:
        interface = SCNetworkServiceGetInterface(service)
        if SCNetworkInterfaceGetInterfaceType(interface) == 'Ethernet':
            yield interface


def main():
    '''This function is very similar to our fix but instead of performing
    any systematic changes will read the information and report it to
    jamf as an extension attribute.'''
    eap8021x_bundle = NSBundle.bundleWithPath_(
        '/System/Library/PrivateFrameworks/EAP8021X.framework')

    # EAP Functions from @mosen's meap project (See above for link)
    eapol_functions = [
        ('EAPOLClientConfigurationGetTypeID', 'Q'),
        ('EAPOLClientProfileGetTypeID', 'Q'),
        ('EAPOLClientItemIDGetTypeID', 'Q'),
        ('EAPOLClientConfigurationCreate',
         '^{EAPOLClientConfigurationRef=}^{__CFAllocator=}'),
        ('EAPOLClientProfileGetUserDefinedName',
         '@^{EAPOLClientProfileRef=}'),
        ('EAPOLClientConfigurationGetSystemProfile',
         '^{EAPOLClientProfileRef=}'
         '^{EAPOLClientConfigurationRef=}@'),
        ('EAPOLClientConfigurationSetSystemProfile',
         'Z^{EAPOLClientConfigurationRef=}@'
         '^{EAPOLClientProfileRef=}'),
        ('EAPOLClientConfigurationSave',
         'Z^{EAPOLClientConfigurationRef=}')]

    objc.loadBundleFunctions(eap8021x_bundle, globals(), eapol_functions)

    # CF Types to be loaded also from @mosen's meap project
    cf_types = [
        ('EAPOLClientConfigurationRef',
         '^{EAPOLClientConfigurationRef=}',
         EAPOLClientConfigurationGetTypeID()),

        ('EAPOLClientProfileRef',
         '^{EAPOLClientProfileRef=}',
         EAPOLClientProfileGetTypeID()),

        ('EAPOLClientItemIDRef',
         '^{EAPOLClientItemIDRef=}',
         EAPOLClientItemIDGetTypeID()), ]

    for item in cf_types:
        objc.registerCFSignature(*item)

    # Define blank list to be used to gather EAPOL information on
    # Ethernet interfaces
    interface_list = []
    prefs = SCPreferencesCreate(None, "python", None)
    services = SCNetworkServiceCopyAll(prefs)

    # Poll through the interfaces and make a list of the true Ethernet
    # adapters on the system
    for interface in ethernet_services(services):
        interface_list.append(SCNetworkInterfaceGetBSDName(interface))

    # For loop to iterate through our Ethernet adapters and determine if they
    # have the system profile we are looking for and apply it to any other
    # Ethernet interfaces that don't have it applied. Change "Ethernet(COE)"
    # to whatever your 802.1x profile is called in Network Preferences.
    # Default in jamf is sadly "Network"
    for ethernet in interface_list:
        cfg = EAPOLClientConfigurationCreate(None)
        look_for_cfg = EAPOLClientConfigurationGetSystemProfile(cfg, ethernet)
        if look_for_cfg is not None:
            if EAPOLClientProfileGetUserDefinedName(
                    look_for_cfg) == 'Ethernet(COE)':
                for ethernet in interface_list:
                    if EAPOLClientConfigurationGetSystemProfile(
                            cfg, ethernet) == look_for_cfg:
                        continue
                    else:
                        EAPOLClientConfigurationSetSystemProfile(cfg, ethernet, look_for_cfg)
                        EAPOLClientConfigurationSave(cfg)


if __name__ == '__main__':
    main()
{% endhighlight %}

Once the System profile was copied to another Ethernet interface, that interface then connected automatically just like the original which is the behavior we are looking for. Now comes the fun part of testing all kinds of different environments using this script to see if it is a universal solution or would it need some tailoring in order to work for everyone. Now obviously the name I use is unique **Ethernet(COE)** which if you build the profile outside of jamf and then upload it to the JSS, it will actually retain that name even if you leave it unsigned. Unfortunately jamf's default 802.1x Ethernet profile name is **Network**. Now you are probably thinking is there a way I can monitor this inside the JSS and the answer is yes. I have gone ahead and devised another script that you can place in your JSS as an Extension Attribute that will poll the Ethernet interfaces on your system to determine if they have the System profile attached. If so then it will report True otherwise False. Of course jamf cannot do an Array or dictionary in an Extension Attribute so I have converted the Array to a String and separated the interfaces with pipes. Then you can build a SMART Group that looks for **like False** which will then give you a Group you could scope out the Fix script as a policy. Here is that Extension Attribute:

{% highlight python %}
#!/usr/bin/python
# pylint: disable=E0611, E1101, E0602, C0103
''''Fix 802.1x When Using Config Profiles and PEAP-MSCHAPV2 or EAP-TLS'''
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
# This script will find the system profile and determine whether it is attached
# to each interface and report that information. This is formated to be used
# with jamf as an Extension attribute. Expected output would be as follows:
# || en3 - True || en4 - False || en5 - False ||
#
# Joshua D. Miller - josh@psu.edu - The Pennsylvania State University
# Last Updated Friday March 21, 2017
#
# References
# https://gist.github.com/pudquick/8ad859f30438f3be149fe9751391d037
# https://gist.github.com/pudquick/4cf32c2b403bf0be23b268d6dd3cf803
# https://github.com/mosen/moobjc-framework-Security/blob/
# master/metadata/Security.fwinfo
# https://github.com/mosen/meap/blob/master/meap/eap8021x/_metadata.py
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
# I'd like to give a very special thanks to Mosen who was so influencial
# in making this script a reality. Thank you so much for asssting with
# this project and it is my hope that this truly solves our 802.1x issue
# on the Mac side and allows us to move forward with the project. We
# decided to switch from EAP-TLS to PEAP-MSCHAPV2 because the user
# will still need a domain bound computer which can only be done by our
# IT Staff and will need the cert from our CA. This script does work with both
# protocols though
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

from __future__ import print_function
from Foundation import NSBundle
from SystemConfiguration import (
    SCNetworkServiceCopyAll, SCNetworkInterfaceGetBSDName,
    SCNetworkInterfaceGetInterfaceType, SCNetworkServiceGetInterface,
    SCPreferencesCreate)
import objc


def ethernet_services(services):
    '''function will pull any en(x) device that is truly an ethernet
    Special Thanks to @mosen for this little function that gets
    the job done'''
    for service in services:
        interface = SCNetworkServiceGetInterface(service)
        if SCNetworkInterfaceGetInterfaceType(interface) == 'Ethernet':
            yield interface


def main():
    '''This function is very similar to our fix but instead of performing
    any systematic changes will read the information and report it to
    jamf as an extension attribute.'''
    eap8021x_bundle = NSBundle.bundleWithPath_(
        '/System/Library/PrivateFrameworks/EAP8021X.framework')

    # EAP Functions from @mosen's meap project (See above for link)
    eapol_functions = [
        ('EAPOLClientConfigurationGetTypeID', 'Q'),
        ('EAPOLClientProfileGetTypeID', 'Q'),
        ('EAPOLClientItemIDGetTypeID', 'Q'),
        ('EAPOLClientConfigurationCreate',
         '^{EAPOLClientConfigurationRef=}^{__CFAllocator=}'),
        ('EAPOLClientProfileGetUserDefinedName',
         '@^{EAPOLClientProfileRef=}'),
        ('EAPOLClientConfigurationGetSystemProfile',
         '^{EAPOLClientProfileRef=}'
         '^{EAPOLClientConfigurationRef=}@'),
        ('EAPOLClientConfigurationSetSystemProfile',
         'Z^{EAPOLClientConfigurationRef=}@'
         '^{EAPOLClientProfileRef=}'),
        ('EAPOLClientConfigurationSave',
         'Z^{EAPOLClientConfigurationRef=}')]

    objc.loadBundleFunctions(eap8021x_bundle, globals(), eapol_functions)

    # CF Types to be loaded also from @mosen's meap project
    cf_types = [
        ('EAPOLClientConfigurationRef',
         '^{EAPOLClientConfigurationRef=}',
         EAPOLClientConfigurationGetTypeID()),

        ('EAPOLClientProfileRef',
         '^{EAPOLClientProfileRef=}',
         EAPOLClientProfileGetTypeID()),

        ('EAPOLClientItemIDRef',
         '^{EAPOLClientItemIDRef=}',
         EAPOLClientItemIDGetTypeID()), ]

    for item in cf_types:
        objc.registerCFSignature(*item)

    # Define blank lists to be used to gather EAPOL information on
    # Ethernet interfaces
    interface_list = []
    result = []
    prefs = SCPreferencesCreate(None, "python", None)
    services = SCNetworkServiceCopyAll(prefs)

    # Poll through the interfaces and make a list of the true Ethernet
    # adapters on the system
    for interface in ethernet_services(services):
        interface_list.append(SCNetworkInterfaceGetBSDName(interface))

    # For loop to iterate through our Ethernet adapters and determine if they
    # have the system profile we are looking for applied to them. False if not
    # present. Change "Ethernet(COE)" to whatever your 802.1x profile is
    # called in Network Preferences. Default in jamf is sadly "Network"
    for ethernet in interface_list:
        cfg = EAPOLClientConfigurationCreate(None)
        look_for_cfg = EAPOLClientConfigurationGetSystemProfile(cfg, ethernet)
        if look_for_cfg is not None:
            if EAPOLClientProfileGetUserDefinedName(
                    look_for_cfg) == 'Ethernet(COE)':
                eth_string = '| {0:} - True |'.format(ethernet)
                result.append(eth_string)
            else:
                eth_string = '| {0:} - False |'.format(ethernet)
                result.append(eth_string)
        else:
            eth_string = '| {0:} - False |'.format(ethernet)
            result.append(eth_string)
    result = ''.join(result)
    print('<result>|{0:}|</result>'.format(result))


if __name__ == '__main__':
    main()
{% endhighlight %}

On a side note - I have tested this script with both EAP-TLS and PEAP-MSCHAPV2 as unfortunately since we have a lot of remote users we might be moving to PEAP-MSCHAPV2 so that a client certificate which requires an AD connection to get isn't required. This makes the profile fail and jamf does not have a built in retry so clearing out a bunch of systems that did not receive the profile was getting repetitive.

Please take these scripts and test them in your environment and report back results to me either on Slack or Twitter. I'm hoping we can come to some kind of true made Enterprise solution for 802.1x so that it works the way most of us intend it to. I would like to give a big personal thanks to [mosen](https://github.com/mosen) as he was very instrumental in assisting with deciphering the EAPOL framework and working with me on getting the functions in Objective C. Without him this may not have been even a possibility.
