#!/bin/sh
# Links gitignored env files from the main checkout into a git worktree.
#
#   sh scripts/worktree-setup.sh [env-file ...]     (default: .env)
#
# Paths are relative to the repository root. Run it after creating a worktree.
# It links and never copies: a copied env file silently stops tracking the
# original. It does nothing in the main checkout, leaves anything already at
# the destination alone, and changes nothing when run a second time.
set -eu

say() { printf 'worktree-setup: %s\n' "$1"; }
warn() { printf 'worktree-setup: warning: %s\n' "$1" >&2; }

top=$(git rev-parse --show-toplevel 2>/dev/null) || {
  warn "not inside a git repository; nothing done"
  exit 1
}
top=$(cd "$top" && pwd -P)
common=$(cd "$top" && cd "$(git rev-parse --git-common-dir)" && pwd -P)
main=$(dirname "$common")

if [ "$top" = "$main" ]; then
  say "this is the main checkout; nothing to do"
  exit 0
fi

# Git Bash and friends create a copy when asked for a symlink unless the
# machine is set up for native links, so refuse rather than copy quietly.
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*)
    warn "symlinks are not reliable in this shell; nothing done. Run this from WSL, or link the env files by hand (see docs/conventions/local-dev.md)"
    exit 1
    ;;
esac

[ "$#" -gt 0 ] || set -- .env

for f in "$@"; do
  case "$f" in
    /*|..|../*|*/..|*/../*)
      warn "$f: must be a path inside the repository; skipped"
      continue
      ;;
  esac

  src="$main/$f"
  dst="$top/$f"

  if [ ! -e "$src" ]; then
    say "$f: not in the main checkout; skipped"
  elif [ -L "$dst" ]; then
    if [ "$(readlink "$dst")" = "$src" ]; then
      say "$f: already linked"
    else
      warn "$f: is a link to $(readlink "$dst"), not the main checkout; left alone"
    fi
  elif [ -e "$dst" ]; then
    warn "$f: a real file is here and shadows the main checkout's copy; left alone. Delete it and re-run to link"
  else
    mkdir -p "$(dirname "$dst")"
    ln -s "$src" "$dst"
    say "$f: linked to $src"
  fi
done
