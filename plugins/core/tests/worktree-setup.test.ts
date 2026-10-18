/**
 * Tests for the worktree setup script shipped in
 * `skills/fk-setup/assets/worktree-setup.sh`.
 *
 * The script is copied into an adopting repository and run in every new git
 * worktree. Its job is small, but each refusal protects something: a copied or
 * overwritten env file fails silently and much later. So each case below builds
 * a real repository with a real worktree and observes what the script did to
 * the filesystem, rather than reading the shell and agreeing with it.
 */
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync, readlinkSync, lstatSync,
  existsSync, symlinkSync, realpathSync, rmSync, chmodSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(
  new URL('../skills/fk-setup/assets/worktree-setup.sh', import.meta.url));

let root = '';
let main = '';
let wt = '';

const sh = (cwd: string, cmd: string, args: string[], env: Record<string, string> = {}) =>
  spawnSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, ...env } });

const git = (cwd: string, ...args: string[]) => {
  const r = sh(cwd, 'git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', ...args]);
  assert.equal(r.status, 0, r.stderr);
  return r;
};

const run = (cwd: string, args: string[] = [], env: Record<string, string> = {}) =>
  sh(cwd, 'sh', [script, ...args], env);

const isLink = (p: string) => lstatSync(p).isSymbolicLink();

beforeEach(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'fk-worktree-')));
  main = join(root, 'main');
  wt = join(root, 'wt');
  mkdirSync(main);
  git(main, 'init', '-q', '-b', 'main');
  writeFileSync(join(main, '.gitignore'), '.env*\n');
  writeFileSync(join(main, 'README.md'), 'x\n');
  git(main, 'add', '.');
  git(main, 'commit', '-q', '-m', 'init');
  writeFileSync(join(main, '.env'), 'SECRET=main\n');
  git(main, 'worktree', 'add', '-q', '-b', 'feature', wt);
});
afterEach(() => { rmSync(root, { recursive: true, force: true }); });

test('links the env file from the main checkout into a worktree', () => {
  const r = run(wt);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(isLink(join(wt, '.env')));
  assert.equal(readlinkSync(join(wt, '.env')), join(main, '.env'));
  assert.equal(readFileSync(join(wt, '.env'), 'utf8'), 'SECRET=main\n');
});

test('a link tracks later edits to the original, which a copy would not', () => {
  run(wt);
  writeFileSync(join(main, '.env'), 'SECRET=rotated\n');
  assert.equal(readFileSync(join(wt, '.env'), 'utf8'), 'SECRET=rotated\n');
});

test('does nothing in the main checkout', () => {
  const r = run(main);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /main checkout/);
  assert.ok(!isLink(join(main, '.env')));
  assert.equal(readFileSync(join(main, '.env'), 'utf8'), 'SECRET=main\n');
});

test('works from a subdirectory of the worktree', () => {
  mkdirSync(join(wt, 'src'));
  const r = run(join(wt, 'src'));
  assert.equal(r.status, 0, r.stderr);
  assert.equal(readlinkSync(join(wt, '.env')), join(main, '.env'));
  assert.ok(!existsSync(join(wt, 'src', '.env')));
});

test('running it twice changes nothing', () => {
  run(wt);
  const before = readlinkSync(join(wt, '.env'));
  const r = run(wt);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stderr, '');
  assert.match(r.stdout, /already linked/);
  assert.equal(readlinkSync(join(wt, '.env')), before);
});

test('a real file at the destination is left alone, with a warning', () => {
  writeFileSync(join(wt, '.env'), 'SECRET=hand-copied\n');
  const r = run(wt);
  assert.equal(r.status, 0);
  assert.match(r.stderr, /real file.*left alone/);
  assert.ok(!isLink(join(wt, '.env')));
  assert.equal(readFileSync(join(wt, '.env'), 'utf8'), 'SECRET=hand-copied\n');
});

test('a link pointing somewhere else is left alone, with a warning', () => {
  const other = join(root, 'other.env');
  writeFileSync(other, 'SECRET=other\n');
  symlinkSync(other, join(wt, '.env'));
  const r = run(wt);
  assert.equal(r.status, 0);
  assert.match(r.stderr, /not the main checkout; left alone/);
  assert.equal(readlinkSync(join(wt, '.env')), other);
});

test('a file missing from the main checkout is skipped, not created', () => {
  const r = run(wt, ['.env', '.env.local']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /\.env\.local: not in the main checkout; skipped/);
  assert.ok(isLink(join(wt, '.env')));
  assert.ok(!existsSync(join(wt, '.env.local')));
});

test('links env files in nested directories', () => {
  mkdirSync(join(main, 'apps', 'web'), { recursive: true });
  writeFileSync(join(main, 'apps', 'web', '.env.local'), 'A=1\n');
  const r = run(wt, ['apps/web/.env.local']);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(readlinkSync(join(wt, 'apps', 'web', '.env.local')),
    join(main, 'apps', 'web', '.env.local'));
});

test('paths outside the repository are refused', () => {
  writeFileSync(join(root, 'outside.env'), 'X=1\n');
  const r = run(wt, ['../outside.env', '/etc/hosts']);
  assert.equal(r.status, 0);
  assert.match(r.stderr, /\.\.\/outside\.env: must be a path inside the repository/);
  assert.match(r.stderr, /\/etc\/hosts: must be a path inside the repository/);
  assert.ok(!existsSync(join(root, 'outside.env.lnk')));
  assert.ok(!existsSync(join(wt, 'hosts')));
});

test('refuses in a shell where a symlink would become a copy', () => {
  const bin = join(root, 'bin');
  mkdirSync(bin);
  writeFileSync(join(bin, 'uname'), '#!/bin/sh\necho MINGW64_NT-10.0\n');
  chmodSync(join(bin, 'uname'), 0o755);
  const r = run(wt, [], { PATH: `${bin}:${process.env.PATH}` });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /symlinks are not reliable/);
  assert.ok(!existsSync(join(wt, '.env')));
});

test('fails outside a git repository without touching anything', () => {
  const r = run(root);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /not inside a git repository/);
});
