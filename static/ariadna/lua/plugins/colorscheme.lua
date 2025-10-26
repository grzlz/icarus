return {
  {
    "folke/tokyonight.nvim",
    priority = 1000,
    opts = {
      style = "day",  -- Light theme with blue accents
      transparent = true,
      styles = {
        sidebars = "transparent",
        floats = "transparent",
      },
    },
  },

  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "tokyonight-day",
    },
  },
}
