---
title: 'Setting Up Neovim in 2025'
description: 'A practical guide to getting a productive Neovim environment without losing a week of your life.'
pubDate: 2025-11-15
heroImage: ../../assets/blog-placeholder-2.jpg
tags: [neovim, tools, linux, productivity]
layout: ../../layouts/post/PostWide.astro
---

I've set up Neovim from scratch three times. The first two times I spent more time configuring than coding. This is what I learned.

## Start with a Distribution

If you're new to Neovim, start with [LazyVim](https://lazyvim.github.io/) or [AstroNvim](https://astronvim.com/). Both give you a solid base with LSP, fuzzy finding, and sensible keymaps out of the box.

Resist the urge to build from scratch until you understand *why* things are done the way they are.

## The Essentials

Once you have a base, there are a few plugins you'll use every day:

**Navigation**
- `telescope.nvim` for fuzzy finding files, grep, git history
- `harpoon` for jumping between your most-used files

**LSP**
- `mason.nvim` for installing language servers
- `nvim-lspconfig` for configuration
- `none-ls` for formatting and linting

**Editor**
- `nvim-treesitter` for syntax highlighting that actually works
- `nvim-cmp` for completion
- `gitsigns.nvim` to see git blame inline

## A Note on Keymaps

The biggest productivity win isn't any specific plugin — it's spending an hour learning the motions you actually use and making them fast.

```lua
-- Example: quick save
vim.keymap.set('n', '<leader>w', ':w<CR>', { silent = true })

-- Jump to last buffer
vim.keymap.set('n', '<leader><leader>', '<C-^>', { silent = true })
```

Learn `ci"`, `da(`, `yip`, `=G`. These four alone will make you faster than any autocomplete plugin.

## The Config Structure

Keep it flat. One `init.lua`, a `lua/plugins/` folder, done.

```
~/.config/nvim/
  init.lua
  lua/
    plugins/
      lsp.lua
      telescope.lua
      treesitter.lua
      ui.lua
```

The moment you start nesting deeper than two levels, you're procrastinating.

---

The goal isn't the perfect config. The goal is to write code. Configure just enough to stop fighting the editor, then get out of your own way.
