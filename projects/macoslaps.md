---
title: macOSLAPS
permalink: /projects/macoslaps/
icon: /assets/img/projects/macoslaps-icon.png
tagline: >-
  Rotates the password of a local administrator account on your Macs and keeps
  it where IT can get it: your MDM, the Mac itself, or Active Directory.
description: >-
  macOSLAPS rotates a Mac's local administrator password on a schedule and
  keeps it in your MDM (plain or encrypted), on the Mac behind a reveal code,
  or in Active Directory.
related_title: LAPS
actions:
  - label: Read the documentation
    url: /macOSLAPS/
    icon: book
  - label: Download
    url: https://github.com/joshua-d-miller/macOSLAPS/releases
    icon: download
  - label: Source on GitHub
    url: https://github.com/joshua-d-miller/macOSLAPS
    icon: github
facts:
  - label: Requires
    value: macOS 13 or later (4.0)
  - label: Works with
    value: Any MDM, or Active Directory
  - label: Written in
    value: Swift (Universal)
  - label: License
    value: MIT
toc: true
---

## macOSLAPS 4.0 is in prerelease

macOSLAPS 4.0 is the biggest update since the tool began. It's a prerelease
(the newest build is on the
[releases page](https://github.com/joshua-d-miller/macOSLAPS/releases)), so
try it on test Macs first and tell me how it goes in
[#laps](https://macadmins.slack.com/archives/C68F4NLFL) on the MacAdmins Slack
or in a [GitHub issue](https://github.com/joshua-d-miller/macOSLAPS/issues).

**The [macOSLAPS documentation](/macOSLAPS/) covers 4.0 in full**: setup,
upgrading from 3.x, every setting, and what most needs testing.

## What it does

macOSLAPS runs on each Mac every 90 minutes. When the managed administrator's
password is due, it generates a new random one, checks that it works, and keeps
it where IT can get it back, in one of four ways:

- **Escrow:** your MDM collects the password with an inventory script.
- **Encrypted escrow:** the same, encrypted to your admins' certificates, so
  the MDM never holds it in readable form.
- **Device mode:** the password never leaves the Mac. Your MDM holds a reveal
  code, a technician types it into the macOSLAPS app at the Mac, and the
  password changes again a few hours later.
- **Active Directory:** on the computer object, read with the same tools as
  Windows LAPS.

![The macOSLAPS reveal window showing the password and its phonetic spelling](/macOSLAPS/images/reveal-3-revealed.png)

It also keeps the admin group to the accounts you approve, handles accounts
with a secure token safely, and stops rather than fights if something else
changes the password.

## New in 4.0

- An app at `/Applications/macOSLAPS.app` with its own icon, signed and
  notarized.
- Device mode, with a reveal window and a menu bar countdown.
- Encrypted escrow, staged rotation and ready-made scripts for Jamf Pro,
  Intune, Workspace ONE and other MDMs.
- Admin group protection, which recognizes the admin your MDM created during
  enrollment.
- Better Active Directory support: `PreferredDC` now works, and a Mac bound to a
  read-only domain controller finds a writable one by itself. `Method` defaults
  to `auto`, which picks Active Directory on bound Macs and Local on the rest.
- The password is never handed out in plaintext on the Mac unless your MDM's
  profile allows it (`AllowRead`), so `-escrow` is the way your MDM collects it.
- Clearer command names: `-rotate` and `-currentPassword` (the old
  `-resetPassword` and `-firstPass` still work), plus `-newPassword` to set a
  password you choose (if the profile allows it with `AllowNewPassword`).
- New identifiers (`com.joshua-d-miller.macoslaps`), with a one-way migration
  of the stored password. Read
  [Upgrading from 3.x](/macOSLAPS/upgrading/) before you upgrade.

## Still on 3.x?

The latest stable release is 3.0.4, documented on the
[wiki](https://github.com/joshua-d-miller/macOSLAPS/wiki). Macs on macOS 12
stay on 3.0.4.

## Help and credits

Ask questions in the [#laps channel](https://macadmins.slack.com/archives/C68F4NLFL)
on the [MacAdmins Slack](https://macadmins.org), or
[open an issue](https://github.com/joshua-d-miller/macOSLAPS/issues).
Everyone who has helped is thanked on the
[credits page](/macOSLAPS/credits/).
