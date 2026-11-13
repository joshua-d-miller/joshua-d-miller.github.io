---
title: macOSLAPS
permalink: /projects/macoslaps/
icon: /assets/img/projects/macoslaps-icon.png
tagline: >-
  A Swift command-line tool that rotates the password of a local administrator
  account on your Macs, the way Microsoft LAPS does on Windows.
description: >-
  macOSLAPS rotates a Mac's local administrator password on a schedule and
  stores it in Active Directory or in the Mac's keychain for your MDM to collect.
related_title: LAPS
actions:
  - label: Download the installer
    url: https://github.com/joshua-d-miller/macOSLAPS/releases/latest
    icon: download
  - label: Source on GitHub
    url: https://github.com/joshua-d-miller/macOSLAPS
    icon: github
  - label: Wiki
    url: https://github.com/joshua-d-miller/macOSLAPS/wiki
    icon: book
facts:
  - label: Requires
    value: macOS 10.13 or later
  - label: Written in
    value: Swift (Universal)
  - label: Stores passwords in
    value: Active Directory or the keychain
  - label: License
    value: MIT
---

<nav class="toc" aria-label="On this page" markdown="1">
On this page

* TOC
{:toc}
</nav>

## What it does

macOSLAPS is installed on each Mac and runs every 90 minutes. When the managed
administrator's password is older than the expiration you set, it generates a
new random password, changes it, and stores it where you can get it back:

- **Active Directory** (the `AD` method): the password and its expiration are
  written to the computer's AD record, just like Windows LAPS. Your help desk
  reads them with the same tools they use for Windows.
- **Local** (the `Local` method): the password stays in the Mac's System
  keychain, and your MDM collects it on demand. Use this if your Macs aren't
  bound to AD.

If the password can't be written back to Active Directory, macOSLAPS puts the
old password back and logs the failure, so a Mac is never left with a password
nobody knows.

## Requirements

- macOS 10.13 or later. For older Macs, use
  [macOSLAPS-Legacy](https://github.com/joshua-d-miller/macOSLAPS-Legacy).
- A local administrator account to manage.
- **Active Directory method:** a writable domain controller the Mac can reach
  (on site or over VPN).
- **Local method:** an MDM to read the password back from the Mac.

## Install

Download the **.pkg** from the
[latest release](https://github.com/joshua-d-miller/macOSLAPS/releases/latest)
and deploy it with your MDM or any other tool. It installs:

| File | Location | What it's for |
| --- | --- | --- |
| `macOSLAPS` | `/usr/local/laps` | The main tool |
| `macOSLAPS-repair` | `/usr/local/laps` | Certificate rotation, if needed |
| `laps` | `/private/etc/paths.d` | Lets you run `macOSLAPS` in Terminal without the full path |
| `edu.psu.macoslaps-check.plist` | `/Library/LaunchDaemons` | Runs macOSLAPS every 90 minutes |

Everything macOSLAPS does is logged to `/Library/Logs/macOSLAPS.log`.

### Running it from your MDM instead

On macOS Ventura and later, the LaunchDaemon shows people a "background item
added" notification and appears in **System Settings → General → Login Items**.
You can either:

- **Keep the LaunchDaemon** and deploy two profiles: a Managed Login Items
  (`com.apple.servicemanagement`) payload with a **Label** rule for
  `edu.psu.macoslaps-check`, so it can't be turned off, and a Notifications
  payload for `com.apple.BTMNotificationAgent` to silence the alert.
- **Skip the LaunchDaemon** and have your MDM run `/usr/local/laps/macOSLAPS`
  on a schedule (a daily Jamf Pro policy, for example). Since 3.0.0 you can
  leave the LaunchDaemon out with an `InstallerChoices.xml` next to the package.

The [Managed Login Item](https://github.com/joshua-d-miller/macOSLAPS/wiki/Managed-Login-Item)
wiki page has the complete profiles and `InstallerChoices.xml`.

## Configure

macOSLAPS reads its settings from the `edu.psu.macoslaps` preference domain,
first from a configuration profile and then from a local file:

1. `/Library/Managed Preferences/edu.psu.macoslaps.plist` (from your MDM, recommended)
2. `/Library/Preferences/edu.psu.macoslaps.plist` (set locally, handy for testing)

For Active Directory you usually only need `LocalAdminAccount`, plus `FirstPass`
if the account has a secure token. For the Local method, also set `Method` to `Local`.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `LocalAdminAccount` | String | `admin` | Short name of the administrator account to manage |
| `DaysTillExpiration` | Integer | `60` | Days before the password is changed again |
| `PasswordLength` | Integer | `12` | Length of the generated password |
| `PasswordGrouping` | Integer | `0` | Characters per group, for passwords like `Ies3-#81n-@imd` (0 turns grouping off) |
| `PasswordSeparator` | String | `-` | Character placed between groups |
| `PasswordRequirements` | Dictionary | none | Minimum number of `Lowercase`, `Uppercase`, `Number` and `Symbol` characters |
| `RemovePassChars` | String | `'` | Characters never to use, for example `1lLO0` |
| `ExclusionSets` | Array | none | Whole character sets to leave out, for example `symbols` |
| `RemoveKeychain` | Boolean | `true` | Delete the admin account's login keychains after a change |
| `PreferredDC` | String | none | Domain controller to use, useful when you have read-only DCs |
| `FirstPass` | String | none | The admin's current password, needed the first time if it has a secure token |
| `Method` | String | `AD` | `AD` for Active Directory or `Local` for the keychain |

To try a setting without an MDM:

```bash
sudo defaults write /Library/Preferences/edu.psu.macoslaps LocalAdminAccount lapsadmin
```

### Example profile

Upload this as a property list in a Jamf Pro **Application & Custom Settings**
payload (preference domain `edu.psu.macoslaps`), or the equivalent in your MDM:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>LocalAdminAccount</key>
    <string>admin</string>
    <key>DaysTillExpiration</key>
    <integer>30</integer>
    <key>PasswordLength</key>
    <integer>14</integer>
    <key>RemovePassChars</key>
    <string>{}[]|</string>
</dict>
</plist>
```

## Command-line options

Options start with a single dash and aren't case sensitive.

| Option | What it does |
| --- | --- |
| `-version` | Prints the version and exits. Doesn't need root. |
| `-help` | Lists these options. Doesn't need root. |
| `-resetPassword` | Changes the password now, whatever the expiration date. |
| `-firstPass <password>` | Changes the password using the one you give as the current password, instead of the `FirstPass` key. |
| `-getPassword` | Local method only: copies the current password and expiration to a temporary keychain item your MDM can read. It's removed on the next run. |

### Reading the password with the Local method

After `sudo macOSLAPS -getPassword`, the name of the temporary keychain item is
in `/var/root/.GeneratedLAPSServiceName`:

```bash
service=$(sudo cat /var/root/.GeneratedLAPSServiceName)
sudo security find-generic-password -w -s "$service"
```

The repository has ready-made
[Jamf Pro extension attributes](https://github.com/joshua-d-miller/macOSLAPS/tree/master/jamf%20Extension%20Attributes)
and [MDM scripts](https://github.com/joshua-d-miller/macOSLAPS/tree/master/MDM%20Scripts)
that do this and run macOSLAPS again to clear the copy.

## Secure tokens and FileVault

Since APFS, admin accounts usually have a **secure token**, and macOS won't let
anyone change a secure-token account's password without knowing the old one.
So macOSLAPS has to know the current password the first time:

1. **First run:** set `FirstPass` (or pass `-firstPass`). macOSLAPS uses it once,
   changes the password, and keeps the new one in the System keychain.
2. **Every run after that:** it reads the current password from the System
   keychain, changes it, and stores the new one there.

On macOS 10.15 and later with a bootstrap token, setting `FirstPass` is strongly
recommended so rotation works from the start.

## Help and credits

Ask questions in the [#laps channel](https://macadmins.slack.com/archives/C68F4NLFL)
on the [MacAdmins Slack](https://macadmins.org), or
[open an issue](https://github.com/joshua-d-miller/macOSLAPS/issues).

macOSLAPS exists thanks to the MacAdmins community, and especially
[Rusty Myers](https://github.com/rustymyers), [Matt Hansen](https://github.com/hansen-m),
[Per Olofsson](https://github.com/magervalp), Allen Clouser, Jody Harpster,
[John Pater](https://github.com/jpat14), [Joel Rennich](https://gitlab.com/Mactroll)
and Peter Szul for ideas, code, testing and security review.
