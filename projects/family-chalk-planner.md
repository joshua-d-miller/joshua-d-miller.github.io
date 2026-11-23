---
title: Family Chalk Planner
permalink: /projects/family-chalk-planner/
icon: /assets/img/projects/family-chalk-planner-icon.png
tagline: >-
  A chalkboard-style family wall calendar for a wall-mounted screen, edited
  from a tablet. It runs on your own network, with no account and no cloud service.
description: >-
  Family Chalk Planner is a self-hosted, chalkboard-style family wall calendar
  with chores, meal plans, weather, photos and holiday decorations.
related_title: Chalk Planner
actions:
  - label: Install it
    url: "#install"
    icon: download
  - label: Source on GitHub
    url: https://github.com/joshua-d-miller/family-chalk-planner
    icon: github
  - label: Getting started
    url: https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/getting-started.md
    icon: book
facts:
  - label: Version
    value: 1.2.6
  - label: Runs on
    value: Home Assistant, Docker, Debian, Ubuntu or a Raspberry Pi
  - label: Calendars
    value: Google, iCloud and CalDAV, Outlook links, Home Assistant's calendars
  - label: Written in
    value: TypeScript (Node.js 26, or 22 on 32-bit ARM)
  - label: License
    value: AGPL-3.0
toc: true
---

<figure>
  <img src="{{ '/assets/img/projects/family-chalk-planner/wall.jpg' | relative_url }}" width="1600" height="900"
       alt="The planner on a wall-mounted screen: a month calendar drawn like chalk on a blackboard, with events, a weather forecast, trash day, countdowns, a meal plan and reward jars in a Notes column.">
  <figcaption>The board on the wall.</figcaption>
</figure>

## What it does

- **Your real calendar.** Events come from Google Calendar, any CalDAV
  calendar (iCloud, Nextcloud, Fastmail, Radicale) or the calendars already in
  Home Assistant, with Outlook and school calendars added by link. Add, change and delete
  them from the tablet, including repeating events, and make birthdays and big
  days stand out in large writing.
- **Draw on it.** Chalk and paint-marker drawing, hand-lettered month titles in
  dozens of fonts, stamps, thousands of clipart pictures, chalk drawings,
  emoji and GIFs. The art is saved with each month.
- **Holiday borders** that come back every year: jack-o'-lanterns in October,
  turkeys in November, garland in December, or pictures you pick.
- **Chores** for every day, week and month that reset by themselves. Tick them
  off on the board or a phone, and give each kid a tablet that shows only theirs.
- **A Notes column** with weather, trash and recycling days, countdowns,
  a meal plan, reward jars, today's events or a photo.
- **Photos** pinned beside the month name, and an overnight slideshow, from an
  iCloud or Google Photos shared album.
- **More than one calendar**, each in its own color, plus read-only links for
  school or sports. A Week page (with a Split View for photos, meals or chores
  under the week), Monday starts, 24-hour times, and US, Canadian or UK holidays.
- **In English or Spanish**, for the whole board or just one screen, so the
  kitchen can be in Spanish and a tablet in English.
- **Make it yours** with backgrounds from green chalkboard to cork, kraft paper
  and whiteboard, board styles, per-event colors and a choice of today markers.
- **Live.** Changes on the tablet show up on the wall within a second, and the
  wall updates itself when you install a new version.
- **Part of Home Assistant.** Install it as a Home Assistant app and it lives
  in the sidebar: your Home Assistant login is your board login, its calendars
  and to-do lists show up on the board, and Home Assistant updates and backs it up.
- **Safe for a family.** Screens pair with a code, people sign in with a
  passkey or a password and authenticator app, and an admin console shows every
  sign-in, screen and change.

<div class="gallery">
  <figure>
    <img src="{{ '/assets/img/projects/family-chalk-planner/tablet.jpg' | relative_url }}" width="1800" height="1013" loading="lazy"
         alt="The board on a family touch screen, with the menu, Edit the calendar and Add event along the bottom.">
    <figcaption>A family touch screen.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/projects/family-chalk-planner/chores.jpg' | relative_url }}" width="2083" height="908" loading="lazy"
         alt="Today's chores grouped by person on a tablet and on a phone, with finished chores crossed out.">
    <figcaption>Chores on a tablet and a phone.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/projects/family-chalk-planner/backgrounds.jpg' | relative_url }}" width="1610" height="910" loading="lazy"
         alt="The same month shown on four backgrounds: green chalkboard, cork, kraft paper and whiteboard.">
    <figcaption>A few of the backgrounds.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/projects/family-chalk-planner/console.jpg' | relative_url }}" width="876" height="930" loading="lazy"
         alt="The admin console on a phone, showing screen pairing and board settings.">
    <figcaption>The admin console.</figcaption>
  </figure>
</div>

## What you need

- Something always on at home: **Home Assistant** (OS or Supervised), anything
  that runs Docker (a NAS, a Raspberry Pi on a 64-bit OS, a server), or Debian
  12/13, Ubuntu 22.04/24.04 or Raspberry Pi OS. A Proxmox container with 1 CPU, 512 MB of RAM
  and 4 GB of disk is plenty. A rented cloud server works too, kept behind
  Cloudflare Access or Tailscale.
- A calendar: Google, iCloud or another CalDAV calendar, or the ones in Home
  Assistant.
- A screen for the wall (any browser in kiosk mode; Fully Kiosk Browser on
  Android works well) and a tablet or phone for editing.

## Install

The [Getting started guide](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/getting-started.md)
goes from nothing to the calendar on the wall, step by step.

**In Home Assistant:** add the app repository, then install **Family Chalk
Planner** from the app store.

[![Add the repository to my Home Assistant](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fjoshua-d-miller%2Ffamily-chalk-planner-ha)

Turn on **Show in sidebar**, start it, and open **Family Board**. There's no
setup code: Home Assistant's admins are the board's admins.

**With Docker:**

```bash
mkdir family-chalk-planner && cd family-chalk-planner
curl -fsSLO https://raw.githubusercontent.com/joshua-d-miller/family-chalk-planner/main/compose.yaml
docker compose up -d
docker compose logs board      # shows the one-time setup code
```

**Or directly on Debian, Ubuntu or a Raspberry Pi**, where the git checkout is the install:

```bash
git clone https://github.com/joshua-d-miller/family-chalk-planner.git /opt/family-chalk-planner
sudo bash /opt/family-chalk-planner/deploy/install.sh
```

The installer sets up the right Node.js for your machine (see below), a
locked-down service user, a systemd service, and the optional face finder used
to frame photos.

With Docker or Linux, open `http://<server>:3002/admin`, enter the setup code to create the
admin account, and use **⚙️ Board** to connect your calendar, weather town and
photo album. There are no files to edit.

**Updating:** Home Assistant shows **Update** on the app. With Docker,
`docker compose pull && docker compose up -d`. On Linux, the board installs new
releases overnight by itself (a new major version waits for **Update now** in the
admin console) and rolls back if one doesn't start.

### Node.js

On Debian, Ubuntu and Raspberry Pi OS the installer sets up Node.js from
NodeSource. Docker and the Home Assistant app bring their own, so there's
nothing to do there.

| Your machine | Node.js | Supported until |
| --- | --- | --- |
| 64-bit (amd64 or arm64: most PCs, Proxmox containers, a Raspberry Pi 3, 4 or 5 on the 64-bit Raspberry Pi OS) | **26**, needed from 1.2 | April 2029 |
| 32-bit ARM (a Raspberry Pi on the 32-bit Raspberry Pi OS) | **22**, the newest Node.js built for it | April 30, 2027 |
| Docker and the Home Assistant app | 26, inside the image | Comes with the image |

- **Already running on 22?** Updates move a NodeSource install on a 64-bit
  machine up to Node.js 26 by themselves. If one can't, the board keeps running
  on the Node.js it has and the update says so.
- **On a 32-bit Raspberry Pi**, the board keeps getting updates until Node.js 22
  reaches its end of life on April 30, 2027, then stays on the last version that
  runs on 22. To keep updating after that, move to the 64-bit Raspberry Pi OS
  (any Pi 3, 4 or 5 runs it) and restore your backup.
- If you installed Node.js some other way, the installer leaves it alone. On a
  64-bit machine, install Node.js 26 yourself to keep getting updates.

The [install guide](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/install.md#nodejs)
has the details.

## Using it

| Where | Address |
| --- | --- |
| In Home Assistant | **Family Board** in the sidebar |
| Wall display | `http://<server>:3002/` |
| Admin console (pair screens, invite people) | `http://<server>:3002/admin` |
| Tablet editor | `http://<server>:3002/edit` |
| Chores on a phone | `http://<server>:3002/chores` |

Add the tablet and phone pages to the home screen so they open like apps.

## Documentation

| Guide | What's in it |
| --- | --- |
| [Getting started](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/getting-started.md) | From nothing to the calendar on the wall: Home Assistant, Docker or Linux |
| [Calendars](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/calendars.md) | Home Assistant, iCloud, Google, other CalDAV, Outlook and calendar links |
| [User guide](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/user-guide.md) | The tablet, family screens, kids' tablets, chores and the wall display |
| [Install](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/install.md) | Debian, Ubuntu, Raspberry Pi and Proxmox, Node.js, HTTPS, screens and people, backups, troubleshooting |
| [Wall screens](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/kiosk.md) | Keeping a screen on the board all day: full screen, awake, back after a power cut |
| [Docker](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/docker.md) | Running it with Docker Compose |
| [Google Calendar](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/google-calendar.md) | Connecting a Google calendar |
| [Photos](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/photos.md) | iCloud and Google Photos shared albums, face framing |
| [Cloud](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/cloud.md) | A rented server: what's on it, how to limit it, Cloudflare Access or Tailscale |
| [Changelog](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/CHANGELOG.md) | What changed in each release |

## License

Family Chalk Planner is free software under the
[GNU Affero General Public License v3.0](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/LICENSE)
or later. You can use, change and share it; if you run a modified version for
other people, you have to offer them its source code. Third-party credits for
fonts and clipart are in
[NOTICE](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/NOTICE).
