#!/bin/bash
# Ariadna Installation Script
# Instala Ariadna configuration de forma segura

set -e

echo "🏛️  Ariadna - Instalador"
echo "=========================="
echo ""

# Check if running as root/sudo (common cause of permission issues)
if [ "$EUID" -eq 0 ] || [ "$USER" = "root" ]; then
    echo "⚠️  Advertencia: No ejecutes este script con sudo"
    echo "   Este script debe ejecutarse como tu usuario normal"
    echo "   Uso correcto: bash install.sh (sin sudo)"
    echo ""
    read -p "   ¿Continuar de todas formas? (no recomendado) [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to install Neovim
install_neovim() {
    echo -e "${YELLOW}⚠️  Neovim no está instalado${NC}"
    echo "   Instalando Neovim automáticamente..."
    echo ""

    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "   Usando Homebrew..."
            brew install neovim
        else
            echo -e "${RED}❌ Homebrew no está instalado${NC}"
            echo "   Instala Homebrew primero: https://brew.sh"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux - detect package manager
        if command -v apt-get &> /dev/null; then
            echo "   Usando apt (Debian/Ubuntu)..."
            sudo apt-get update
            sudo apt-get install -y neovim
        elif command -v dnf &> /dev/null; then
            echo "   Usando dnf (Fedora)..."
            sudo dnf install -y neovim
        elif command -v pacman &> /dev/null; then
            echo "   Usando pacman (Arch)..."
            sudo pacman -S --noconfirm neovim
        elif command -v zypper &> /dev/null; then
            echo "   Usando zypper (openSUSE)..."
            sudo zypper install -y neovim
        else
            echo -e "${RED}❌ No se pudo detectar un gestor de paquetes compatible${NC}"
            echo "   Por favor instala Neovim manualmente: https://github.com/neovim/neovim/releases"
            exit 1
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows (Git Bash/Cygwin)
        if command -v winget &> /dev/null; then
            echo "   Usando winget..."
            winget install Neovim.Neovim
        elif command -v choco &> /dev/null; then
            echo "   Usando Chocolatey..."
            choco install neovim -y
        else
            echo -e "${RED}❌ No se encontró winget o Chocolatey${NC}"
            echo "   Por favor instala Neovim manualmente: https://github.com/neovim/neovim/releases"
            exit 1
        fi
    else
        echo -e "${RED}❌ Sistema operativo no soportado: $OSTYPE${NC}"
        echo "   Por favor instala Neovim manualmente: https://github.com/neovim/neovim/releases"
        exit 1
    fi

    echo -e "${GREEN}✓${NC} Neovim instalado correctamente"
}

# Check Neovim version
if ! command -v nvim &> /dev/null; then
    install_neovim
fi

NVIM_VERSION=$(nvim --version | head -n1 | sed 's/NVIM v//')
echo -e "${GREEN}✓${NC} Neovim $NVIM_VERSION encontrado"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js no está instalado (necesario para LSP servers)${NC}"
    echo "   Instala Node.js: https://nodejs.org"
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION encontrado"
fi

# Check Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Git encontrado"

echo ""
echo "📂 Preparando instalación..."

# Backup existing config
if [ -d "$HOME/.config/nvim" ]; then
    BACKUP_DIR="$HOME/.config/nvim.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}⚠️  Configuración existente de Neovim encontrada${NC}"
    echo "   Creando respaldo en: $BACKUP_DIR"
    mv "$HOME/.config/nvim" "$BACKUP_DIR"
    echo -e "${GREEN}✓${NC} Respaldo creado"
fi

# Backup existing data
if [ -d "$HOME/.local/share/nvim" ]; then
    BACKUP_DATA="$HOME/.local/share/nvim.backup.$(date +%Y%m%d_%H%M%S)"
    echo "   Respaldando datos de Neovim en: $BACKUP_DATA"
    mv "$HOME/.local/share/nvim" "$BACKUP_DATA"
    echo -e "${GREEN}✓${NC} Datos respaldados"
fi

echo ""
echo "🏛️  Siguiendo el hilo de Ariadna..."
echo ""

# Base URL for downloads
BASE_URL="https://icarus.mx/ariadna"

# Create directory structure with better error handling
echo "📂 Creando estructura de directorios..."

# Ensure .config exists first
if [ ! -d "$HOME/.config" ]; then
    echo "   Creando directorio .config..."
    mkdir -p "$HOME/.config" || {
        echo -e "${RED}❌ Error: No se pudo crear $HOME/.config${NC}"
        echo "   Verifica los permisos de tu directorio home"
        exit 1
    }
fi

# Create nvim directories
mkdir -p "$HOME/.config/nvim/lua/config" || {
    echo -e "${RED}❌ Error: No se pudo crear $HOME/.config/nvim/lua/config${NC}"
    echo "   Directorio actual: $(pwd)"
    echo "   HOME: $HOME"
    echo "   Permisos de .config: $(ls -ld $HOME/.config 2>&1)"
    exit 1
}

mkdir -p "$HOME/.config/nvim/lua/plugins" || {
    echo -e "${RED}❌ Error: No se pudo crear $HOME/.config/nvim/lua/plugins${NC}"
    exit 1
}

echo -e "${GREEN}✓${NC} Directorios creados correctamente"

# Files to download
FILES=(
    "init.lua"
    "lua/config/autocmds.lua"
    "lua/config/keymaps.lua"
    "lua/config/lazy.lua"
    "lua/config/options.lua"
    "lua/plugins/ariadna.lua"
    "lua/plugins/colorscheme.lua"
    "lua/plugins/example.lua"
    "lua/plugins/markdown.lua"
    "lua/plugins/svelte.lua"
    "lua/plugins/tailwind.lua"
)

# Fun loading messages
MESSAGES=(
    "Desenredando el laberinto..."
    "Esquivando al Minotauro..."
    "Siguiendo el hilo dorado..."
    "Encontrando la salida..."
    "Trazando el camino..."
    "Navegando los pasillos..."
    "Descubriendo secretos..."
    "Iluminando el camino..."
)

TOTAL_FILES=${#FILES[@]}
CURRENT=0

# Download each file with progress
for file in "${FILES[@]}"; do
    CURRENT=$((CURRENT + 1))

    # Pick a random message
    MSG_INDEX=$((RANDOM % ${#MESSAGES[@]}))
    MESSAGE="${MESSAGES[$MSG_INDEX]}"

    # Progress bar
    PERCENT=$((CURRENT * 100 / TOTAL_FILES))
    FILLED=$((PERCENT / 10))
    EMPTY=$((10 - FILLED))
    BAR=$(printf '█%.0s' $(seq 1 $FILLED))
    SPACE=$(printf '░%.0s' $(seq 1 $EMPTY))

    # Display progress
    printf "\r\033[K${MESSAGE} [${BAR}${SPACE}] %d%% - %s" "$PERCENT" "$(basename $file)"

    # Download file
    curl -fsSL "${BASE_URL}/${file}" -o "$HOME/.config/nvim/${file}" 2>/dev/null || {
        echo ""
        echo -e "${RED}❌ Error descargando ${file}${NC}"
        exit 1
    }

    # Small delay for visual effect
    sleep 0.1
done

echo ""
echo ""
echo -e "${GREEN}✓${NC} Hilo seguido - ¡Has escapado del laberinto!"

echo ""
echo "🎨 Instalando plugins y LSP servers..."
echo "   (Esto puede tomar 2-3 minutos)"
echo ""

# Open nvim and install plugins
nvim --headless "+Lazy! sync" "+qa" 2>&1 | grep -v "^$" || true

echo ""
echo -e "${GREEN}✓${NC} Plugins instalados"

echo ""
echo "🎉 ¡Instalación completada!"
echo ""
echo "📚 Próximos pasos:"
echo "   1. Abre Neovim: nvim"
echo "   2. Espera a que Mason instale LSP servers (~1 min)"
echo "   3. Reinicia Neovim"
echo "   4. Lee la ayuda: :help ariadna"
echo ""
echo "⌨️  Keybindings esenciales:"
echo "   Space Space  - Buscar archivos"
echo "   Space e      - Explorador de archivos"
echo "   Space h      - Ayuda"
echo ""
echo "🏛️  Hecho con <3 por icarus.mx"
echo ""
