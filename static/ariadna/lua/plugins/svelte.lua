-- SvelteKit 5 support
return {
  -- Svelte language support
  {
    "nvim-treesitter/nvim-treesitter",
    opts = function(_, opts)
      vim.list_extend(opts.ensure_installed, {
        "svelte",
        "javascript",
        "typescript",
        "html",
        "css",
      })
    end,
  },

  -- Svelte LSP
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        svelte = {
          settings = {
            svelte = {
              plugin = {
                svelte = {
                  compilerWarnings = {
                    ["a11y-aria-attributes"] = "ignore",
                    ["a11y-incorrect-aria-attribute-type"] = "ignore",
                    ["a11y-unknown-aria-attribute"] = "ignore",
                    ["a11y-hidden"] = "ignore",
                    ["a11y-misplaced-role"] = "ignore",
                    ["a11y-unknown-role"] = "ignore",
                    ["a11y-no-abstract-role"] = "ignore",
                    ["a11y-no-redundant-roles"] = "ignore",
                    ["a11y-role-has-required-aria-props"] = "ignore",
                    ["a11y-accesskey"] = "ignore",
                    ["a11y-autofocus"] = "ignore",
                    ["a11y-misplaced-scope"] = "ignore",
                    ["a11y-positive-tabindex"] = "ignore",
                    ["a11y-invalid-attribute"] = "ignore",
                    ["a11y-missing-attribute"] = "ignore",
                    ["a11y-img-redundant-alt"] = "ignore",
                    ["a11y-label-has-associated-control"] = "ignore",
                    ["a11y-media-has-caption"] = "ignore",
                    ["a11y-distracting-elements"] = "ignore",
                    ["a11y-structure"] = "ignore",
                    ["a11y-mouse-events-have-key-events"] = "ignore",
                    ["a11y-missing-content"] = "ignore",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  -- Ensure svelte-language-server is installed
  {
    "williamboman/mason.nvim",
    opts = function(_, opts)
      opts.ensure_installed = opts.ensure_installed or {}
      vim.list_extend(opts.ensure_installed, {
        "svelte-language-server",
      })
    end,
  },
}
