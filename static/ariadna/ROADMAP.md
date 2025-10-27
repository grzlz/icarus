# Ariadna Roadmap

## Vision
Ariadna is a preconfigured Neovim setup designed for web developers. The goal is to reach v1.0.0 stability and then submit to `winget` for official Windows package distribution.

---

## Phase 1: Stabilize (Current)

### Install Script (`install.ps1`)
- [x] Create PowerShell installer for Windows
- [ ] Test on actual Windows machines (multiple configurations)
- [ ] Verify all dependency checks work correctly
- [ ] Verify file downloads work from `https://icarus.mx/ariadna/`
- [ ] Test backup/restore flow for existing configs
- [ ] Handle edge cases (permission errors, network failures)

### Neovim Configuration
- [ ] Verify all plugins install correctly via Lazy
- [ ] Test LSP servers installation (Mason)
- [ ] Verify keybindings work as intended
- [ ] Test on different Neovim versions (0.9+)
- [ ] Performance testing (startup time, response time)
- [ ] Documentation for keybindings and customization

### Core Plugins
- [ ] `ariadna.lua` - Main configuration
- [ ] `colorscheme.lua` - Theme setup
- [ ] `svelte.lua` - Svelte/SvelteKit support
- [ ] `tailwind.lua` - Tailwind CSS support
- [ ] `markdown.lua` - Markdown support
- [ ] `example.lua` - Example plugins reference

### Documentation
- [ ] README.md with feature overview
- [ ] Installation guide for Windows
- [ ] Keybindings reference (`:help ariadna`)
- [ ] Troubleshooting guide
- [ ] Contributing guidelines

---

## Phase 2: v1.0.0 Release

### Pre-Release Checklist
- [ ] All Phase 1 items complete
- [ ] No known bugs in installer
- [ ] No known bugs in neovim config
- [ ] Documentation complete and reviewed
- [ ] Git tag: `v1.0.0`

### Deployment
- [ ] Ensure `https://icarus.mx/ariadna/install.ps1` is stable
- [ ] Ensure all config files are accessible at `https://icarus.mx/ariadna/lua/config/*` etc.
- [ ] Update version in installer script
- [ ] Create GitHub release

---

## Phase 3: Winget Submission

### Manifest Creation
- [ ] Create `ariadna.yaml` (main manifest)
- [ ] Create `ariadna.installer.yaml` (installer config)
- [ ] Create `ariadna.locale.en-US.yaml` (localization)
- [ ] Calculate SHA256 hash of final `install.ps1`
- [ ] Validate manifests with `winget validate`

### Submission
- [ ] Fork https://github.com/microsoft/winget-pkgs
- [ ] Add manifest files in correct directory structure
- [ ] Submit PR to winget-pkgs
- [ ] Respond to Microsoft review feedback
- [ ] Merge and release

---

## Phase 4: Post-Release

### Maintenance
- [ ] Monitor for user issues
- [ ] Keep plugins and LSP servers updated
- [ ] Update winget manifest for new versions
- [ ] Community support and contributions

### Future Enhancements
- [ ] macOS/Linux installer (bash script)
- [ ] Scoop package (easier than winget for developers)
- [ ] Web-based configuration wizard
- [ ] Plugin marketplace / community configs

---

## Current Blockers
- [ ] Test the installer on actual Windows machines
- [ ] Verify all download URLs work correctly
- [ ] Complete neovim configuration stability testing

## Success Criteria for v1.0.0
1. Installer runs without errors on clean Windows systems
2. All files download successfully
3. Neovim starts and all plugins load
4. All keybindings work as documented
5. No critical bugs reported in testing
6. Documentation is complete and clear

---

## Timeline Estimate
- **Phase 1 (Stabilize)**: 1-2 weeks
- **Phase 2 (v1.0.0)**: 1 week
- **Phase 3 (Winget)**: 2-3 weeks (includes review time)

**Total**: ~4-6 weeks to official winget availability
