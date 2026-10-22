---
title: qtmancer.nvim
description: "A Neovim plugin for Qt C++ development: project setup, Qt Designer, class generation and debugging."
pubDate: 2026-10-22
status: In Progress
vault: code
tags:
  - neovim
  - lua
  - qt
  - cpp
  - tools
tech:
  - Lua
  - Neovim
  - Qt
  - CMake
features:
  - Create Qt projects, single or multi-module, with CMake or qmake
  - Open Qt Designer and generate C++ classes from .ui files
  - Build, run and debug from the editor with nvim-dap
  - CMake presets and automatic CMakeLists.txt updates
githubUrl: https://github.com/kastico/qtmancer.nvim
draft: true
heroImage: ../../assets/qtmancer/qtmancer.png
---

## About

qtmancer.nvim is a Neovim plugin that brings the Qt workflow into the terminal: creating projects, designing interfaces, generating classes, building and debugging, without leaving the editor.

It is a fork of [qt-assistant.nvim](https://github.com/2774326573/qt-assistant.nvim), adapted to my own setup as a Qt developer who lives in the terminal.

## What it does

- **Projects**: scaffold widget, Quick/QML and console apps, plus multi-module workspaces with libraries and plugins.
- **UI design**: create and edit `.ui` files, open Qt Designer, and generate the matching C++ class with `uic`.
- **Build and run**: CMake and qmake, with generated CMake presets.
- **Debugging**: nvim-dap integration with GDB or LLDB.
- **Cross-platform**: Linux, macOS and Windows.
