-- Biblioteca access for CRETA students
-- Loads immediately to register the :Biblioteca command and <leader>b keybinding
return {
	{
		"folke/lazy.nvim",
		init = function()
			-- Create :Biblioteca command (runs before plugin loading)
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

			-- Create <leader>b keybinding
			vim.keymap.set("n", "<leader>b", function()
				require("telescope.builtin").find_files({
					prompt_title = "📚 Biblioteca de Ariadna",
					cwd = vim.fn.stdpath("config") .. "/biblioteca",
					hidden = false,
					no_ignore = true,
				})
			end, { desc = "📚 Biblioteca (guías y tutoriales)" })
		end,
	},
}
