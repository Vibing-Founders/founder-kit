/**
 * Alternate Vitest config for tests that open a direct Postgres connection.
 *
 * WHY: a cloud sandbox has no raw TCP route to the database (the host does not
 * resolve, the pooler times out), so any test importing `pg` fails on a
 * connection timeout. This config aliases `pg` to the HTTPS shim, which carries
 * the same SQL over the Management API instead.
 *
 * USE: run only the files that need it, and only in a sandbox --
 *
 *     npx vitest run -c vitest.config.pghttp.ts <files>
 *
 * CI and local runs have real TCP and should use the ordinary config.
 *
 * READ `test/helpers/pg-http-shim.ts`'s header before trusting a result. It
 * documents where the shim deliberately diverges from a real client --
 * transactions are no-ops, and that is the one most likely to surprise you.
 *
 * ---------------------------------------------------------------------------
 * ADJUST TWO THINGS after copying this file into your repository:
 *   1. The `import baseConfig from './vitest.config'` line below, if your
 *      project's Vitest config is not at `./vitest.config.ts` (a `.mts` or
 *      differently-named config needs the specifier changed here).
 *   2. The `SHIM` constant below, if you changed `database.shim.path` in
 *      the `agent-delivery` section of `.vf-founder-kit/config.yaml` from
 *      its default.
 * ---------------------------------------------------------------------------
 */

import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from './vitest.config';

const SHIM = fileURLToPath(new URL('./test/helpers/pg-http-shim.ts', import.meta.url));

/**
 * Overrides a run applies when the suite targets a remote branch rather than a
 * local database. They exist because a remote branch fails in ways that look
 * like broken tests: setup and teardown make many round trips and time out on
 * latency, and a worker count tuned for a local stack oversubscribes the
 * branch's connection slots.
 *
 * THESE TWO VARIABLE NAMES ARE THE CONTRACT between the run and this file. The
 * dispatched run exports them from `database.test_overrides` in the
 * `agent-delivery` section of `.vf-founder-kit/config.yaml`; unset, the
 * project's own settings are left alone. They are documented in
 * `_shared/config-schema.md` under `database.test_overrides` and in the
 * runbook's step 3.7 — if you rename them here, rename them there too or the
 * overrides silently stop applying.
 *
 * Note this file is only loaded for shim-backed runs. A project that needs the
 * overrides without the shim passes them on the test command line instead; the
 * runbook says how.
 */
const num = (v: string | undefined): number | undefined => {
  const n = Number(v);
  return v && Number.isFinite(n) ? n : undefined;
};

const maxWorkers = num(process.env.AGENT_DELIVERY_MAX_WORKERS);
const hookTimeout = num(process.env.AGENT_DELIVERY_HOOK_TIMEOUT_MS);

export default mergeConfig(
  baseConfig,
  defineConfig({
    resolve: {
      alias: {
        pg: SHIM,
      },
    },
    test: {
      ...(maxWorkers !== undefined ? { maxWorkers, minWorkers: 1 } : {}),
      ...(hookTimeout !== undefined ? { hookTimeout, teardownTimeout: hookTimeout } : {}),
    },
  })
);
