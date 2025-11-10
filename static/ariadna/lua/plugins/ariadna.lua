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
			-- Register Biblioteca command early to avoid timing issues
			if not vim.fn.exists(":Biblioteca") then
				vim.api.nvim_create_user_command("Biblioteca", function()
					require("telescope.builtin").find_files({
						prompt_title = "📚 Biblioteca de Ariadna",
						cwd = vim.fn.stdpath("config") .. "/biblioteca",
						hidden = false,
						no_ignore = true,
					})
				end, {
					desc = "Open Biblioteca resources",
				})
			end

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
							icon = " ",
							icon_hl = "Title",
							desc = "Buscar Archivo",
							desc_hl = "String",
							key = "f",
							key_hl = "Number",
							key_format = " %s", -- remove default surrounding `[]`
							action = "Telescope find_files",
						},
						{
							icon = " ",
							icon_hl = "Title",
							desc = "Archivos Recientes",
							desc_hl = "String",
							key = "r",
							key_hl = "Number",
							key_format = " %s",
							action = "Telescope oldfiles",
						},
						{
							icon = " ",
							icon_hl = "Title",
							desc = "Buscar Texto",
							desc_hl = "String",
							key = "g",
							key_hl = "Number",
							key_format = " %s",
							action = "Telescope live_grep",
						},
						{
							icon = " ",
							icon_hl = "Title",
							desc = "Biblioteca",
							desc_hl = "String",
							key = "b",
							key_hl = "Number",
							key_format = " %s",
							action = function()
							vim.cmd("Biblioteca")
						end,
						},
						{
							icon = " ",
							icon_hl = "Title",
							desc = "Lazy",
							desc_hl = "String",
							key = "l",
							key_hl = "Number",
							key_format = " %s",
							action = "Lazy",
						},
						{
							icon = " ",
							icon_hl = "Title",
							desc = "Salir",
							desc_hl = "String",
							key = "q",
							key_hl = "Number",
							key_format = " %s",
							action = "qa",
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
