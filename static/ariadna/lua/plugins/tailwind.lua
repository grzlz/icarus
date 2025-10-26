-- Tailwind CSS 4 support
return {
  -- Tailwind LSP for autocompletion
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        tailwindcss = {
          -- Attach to these filetypes
          filetypes = {
            "html",
            "css",
            "scss",
            "javascript",
            "javascriptreact",
            "typescript",
            "typescriptreact",
            "svelte",
            "vue",
          },
          settings = {
            tailwindCSS = {
              experimental = {
                classRegex = {
                  -- Support for Svelte class:directive
                  { "class:([a-z-]+)", "([a-z-]+)" },
                  -- Standard class attribute
                  'class\\s*=\\s*["\']([^"\']*)["\']',
                },
              },
            },
          },
        },
      },
    },
  },

  -- Color highlighting for Tailwind classes
  {
    "NvChad/nvim-colorizer.lua",
    opts = {
      user_default_options = {
        tailwind = true,
        mode = "virtualtext",
      },
      filetypes = {
        "*",
        svelte = { tailwind = true },
        html = { tailwind = true },
      },
    },
  },

  -- Ensure tailwindcss-language-server is installed
  {
    "williamboman/mason.nvim",
    opts = function(_, opts)
      opts.ensure_installed = opts.ensure_installed or {}
      vim.list_extend(opts.ensure_installed, {
        "tailwindcss-language-server",
      })
    end,
  },
}
