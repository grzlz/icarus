# Ariadna Installation Script for Windows (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File install.ps1

$ErrorActionPreference = "Stop"

# Set UTF-8 encoding for proper character display
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

Write-Host "  Ariadna - Instalador para Windows" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator (not needed, but warn if true)
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    Write-Host "[WARNING]  Advertencia: Estás ejecutando como Administrador" -ForegroundColor Yellow
    Write-Host "   Esto puede causar problemas de permisos." -ForegroundColor Yellow
    Write-Host "   Recomendación: Ejecuta sin privilegios de administrador" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "¿Continuar de todas formas? (s/N)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 1
    }
}

# Function to check if command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check Neovim
if (-not (Test-Command nvim)) {
    Write-Host "[WARNING] Neovim no está instalado" -ForegroundColor Yellow
    Write-Host "   Instalando Neovim automáticamente usando winget..." -ForegroundColor White
    Write-Host ""

    try {
        # Install Neovim using winget
        winget install --id Neovim.Neovim --silent --accept-package-agreements --accept-source-agreements

        # Refresh environment PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

        # Verify installation
        if (Test-Command nvim) {
            $nvimVersion = (nvim --version | Select-Object -First 1) -replace 'NVIM v', ''
            Write-Host "[OK] Neovim $nvimVersion instalado correctamente" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] La instalación de Neovim falló" -ForegroundColor Red
            Write-Host "   Por favor, instala manualmente desde:" -ForegroundColor White
            Write-Host "   https://github.com/neovim/neovim/releases" -ForegroundColor Gray
            exit 1
        }
    } catch {
        Write-Host "[ERROR] Error al instalar Neovim: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "   Opciones de instalación manual:" -ForegroundColor Yellow
        Write-Host "   1. Usando winget: winget install Neovim.Neovim" -ForegroundColor White
        Write-Host "   2. Usando Chocolatey: choco install neovim" -ForegroundColor White
        Write-Host "   3. Descarga manual: https://github.com/neovim/neovim/releases" -ForegroundColor White
        exit 1
    }
} else {
    $nvimVersion = (nvim --version | Select-Object -First 1) -replace 'NVIM v', ''
    Write-Host "[OK] Neovim $nvimVersion encontrado" -ForegroundColor Green
}

# Check Node.js
if (-not (Test-Command node)) {
    Write-Host "[WARNING]  Node.js no está instalado (necesario para LSP servers)" -ForegroundColor Yellow
    Write-Host "   Instala desde: https://nodejs.org" -ForegroundColor White
} else {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js $nodeVersion encontrado" -ForegroundColor Green
}

# Check Git
if (-not (Test-Command git)) {
    Write-Host "[WARNING] Git no está instalado" -ForegroundColor Yellow
    Write-Host "   Instalando Git automáticamente usando winget..." -ForegroundColor White
    Write-Host ""

    try {
        # Install Git using winget
        winget install --id Git.Git --silent --accept-package-agreements --accept-source-agreements

        # Refresh environment PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

        # Verify installation
        if (Test-Command git) {
            $gitVersion = git --version
            Write-Host "[OK] $gitVersion instalado correctamente" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] La instalación de Git falló" -ForegroundColor Red
            Write-Host "   Por favor, instala manualmente desde:" -ForegroundColor White
            Write-Host "   https://git-scm.com/download/win" -ForegroundColor Gray
            exit 1
        }
    } catch {
        Write-Host "[ERROR] Error al instalar Git: $_" -ForegroundColor Red
        Write-Host "   Por favor, instala manualmente desde:" -ForegroundColor White
        Write-Host "   https://git-scm.com/download/win" -ForegroundColor Gray
        exit 1
    }
} else {
    Write-Host "[OK] Git encontrado" -ForegroundColor Green
}

Write-Host ""
Write-Host "[DIR] Preparando instalación..." -ForegroundColor Cyan

# Windows-specific paths
$nvimConfigPath = "$env:LOCALAPPDATA\nvim"
$nvimDataPath = "$env:LOCALAPPDATA\nvim-data"
$nvimCachePath = "$env:LOCALAPPDATA\nvim"

# Backup existing config
if (Test-Path $nvimConfigPath) {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = "$nvimConfigPath.backup.$timestamp"
    Write-Host "[WARNING]  Configuración existente encontrada" -ForegroundColor Yellow
    Write-Host "   Creando respaldo en: $backupPath" -ForegroundColor White
    Move-Item -Path $nvimConfigPath -Destination $backupPath -Force
    Write-Host "[OK] Respaldo creado" -ForegroundColor Green
}

# Backup existing data
if (Test-Path $nvimDataPath) {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDataPath = "$nvimDataPath.backup.$timestamp"
    Write-Host "   Respaldando datos en: $backupDataPath" -ForegroundColor White
    Move-Item -Path $nvimDataPath -Destination $backupDataPath -Force
    Write-Host "[OK] Datos respaldados" -ForegroundColor Green
}

Write-Host ""
Write-Host "  Siguiendo el hilo de Ariadna..." -ForegroundColor Cyan
Write-Host ""

# Base URL for downloads
$baseUrl = "https://icarus.mx/ariadna"

# Create directory structure
Write-Host "[DIR] Creando estructura de directorios..." -ForegroundColor Cyan

$directories = @(
    "$nvimConfigPath",
    "$nvimConfigPath\lua\config",
    "$nvimConfigPath\lua\plugins",
    "$nvimConfigPath\lua\assets"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Host "[OK] Directorios creados" -ForegroundColor Green

# Files to download
$files = @(
    "init.lua",
    "lua/config/autocmds.lua",
    "lua/config/keymaps.lua",
    "lua/config/lazy.lua",
    "lua/config/options.lua",
    "lua/plugins/ariadna.lua",
    "lua/plugins/colorscheme.lua",
    "lua/plugins/example.lua",
    "lua/plugins/markdown.lua",
    "lua/plugins/svelte.lua",
    "lua/plugins/tailwind.lua",
    "lua/assets/arianda-logo.txt"
)

# Fun loading messages
$messages = @(
    "Desenredando el laberinto...",
    "Esquivando al Minotauro...",
    "Siguiendo el hilo dorado...",
    "Encontrando la salida...",
    "Trazando el camino...",
    "Navegando los pasillos...",
    "Descubriendo secretos...",
    "Iluminando el camino..."
)

$totalFiles = $files.Count
$current = 0

# Download each file with progress
foreach ($file in $files) {
    $current++

    # Pick a random message
    $message = $messages | Get-Random

    # Progress calculation
    $percent = [math]::Floor(($current / $totalFiles) * 100)
    $filled = [math]::Floor($percent / 10)
    $empty = 10 - $filled
    $bar = "█" * $filled + "░" * $empty

    # Display progress
    Write-Host "`r$message [$bar] $percent% - $(Split-Path $file -Leaf)" -NoNewline

    # Download URL (convert forward slashes for URL)
    $fileUrl = "$baseUrl/$($file -replace '\\', '/')"

    # Destination path (Windows paths)
    $destPath = Join-Path $nvimConfigPath $file

    # Ensure parent directory exists
    $parentDir = Split-Path $destPath -Parent
    if (-not (Test-Path $parentDir)) {
        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
    }

    # Download file
    try {
        Invoke-WebRequest -Uri $fileUrl -OutFile $destPath -UseBasicParsing -ErrorAction Stop
    } catch {
        Write-Host ""
        Write-Host "[ERROR] Error descargando $file" -ForegroundColor Red
        Write-Host "   URL: $fileUrl" -ForegroundColor Gray
        Write-Host "   Error: $_" -ForegroundColor Gray
        exit 1
    }

    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host ""
Write-Host "[OK] Hilo seguido - ¡Has escapado del laberinto!" -ForegroundColor Green

Write-Host ""
Write-Host "[INSTALL] Instalando plugins y LSP servers..." -ForegroundColor Cyan
Write-Host "   (Esto puede tomar 2-3 minutos)" -ForegroundColor White
Write-Host ""

# Create temporary files for output redirection
$tempOut = [System.IO.Path]::GetTempFileName()
$tempErr = [System.IO.Path]::GetTempFileName()

# Start nvim process with output redirection
$process = Start-Process -FilePath "nvim" `
    -ArgumentList "--headless", "+Lazy! sync", "+qa" `
    -NoNewWindow `
    -RedirectStandardOutput $tempOut `
    -RedirectStandardError $tempErr `
    -PassThru

# Show animated progress while installing
$spinChars = @('⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏')
$spinIndex = 0
Write-Host "   " -NoNewline

while (-not $process.HasExited) {
    Write-Host "`r   $($spinChars[$spinIndex % $spinChars.Count]) Instalando plugins..." -NoNewline -ForegroundColor Yellow
    Start-Sleep -Milliseconds 100
    $spinIndex++
}

Write-Host "`r   " -NoNewline

# Wait for process to fully complete
$process.WaitForExit()

# Clean up temp files
Remove-Item $tempOut -ErrorAction SilentlyContinue
Remove-Item $tempErr -ErrorAction SilentlyContinue

# Verify installation
$lazyPath = "$env:LOCALAPPDATA\nvim-data\lazy"
if (Test-Path $lazyPath) {
    $pluginCount = (Get-ChildItem $lazyPath -Directory).Count
    Write-Host "[OK] $pluginCount plugins instalados correctamente" -ForegroundColor Green
} else {
    Write-Host "[WARNING] No se pudo verificar la instalación de plugins" -ForegroundColor Yellow
}

Write-Host ""

Write-Host ""
Write-Host "[SUCCESS] ¡Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Abre Neovim: nvim" -ForegroundColor White
Write-Host "   2. Espera a que Mason instale LSP servers (~1 min)" -ForegroundColor White
Write-Host "   3. Reinicia Neovim" -ForegroundColor White
Write-Host "   4. Lee la ayuda: :help ariadna" -ForegroundColor White
Write-Host ""
Write-Host "[KEYS]  Keybindings esenciales:" -ForegroundColor Cyan
Write-Host "   Space Space  - Buscar archivos" -ForegroundColor White
Write-Host "   Space e      - Explorador de archivos" -ForegroundColor White
Write-Host "   Space h      - Ayuda" -ForegroundColor White
Write-Host ""
Write-Host "[PATH] Configuración instalada en:" -ForegroundColor Cyan
Write-Host "   $nvimConfigPath" -ForegroundColor Gray
Write-Host ""
Write-Host "  Hecho con ❤ por icarus.mx" -ForegroundColor Cyan
Write-Host ""
