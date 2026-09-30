/**
 * Tests for the Postgres-over-HTTPS shim shipped in
 * `skills/fk-onboard/assets/pg-http-shim.ts`.
 *
 * The shim is copied into an adopting repository and aliased over the whole `pg`
 * package, where it executes arbitrary DDL against a disposable database branch.
 * Its guard is the only thing standing between that and production, so the guard
 * cases below are the point of this file: `fetch` is stubbed so each refusal is
 * observed rather than argued about, and every test asserts that no query
 * reached the network.
 */
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Client, Pool, rewrites, cronParkRewrite, __resetBranchCheck }
  from '../skills/fk-onboard/assets/pg-http-shim.ts';

const realFetch = globalThis.fetch;
let calls: Array<{ url: string; body?: any }> = [];

const stubFetch = (branches: any[], queryResult: any = []) => {
  globalThis.fetch = (async (url: any, init: any = {}) => {
    const u = String(url);
    calls.push({ url: u, body: init.body ? JSON.parse(init.body) : undefined });
    if (u.endsWith('/branches')) {
      return new Response(JSON.stringify(branches), { status: 200 });
    }
    return new Response(JSON.stringify(queryResult), { status: 200 });
  }) as typeof fetch;
};

beforeEach(() => {
  calls = [];
  __resetBranchCheck();
  rewrites.length = 0;
  process.env.SUPABASE_PROJECT_REF = 'prodref';
  process.env.SUPABASE_BRANCH_REF = 'branchref';
  process.env.SUPABASE_ACCESS_TOKEN = 'tok';
});
afterEach(() => { globalThis.fetch = realFetch; });

const queryUrls = () => calls.filter(c => c.url.includes('/database/query'));

test('R20: the production project ref is refused before any query is issued', async () => {
  process.env.SUPABASE_BRANCH_REF = 'prodref';
  stubFetch([]);
  const c = new Client();
  await assert.rejects(c.query('select 1'), /is the production project/);
  assert.equal(queryUrls().length, 0);
  assert.equal(calls.length, 0, 'not even the branch listing');
});

test('R20: a ref absent from the branch list is refused', async () => {
  stubFetch([{ name: 'other', project_ref: 'somethingelse' }]);
  const c = new Client();
  await assert.rejects(c.connect(), /is not a preview branch of prodref/);
  assert.equal(queryUrls().length, 0);
});

test('R20: the branch named `main` is refused', async () => {
  stubFetch([{ name: 'main', project_ref: 'branchref' }]);
  const c = new Client();
  await assert.rejects(c.connect(), /refusing to run against the branch named/);
  assert.equal(queryUrls().length, 0);
});

test('R20: the guard needs a live listing — env vars alone do not satisfy it', async () => {
  // Everything set, but the listing call fails.
  globalThis.fetch = (async (url: any) => {
    calls.push({ url: String(url) });
    return new Response('nope', { status: 500 });
  }) as typeof fetch;
  const c = new Client();
  await assert.rejects(c.connect(), /could not list branches[\s\S]*Refusing to run/);
  assert.equal(queryUrls().length, 0);
});

test('a caller that skips connect() and queries directly is still guarded', async () => {
  stubFetch([{ name: 'other', project_ref: 'nope' }]);
  const c = new Client();
  await assert.rejects(c.query('select 1'), /is not a preview branch/);
  assert.equal(queryUrls().length, 0);
});

test('AE2: dollar-quoted SQL is rejected, not silently interpolated', async () => {
  stubFetch([{ name: 'run-x', project_ref: 'branchref' }]);
  const c = new Client();
  await c.connect();
  await assert.rejects(
    c.query('create function f() returns int as $$ select $1 $$ language sql', [1]),
    /dollar-quoted body/
  );
  assert.equal(queryUrls().length, 0);
});

test('transaction control returns without reaching the network', async () => {
  stubFetch([{ name: 'run-x', project_ref: 'branchref' }]);
  const c = new Client();
  for (const sql of ['begin', 'COMMIT;', ' rollback ', 'start transaction', 'end;']) {
    assert.deepEqual(await c.query(sql), { rows: [], rowCount: 0 });
  }
  assert.equal(calls.length, 0, 'not even the guard: no network at all');
});

test('divergence 2: a config naming another role is refused', () => {
  assert.throws(() => new Client({ user: 'some_admin' }), /always runs as 'postgres'/);
  assert.doesNotThrow(() => new Client({ user: 'postgres' }));
  assert.doesNotThrow(() => new Client());
});

test('happy path: parameters are interpolated and rows are returned', async () => {
  stubFetch([{ name: 'run-x', project_ref: 'branchref' }], [{ id: 1 }, { id: 2 }]);
  const c = new Client();
  await c.connect();
  const r = await c.query('select * from t where a = $1 and b = $2', ["o'brien", null]);
  assert.deepEqual(r.rows, [{ id: 1 }, { id: 2 }]);
  assert.equal(r.rowCount, 2);
  assert.equal(queryUrls()[0].body.query, "select * from t where a = 'o''brien' and b = NULL");
});

test('divergence 3: a non-returning write reports rowCount 0', async () => {
  stubFetch([{ name: 'run-x', project_ref: 'branchref' }], []);
  const c = new Client();
  await c.connect();
  const r = await c.query('update t set a = 1');
  // Documented precondition, flagged by the install scan.
  assert.equal(r.rowCount, 0);
});

test('rewrites ship empty and are opt-in', async () => {
  stubFetch([{ name: 'run-x', project_ref: 'branchref' }], []);
  const c = new Client();
  await c.connect();
  await c.query('update cron.job set active = $1 where jobname = $2', [false, 'j']);
  assert.ok(queryUrls()[0].body.query.includes('update cron.job'), 'unrewritten by default');

  rewrites.push(cronParkRewrite);
  await c.query('update cron.job set active = $1 where jobname = $2', [false, 'j']);
  assert.equal(
    queryUrls()[1].body.query,
    "select cron.alter_job(job_id := jobid, active := false) from cron.job where jobname = 'j'"
  );
});

test('a dollar-quoted body with NO parameters is safe and passes through', async () => {
  stubFetch([{ name: 'run-x', project_ref: 'branchref' }], []);
  const c = new Client();
  await c.connect();
  const sql = 'create function f() returns int as $$ select 1 $$ language sql';
  // No params: substitution never runs, so nothing can be corrupted.
  await c.query(sql);
  assert.equal(queryUrls()[0].body.query, sql);
});

test('SAFETY: a verified ref does not bless a later unverified ref', async () => {
  stubFetch([{ name: 'run-x', project_ref: 'goodref' }]);
  process.env.SUPABASE_BRANCH_REF = 'goodref';
  const ok = new Client();
  await ok.connect(); // verifies goodref

  // The suite switches target (a helper, or the dotenv-outranks-exports case).
  process.env.SUPABASE_BRANCH_REF = 'prodref';
  const evil = new Client();
  await assert.rejects(
    evil.query('alter table t disable trigger all'),
    /production project|not a preview branch/
  );
  assert.equal(queryUrls().length, 0);
});

test('SAFETY: role guard catches a connection string naming another role', () => {
  assert.throws(
    () => new Client('postgres://supabase_admin:pw@host:5432/db'),
    /always runs as 'postgres'/
  );
  assert.throws(
    () => new Client({ connectionString: 'postgres://supabase_admin:pw@h/db' }),
    /always runs as 'postgres'/
  );
  assert.doesNotThrow(() => new Client('postgres://postgres:pw@host:5432/db'));
});

test('dollar-quoted tag containing digits is rejected', async () => {
  stubFetch([{ name: 'run-x', project_ref: 'branchref' }]);
  const c = new Client();
  await c.connect();
  await assert.rejects(
    c.query('create function f() as $fn2$ select $1 $fn2$ language sql', [1]),
    /dollar-quoted body/
  );
});

test('extended transaction forms stay off the network', async () => {
  stubFetch([{ name: 'run-x', project_ref: 'branchref' }]);
  const c = new Client();
  for (const sql of ['BEGIN TRANSACTION', 'begin isolation level serializable',
                     'COMMIT WORK', 'savepoint sp1', 'rollback to savepoint sp1',
                     'release savepoint sp1', 'end transaction']) {
    assert.deepEqual(await c.query(sql), { rows: [], rowCount: 0 });
  }
  assert.equal(calls.length, 0);
});

test('Pool refuses honestly instead of being undefined', () => {
  assert.notEqual(Pool, undefined);
  assert.throws(() => new Pool(), /only the `Client` interface/);
});
