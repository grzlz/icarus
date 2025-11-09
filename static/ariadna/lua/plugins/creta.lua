-- CRETA command - Open Ariadna README
-- Loads immediately to register the :Creta command and <leader>cr keybinding
return {
	{
		"folke/lazy.nvim",
		init = function()
			-- Create :Creta command (runs before plugin loading)
			vim.api.nvim_create_user_command("Creta", function()
				local readme_path = vim.fn.stdpath("config") .. "/README.md"
				vim.cmd("edit " .. readme_path)
			end, {
				desc = "Open Ariadna README",
			})

			-- Create <leader>cr keybinding
			vim.keymap.set("n", "<leader>cr", function()
				local readme_path = vim.fn.stdpath("config") .. "/README.md"
				vim.cmd("edit " .. readme_path)
			end, { desc = "🏛️ CRETA (Ariadna README)" })
		end,
	},
}
