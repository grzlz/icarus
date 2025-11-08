-- CRETA command - Open Ariadna README
return {
	{
		"nvim-telescope/telescope.nvim",
		keys = {
			{
				"<leader>cr",
				function()
					local readme_path = vim.fn.stdpath("config") .. "/README.md"
					vim.cmd("edit " .. readme_path)
				end,
				desc = "🏛️ CRETA (Ariadna README)",
			},
		},
		config = function()
			-- Create :Creta command
			vim.api.nvim_create_user_command("Creta", function()
				local readme_path = vim.fn.stdpath("config") .. "/README.md"
				vim.cmd("edit " .. readme_path)
			end, {
				desc = "Open Ariadna README",
			})
		end,
	},
}
