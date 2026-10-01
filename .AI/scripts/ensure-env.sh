#!/usr/bin/env bash
# ==============================================================================
# TiTEC Automation - Environment & Runtime Version Check & Fix Script
# Used by AI agents and developers to ensure host device meets runtime requirements.
# ==============================================================================

set -e

REQUIRED_NODE_MAJOR=20
REQUIRED_NODE_MINOR=19

echo "🔍 [1/4] Checking current Node.js version..."

CURRENT_NODE_VER=""
if command -v node >/dev/null 2>&1; then
    CURRENT_NODE_VER=$(node -v | sed 's/v//')
fi

NEEDS_FIX=0

if [ -z "$CURRENT_NODE_VER" ]; then
    echo "⚠️  Node.js is not found in PATH."
    NEEDS_FIX=1
else
    NODE_MAJOR=$(echo "$CURRENT_NODE_VER" | cut -d. -f1)
    NODE_MINOR=$(echo "$CURRENT_NODE_VER" | cut -d. -f2)

    echo "   Current Node version: v$CURRENT_NODE_VER (located at: $(which node))"

    if [ "$NODE_MAJOR" -lt 20 ]; then
        echo "❌ Node version is below required (v20.19+ or v22.12+ required by Vite 7 / Next 16)."
        NEEDS_FIX=1
    elif [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 19 ]; then
        echo "❌ Node version is v$CURRENT_NODE_VER, but Vite 7 requires >= v20.19.0."
        NEEDS_FIX=1
    else
        echo "✅ Node.js version is compatible (v$CURRENT_NODE_VER >= v20.19.0)."
    fi
fi

if [ "$NEEDS_FIX" -eq 1 ]; then
    echo ""
    echo "🛠️  [2/4] Applying fix using NVM..."

    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        # shellcheck source=/dev/null
        . "$NVM_DIR/nvm.sh"
    elif [ -d "$HOME/.nvm" ]; then
        echo "   NVM directory found, sourcing..."
        # shellcheck source=/dev/null
        [ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
    else
        echo "❌ NVM is not installed. Installing NVM or upgrading system Node to >= 20.19.0 is required."
        echo "   Run: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash"
        exit 1
    fi

    # Check if node 20 is already installed in nvm
    if ! nvm ls 20 >/dev/null 2>&1; then
        echo "   Installing Node 20 via nvm..."
        nvm install 20
    fi

    echo "   Selecting Node 20 as active & default..."
    nvm use 20
    nvm alias default 20

    TARGET_NODE_BIN=$(nvm which 20)
    TARGET_DIR=$(dirname "$TARGET_NODE_BIN")

    echo "   Target Node binary: $TARGET_NODE_BIN"

    echo ""
    echo "🔗 [3/4] Ensuring subshells and non-interactive processes use Node 20..."
    mkdir -p "$HOME/.local/bin"
    ln -sf "$TARGET_DIR/node" "$HOME/.local/bin/node"
    ln -sf "$TARGET_DIR/npm" "$HOME/.local/bin/npm"
    ln -sf "$TARGET_DIR/npx" "$HOME/.local/bin/npx"

    hash -r 2>/dev/null || true
fi

echo ""
echo "✨ [4/4] Verification:"
echo "   Node:     $(node -v 2>/dev/null || echo 'not found') ($(which node 2>/dev/null || echo 'none'))"
echo "   NPM:      $(npm -v 2>/dev/null || echo 'not found')"
if command -v php >/dev/null 2>&1; then
    echo "   PHP:      $(php -v | head -n 1)"
else
    echo "   PHP:      not found"
fi
if command -v composer >/dev/null 2>&1; then
    echo "   Composer: $(composer --version | head -n 1)"
else
    echo "   Composer: not found"
fi

echo ""
echo "🎉 Environment check completed!"
