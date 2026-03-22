---
title: "The Bunker"
description: "This website — a personal digital shelter built with Astro. Vaults, blog, minimal aesthetic."
pubDate: 2025-10-01
updatedDate: 2025-12-01
heroImage: ../../assets/blog-placeholder-4.jpg
status: "In Progress"
vault: "web-development"
tags: [portfolio, astro, personal]
features:
  - "Vault system for finished projects"
  - "Blog with multiple post layouts"
  - "Minimal dark design system"
tech: [Astro, TypeScript, CSS]
githubUrl: "https://github.com/kastico/kastico.github.io"
websiteUrl: "https://kastico.github.io"
---

## About

This site is the third iteration of my personal corner of the web.

Previous versions were either over-engineered or never shipped. This one started with a constraint: ship something real, keep it clean, and make it easy to maintain.

## Stack

Built with Astro for static generation. No frameworks, no dependencies beyond what Astro brings. Everything is plain HTML, CSS, and a bit of TypeScript. The design system lives entirely in `global.css` — no Tailwind, no CSS-in-JS.

## Design Decisions

The vault system came from how I actually organise my work. I have areas of interest (web dev, graphic design, music) and within each area, specific projects. Having a two-level hierarchy maps cleanly to Astro's content collections.

The blog has three post layouts to match three different types of writing: long-form essays, technical tutorials, and short notes.

## What I Learned

The biggest thing: shipping a slightly rough version early is infinitely more valuable than a perfect version that never exists.
