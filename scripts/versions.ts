/**
 * Version rules for the marketplace, used by `tests/versions.test.ts`.
 *
 * Claude Code decides whether an installed plugin needs updating by comparing
 * version strings, not commits. A change merged without a version bump reaches
 * nobody who already has the plugin, and nothing reports it. These helpers let
 * a test say so before the merge.
 */

export type Versions = Record<string, string | undefined>;

export const parseVersion = (v: string): [number, number, number] | null => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
};

export const isNewer = (head: string, base: string): boolean => {
  const h = parseVersion(head);
  const b = parseVersion(base);
  if (!h || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (h[i] !== b[i]) return h[i] > b[i];
  }
  return false;
};

/**
 * The plugin a changed file ships in, or null when the file does not reach a
 * founder's machine in a way that matters: anything outside `plugins/`, and a
 * plugin's own tests and evals.
 */
export const shippedPlugin = (file: string): string | null => {
  const m = /^plugins\/([^/]+)\/(.+)$/.exec(file);
  if (!m) return null;
  const [, plugin, rest] = m;
  if (rest.startsWith('tests/') || /(^|\/)evals\//.test(rest)) return null;
  return plugin;
};

/**
 * Plugins whose shipped files changed without their version going up. A plugin
 * that is new (no base version) or removed (no head version) needs no bump.
 */
export const missingBumps = (changed: string[], base: Versions, head: Versions): string[] => {
  const touched = new Set<string>();
  for (const file of changed) {
    const plugin = shippedPlugin(file);
    if (plugin) touched.add(plugin);
  }
  return [...touched]
    .filter((p) => {
      const b = base[p];
      const h = head[p];
      return b !== undefined && h !== undefined && !isNewer(h, b);
    })
    .sort();
};
