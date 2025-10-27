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
		event = "VimEnter",
		priority = 1000,
		config = function()
			local logo = [[

                                   NWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW.
                                   WWk''''''''''''''''''''''''''''''kWX''''''''''''''''''''''''''''''dWW.
                                   WWd                              oWX                              cWW.
                                   WWd    :k0Oc................     oWX.....................;xOkc    cWW.
                                   WWd   'WWWWWWWWWWWWWWWWWWWWWx    oWWWWWWWWWWWWWWWWWWWWWWWWW:0W:   cWW.
                                   WWd    oNWNd..............OWk     .......................oNWWd.   cWW.
                                   WWd     OWO               kWk                             dWX     cWW.
                                   WWd     OWO     ';;;;.    kW0;;;;;;;;;;;;;;;;;;;;;;;,     dWX     cWW.
                                   WWd     OW0    .WWNXXo    oXXXXXXNWWXXXXXXXXXXXXXXXWW:    dWX     cWW.
                                   WWd     OW0    .WWc              dWK              .WW:    dWX     cWW.
                                   WWd     OW0    .WWc              dWK              .WW:    dWX     cWW.
                                   WWd     OW0    .WWc    .lllllllll0WNlllllllll;    .WW:    dWX     cWW.
                                   WWd    cNWNd   .WWc    cWWOkkkkkkkkkkkkkkkkXWX   .kWWK;   dWX     cWW.
                                   WWd   .WX,XW:  .WWc    cWW.                kWX   kWk:WN   dWX     cWW.
                                   WWd    :OKOc   .WWc    cWW.                kWX   .d00x'   dWX     cWW.
                                   WWd            .WWc    cWW.   .XNNNNNNo    kWX            dWX     cWW.
                                   WWKddddddddddddxWWc    cWWxdddxWWo,,XWk    kWNddddddo.    dWNdddddOWW.
                                   WWKxxxxxXWXxxxxxxd.    cWWxdddxWWd;;XWk    kWWddddxWW:    dWNddddd0WW.
                                   WWd     OWO            cWW.   .0KKKKKKl    kWN    .WW:    dWX     cWW.
                                   WWd     OWO    .;:,    cWW.                kWN    .WW:    dWX     cWW.
                                   WWd     kW0   ,WXxWX.  cWW.                kWN   cKWW0.   dWX     cWW.
                                   WWd     kW0   ,WXxWK.  :WWWWWWWWWWWk   .XWWWWK   NWckWd   dWX     cWW.
                                   WWd     kW0    .WWd     .''''''''xWX    .''''    .dWWx.   dWX     cWW.
                                   WWd     kW0    .WWl              oWX              .WW:    dWX     cWW.
                                   WWd     kW0    .WWx,,,,,,,,,.    oWN,,,,,,,,,,,,,,:WW:    dWX     cWW.
                                   WWd     kW0     OKKKKKKKKKKKc    ;KKKKKKKKKKKKKKKKKKK'    dWX     cWW.
                                   WWd     kW0                                               dWX     cWW.
                                   WWd     OWX.                                              xWX.    cWW.
                                   WWd   .XWWWWxoooooooooooooooooooooo,    looooooooooooooooXWkXN'   cWW.
                                   WWd    0WWWNkxxxxxxxxxxxxxxxxxxxxKWK    dxxxxxxxxxxxxxxxxKWxKN,   cWW.
                                   WWd     ';,.                     oWK                      ,:;.    cWW.
                                   WWd                              oWK                              cWW.
                                   WWKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxKWNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0WW.
                                   ldddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddo

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
							"⚡ Ariadna cargado en " .. ms .. "ms",
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
