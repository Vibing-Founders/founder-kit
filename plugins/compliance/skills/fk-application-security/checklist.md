# Application Security — Checklist Mode

## Goal
Generate a concrete, tickable secure development checklist for a given feature type.

## Steps

1. **Identify the feature type** — common types:
   - User authentication (login, registration, password reset, MFA)
   - Payment flow
   - File upload / download
   - API endpoint (CRUD)
   - Admin panel / privileged operations
   - Third-party integrations (OAuth, webhooks)
   - Age verification / identity verification

2. **Load knowledge files**:
   - `knowledge/owasp-top-10.md` — for the risk categories to cover
   - `knowledge/auth-patterns.md` — for auth-related items
   - `knowledge/secure-coding.md` — for input validation, secrets, encryption items

3. **Produce a checklist** tailored to the feature type. Don't include items that obviously don't apply.

4. **Mark priority**:
   - 🔴 **REQUIRED** — ship blocker; the feature should not go live without this
   - 🟡 **BEFORE LAUNCH** — important but can be scheduled if feature isn't live yet
   - 🟢 **HARDENING** — defence in depth; address in next cycle

---

## Output format

```markdown
# Secure Development Checklist: [Feature Name]

> 🔴 REQUIRED (ship blocker) | 🟡 BEFORE LAUNCH | 🟢 HARDENING

---

## Authentication & Authorisation

- 🔴 ☐ [Item — e.g. All endpoints require authentication unless explicitly public]
- 🔴 ☐ [Item — e.g. Authorisation check verifies the authenticated user owns the resource]

## Input Validation

- 🔴 ☐ [Item — e.g. All user-supplied inputs validated server-side before processing]
- 🔴 ☐ [Item]

## [Feature-specific section, e.g. File Uploads / Payment / Sessions]

- 🔴 ☐ [Item]
- 🟡 ☐ [Item]

## Secrets & Configuration

- 🔴 ☐ No API keys, database credentials, or secrets committed to version control
- 🔴 ☐ [Feature-specific secrets items]

## Logging & Monitoring

- 🟡 ☐ Security events logged (auth failures, access control failures, suspicious input)
- 🟡 ☐ [Feature-specific items]

## Dependencies

- 🟡 ☐ New dependencies reviewed for known vulnerabilities (`npm audit`)
- 🟢 ☐ [Other dependency items]

## Testing

- 🟡 ☐ Security test cases written for auth bypass, privilege escalation, input injection
- 🟢 ☐ [Feature-specific testing items]
```

---

## Pre-built checklist starters by feature type

**Authentication features** — pull from `knowledge/auth-patterns.md`:
- Password hashing algorithm
- Session token entropy and cookie flags
- Rate limiting on auth endpoints
- MFA availability
- Password reset token expiry

**File upload features** — pull from `knowledge/secure-coding.md` input validation section:
- MIME type validation server-side
- File size limits
- Randomised filenames
- Storage in object store, not application server
- Never serve as executable

**API endpoints** — focus on A01 (access control) and A03 (injection):
- Auth check on every endpoint
- Ownership/tenancy check on resource access
- Parameterised queries
- Input validation and sanitisation
- Rate limiting

**Payment flows** — focus on A04 (insecure design) and A02 (cryptography):
- Price re-validated server-side (never trust client)
- PCI-scoped data minimisation (don't store card numbers)
- Webhook signature verification
- Idempotency handling for double-submission
