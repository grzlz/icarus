return {
  -- Inline markdown rendering (auto-renders when opening .md files)
  {
    "MeanderingProgrammer/render-markdown.nvim",
    opts = {
      -- Render markdown in normal mode
      render_modes = { "n", "c" },
      -- Style headings with different sizes
      heading = {
        enabled = true,
        sign = true,
        icons = { "󰲡 ", "󰲣 ", "󰲥 ", "󰲧 ", "󰲩 ", "󰲫 " },
      },
      -- Style code blocks
      code = {
        enabled = true,
        sign = true,
        style = "full",
        left_pad = 2,
        right_pad = 2,
      },
      -- Style bullets and checkboxes
      bullet = {
        enabled = true,
        icons = { "●", "○", "◆", "◇" },
      },
    },
    dependencies = { "nvim-treesitter/nvim-treesitter" },
    ft = { "markdown" },
  },

  -- Glow preview with Shift+L
  {
    "ellisonleao/glow.nvim",
    config = function()
      require("glow").setup({
        border = "rounded",
        style = "dark",
        pager = false,
        width = 120,
      })

      -- Add Shift+L keybinding for markdown files
      vim.api.nvim_create_autocmd("FileType", {
        pattern = "markdown",
        callback = function()
          vim.keymap.set("n", "<S-l>", "<cmd>Glow<cr>", {
            buffer = true,
            desc = "Preview Markdown with Glow"
          })
        end,
      })
    end,
    cmd = "Glow",
    ft = { "markdown" },
  },
}
