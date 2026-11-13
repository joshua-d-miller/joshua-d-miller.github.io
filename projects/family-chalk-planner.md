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
  - label: User guide
    url: https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/user-guide.md
    icon: book
facts:
  - label: Runs on
    value: Docker, Debian or Ubuntu
  - label: Calendars
    value: Google Calendar and CalDAV
  - label: Written in
    value: TypeScript (Node.js 22)
  - label: License
    value: AGPL-3.0
---

<figure>
  <img src="{{ '/assets/img/projects/family-chalk-planner/wall.jpg' | relative_url }}" width="1600" height="900"
       alt="The planner on a wall-mounted screen: a month calendar drawn like chalk on a blackboard, with events, a weather forecast, trash day, countdowns, a meal plan and reward jars in a Notes column.">
  <figcaption>The board on the wall.</figcaption>
</figure>

<nav class="toc" aria-label="On this page" markdown="1">
On this page

* TOC
{:toc}
</nav>

## What it does

- **Your real calendar.** Events come from Google Calendar or any CalDAV
  calendar (iCloud, Nextcloud, Fastmail, Radicale). Add, change and delete
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
  school or sports. A Week page, Monday starts, 24-hour times, and US, Canadian
  or UK holidays.
- **Make it yours** with backgrounds from green chalkboard to cork, kraft paper
  and whiteboard, board styles, per-event colors and a choice of today markers.
- **Live.** Changes on the tablet show up on the wall within a second, and the
  wall updates itself when you install a new version.
- **Safe for a family.** Screens pair with a code, people sign in with a
  passkey or a password and authenticator app, and an admin console shows every
  sign-in, screen and change.

<div class="gallery">
  <figure>
    <img src="{{ '/assets/img/projects/family-chalk-planner/tablet.jpg' | relative_url }}" width="1600" height="900" loading="lazy"
         alt="The board on a tablet in a wooden frame, with editing tools along the bottom: Draw, Month title, Border, photos, style and Add event.">
    <figcaption>Editing on a tablet.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/projects/family-chalk-planner/chores.jpg' | relative_url }}" width="1600" height="697" loading="lazy"
         alt="Today's chores grouped by person on a tablet and on a phone, with finished chores crossed out.">
    <figcaption>Chores on a tablet and a phone.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/projects/family-chalk-planner/backgrounds.jpg' | relative_url }}" width="1600" height="904" loading="lazy"
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

- An always-on machine on your home network: anything that runs Docker (a NAS,
  a Raspberry Pi, a server), or Debian 12/13 or Ubuntu 22.04/24.04 on amd64 or
  arm64. A Proxmox container with 1 CPU, 512 MB of RAM and 4 GB of disk is plenty.
  No server at home? It also runs on a small cloud server behind a free
  Cloudflare Tunnel.
- A Google or CalDAV calendar.
- A screen for the wall (any browser in kiosk mode; Fully Kiosk Browser on
  Android works well) and a tablet or phone for editing.

## Install

**With Docker:**

```bash
mkdir family-chalk-planner && cd family-chalk-planner
curl -fsSLO https://raw.githubusercontent.com/joshua-d-miller/family-chalk-planner/main/compose.yaml
docker compose up -d
docker compose logs board      # shows the one-time setup code
```

**Or directly on Debian or Ubuntu**, where the git checkout is the install:

```bash
git clone https://github.com/joshua-d-miller/family-chalk-planner.git /opt/family-chalk-planner
sudo bash /opt/family-chalk-planner/deploy/install.sh
```

The installer adds Node.js 22 if it's missing, a locked-down service user,
a systemd service, and the optional face finder used to frame photos.

Then open `http://<server>:3002/admin`, enter the setup code to create the
admin account, and use **⚙️ Board** to connect your calendar, weather town and
photo album. There are no files to edit.

**Updating:** `docker compose pull && docker compose up -d`, or
`sudo /opt/family-chalk-planner/deploy/update.sh`, which installs the newest
release and rolls back by itself if it doesn't start.

## Using it

| Where | Address |
| --- | --- |
| Wall display | `http://<server>:3002/` |
| Admin console (pair screens, invite people) | `http://<server>:3002/admin` |
| Tablet editor | `http://<server>:3002/edit` |
| Chores on a phone | `http://<server>:3002/chores` |

Add the tablet and phone pages to the home screen so they open like apps.

## Documentation

| Guide | What's in it |
| --- | --- |
| [User guide](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/user-guide.md) | The tablet, family screens, kids' tablets, chores and the wall display |
| [Install](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/install.md) | Debian, Ubuntu and Proxmox, HTTPS, screens and people, backups, troubleshooting |
| [Docker](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/docker.md) | Running it with Docker Compose |
| [Google Calendar](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/google-calendar.md) | Connecting a Google calendar |
| [Photos](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/photos.md) | iCloud and Google Photos shared albums, face framing |
| [Cloud](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/cloud.md) | A small cloud server behind a Cloudflare Tunnel |
| [Changelog](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/CHANGELOG.md) | What changed in each release |

## License

Family Chalk Planner is free software under the
[GNU Affero General Public License v3.0](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/LICENSE)
or later. You can use, change and share it; if you run a modified version for
other people, you have to offer them its source code. Third-party credits for
fonts and clipart are in
[NOTICE](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/NOTICE).
