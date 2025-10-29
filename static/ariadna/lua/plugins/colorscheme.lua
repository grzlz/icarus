return {
  {
    "folke/tokyonight.nvim",
    priority = 1000,
    opts = {
      style = "night",  -- Dark theme
      transparent = false,
      styles = {
        sidebars = "dark",
        floats = "dark",
      },
    },
  },

  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "tokyonight-night",
    },
  },
}
