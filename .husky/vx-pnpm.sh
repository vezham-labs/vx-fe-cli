#!/usr/bin/env sh

# Git GUI clients do not load the user's shell profile, so they can otherwise
# invoke an older Homebrew Node/pnpm even when a compatible NVM version exists.
vx_nvm_dir="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$vx_nvm_dir/nvm.sh" ]; then
  NVM_DIR="$vx_nvm_dir"
  export NVM_DIR
  . "$NVM_DIR/nvm.sh" --no-use
  nvm use --silent default >/dev/null 2>&1 || :
fi

path_add() {
  if [ -n "$1" ] && [ -d "$1" ]; then
    PATH="$1:$PATH"
  fi
}

vx_active_node_bin=""
if command -v node >/dev/null 2>&1; then
  vx_active_node_bin=$(dirname "$(command -v node)")
fi

path_add_from_windows_env() {
  if command -v cygpath >/dev/null 2>&1 && [ -n "$1" ]; then
    path_add "$(cygpath -u "$1" 2>/dev/null)/npm"
  fi
}

path_add "/c/Users/$USERNAME/scoop/shims"
path_add "/c/Users/$USERNAME/AppData/Local/Volta/bin"
path_add "/c/Users/$USERNAME/AppData/Roaming/npm"
path_add "/c/Program Files (x86)/nodejs"
path_add "/c/Program Files/nodejs"
path_add_from_windows_env "$APPDATA"

path_add "/usr/local/bin"
path_add "/opt/homebrew/bin"
path_add "$HOME/.volta/bin"
path_add "$HOME/Library/pnpm"
path_add "$HOME/.local/share/pnpm"
path_add "$PNPM_HOME"
path_add "$vx_active_node_bin"

export PATH

if ! command -v pnpm >/dev/null 2>&1; then
  if command -v corepack >/dev/null 2>&1; then
    pnpm() {
      corepack pnpm "$@"
    }
  else
    echo "[vx/Husky] @vx/ERROR: pnpm not found. Install pnpm via Corepack/Homebrew/npm, or open your Git client from a shell with pnpm in PATH."
    exit 127
  fi
fi
