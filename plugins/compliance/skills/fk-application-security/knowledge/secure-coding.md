# Secure Coding Practices

> Reference guide to input validation, secrets handling, dependency management, encryption standards, and general secure development practices for web and mobile platforms.

---

## 1. Input Validation

### Principles

**Validate at boundaries**: validate all input that crosses a trust boundary — HTTP requests, file uploads, webhooks, message queues, third-party API responses.

**Allowlisting over blocklisting**: define what is valid and reject everything else. Blocklists are incomplete by definition.

**Validate on the server**: client-side validation is UX, not security. Always re-validate on the server.

**Fail closed**: if validation fails or is uncertain, deny the request. Don't process ambiguous input.

### What to validate

For every input field:
- **Type**: is it a string, number, boolean, date? Reject the wrong type.
- **Length**: minimum and maximum. A name is not 10,000 characters; a UUID is exactly 36 characters.
- **Format**: email, URL, phone number — validate against a strict regex or use a validation library.
- **Range**: for numbers, validate min/max. For dates, validate sensible ranges.
- **Charset**: for free-text fields, consider whether you need to support full Unicode or just ASCII/Latin.
- **Encoding**: normalise Unicode before comparison (NFC normalisation prevents homoglyph attacks).

### Common validation patterns (TypeScript/JavaScript)

```typescript
// Email — use a library, not a simple regex
import { z } from 'zod'
const emailSchema = z.string().email().max(254)

// UUID
const uuidSchema = z.string().uuid()

// Safe string (no HTML tags)
const safeStringSchema = z.string().max(500).regex(/^[^<>'"&]*$/)

// Date of birth
const dobSchema = z.string().date() // YYYY-MM-DD format
```

### SQL injection prevention

Use parameterised queries / prepared statements exclusively:

```typescript
// WRONG — never do this
// db.query(`SELECT * FROM users WHERE email = '${email}'`)

// RIGHT — parameterised
const users = await db.query('SELECT * FROM users WHERE email = $1', [email])

// RIGHT — ORM with proper parameterisation
const user = await db.from('users').select('*').eq('email', email).single()
```

### Preventing XSS

- **React**: template expressions are auto-escaped by default. The `dangerouslySetInnerHTML` prop bypasses this protection and should never be used with user-controlled data.
- **Vue / Angular**: similar — `v-html` and `[innerHTML]` bypass escaping. Avoid with untrusted data.
- When you must render user-provided HTML: always use DOMPurify to sanitise it first.
- Set `Content-Security-Policy` headers to restrict script sources.
- Use `X-Content-Type-Options: nosniff` to prevent MIME sniffing.

```typescript
import DOMPurify from 'dompurify'

// Sanitise before rendering any user-provided HTML
const safeHtml = DOMPurify.sanitize(userProvidedHtml, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href']
})
```

### File upload validation

- Validate MIME type server-side using magic bytes (not just file extension or Content-Type header from client)
- Limit file size
- Generate a new UUID filename — never use the original filename in storage or file system paths
- Store uploaded files in a separate storage bucket (e.g. S3), not on the application server
- Never serve uploaded files with a Content-Type that allows execution
- Scan for malware if you have volume (ClamAV, or a cloud scanning service)

```typescript
// Never use the original filename
const safeFilename = `${crypto.randomUUID()}.${allowedExtension}`
```

---

## 2. Secrets Management

### What counts as a secret

- Database credentials
- API keys (Stripe, Twilio, Agora, third-party services)
- JWT signing secrets
- Encryption keys
- OAuth client secrets
- Service account credentials

### The rules

**Never commit secrets to version control.**
Use `.gitignore` for local `.env` files. Scan your git history if you suspect secrets were ever committed (tools: `trufflehog`, `gitleaks`).

**Use environment variables** for local development (`.env` file, never committed).

**Use a secrets manager** for production:
- AWS Secrets Manager / Parameter Store
- Google Cloud Secret Manager
- HashiCorp Vault
- Doppler, Infisical (developer-focused options)

**Rotate secrets regularly:**
- Rotate all secrets on a defined schedule (quarterly at minimum for high-value keys)
- Immediately rotate any secret that may have been exposed
- Use short-lived tokens where your service supports it (e.g. AWS IAM roles, not long-lived access keys)

**Scope secrets narrowly:**
- Create separate API keys per environment (development, staging, production)
- Create separate keys per integration — don't use one Stripe key for everything
- Apply principle of least privilege to service accounts

### Detecting leaked secrets

Set up automated secret scanning:
- **GitHub Advanced Security / GitHub Actions**: `trufflehog` or `gitleaks` as a CI check
- **Pre-commit hooks**: `detect-secrets` or `gitleaks` to catch secrets before they're committed
- **Cloud console**: enable alerts for unusual API usage that might indicate key compromise

### What to do if a secret is leaked

1. **Rotate immediately** — generate a new secret and update all deployments
2. **Revoke the old secret** — ensure it can no longer be used
3. **Audit usage** — check logs to determine if the leaked secret was used by anyone other than you
4. **Notify affected parties** — if the secret gave access to user data, assess breach notification obligations
5. **Review how it leaked** — update processes to prevent recurrence

---

## 3. Encryption Standards

### Data in transit

- **TLS 1.3** preferred; TLS 1.2 acceptable with strong cipher suites
- Disable TLS 1.0 and 1.1 — they are deprecated and vulnerable (BEAST, POODLE attacks)
- Configure strong cipher suites: prefer ECDHE for key exchange, AES-GCM or ChaCha20-Poly1305 for symmetric encryption
- Enable HTTP Strict Transport Security (HSTS): `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- Use HTTPS everywhere, including internal service-to-service communication

### Data at rest

- **AES-256-GCM** for symmetric encryption (authenticated encryption — provides both confidentiality and integrity)
- Never use AES-ECB — it reveals patterns in data
- Use your cloud provider's managed encryption where possible (AWS KMS, Google CMEK) — they handle key management
- Enable encryption at rest on all databases, storage buckets, and backups

### Password hashing (not encryption — one-way)

See `auth-patterns.md` — use Argon2id, bcrypt, scrypt, or PBKDF2. Never MD5 or SHA-1 for passwords.

### Generating random values

Use a cryptographically secure random number generator (CSPRNG):
- Node.js: `crypto.randomBytes()` or `crypto.randomUUID()`
- Never use `Math.random()` for security-sensitive values (it's not cryptographically random)

```typescript
import { randomBytes, randomUUID } from 'crypto'

const sessionToken = randomBytes(32).toString('hex')  // 64-char hex string
const id = randomUUID()  // UUID v4
```

### Key management

- Never hardcode encryption keys — store in a secrets manager or key management service
- Separate encryption keys from the data they protect (key in secrets manager, data in database)
- Document key rotation procedures and test them before you need them
- Consider envelope encryption for large datasets: data is encrypted with a data encryption key (DEK); the DEK is encrypted with a key encryption key (KEK) stored in KMS

---

## 4. Dependency Management

### Keeping dependencies secure

**Audit regularly:**
```bash
npm audit                    # Check for known vulnerabilities
npm audit fix               # Auto-fix where safe
npm outdated                # See what's outdated
```

**Automated scanning:**
- Dependabot (GitHub): opens PRs for vulnerable dependencies automatically
- Snyk: dependency + container scanning with fix suggestions
- OWASP Dependency-Check: open source, integrates into CI/CD

**Upgrade policy:**
- **Critical CVEs**: patch within 24–48 hours
- **High CVEs**: patch within 2 weeks
- **Medium/Low**: addressed in regular dependency update cycles (monthly or per-sprint)

### Pinning and lockfiles

- Commit `package-lock.json` / `yarn.lock` to version control — this ensures reproducible builds
- Use `npm ci` (not `npm install`) in CI/CD — installs exactly from the lockfile, fails if package-lock.json is inconsistent
- For containers: pin base image versions to specific digests, not just tags (`node:20.15.0` not `node:latest`)

### Evaluating new dependencies

Before adding a new package:
1. Is it actively maintained? When was the last commit? Do they respond to issues?
2. How many dependents does it have? High usage = more scrutiny from the community
3. What's the download count trend — is it growing or dying?
4. Does it have a security policy? (`SECURITY.md`, responsible disclosure process)
5. Could you implement this yourself in a small amount of code? (Avoid dependencies for trivial functionality)
6. Check for previous vulnerabilities in the package history

### Supply chain security

- Be cautious of `postinstall` scripts in packages — they run code on install
- Review the contributors list for popular packages you depend on heavily
- Consider using `npm pack` + manual review for critical security-adjacent packages
- In CI/CD: use `--ignore-scripts` for non-interactive installs of untrusted code if possible

---

## 5. Secure Development Lifecycle

### Security requirements in design

Before building a feature, answer:
- What data does this feature collect, store, or transmit?
- Who can access this data? What could go wrong if an attacker does?
- What are the trust boundaries? (User input, external APIs, other services)
- What authentication and authorisation does this require?
- What logging is needed to detect misuse?

### Code review security checklist

For every PR:
- ☐ Does user input get validated before use?
- ☐ Are there any direct SQL interpolations? (Should be parameterised)
- ☐ Are any secrets or credentials hardcoded?
- ☐ Are new API endpoints protected with appropriate auth checks?
- ☐ Is any user data written to logs? (PII in logs is a GDPR issue)
- ☐ Does this feature access data that the current user owns? (Access control check)
- ☐ Are file uploads handled safely?
- ☐ Are new dependencies needed? Have they been reviewed?

### Static analysis (SAST)

Set up automated static analysis in CI:
- **ESLint security plugin** (`eslint-plugin-security`) — catches common JS security issues
- **Semgrep** — powerful pattern-based analysis; has security-specific rulesets
- **CodeQL** (GitHub) — deep semantic analysis for common vulnerability patterns

### Penetration testing

- Conduct a penetration test before major launches and after significant architecture changes
- Scope: cover auth flows, access control, all user-input surfaces, file uploads, API endpoints
- Use a reputable firm with CREST or CHECK certification for UK-regulated platforms
- Run OWASP ZAP or Burp Suite as part of your own security testing in development

### Dependency scanning in CI

```yaml
- name: Audit dependencies
  run: npm audit --audit-level=high
```

Fail the build on high/critical vulnerabilities.

---

## 6. Security Headers

Every response from your web app should include:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**CSP (Content-Security-Policy)**: Most powerful XSS mitigation. Defines which scripts, styles, images, etc. can be loaded. Use nonces or hashes for inline scripts; avoid `unsafe-inline`.

**HSTS**: Tells browsers to only use HTTPS. Submit to the HSTS preload list for maximum effect.

**X-Content-Type-Options: nosniff**: Prevents browsers from MIME-type sniffing.

**X-Frame-Options: DENY**: Prevents clickjacking by blocking the page being embedded in iframes.

Use https://securityheaders.com to test your headers.

---

## 7. Logging Security

### What to log (security events)

- All authentication events: login success/failure, logout, MFA attempts
- All access control failures: 403 responses, unauthorised resource access attempts
- All admin actions: who did what, when, on which resource
- All input validation failures (can help detect scanning/fuzzing attempts)
- Password reset requests and completions
- MFA setup, change, and removal
- Sensitive data access (viewing another user's data, etc.)

### What NOT to log

- Passwords or password hashes
- Session tokens, JWT tokens, API keys
- Full credit card numbers (you shouldn't have them; payment processors hold them)
- Government ID numbers
- Sensitive personal data (don't log the content of fields containing PII)

**Log PII carefully**: user IDs are fine; email addresses, phone numbers, DOBs in logs are risky — logs often have broader access than databases, are retained longer, and may be shipped to third-party services.

### Log integrity

- Ship logs to a centralised service separate from the application server
- Apply separate access controls to logs (not everyone who can access the app can access security logs)
- Enable log integrity protection (append-only, tamper-evident) for security-critical logs
- Retain security logs for at least 12 months (many regulations require this)
