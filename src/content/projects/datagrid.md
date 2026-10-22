---
title: "DataGrid"
description: "A lightweight QML table component with customizable, persistent column layout."
pubDate: 2026-10-22
status: "In Progress"
vault: "code"
tags: [qt, qml, cpp, open-source]
tech: [Qt 6, QML, C++, CMake]
features:
  - "ListView-based, with horizontal and vertical scrolling"
  - "Customizable headers: column position, visibility and width"
  - "Column layout saved and restored with QSettings"
  - "No dependencies beyond Qt"
githubUrl: "https://github.com/kastico/DataGrid"
draft: true
---

## About

DataGrid is a simple QML table component that gives a `QAbstractListModel` the behaviour of a table. It uses a plain `ListView` with a column layout, which keeps the code small and easy to read.

It grew out of business software work, where tables are everywhere and users expect to arrange columns their own way.

## Highlights

- **Customizable headers**: reorder, hide and resize columns.
- **Remembers the layout**: column preferences are stored with `QSettings` and restored on the next launch.
- **Small and readable**: no external dependencies, easy to adapt.

## Status

Early development. The core works and more features are being added. It is fully open source, so feel free to use, modify and contribute on [GitHub](https://github.com/kastico/DataGrid).
