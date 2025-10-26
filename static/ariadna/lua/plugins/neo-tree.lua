-- Neo-tree configuration to hide config files
return {
  "nvim-neo-tree/neo-tree.nvim",
  opts = {
    filesystem = {
      filtered_items = {
        visible = false,
        hide_dotfiles = false,
        hide_gitignored = false,
        hide_by_name = {
          "eslint.config.js",
          "jsconfig.json",
          "vite.config.js",
          "svelte.config.js",
          "package-lock.json",
          ".prettierrc",
          ".prettierignore",
          ".npmrc",
          ".gitignore",
        },
        never_show = {
          "eslint.config.js",
          "jsconfig.json",
          "vite.config.js",
          "svelte.config.js",
          "package-lock.json",
          ".prettierrc",
          ".prettierignore",
          ".npmrc",
          ".gitignore",
        },
      },
    },
  },
}
