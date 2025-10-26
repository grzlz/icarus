return {
  -- Extend Telescope defaults to search ignored files
  {
    "nvim-telescope/telescope.nvim",
    opts = function(_, opts)
      opts.defaults = vim.tbl_deep_extend("force", opts.defaults or {}, {
        vimgrep_arguments = {
          "rg",
          "--color=never",
          "--no-heading",
          "--with-filename",
          "--line-number",
          "--column",
          "--smart-case",
          "--hidden",
          "--no-ignore",
        },
      })

      opts.pickers = vim.tbl_deep_extend("force", opts.pickers or {}, {
        find_files = {
          find_command = { "rg", "--files", "--hidden", "--no-ignore" },
        },
      })
    end,
  },
  -- Show gitignored entries in neo-tree
  {
    "nvim-neo-tree/neo-tree.nvim",
    opts = {
      filesystem = {
        filtered_items = {
          hide_gitignored = false,
        },
      },
    },
  },
}
