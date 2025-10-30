-- Ariadna/Icarus specific customizations
return {
	-- Disable LazyVim's default dashboards
	{ "goolord/alpha-nvim", enabled = false },
	{ "echasnovski/mini.starter", enabled = false },

	-- Disable snacks.nvim dashboard (LazyVim's current default)
	{
		"folke/snacks.nvim",
		opts = {
			dashboard = { enabled = false },
		},
	},

	-- Dashboard with Ariadna branding
	{
		"nvimdev/dashboard-nvim",
		lazy = false,
		priority = 1000,
		config = function()
			-- Enhanced Ariadna dashboard with ASCII art
			local logo = [[


        ╭───────●━━━━━━━━━━━━━━━━━━━━●───────╮

         ▄▀█ █▀█ █ ▄▀█ █▀▄ █▄ █ ▄▀█
         █▀█ █▀▄ █ █▀█ █▄▀ █ ▀█ █▀█

        ╰───────●━━━━━━━━━━━━━━━━━━━━●───────╯

]]

			local opts = {
				theme = "doom",
				hide = {
					statusline = false,
				},
				config = {
					header = vim.split(logo, "\n"),
					center = {
						{
							icon = "",
							desc = "",
							key = "",
							action = "",
						},
					},
					footer = function()
						return {}
					end,
				},
			}

			require("dashboard").setup(opts)
		end,
	},

	-- Auto-install essential LSP servers for Icarus stack
	{
		"williamboman/mason.nvim",
		opts = function(_, opts)
			opts.ensure_installed = opts.ensure_installed or {}
			vim.list_extend(opts.ensure_installed, {
				"vtsls", -- TypeScript/JavaScript
				"svelte-language-server", -- SvelteKit
				"tailwindcss-language-server", -- Tailwind CSS
				"prettier", -- Formatter
				"eslint-lsp", -- Linter
				"stylua", -- Lua formatter (for config)
			})
		end,
	},
}
