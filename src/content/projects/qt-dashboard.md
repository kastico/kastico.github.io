---
title: "Qt Dashboard UI"
description: "Internal business dashboard built with C++ and Qt QML. Charts, tables, real-time data."
pubDate: 2024-06-01
updatedDate: 2025-01-10
heroImage: ../../assets/blog-placeholder-5.jpg
status: "Completed"
vault: "web-development"
tags: [qt, cpp, ui, work]
features:
  - "Real-time data refresh"
  - "Responsive QML layouts"
  - "Dark/light theme"
  - "Export to PDF"
tech: [C++, Qt, QML, PostgreSQL]
---

## Context

Built for internal use at my day job. The company needed a way to visualise maintenance data across multiple clients — think machine uptime, service intervals, alert histories.

## The Stack

C++ backend pulling from a PostgreSQL database, QML frontend for the UI. Qt is an interesting choice in 2024 — not trendy, but rock solid and genuinely cross-platform without the usual compromises.

## Challenges

The hardest part was real-time updates. Polling every N seconds felt wrong; we ended up with a hybrid — push notifications for critical alerts, periodic refresh for everything else.

## Result

Deployed across 3 client sites. Zero crashes in production since launch, which in the world of industrial software is the only metric that matters.
