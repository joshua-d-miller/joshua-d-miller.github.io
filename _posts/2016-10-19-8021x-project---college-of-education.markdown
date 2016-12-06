---
title: 802.1x Project - College of Education
layout: post
type: post
published: true
comments: true
date: 2016-10-19 08:00:03 -04:00
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
Over the past few months our College has begun attempts to secure our **wired** network. This is due to the fact that our current setup was to use **DHCP Reservations** to allow devices on our wired network. This worked fine however anyone can statically assign an IP address and get on our network. It also presented a problem with the Apple dongles, displays and docks as the MAC address is tied to that device rather than the machine. In order to amplify security, we decided to begin testing and eventually fully implement 802.1x on our wired networks. The goal was simple - Provide security of our network without any interruption to our users.

To perform this I began testing with a **Brocade** switch as that is the brand of switches that our networking team provides us. Then I setup a Windows Server with Network Policy Server (NPS). Finally, I made a configuration profile for Macs and a Group Policy for Windows machines that will allow them to contact our Certificate Authority and receive a computer certificate. The theory was to use **EAP-TLS** for authentication which will check that the computer is bound to our Active Directory and has a valid certificate from our CA. If these conditions are met then the device is allowed on the network. This would remedy the Apple accessory issue and the need for DHCP Reservations all while keeping personal devices off of the network. Now lets look at the configuration of all of this:

**Step 1: Configure the switch**<br/>
To configure the switch we will need to setup a RADIUS server entry on the switch. In our college, we have a **Bradford NAC** which we will use as a proxy to talk to our RADIUS servers. This is so we can utilize our NAC to protect against **MAC spoofing** and also configure **VLANS** on our network. The switch will have the following configuration piece for RADIUS:

{% highlight text %}
radius-server host IPAddressOfRADIUS auth-port 1812 acct-port 1813 default key YourSecretKeyHere dot1x

aaa authentication dot1x default radius

authentication
    dot1x enable
    dot1x enable (ports you want to enable ex eth 1/1/1)
    dot1x timeout tx-period 10
    dot1x timeout supplicant 15
{% endhighlight %}

**Step 2: Configure a Windows RADIUS Server**<br/>
Now we will configure a Windows RADIUS server to handle the authentication requests. Let's get started:

- Add your switch to the RADIUS client whose shared secret is the same as the key you put on the switch
- Create a **Connection Request** policy that looks for the NAS Port Type as **Ethernet**
- Create a **Network Policy** called **Certificate Validation** with the following settings
    + Conditions
        * NAS Port Type (Again) - Ethernet
        * Windows Groups - Domain Computers
        * Authentication Type - EAP
    + Constraints
        * Authentication Method - Add **ONLY** Microsoft: Smart Card or other certificate
            - In the certificate settings select a certificate for the server from your CA
        * Again under NAS Port Type select Ethernet<br/><br/>

**Step 3a: Group Policy**<br/>
With the RADIUS server and the switch configured we will now add the Group Policy for the Windows clients to get a computer certificate and use the correct settings to authenticate. Listed below are the group policy settings:

- Create a policy called **802.1x Wired Autoconfig**
    - Computer Configuration --> Policies --> Security Settings
        - System Services
            - Wired Autoconfig (Startup Mode: Automatic)
        - Wired Network (802.3) Policies
            - Name: Your Name Here
            - Description: We use something like "Settings Required to access network"
            - Use Windows wired LAN network services for clients: Enabled
            - Shared user credentials for network authentication: Enabled
        - Network Profile
            - Security Settings
                - Enable use of IEEE 802.1x authentication for network access: Enabled
                - Enforce use of IEEE 802.1x authentication from network access: Disabled
            - IEEE 802.1X Settings
                - Computer Authentication: Computer Only
                - EAPOL Start Message: Transmit per IEEE 802.1X
                - Maximum Authentication Failures: 1
                - Maximum EAPOL-Start Messages Sent: 3
                - Held Period (seconds): 1
                - Start Period (seconds): 5
                - Authentication Period (seconds): 18
            - Network Authentication Method Properties
                - Authentication Method: Smart card or certificate
                - Validate server certificate: Enabled
                    - NOTE: Make sure you select your CA Cert in the list
                - Use a certificate on this computer: Enabled
                - Use simple certificate selection: Enabled
                - Use a different username for the connection: Disabled
        - Public Key Policies/Certificate Services Client - Auth-Enrollment Settings
            - Automatic certificate management: Enabled
            - Enroll new certificates, renew expired certificates, process pending certificate requests and remove revoked certificates: Enabled
            - Update and manage certificates that use certificate templates from Active Directory<br/><br/>

With this policy and an AD CA template for computers you should now be able to receive the settings needed to connect to your 802.1x switch using a Windows 7, 8 or 10 client.

**Step 3b Configure MDM Profile for macOS devices**<br/>
We currently use jamf to serve MDM profiles to our macOS devices. One issue I have found with building this profile in jamf however is that it treats the profile as a user profile when attempting to connect so the user is prompted to select the computer certificate. If I sign the profile using a developer certificate and then upload to jamf so it can't modify it, then this does not occur. I would suggest that you do the same. Here is a sample **mobileconfig** file that you can tailor to your organization and upload to your MDM:

{% highlight xml linenos %}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>AllowAllAppsAccess</key>
            <true/>
            <key>CertServer</key>
            <string>Your CA Server DNS address</string>
            <key>CertTemplate</key>
            <string>Mac-Client/Server-Auth</string>
            <key>CertificateAcquisitionMechanism</key>
            <string>RPC</string>
            <key>CertificateAuthority</key>
            <string>Name of the Authority</string>
            <key>CertificateRenewalTimeInterval</key>
            <integer>30</integer>
            <key>Description</key>
            <string>Settings needed to connect to the College's 802.1x Network</string>
            <key>KeyIsExtractable</key>
            <false/>
            <key>PayloadDisplayName</key>
            <string>AD Certificate</string>
            <key>PayloadEnabled</key>
            <true/>
            <key>PayloadIdentifier</key>
            <string>edu.psu.educ.ADCSRequest</string>
            <key>PayloadType</key>
            <string>com.apple.ADCertificate.managed</string>
            <key>PayloadUUID</key>
            <string>fc4505c6-8d95-4ebb-85d8-f158c162fc40</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PromptForCredentials</key>
            <false/>
            <key>updated_at_xid</key>
            <integer>72640</integer>
        </dict>
        <dict>
            <key>PayloadContent</key>
            <data>
            bunchofdatahere
            </data>
            <key>PayloadEnabled</key>
            <true/>
            <key>PayloadIdentifier</key>
            <string>edu.psu.educ.certforCA</string>
            <key>PayloadDisplayName</key>
            <string>Your CA Cert</string>
            <key>PayloadType</key>
            <string>com.apple.security.root</string>
            <key>PayloadUUID</key>
            <string>2ac0d312-a124-4ce3-8a7a-934b61e5da27</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>updated_at_xid</key>
            <integer>72637</integer>
        </dict>
        <dict>
            <key>AuthenticationMethod</key>
            <string></string>
            <key>AutoJoin</key>
            <true/>
            <key>EAPClientConfiguration</key>
            <dict>
                <key>AcceptEAPTypes</key>
                <array>
                    <integer>13</integer>
                </array>
                <key>PayloadCertificateAnchorUUID</key>
                <array>
                    <string>2ac0d312-a124-4ce3-8a7a-934b61e5da27</string>
                </array>
            </dict>
            <key>EncryptionType</key>
            <string>Any</string>
            <key>HIDDEN_NETWORK</key>
            <false/>
            <key>Interface</key>
            <string>FirstActiveEthernet</string>
            <key>PayloadCertificateUUID</key>
            <string>fc4505c6-8d95-4ebb-85d8-f158c162fc40</string>
            <key>PayloadDisplayName</key>
            <string>Ethernet - CoE</string>
            <key>PayloadEnabled</key>
            <true/>
            <key>PayloadIdentifier</key>
            <string>edu.psu.educ.ethernetcoe</string>
            <key>PayloadType</key>
            <string>com.apple.firstactiveethernet.managed</string>
            <key>PayloadUUID</key>
            <string>7b504450-e474-0133-d175-48bcc8f51634PEAP</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>ProxyType</key>
            <string>None</string>
            <key>SetupModes</key>
            <array>
                <string>System</string>
            </array>
            <key>updated_at_xid</key>
            <integer>72631</integer>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>This profile will configure the settings needed to connect to the College of Education's Secure Ethernet Network.</string>
    <key>PayloadDisplayName</key>
    <string>Ethernet - CoE</string>
    <key>PayloadIdentifier</key>
    <string>edu.psu.educ.8021x.System</string>
    <key>PayloadOrganization</key>
    <string>Penn State College of Education</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadScope</key>
    <string>System</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>edu.psu.educ.8021x.System</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>
{% endhighlight %}

As you can see, I made a few changes. First, I changed the **PayloadDisplayName** so that instead of it saying **Ethernet** in the list of 802.1x security profiles it actually will say where it is used. Secondly, you will also see that I created an special template called **Mac Client/Sever Auth** so that macOS devices could authenticate. You can see more details on that [here](https://www.afp548.com/2012/11/20/802-1x-eaptls-machine-auth-mtlion-adcerts/ "802.1x EAP-TLS Machine Authentication in Mt. Lion with AD Certificates"). Finally, we have both our Mac and Windows clients configured to connect to our RADIUS server and authenticate to the network. To sign the configuration profile you can use [Nick McSpadden's Profile Signer](https://github.com/nmcspadden/ProfileSigner "Profile Signer"). Of course you will need a developer certificate in order to do so.

**Final Thoughts**<br/>
So far testing has been very successful and one of our four buildings is currently online. Since going through the test we have discovered a few interesting pieces that we still need to figure out. For instance, most printers that are network do not support 802.1x so we were thinking of creating a private VLAN that our networked clients can access but does not have access to the Internet for the printers that will have 802.1x disabled. We have also thought about using **MAC Authentication** on the switches on this VLAN. Other devices such as Apple TVs, ThereNow Cameras and our one buildings Clinic equipment obviously also do not support 802.1x so we are still working to determine the best way to support these devices moving forward. I welcome additional comments for those who might have suggestions to make this better than it already seems to be.




