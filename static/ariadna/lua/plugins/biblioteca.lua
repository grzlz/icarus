-- Biblioteca access for CRETA students
return {
	{
		"nvim-telescope/telescope.nvim",
		keys = {
			{
				"<leader>b",
				function()
					require("telescope.builtin").find_files({
						prompt_title = "📚 Biblioteca de Ariadna",
						cwd = vim.fn.stdpath("config") .. "/biblioteca",
						hidden = false,
						no_ignore = true,
					})
				end,
				desc = "📚 Biblioteca (guías y tutoriales)",
			},
		},
		config = function()
			-- Create :Biblioteca command
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
		end,
	},
}
