# OWASP Top 10 — Application Security Risks

> Reference guide to the OWASP Top 10 (2021 edition) with platform-relevant examples and mitigation guidance.
> Source: https://owasp.org/www-project-top-ten/ (2021 edition)

---

## A01:2021 — Broken Access Control

**What it is**: Access control enforces policy such that users cannot act outside their intended permissions. Failures lead to unauthorised information disclosure, modification, or destruction of data, or performing business functions outside the user's limits.

**Common vulnerabilities:**
- Bypassing access control checks by modifying the URL, internal application state, or HTML page
- Permitting viewing or editing someone else's account by providing its unique identifier (IDOR — Insecure Direct Object Reference)
- Accessing API endpoints without proper authentication/authorisation checks
- Elevation of privilege: acting as a user without being logged in, or acting as admin when logged in as a standard user
- CORS misconfiguration allowing API access from unauthorised origins
- Force browsing to authenticated pages as an unauthenticated user, or to privileged pages as a standard user

**Platform-specific examples:**
- A fan accessing another fan's booking details by changing a booking ID in the URL
- A user accessing another user's video call by guessing a session ID
- An API endpoint for creator earnings that doesn't check the creator ID matches the authenticated user
- Accessing admin-only moderation tools because the frontend hides the button but the API doesn't check authorisation

**Mitigations:**
- Deny by default — require explicit grants for each resource
- Implement access control in server-side code, not just the frontend
- Log access control failures and alert on high rates (potential enumeration attacks)
- Rate limit API calls to minimise automated enumeration
- Invalidate server-side session tokens after logout
- For multi-tenant systems: ensure all DB queries include tenant/owner checks, not just user-level auth

---

## A02:2021 — Cryptographic Failures

**What it is**: Previously called "Sensitive Data Exposure". Failures in cryptography (or lack thereof) that expose sensitive data.

**Common vulnerabilities:**
- Transmitting sensitive data in cleartext (HTTP instead of HTTPS)
- Weak or deprecated cryptographic algorithms (MD5, SHA1 for password hashing, DES for encryption)
- Hardcoded cryptographic keys in source code
- Not validating server certificates (disabling TLS verification in code)
- Using ECB mode for block ciphers (leaks structure of plaintext)
- Storing passwords without salted hashing (or with weak hashes like MD5)
- Storing sensitive data unencrypted at rest (credit card numbers, identity documents)

**Platform-specific examples:**
- Storing user DOB + payment data in plaintext in the database
- Using MD5 to hash passwords
- API keys or Stripe secrets committed to version control
- Age verification selfies stored unencrypted in a public storage bucket
- Transmitting call metadata over unencrypted HTTP

**Mitigations:**
- Classify data processed by sensitivity; apply appropriate protection
- Don't store sensitive data you don't need
- Encrypt all data in transit with TLS 1.2+ (TLS 1.3 preferred)
- Encrypt sensitive data at rest using strong algorithms (AES-256-GCM)
- Use bcrypt, scrypt, Argon2, or PBKDF2 for password storage (never MD5/SHA1)
- Never store secrets in code — use environment variables and secret managers (Vault, AWS Secrets Manager)
- Ensure cloud storage buckets are not publicly accessible by default

---

## A03:2021 — Injection

**What it is**: User-supplied data is sent to an interpreter as part of a command or query. An attacker's hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorisation.

**Types**: SQL injection, NoSQL injection, LDAP injection, OS command injection, SSTI (template injection), XSS (cross-site scripting).

**Common vulnerabilities:**
- Using user input directly in SQL queries without parameterisation
- Evaluating user-controlled input as code
- Interpolating user data into shell commands
- Rendering user-provided HTML without sanitisation (XSS)
- Injecting into template engines (SSTI)

**Platform-specific examples:**
- A search field that builds a SQL query with direct string interpolation
- A moderation notes field that allows HTML, which is then rendered to other moderators (stored XSS)
- A webhook URL that gets fetched server-side without validation (can become SSRF)
- User-uploaded filenames passed to server-side processes without sanitisation

**Mitigations:**
- Use parameterised queries / prepared statements — never interpolate user data into SQL
- Use ORM layer correctly (avoid raw queries with string interpolation)
- Validate, sanitise, and encode all user input
- Use an HTML sanitiser library (e.g. DOMPurify) before rendering user-provided HTML
- Avoid evaluating user-controlled data as code
- Apply allowlisting on input validation (not just blocklisting)
- Set `Content-Security-Policy` HTTP headers to mitigate XSS impact
- For file uploads: validate MIME type server-side, scan for malware, never serve uploaded files as executable

---

## A04:2021 — Insecure Design

**What it is**: A broad category representing weaknesses in design and architecture. Secure design requires threat modelling and integrating security into the development lifecycle from the start, not as an afterthought.

**Common patterns:**
- Features designed without threat modelling (what could go wrong if an adversary uses this?)
- Business logic that can be bypassed (e.g. skipping payment steps, bypassing age checks by manipulating the flow)
- No rate limiting on sensitive operations (login, OTP, email verification)
- Trusting client-side data for security decisions (e.g. "isAdmin: true" in a JWT that isn't server-verified)
- Designing flows where recovery paths are insecure (e.g. password reset leaks via timing or enumeration)

**Platform-specific examples:**
- An age verification flow where the user can skip the verification step by directly accessing the post-verification URL
- Allowing the client to specify the price of a booking (not re-validated server-side)
- A creator payout system where the creator ID is passed in the request body rather than derived from the authenticated session

**Mitigations:**
- Use threat modelling for every significant feature (STRIDE, attack trees)
- Document trust boundaries: what data comes from users, what from your own systems
- Never trust client-side values for security-sensitive decisions — always re-derive or re-validate server-side
- Rate limit all sensitive operations: login, password reset, OTP, API endpoints
- Test all business logic flows for bypass paths before shipping
- Implement defence in depth (multiple layers of checks, not a single gate)

---

## A05:2021 — Security Misconfiguration

**What it is**: The most commonly seen issue. Results from insecure default configurations, incomplete or ad-hoc configurations, open cloud storage, misconfigured HTTP headers, verbose error messages disclosing sensitive information.

**Common vulnerabilities:**
- Default credentials unchanged (database admin passwords, cloud console passwords)
- Unnecessary features enabled (open ports, services, pages, accounts, privileges)
- Error handling that returns stack traces, server version info, or internal paths to users
- Missing security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Cloud storage publicly readable
- Outdated software with known vulnerabilities running in production
- CORS configured as `*` on sensitive endpoints

**Platform-specific examples:**
- A staging database accessible from the public internet with default credentials
- Supabase RLS (Row Level Security) not enabled, allowing any authenticated user to read all rows
- Error responses from the API that include SQL query text or stack traces
- A development debug endpoint deployed to production
- Tokens or PII appearing in logs shipped to third-party log aggregators

**Mitigations:**
- Implement a repeatable hardening process for all environments
- Enable RLS on all database tables
- Remove or disable unused features, endpoints, services, and ports
- Configure security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Separate development/staging from production credentials
- Review cloud permissions regularly — no public access to storage buckets by default
- Ensure error responses never expose internal details in production
- Automated security scanning in CI/CD (SAST, dependency scanning, secrets detection)

---

## A06:2021 — Vulnerable and Outdated Components

**What it is**: Using components (libraries, frameworks, OS, containers) with known vulnerabilities. Includes not knowing what version you're using, not patching regularly, or not testing compatibility of updates.

**Common vulnerabilities:**
- Not tracking versions of all components used
- Not monitoring CVE databases or subscribing to security advisories for your dependencies
- Running old versions of Node.js, Ruby, Python, databases after end-of-life
- Not updating dependencies after known vulnerabilities are published
- Using abandoned or unmaintained packages

**Platform-specific examples:**
- Using a version of `jsonwebtoken` with a known signature bypass vulnerability
- Running Node 14 in production after it reached end-of-life
- An npm package with a supply chain compromise that isn't caught before deployment
- Using an old version of the Supabase client with a known auth bypass

**Mitigations:**
- Use a software composition analysis (SCA) tool: Dependabot (GitHub), Snyk, or similar
- Regularly audit direct and transitive dependencies with `npm audit` / `bundle audit`
- Subscribe to security advisories for your major frameworks and runtime
- Have a policy for patching critical CVEs (e.g. within 48 hours for critical, 2 weeks for high)
- Prefer well-maintained packages with active release histories
- Pin dependencies to specific versions in production to prevent unexpected updates

---

## A07:2021 — Identification and Authentication Failures

**What it is**: Previously called "Broken Authentication". Failures in authentication or session management that allow attackers to compromise passwords, keys, session tokens, or assume other users' identities.

**Common vulnerabilities:**
- Permitting weak or well-known passwords
- Weak or ineffective credential recovery (knowledge-based questions, guessable resets)
- Storing passwords in plaintext or with weak hashing
- Not using MFA for privileged operations
- Insecure session identifiers (short, predictable, not invalidated on logout)
- Not rotating session tokens after privilege escalation (session fixation)
- JWT vulnerabilities: accepting `alg: none`, not verifying signatures, not checking expiry

**Platform-specific examples:**
- Admin accounts with no MFA
- JWT tokens that don't expire (no `exp` claim)
- Session tokens that remain valid after password change or logout
- Password reset links that are valid for 7 days instead of 1 hour
- Auth cookies without `HttpOnly` and `Secure` flags

**Mitigations:**
- Implement strong password policies (minimum length, breach database checks via HaveIBeenPwned API)
- Enforce MFA for admin accounts; offer MFA to all users
- Use a proven auth library or service (Supabase Auth, Auth0) — don't build auth from scratch
- Set short session expiry and rotate tokens on re-authentication
- Set cookies as `HttpOnly`, `Secure`, `SameSite=Strict` or `Lax`
- Validate JWTs properly: check signature, expiry, issuer, audience
- Invalidate all sessions on password change and password reset
- Rate limit login and auth endpoints; implement account lockout or CAPTCHA after failures
- Time-limit password reset tokens (1–4 hours maximum)

---

## A08:2021 — Software and Data Integrity Failures

**What it is**: Code and infrastructure that does not protect against integrity violations. Includes insecure deserialization, use of plugins/libraries from untrusted sources, CI/CD pipeline insecurity, and auto-update mechanisms without integrity verification.

**Common vulnerabilities:**
- Deserializing untrusted data without integrity checks
- Loading JavaScript from CDNs without Subresource Integrity (SRI) hashes
- Relying on auto-update mechanisms that don't verify signatures
- CI/CD pipeline that can be compromised to inject malicious code
- Processing JSON or XML from user input and trusting it for business logic

**Platform-specific examples:**
- A third-party script loaded without SRI: if the CDN is compromised, arbitrary code runs on your site
- Accepting a serialised object from a cookie and deserialising it without verification
- A GitHub Actions workflow that uses `@latest` tags for actions (vulnerable to supply chain attacks)
- A webhook payload processed without signature verification (attacker can forge calls to your webhook)

**Mitigations:**
- Use SRI hashes for all third-party scripts and stylesheets: `<script integrity="sha256-...">`
- Verify signatures on all software updates and releases
- Ensure CI/CD pipelines are secured: limited permissions, no secrets in logs, pinned action versions
- Use HMAC or digital signatures to verify webhook payloads before processing
- Don't deserialise data from untrusted sources without strict schema validation
- Audit third-party integrations for supply chain risk

---

## A09:2021 — Security Logging and Monitoring Failures

**What it is**: Without logging and monitoring, breaches cannot be detected and responded to. This allows attackers to persist, pivot to more systems, and exfiltrate data without detection.

**Common vulnerabilities:**
- Not logging authentication events, access control failures, or input validation failures
- Logs that are inadequate for forensic purposes (no IP, no timestamp, no user ID)
- Not monitoring logs or alerting on suspicious patterns
- Logs stored only locally (destroyed if server is compromised)
- Log injection (allowing user input to appear in logs without sanitisation)
- No incident response plan

**Platform-specific examples:**
- No alerts when an admin account logs in from an unexpected country
- No logging when users fail age verification multiple times in a row
- Access control failures silently swallowed — no visibility on who tried to access other users' data
- All production logs stored on the same server as the application

**Mitigations:**
- Log: all authentication events (success and failure), access control failures, input validation failures, all admin actions
- Include: timestamp, IP address, user ID (or "anonymous"), session ID, action, resource affected
- Centralise logs to a service outside the application server (CloudWatch, Datadog, Splunk, Papertrail)
- Set up alerts for: multiple failed logins, high rate of access control failures, unusual admin activity, unexpected geographic logins
- Protect log integrity (write-once storage, separate access controls for log systems)
- Have and test an incident response plan

---

## A10:2021 — Server-Side Request Forgery (SSRF)

**What it is**: SSRF flaws occur when a web application fetches a remote resource based on user-supplied input without validating the URL. An attacker can coerce the application to send a crafted request to an unexpected destination, even when protected by a firewall or network ACL.

**Common vulnerabilities:**
- Allowing users to submit URLs that the server fetches (webhooks, link previews, file imports from URL)
- Fetching user-supplied URLs and not restricting which hosts can be reached
- Metadata service access in cloud environments (e.g. AWS IMDSv1 endpoint `169.254.169.254`)

**Platform-specific examples:**
- A "profile image URL" feature that fetches and caches the image server-side — an attacker submits the AWS metadata service URL to steal cloud credentials
- A webhook URL field where an attacker provides an internal URL to probe internal services
- A "preview this link" feature that makes server-side HTTP requests to any URL

**Mitigations:**
- Validate and sanitise all client-supplied input URLs
- Allowlist permitted URL schemes (https only) and domains where possible
- Block requests to private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1, 169.254.0.0/16)
- Use a dedicated service or isolated function for fetching external URLs, with minimal permissions
- Disable HTTP redirects or validate the final destination after following redirects
- Upgrade to AWS IMDSv2 (token-required metadata service) if running on AWS EC2
