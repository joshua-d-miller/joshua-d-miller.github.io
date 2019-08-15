---
layout: post
published: true
comments: true
title: "LAPS for macOS"
date: "2019-08-15 09:16:00 -0400"
img: LAPS.png
tags:
    - Active Directory
    - Mac Management
    - macOS
---
I am excited to announce a new macOS application called **LAPS for macOS**. This application will allow you to grab LAPS passwords much similar to the **LAPS UI** for Windows from Active Directory on your macOS device instead of using RDP to connect to a server and pull the password.

## Features

This application will look very similar to the **LAPS UI** for Windows with the exception of a new tab called *Credentials*.

- **Credentials** - The Credentials tab will allow you to input credentials in the application and save them to keychain that can be used to pull LAPS passwords from Active Directory. This is espeically useful if you are logging into your macOS device with an account that does not have permission to view LAPS passwords.
- **Expire Password** - Similar to **LAPS UI** for Windows you can expire the password immediately which will set the expiration date to January 1, 2001. Upon next run of macOSLAPS or Group Policy, the password will then change.
- **Custom Expiration** - When clicking the date box, you can set a custom expiration date for the LAPS password. This is useful if you are giving someone the LAPS password for temporary use.
- **Readable Password** - One of the most annoying *features* of **LAPS UI** on Windows is the fact that the password is in an almost unreadable font and certain letters and numbers look the same. I have gone ahead and used the **Courier** font so that it is very easy to read.

## Instllation

Just install the application on your macOS device using your favorite software package manager or just copy the App from the DMG manually.

## Conclusion

LAPS for macOS will allow me or you to read LAPS passwords without going out to a Windows Server. Right now your macOS device must be bound in order for this application to work properly. It is my hope that at some point I'll be able to get this application to work without the need to be bound. If you have questions or concerns about the new application please let me know.
