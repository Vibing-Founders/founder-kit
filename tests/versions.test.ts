/**
 * Marketplace version checks.
 *
 * Two things go wrong silently with plugin versions, and both leave founders on
 * old content without an error anywhere:
 *
 *  - `plugin.json` and the plugin's `marketplace.json` entry disagree. Claude
 *    Code uses `plugin.json`, so the listing advertises a version nobody gets.
 *  - A plugin's shipped files change and its version does not. Claude Code sees
 *    the same version and keeps the cached copy.
 *
 * The last test compares the working tree with the branch it will merge into
 * (`origin/main`, or `FK_BASE_REF`), so it fails on a pull request that forgot
 * the bump and passes on `main` itself, where there is nothing to compare.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseVersion, isNewer, shippedPlugin, missingBumps } from '../scripts/versions.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifest = (plugin: string) => join('plugins', plugin, '.claude-plugin', 'plugin.json');
const readJson = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8'));

const pluginDirs = readdirSync(join(root, 'plugins'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(root, manifest(d.name))))
  .map((d) => d.name)
  .sort();
const marketplace: Array<{ name: string; version?: string; source: string }> =
  readJson('.claude-plugin/marketplace.json').plugins;

const git = (...args: string[]): string | null => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
};

test('every plugin directory is listed in the marketplace, and nothing else is', () => {
  assert.deepEqual(marketplace.map((p) => p.name).sort(), pluginDirs);
  for (const entry of marketplace) {
    assert.equal(entry.source, `./plugins/${entry.name}`);
  }
});

test('each plugin has the same valid version in plugin.json and marketplace.json', () => {
  for (const entry of marketplace) {
    const own = readJson(manifest(entry.name));
    assert.equal(own.name, entry.name);
    assert.ok(parseVersion(own.version), `${entry.name}: "${own.version}" is not MAJOR.MINOR.PATCH`);
    assert.equal(entry.version, own.version,
      `${entry.name}: marketplace.json says ${entry.version}, plugin.json says ${own.version}. Set both to the same version.`);
  }
});

test('isNewer compares versions numerically', () => {
  assert.ok(isNewer('0.0.10', '0.0.9'));
  assert.ok(isNewer('0.1.0', '0.0.9'));
  assert.ok(isNewer('1.0.0', '0.9.9'));
  assert.ok(!isNewer('0.0.3', '0.0.3'));
  assert.ok(!isNewer('0.0.2', '0.0.3'));
  assert.ok(!isNewer('0.1', '0.0.3'));
  assert.ok(!isNewer('v0.1.0', '0.0.3'));
});

test('tests and evals do not count as shipped changes; everything else in a plugin does', () => {
  assert.equal(shippedPlugin('plugins/core/skills/fk-setup/SKILL.md'), 'core');
  assert.equal(shippedPlugin('plugins/core/skills/fk-setup/assets/worktree-setup.sh'), 'core');
  assert.equal(shippedPlugin('plugins/core/.claude-plugin/plugin.json'), 'core');
  assert.equal(shippedPlugin('plugins/core/tests/worktree-setup.test.ts'), null);
  assert.equal(shippedPlugin('plugins/core/skills/fk-setup/evals/evals.json'), null);
  assert.equal(shippedPlugin('README.md'), null);
  assert.equal(shippedPlugin('.claude-plugin/marketplace.json'), null);
});

test('missingBumps names plugins that changed without a higher version', () => {
  const base = { core: '0.1.0', compliance: '0.0.3', gone: '1.0.0' };
  assert.deepEqual(
    missingBumps(['plugins/core/skills/fk-setup/SKILL.md'], base, { ...base }),
    ['core']);
  assert.deepEqual(
    missingBumps(['plugins/core/skills/fk-setup/SKILL.md'], base, { ...base, core: '0.1.1' }),
    []);
  assert.deepEqual(
    missingBumps(['plugins/core/skills/fk-setup/SKILL.md'], base, { ...base, core: '0.0.9' }),
    ['core'], 'a lower version is not a bump');
  assert.deepEqual(
    missingBumps(['plugins/core/tests/x.test.ts', 'README.md'], base, { ...base }),
    [], 'tests and docs outside plugins need no bump');
  assert.deepEqual(
    missingBumps(['plugins/fresh/skills/fk-new/SKILL.md'], base, { ...base, fresh: '0.1.0' }),
    [], 'a new plugin needs no bump');
  assert.deepEqual(
    missingBumps(['plugins/gone/skills/fk-old/SKILL.md'], base, { core: '0.1.0', compliance: '0.0.3' }),
    [], 'a removed plugin needs no bump');
  assert.deepEqual(
    missingBumps(['plugins/core/a.md', 'plugins/compliance/b.md'], base, { ...base, core: '0.2.0' }),
    ['compliance']);
});

test('every plugin changed since the base branch has a higher version', (t) => {
  const baseRef = process.env.FK_BASE_REF || 'origin/main';
  const mergeBase = git('merge-base', 'HEAD', baseRef);
  if (!mergeBase) {
    t.skip(`${baseRef} is not available to compare against`);
    return;
  }
  const changed = (git('diff', '--name-only', mergeBase) ?? '').split('\n').filter(Boolean);
  const untracked = (git('ls-files', '--others', '--exclude-standard', 'plugins') ?? '').split('\n').filter(Boolean);

  const names = new Set([...changed, ...untracked].map(shippedPlugin).filter((p): p is string => p !== null));
  const base: Record<string, string | undefined> = {};
  const head: Record<string, string | undefined> = {};
  for (const name of names) {
    const before = git('show', `${mergeBase}:${manifest(name)}`);
    base[name] = before ? JSON.parse(before).version : undefined;
    head[name] = existsSync(join(root, manifest(name))) ? readJson(manifest(name)).version : undefined;
  }

  const missing = missingBumps([...changed, ...untracked], base, head);
  assert.deepEqual(missing, [],
    `Changed without a version bump: ${missing.map((p) => `${p} (still ${base[p]})`).join(', ')}. ` +
    'Raise the version in plugins/<name>/.claude-plugin/plugin.json and in .claude-plugin/marketplace.json, ' +
    'or founders who already have the plugin will not receive the change. See "Versions" in CONTRIBUTING.md.');
});
