-- Svelte support with proper syntax highlighting
return {
  -- Add Svelte treesitter parser
  {
    "nvim-treesitter/nvim-treesitter",
    opts = function(_, opts)
      -- Add Svelte and related parsers
      vim.list_extend(opts.ensure_installed, {
        "svelte",
        "html",
        "css",
        "javascript",
        "typescript",
      })
    end,
  },

  -- Svelte LSP support
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        svelte = {
          settings = {
            svelte = {
              -- Enable experimental features for Svelte 5
              plugin = {
                svelte = {
                  compilerWarnings = {
                    ["a11y-autofocus"] = "ignore",
                    ["a11y-click-events-have-key-events"] = "ignore",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
