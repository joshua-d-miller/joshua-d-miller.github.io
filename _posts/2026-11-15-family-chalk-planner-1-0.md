---
title: "Family Chalk Planner 1.0: Our Chalkboard Calendar, Now for Everyone"
date: 2026-11-15T09:00:00-05:00
img: family-chalk-planner.png
tags:
  - Family Chalk Planner
  - Home Assistant
  - Self-hosted
---
The family calendar in our house used to be a chalkboard. My wife drew it by hand every month: the
month's name in fancy lettering, a border that matched the season, and everybody's events written in. It
looked great, and keeping it up to date was a lot of work.

When we put a touchscreen on the wall, the calendar software it came with didn't hold up, so I started building
my own. The goal was simple: keep the chalkboard look my wife loved, but have the events come from our real
calendar and let her decorate it from her iPad. That project is
**[Family Chalk Planner]({{ '/projects/family-chalk-planner/' | relative_url }})**, and today I'm releasing
version 1.0 for anyone to use.

<figure>
  <img src="{{ '/assets/img/projects/family-chalk-planner/wall.jpg' | relative_url }}" width="1600" height="900"
       alt="The planner on a wall-mounted screen: a month calendar drawn like chalk on a blackboard, with events, a weather forecast, trash day, countdowns, a meal plan and reward jars in a Notes column.">
  <figcaption>The board on our wall.</figcaption>
</figure>

## What it does

The wall screen shows the month like a chalkboard, with your events from Google Calendar, iCloud, any
other CalDAV calendar or the calendars already in Home Assistant. From a tablet you can add and change events,
draw on the board, hand-letter the month's name, add a holiday border and drop in pictures from thousands of free
clipart pictures. Whatever you change shows up on the wall within a second.

Over time it picked up the things our house actually uses:

- **Chores** for the day, week and month that reset by themselves, with each kid's tablet showing only theirs
- **A Notes column** with the weather, trash day, countdowns, a meal plan and reward jars the kids fill up
- **Photos** from a shared album, plus a slideshow overnight
- **Backgrounds** from green chalkboard to cork and whiteboard

## Three ways to run it

Everything runs on your own network. There's no account to make and no cloud service in the middle.

1. **Home Assistant.** New in 1.0, and the one I'd pick if you already run Home Assistant. Install it as an app
   and it shows up in the sidebar. Your Home Assistant login is your board login, the calendars and to-do lists
   you already have in Home Assistant show up on the board, and Home Assistant keeps it updated and backed up.
2. **Docker.** One `compose.yaml` and `docker compose up -d`.
3. **Debian, Ubuntu, Raspberry Pi or a Proxmox container.** One install script, and the board installs its own
   updates overnight.

The [Getting started guide](https://github.com/joshua-d-miller/family-chalk-planner/blob/main/docs/getting-started.md)
walks through each one, from nothing to the calendar on the wall.

## Built to be trusted with a family's calendar

Since this holds our family's schedule, I wanted it locked down. Screens pair with a one-time code, people sign
in with a passkey or a password plus an authenticator app (or their Home Assistant login), and the admin console
shows every sign-in, screen and change. Saved passwords are encrypted. Every change to the code is tested: a new
family's first setup in a real browser, the install and update scripts, the Docker image, and the Home Assistant
app running against a real Home Assistant.

## Thank you

This project started for my wife, and it wouldn't be what it is without her. She tried every version, told me
what was clunky, and kept pushing it to look as good as the chalkboard she used to draw by hand. Thanks also to
my neighbor Colby, who ran his own copy, tested Google Calendar for me and built features of his own. And thanks
to my kids, the first users of the chores and reward jars.

## Try it

Family Chalk Planner is free and open source under the AGPL-3.0. The code, docs and issue tracker are on
[GitHub](https://github.com/joshua-d-miller/family-chalk-planner). If you put it on your own wall, I'd love to
hear how it goes, and if something doesn't work, please
[open an issue](https://github.com/joshua-d-miller/family-chalk-planner/issues).
