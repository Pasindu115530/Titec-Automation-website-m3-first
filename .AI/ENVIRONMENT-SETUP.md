# Environment & Runtime Version Guide for AI Agents & Developers

> **MANDATORY DIRECTIVE FOR ALL AI AGENTS**:  
> Before running any development servers (`composer run dev`, `npm run dev`), building bundles (`npm run build`), or executing tests, you **MUST** verify and ensure the host device environment matches the runtime versions below. If the host device has an incompatible or outdated version (e.g. Node 18), you **MUST fix the environment** following the steps in this document before proceeding with the user's task.

---

## 📌 Runtime Version Requirements

| Runtime / Tool | Minimum Version | Recommended / Target | Notes & Constraints |
|---|---|---|---|
| **Node.js** | **`v20.19.0+`** or **`v22.12.0+`** | **`v20.20.2+` (LTS Iron)** | ⚠️ **DO NOT USE Node 18 (`v18.19.1`)**. Vite 7 (`backend-laravel`) and Next.js 16 (`frontend-next`, `frontend-erp`) strictly require modern Node APIs (specifically `crypto.hash`). Node 18 will crash with: `TypeError: crypto.hash is not a function`. |
| **NPM** | **`v10.0.0+`** | **`v10.8.2+`** | Bundled with Node 20 LTS. |
| **PHP** | **`8.2+`** | **`8.3+`** | Required by Laravel 12 (`backend-laravel/composer.json`). |
| **Composer** | **`2.2+`** | **`2.7+`** | Required for PHP dependency management and script execution. |
| **MySQL** | **`8.0+`** | **`8.0+` / MariaDB 10.4+** | Main database for Laravel backend. |

---

## 🚨 Root Cause of the Common "crypto.hash" Device Failure

On many Linux distributions (such as default Ubuntu 24.04), the system APT package installs **Node 18.19.1** to `/usr/bin/node`.

When Vite 7 (`^7.0.7`) is launched in `backend-laravel`:
```bash
composer run dev
# invokes: npx concurrently "php artisan serve" "npm run dev"
```
If the active Node executable is Node 18, Vite throws:
```text
[vite] You are using Node.js 18.19.1. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.
[vite] error when starting dev server:
[vite] TypeError: crypto.hash is not a function
```

### Why standard `nvm use` alone can fail in subshells
1. `composer run dev` runs child processes through PHP's `proc_open()` or system shell (`/bin/sh`).
2. Non-interactive subshells do **not** run interactive `.bashrc` scripts (standard `.bashrc` starts with `case $- in *i*) ;; *) return;; esac`).
3. As a result, subshells fall back to `/usr/bin/node` (Node 18) unless the Node binary is in a standard user PATH directory like `~/.local/bin/`.

---

## 🛠️ Automated Fix for AI Agents (One Command)

Any AI agent encountering a new device or shell can immediately execute the included fix script:

```bash
bash .AI/scripts/ensure-env.sh
```

This script:
1. Detects the currently active `node` version.
2. If `< 20.19.0`, loads NVM, installs or activates Node 20 (`v20.20.2`), and sets `nvm alias default 20`.
3. Symlinks `node`, `npm`, and `npx` into `~/.local/bin/` so all non-interactive shells, IDE terminals, and `composer` subprocesses inherit Node 20.
4. Resets the shell binary cache with `hash -r`.
5. Prints a full verification report.

---

## 🔧 Manual Step-by-Step Fix Protocol

If running manually or adapting for another shell/OS:

### 1. Verify Current Active Version
```bash
node -v
which node
```

### 2. If Node is < 20.19.0, Activate / Install Node 20 via NVM
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and switch to Node 20
nvm install 20
nvm use 20
nvm alias default 20
```

### 3. Guarantee Non-Interactive Subshells Use Node 20
Symlink the Node 20 binaries into `~/.local/bin/` (which is in user `PATH` from `~/.profile`):
```bash
mkdir -p "$HOME/.local/bin"
NODE_DIR="$(dirname $(nvm which 20))"
ln -sf "$NODE_DIR/node" "$HOME/.local/bin/node"
ln -sf "$NODE_DIR/npm" "$HOME/.local/bin/npm"
ln -sf "$NODE_DIR/npx" "$HOME/.local/bin/npx"

# Reset command lookup cache
hash -r
```

### 4. Ensure `.nvmrc` exists
The project root contains [.nvmrc](file:///media/twisted/Local%20Disk/Projects/Clients/Titec-Automation-website-m3-first/.nvmrc) with:
```text
20
```
This enables version managers (nvm, fnm, asdf) to automatically select Node 20 when entering the project directory.

---

## 🔍 Verification Commands

Before concluding any environment fix or running services, execute these validation commands:

```bash
# 1. Verify Node and NPM
node -v    # Must be >= v20.19.0
npm -v     # Must be >= 10.0.0

# 2. Verify PHP and Composer
php -v          # Must be >= 8.2
composer -V     # Must be >= 2.2

# 3. Test Laravel & Vite dev server
cd backend-laravel
composer run dev
# Vite v7 and Laravel 12 must start without 'crypto.hash' error.
```

---

## 📋 Checklist for AI Agents Working on This Repository

- [ ] Check `node -v` before starting any development or build command.
- [ ] If Node is `< 20.19.0`, run `bash .AI/scripts/ensure-env.sh`.
- [ ] Run `hash -r` in the current shell if bash had cached `/usr/bin/node`.
- [ ] Ensure project `.nvmrc` is preserved.
- [ ] Ensure `frontend-next`, `frontend-erp`, and `backend-laravel` dependencies build cleanly with Node 20.
