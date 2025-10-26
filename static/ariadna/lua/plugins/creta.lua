-- Creta/Icarus specific customizations
return {
  -- Dashboard with Creta branding
  {
    "nvimdev/dashboard-nvim",
    event = "VimEnter",
    opts = function()
      local logo = [[
███████████████████████████
█   █   █   █   █   █   █
█ C █ R █ E █ T █ A █ █ █
█   █   █   █   █   █   █
███████████████████████████

 Bienvenido a Creta Vim 🏛️
 Salgamos de este laberinto
      ]]

      logo = string.rep("\n", 8) .. logo .. "\n\n"

      local opts = {
        theme = "doom",
        hide = {
          statusline = false,
        },
        config = {
          header = vim.split(logo, "\n"),
          center = {
            {
              action = "Telescope find_files",
              desc = " Buscar archivos",
              icon = " ",
              key = "f",
            },
            {
              action = "ene | startinsert",
              desc = " Nuevo archivo",
              icon = " ",
              key = "n",
            },
            {
              action = "Telescope oldfiles",
              desc = " Archivos recientes",
              icon = " ",
              key = "r",
            },
            {
              action = "Telescope live_grep",
              desc = " Buscar texto",
              icon = " ",
              key = "g",
            },
            {
              action = 'lua require("persistence").load()',
              desc = " Restaurar sesión",
              icon = " ",
              key = "s",
            },
            {
              action = "Lazy",
              desc = " Lazy (plugins)",
              icon = "󰒲 ",
              key = "l",
            },
            {
              action = "qa",
              desc = " Salir",
              icon = " ",
              key = "q",
            },
          },
          footer = function()
            local stats = require("lazy").stats()
            local ms = (math.floor(stats.startuptime * 100 + 0.5) / 100)
            return {
              "⚡ Creta Vim cargado en " .. ms .. "ms",
              "📦 " .. stats.loaded .. "/" .. stats.count .. " plugins",
              "",
              "🏛️ icarus.mx",
            }
          end,
        },
      }

      for _, button in ipairs(opts.config.center) do
        button.desc = button.desc .. string.rep(" ", 43 - #button.desc)
        button.key_format = "  %s"
      end

      return opts
    end,
  },

  -- Auto-install essential LSP servers for Icarus stack
  {
    "williamboman/mason.nvim",
    opts = function(_, opts)
      opts.ensure_installed = opts.ensure_installed or {}
      vim.list_extend(opts.ensure_installed, {
        "vtsls",                      -- TypeScript/JavaScript
        "svelte-language-server",      -- SvelteKit
        "tailwindcss-language-server", -- Tailwind CSS
        "prettier",                    -- Formatter
        "eslint-lsp",                  -- Linter
        "stylua",                      -- Lua formatter (for config)
      })
    end,
  },
}
