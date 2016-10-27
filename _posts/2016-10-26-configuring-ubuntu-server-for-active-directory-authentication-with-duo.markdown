---
title: Configuring Ubuntu Server for Active Directory authentication with Duo
layout: post
type: post
published: true
comments: true
date: 2016-10-26 08:01:08 -04:00
image: images/Ubuntu.png
status: publish
categories:
- Ubuntu
- Active Directory
tags:
- Duo
- SSSD
---

Today I decided that I wanted to really start moving away from macOS xServe machines. Currently, I still do Mac repairs so I'll need to setup a Mac Mini with AST but that is besides the point. In this post I will highlight how to setup a Ubuntu server with Active Directory and Duo so that we can prepare to make it a Netboot server. At the time of this post the Ubuntu version was 16.04

# Active Directory Configuration

To begin, I installed Ubuntu 16.04 Server in a Hyper-V VM following the easy setup. Next we run the following commands to make sure that the Ubuntu Server is up to date:

{% highlight text %}
sudo apt-get update        # Fetches the list of available updates
sudo apt-get upgrade       # Strictly upgrades the current packages
sudo apt-get dist-upgrade  # Installs updates (new ones)
{% endhighlight %}

Now that we have completed the initial server setup, it is time to configure Active Directory and Duo authentication as I use both of these in our college. Lets first install **sssd** as I prefer this method for using Active Directory authentication. We will then install **realmd** since Ubuntu does include this. It allows us to discover our Active Diretory and install any additional packages that may be required. Here is what mine looked like:

{% highlight text %}
sudo apt-get install sssd
sudo apt-get install realmd
realm discover your.domain
your.domain
   type: kerberos
   realm-name: YOUR.DOMAIN
   domain-name: your.domain
   configured: no
   server-software: active-directory
   client-software: sssd
   required-package: sssd-tools
   required-package: sssd
   required-package: libnss-sss
   required-package: libpam-sss
   required-package: adcli
   required-package: samba-common-bin
sudo apt-get install sssd-tools libnss-sss libpam-sss adcli samba-common-bin
{% endhighlight %}

So now we should be able to join the domain right? Unfortunately, I ran into an issue and recevied an error about the necessary packages not being installed even though we just installed them. The good news however is I was able to get around this by performing the following:

{% highlight text %}
sudo realm join -v -U domainadmin your.domain --install=/
{% endhighlight %}

This command allows the joining of Active Directory to run in verbose mode, specifies a user to use while joining the domain and will install any necessary packages to finish the install. You should be now setup to use AD accounts on the system but let's make one more change. The default behavior is to use **user@domain** to login which I don't prefer so I go into the **/etc/sssd/sssd.conf** and change the following:

### sssd.conf

**From**
{% highlight text %}
use_fully_qualifed_names = True
fallback_homedir = /home/%u@%d
{% endhighlight %}
**To**
{% highlight text %}
use_fully_qualified_named = False
fallback_homedir = /home/%u
{% endhighlight %}

With this change a user can use their shortname to login to the server and their home directory will be **/home/user**. In order to create the home directory automatically however we need to make a small change in the **/etc/pam.d/common-session** file by adding the following line after *session required pam_unix.so*:

### common-session
{% highlight text %}
session    required    pam_mkhomedir.so skel=/etc/skel/ umask=0022
{% endhighlight %}

Next we want to grant our group to be able to **sudo** and make changes on the server. This step is completlely optional but if you are planning on making server changes after setup I would highly recommend it so you can track changes. We will edit the file **/etc/sudoers** and add underneath the line *%admin ALL=(ALL) ALL* we will add the following:

{% highlight text %}
%GroupName ALL=(ALL) ALL
{% endhighlight %}

Now we want to limit SSH access to this group and the local account if someone knows it. Obviously you could turn off the local account if you'd like but I keep it on for an emergency. We will need to edit the **/etc/pam.d.sshd** file in order to make this change. Please add the following underneath the line *account required pam_nologin.so*:

{% highlight text %}
account    sufficient   pam_succeed_if.so user ingroup GroupName
account    sufficient   pam_succeed_if.so user ingroup wheel
{% endhighlight %}

From here I like to reboot for good measure just to make sure everything took correctly. Upon completion of the reboot, I was able to login on the console or use SSH with my Active Directory account. I can also **sudo** as I want to be able to make changes. Now onto Duo:

# Duo Configuration

To configure Duo we will need to download the Duo tar file. You can for the most part just follow the steps listed here: [Duo Unix Setup]('https://duo.com/docs/duounix' "Duo Unix Setup"). One thing when performining this: you will need to install the **build-essential** package so that it can be compiled. You may also need to elevate to root when compiling by using the *sudo -s* command as I ran into an error trying to do it from my account.

{% highlight text %}
sudo apt-get install build-essential
{% endhighlight %}

Now that Duo is installed you will need to configure it by editing the */etc/duo/pam_duo.conf* file as listed in the link above. Once that is compelted we will configure how Duo is used with Active Directory. We will need to edit */etc/pam.d/common-auth* and paste this block over the "Primary" block:

{% highlight text %}
auth    [success=3 default=ignore]      pam_unix.so nullok_secure
auth    requisite                       pam_sss.so use_first_pass
auth    [success=1 default=ignore]      /lib64/security/pam_duo.so
{% endhighlight %}

This means that if you are using a local account that it will skip the Duo process but if you use an Active Directory account, duo authentication is required.

This may look like a lot of steps but after highlighting them it is actually pretty simple. Now that we have the server configured it is time to start setting up NetBoot.


