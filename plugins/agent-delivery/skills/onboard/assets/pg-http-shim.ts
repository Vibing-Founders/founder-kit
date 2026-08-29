/**
 * A `pg.Client`-shaped adapter that routes SQL over HTTPS instead of raw TCP.
 *
 * WHY THIS EXISTS (sandbox-only): some test files open a direct Postgres
 * connection because a REST interface structurally cannot express what they
 * assert — `pg_catalog` introspection, `ALTER TABLE ... DISABLE TRIGGER`, and
 * writes to scheduler schemas. In a cloud sandbox the database host does not
 * resolve and the pooler times out: only HTTPS through the agent proxy leaves
 * the box. The Management API's `/database/query` endpoint runs arbitrary SQL
 * over HTTPS, which covers all three cases.
 *
 * NOT FOR CI OR LOCAL RUNS — those have real TCP and should use `pg` proper.
 *
 * ---------------------------------------------------------------------------
 * WHERE THIS DIVERGES FROM A REAL CLIENT. Read this before trusting a result.
 * Each item is either enforced at runtime (throws) or listed as a precondition
 * the `onboard` skill's scan checks before installing this file.
 *
 * 1. TRANSACTIONS ARE NO-OPS (enforced: `begin`/`commit`/`rollback` return
 *    without reaching the network). The endpoint is stateless, so a transaction
 *    cannot be held across separate `query()` calls; every statement
 *    autocommits.
 *    PRECONDITION: your tests use transactions for atomic grouping, not for
 *    rollback-based isolation. A suite that relies on `rollback` to undo its
 *    fixtures is NOT supported here — it will leave its writes behind. It also
 *    means a mid-sequence failure can leave a trigger disabled, which is why
 *    this must only ever point at a disposable branch (see the guard below).
 *
 * 2. ONE FIXED DATABASE ROLE (enforced: a connection config naming a different
 *    user throws). Every statement runs as the endpoint's own role, whatever
 *    the connection config says. A test that connects as another role to reach
 *    an object that role owns cannot work here, and would otherwise fail with a
 *    confusing permission error instead of an honest one.
 *
 * 3. ROW COUNTS REFLECT RETURNED ROWS ONLY (precondition, not enforceable
 *    here). The endpoint returns rows, not a command tag, so `rowCount` is the
 *    length of the result. A write with no `RETURNING` clause reports 0 rows
 *    affected even when it changed many.
 *    PRECONDITION: no test asserts an affected-row count on a non-returning
 *    write. The install-time scan flags any that do.
 *
 * 4. PARAMETERS ARE INTERPOLATED, NOT BOUND (partly enforced: dollar-quoted
 *    SQL throws). There is no bind protocol over HTTP, so `$1..$N` are
 *    substituted as literals before the statement is sent.
 *    - Dollar-quoted bodies (`$$ ... $$`, `$tag$ ... $tag$`) would be corrupted
 *      by that substitution, so they are rejected outright rather than
 *      silently mangled.
 *    - PRECONDITION: no statement contains a literal `$1`-shaped token outside
 *      a parameter position (inside a string literal, say). Substitution cannot
 *      tell it apart from a real placeholder and will corrupt it. The
 *      install-time scan flags these.
 * ---------------------------------------------------------------------------
 */

type Row = Record<string, unknown>;

/** The role the Management API query endpoint executes as. See divergence 2. */
const ENDPOINT_ROLE = 'postgres';

const quote = (s: string): string => `'${s.replace(/'/g, "''")}'`;

/** Render a JS value as a Postgres literal. Casts in the SQL (`$1::uuid[]`) still apply. */
const literal = (v: unknown): string => {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  if (typeof v === 'bigint') return v.toString();
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (v instanceof Date) return quote(v.toISOString());
  // `ARRAY[]` alone is untyped, but the SQL's own `::uuid[]` cast follows the
  // substitution, so an empty array renders correctly as `ARRAY[]::uuid[]`.
  if (Array.isArray(v)) return `ARRAY[${v.map(literal).join(',')}]`;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(v)) {
    return `'\\x${v.toString('hex')}'::bytea`;
  }
  if (typeof v === 'object') return quote(JSON.stringify(v));
  return quote(String(v));
};

/** `$$ ... $$` or `$tag$ ... $tag$`. Substitution would corrupt these (divergence 4). */
const DOLLAR_QUOTED = /\$[A-Za-z_]*\$/;

/** Substitute $1..$N with literals. */
const interpolate = (text: string, params?: unknown[]): string => {
  // No parameters means no substitution, so a dollar-quoted body passes through
  // untouched and is safe. The guard below belongs after this return, not before
  // it: rejecting a statement substitution never rewrites would refuse SQL the
  // shim can run correctly.
  if (!params || params.length === 0) return text;
  if (DOLLAR_QUOTED.test(text)) {
    throw new Error(
      'pgHttpShim: this statement contains a dollar-quoted body ($$ or $tag$), which ' +
        'parameter substitution would corrupt. This shim cannot run it. Run this test ' +
        'against a real Postgres connection instead.'
    );
  }
  return text.replace(/\$(\d+)/g, (whole, n: string) => {
    const idx = Number(n) - 1;
    return idx < params.length ? literal(params[idx]) : whole;
  });
};

const TXN_NOOP = /^\s*(begin|commit|rollback|start\s+transaction|end)\s*;?\s*$/i;

// ---------------------------------------------------------------------------
// Statement rewrites — an extension point, not a universal translation layer.
//
// Some statements cannot run as the endpoint's role but have a supported
// equivalent that can. Rather than guessing, this file exposes a list your
// project fills in. It ships EMPTY: a rewrite is a project-shaped fix, and one
// that silently changes SQL you did not expect it to touch is worse than an
// honest permission error.
//
// Add one by pushing onto `rewrites` from your test setup, or by editing this
// array directly after copying the file into your repo.
// ---------------------------------------------------------------------------

export interface Rewrite {
  /** Named so a rewritten statement can be reported rather than applied invisibly. */
  name: string;
  /** Return the replacement SQL, or `null` to decline. */
  apply(sql: string, params?: unknown[]): string | null;
}

export const rewrites: Rewrite[] = [];

/**
 * EXAMPLE rewrite — supplied, not enabled. Add it with:
 *
 *   import { rewrites, cronParkRewrite } from './pg-http-shim';
 *   rewrites.push(cronParkRewrite);
 *
 * A test that parks a scheduled job with
 * `update cron.job set active = $1 where jobname = $2` normally connects as the
 * role that owns `cron.job`. The endpoint's role does not own it, so that
 * statement can never work here. `cron.alter_job()` is the scheduler's supported
 * API for the same change and IS executable by the endpoint's role.
 *
 * The `FROM cron.job` form preserves the original's behaviour on a missing job:
 * zero rows in, zero calls made, no error — where a scalar subquery would pass
 * NULL to `alter_job` and raise.
 */
export const cronParkRewrite: Rewrite = {
  name: 'cron-park',
  apply(sql, params) {
    const m =
      /^\s*update\s+cron\.job\s+set\s+active\s*=\s*\$(\d+)\s+where\s+jobname\s*=\s*\$(\d+)\s*;?\s*$/i.exec(
        sql
      );
    if (!m || !params) return null;
    const active = params[Number(m[1]) - 1];
    const jobname = params[Number(m[2]) - 1];
    if (active === undefined || jobname === undefined) return null;
    return (
      `select cron.alter_job(job_id := jobid, active := ${literal(active)}) ` +
      `from cron.job where jobname = ${literal(jobname)}`
    );
  },
};

const applyRewrites = (sql: string, params?: unknown[]): string | null => {
  for (const r of rewrites) {
    const out = r.apply(sql, params);
    if (out !== null) return out;
  }
  return null;
};

/**
 * Refuse to run against anything that is not a verified preview branch.
 *
 * This shim executes arbitrary DDL. Without this check, a stray branch
 * reference pointing at the production project would let a test run
 * `ALTER TABLE ... DISABLE TRIGGER` against live data. The target must
 * therefore appear in the production project's own branch list, and must not be
 * the branch named `main` (which is production's own branch, not a disposable
 * one).
 *
 * Note what this guard requires: a LIVE branch listing. It cannot be satisfied
 * by setting environment variables alone.
 *
 * Resolved once per process; every query awaits the same promise.
 */
let branchCheck: Promise<void> | null = null;

/** Exported for tests; resets the memoised guard between cases. */
export const __resetBranchCheck = (): void => {
  branchCheck = null;
};

const assertDisposableBranch = (ref: string, token: string): Promise<void> => {
  if (branchCheck) return branchCheck;

  branchCheck = (async () => {
    const prodRef = process.env.SUPABASE_PROJECT_REF;
    if (!prodRef) {
      throw new Error(
        'pgHttpShim: SUPABASE_PROJECT_REF is not set, so the target cannot be ' +
          'verified as a preview branch. Refusing to run.'
      );
    }
    if (ref === prodRef) {
      throw new Error(
        `pgHttpShim: SUPABASE_BRANCH_REF (${ref}) is the production project. Refusing to run.`
      );
    }

    const res = await fetch(`https://api.supabase.com/v1/projects/${prodRef}/branches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(
        `pgHttpShim: could not list branches of ${prodRef} to verify the target (${res.status}). Refusing to run.`
      );
    }

    const branches = (await res.json()) as Array<{ name?: string; project_ref?: string }>;
    const match = branches.find((b) => b.project_ref === ref);
    if (!match) {
      throw new Error(
        `pgHttpShim: ${ref} is not a preview branch of ${prodRef}. Refusing to run.`
      );
    }
    if (match.name === 'main') {
      throw new Error('pgHttpShim: refusing to run against the branch named `main`.');
    }
  })();

  return branchCheck;
};

export class Client {
  private readonly ref: string;
  private readonly token: string;

  constructor(config?: { user?: string } | string) {
    // Divergence 2: every statement runs as the endpoint's role. A config that
    // asks for a different one would be silently ignored, so refuse instead.
    if (config && typeof config === 'object' && config.user && config.user !== ENDPOINT_ROLE) {
      throw new Error(
        `pgHttpShim: this test connects as '${config.user}', but the HTTPS query endpoint ` +
          `always runs as '${ENDPOINT_ROLE}'. Refusing to run rather than executing as the ` +
          'wrong role. Run this test against a real Postgres connection instead.'
      );
    }

    const ref = process.env.SUPABASE_BRANCH_REF;
    const token = process.env.SUPABASE_ACCESS_TOKEN;
    if (!ref) throw new Error('pgHttpShim: SUPABASE_BRANCH_REF is not set');
    if (!token) throw new Error('pgHttpShim: SUPABASE_ACCESS_TOKEN is not set');
    this.ref = ref;
    this.token = token;
  }

  async connect(): Promise<void> {
    await assertDisposableBranch(this.ref, this.token);
  }
  async end(): Promise<void> {}

  async query<T extends Row = Row>(
    text: string | { text: string; values?: unknown[] },
    params?: unknown[]
  ): Promise<{ rows: T[]; rowCount: number }> {
    const sql = typeof text === 'string' ? text : text.text;
    const values = typeof text === 'string' ? params : (text.values ?? params);

    // Divergence 1: no network round trip for transaction control.
    if (TXN_NOOP.test(sql)) return { rows: [], rowCount: 0 };

    // Also guarded here, not just in connect(), so a caller that skips connect()
    // cannot reach the database unverified. The result is memoised per process.
    await assertDisposableBranch(this.ref, this.token);

    const query = applyRewrites(sql, values) ?? interpolate(sql, values);
    const res = await fetch(`https://api.supabase.com/v1/projects/${this.ref}/database/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const detail = await res.text();
      // Surface the server's own message so a failing assertion reads like a
      // Postgres error rather than an HTTP one.
      throw new Error(`pgHttpShim ${res.status}: ${detail.slice(0, 500)}`);
    }

    const body = (await res.json()) as T[] | null;
    const rows = Array.isArray(body) ? body : [];
    // Divergence 3: this is the returned-row count, not the affected-row count.
    return { rows, rowCount: rows.length };
  }
}

export default { Client };
