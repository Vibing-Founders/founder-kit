# OWASP Top 10 — 2021
> **Source**: https://owasp.org/Top10/ (OWASP Top 10:2021)
> **Compiled**: From training knowledge (August 2025 cutoff) — verify against current official text
> **Enforcement body**: N/A — OWASP Top 10 is an awareness document; referenced by PCI DSS, ISO 27001, NIST, and many regulatory frameworks
> **Scope**: Web application security risks — applicable to web apps, APIs, mobile backends, and related services

## Quick Reference

| Rank | Category | Key CWEs |
|---|---|---|
| A01 | Broken Access Control | CWE-200, 201, 352, 359, 22, 284, 285, 862, 863, 639 |
| A02 | Cryptographic Failures | CWE-261, 296, 310, 319, 321, 326, 327, 328, 329, 331, 338, 523, 759 |
| A03 | Injection | CWE-20, 74, 75, 77, 78, 79, 89, 564, 917 |
| A04 | Insecure Design | CWE-73, 183, 209, 213, 235, 256, 257, 266, 269, 280, 311, 312, 313, 316, 419, 430, 434 |
| A05 | Security Misconfiguration | CWE-2, 11, 13, 15, 16, 260, 315, 520, 526, 537, 539, 548, 579, 598, 601, 611, 614, 756, 776, 942, 1021, 1173 |
| A06 | Vulnerable and Outdated Components | CWE-1104 |
| A07 | Identification and Authentication Failures | CWE-255, 259, 287, 288, 290, 294, 295, 297, 300, 302, 304, 306, 307, 346, 384, 521, 613, 620, 640, 798, 940, 1216 |
| A08 | Software and Data Integrity Failures | CWE-345, 346, 353, 426, 494, 502, 565, 784, 829, 830 |
| A09 | Security Logging and Monitoring Failures | CWE-117, 223, 532, 778 |
| A10 | Server-Side Request Forgery (SSRF) | CWE-918 |

---

## A01:2021 — Broken Access Control

**Moved from #5 in 2017 to #1 in 2021.** Found in 94% of tested applications.

### Description
Access control enforces policy such that users cannot act outside their intended permissions. Failures typically lead to unauthorised information disclosure, modification, or destruction of data, or performing business functions outside the user's limits.

### How It Manifests
- Violation of the principle of least privilege or deny-by-default — access is permitted when it should be denied.
- Bypassing access control checks by modifying URL, internal application state, or HTML page; using an attack tool to modify API requests.
- Permitting viewing or editing someone else's account by providing its unique identifier (insecure direct object reference / IDOR).
- Accessing API functionality with missing access controls for POST, PUT, and DELETE.
- Privilege escalation: acting as a user without being logged in, or acting as an admin when logged in as a standard user.
- Metadata manipulation — replaying or tampering with a JWT access control token, cookie, or hidden field to elevate privileges.
- CORS misconfiguration allowing API access from unauthorised or untrusted origins.
- Force browsing to authenticated pages as an unauthenticated user, or to privileged pages as a standard user.

### Platform-Specific Examples
- A creator on a video call platform can view another creator's private booking schedule by changing a user ID in an API request (IDOR).
- An unauthenticated user accesses admin endpoints (`/api/admin/users`) by directly calling the URL.
- A fan accesses another fan's payment history by incrementing a record ID in a REST API URL.
- A standard user grants themselves admin privileges by editing a JWT claim (`"role": "admin"`).
- Cross-origin requests from a malicious domain are accepted because CORS is configured as `Access-Control-Allow-Origin: *` on authenticated endpoints.

### Prevention
- Deny by default except for public resources.
- Implement access control checks server-side — never only in the client.
- Enforce record ownership — users can only access records they own (unless explicitly granted).
- Disable web server directory listing; ensure file metadata and backups are not stored in web roots.
- Log access control failures and alert admins when repeated failures occur (potential brute force or enumeration).
- Rate limit API and controller access to minimise automated attack tooling.
- Invalidate stateful session tokens after logout; JWT tokens should have short expiry.
- Use a single, well-tested access control mechanism throughout the application.
- Write unit and integration tests specifically for access control functionality.

---

## A02:2021 — Cryptographic Failures

**Previously "Sensitive Data Exposure" — renamed to reflect root cause.** Moved from #3 to #2.

### Description
Failures related to cryptography (or lack thereof) that often lead to exposure of sensitive data. Covers data at rest, data in transit, and key management failures.

### How It Manifests
- Transmitting sensitive data in cleartext (HTTP, FTP, SMTP without STARTTLS).
- Using old or weak cryptographic algorithms (MD5, SHA1, RC4, DES, 3DES) or insecure cipher suites (SSL or early TLS).
- Using default crypto keys, generating or reusing weak crypto keys, or failing to rotate keys.
- Not enforcing encryption (e.g., missing HTTP Strict Transport Security — HSTS).
- Receiving server certificates not validated (e.g., certificate validation disabled in code).
- Passwords stored as plain text, or using weak hashing algorithms without salt (MD5, SHA1, SHA256 without proper salting and stretching).
- Outdated cryptographic padding methods (PKCS#1 v1.5, CBC mode without HMAC).
- Using non-cryptographic pseudo-random number generators for security-sensitive operations.

### Platform-Specific Examples
- An API returns full payment card details in plaintext in a JSON response.
- User passwords stored as unsalted MD5 hashes — rainbow tables trivially crack most passwords.
- Session cookies transmitted over HTTP.
- TLS certificate verification disabled in the mobile app codebase (`rejectUnauthorized: false`).
- AWS S3 bucket containing video files is publicly accessible with no encryption at rest.
- API keys stored in a Git repository in plaintext.

### Prevention
- Classify data processed, stored, or transmitted; identify which data requires protection under applicable regulations (GDPR, COPPA, PCI DSS).
- Do not store sensitive data unnecessarily — discard it as soon as possible.
- Encrypt all sensitive data at rest using strong, current algorithms (AES-256-GCM).
- Ensure all data in transit is encrypted — enforce TLS 1.2+ everywhere; use HSTS.
- Use strong adaptive password hashing: Argon2, bcrypt, scrypt, or PBKDF2 with appropriate work factor.
- Use cryptographically secure random number generators for all security-relevant operations.
- Disable deprecated protocols (SSL, TLS 1.0, TLS 1.1) and weak cipher suites.
- Manage cryptographic keys securely — use a key management service (AWS KMS, GCP Cloud KMS, HashiCorp Vault).
- Never put keys and credentials in source code; use environment variables or secrets managers.

---

## A03:2021 — Injection

**Previously #1 in 2017; dropped to #3.** Includes cross-site scripting (XSS). Found in 94% of tested applications.

### Description
Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query. An attacker can use injection to manipulate queries, execute arbitrary commands, or bypass authentication.

### Injection Types

**SQL injection**: User-supplied data is interpolated into SQL queries without sanitisation. Example vulnerable pattern:
```
SELECT * FROM streams WHERE title LIKE '%' + userInput + '%'
```
Injecting `%'; DROP TABLE users;--` destroys data.

**NoSQL injection**: Malicious operators or expressions injected into MongoDB or other NoSQL queries via JSON payloads containing operator keys such as `$gt`, `$where`.

**OS command injection**: User input is passed to a system shell call (e.g., Python `subprocess.call(shell=True)`, PHP `passthru()`) without sanitisation — attacker appends shell metacharacters.

**LDAP injection**: User input inserted into LDAP query expressions without escaping, allowing query manipulation.

**Cross-site scripting (XSS) — reflected, stored, DOM-based**: Malicious scripts injected into content that is consumed by other users in a browser. Stored XSS is the most severe — persisted in the database and served to every visitor.

**Server-side template injection**: User input rendered unescaped in a server-side template engine (Twig, Freemarker, Jinja2) — can lead to remote code execution.

**GraphQL injection**: Maliciously crafted GraphQL queries or mutations exploiting insufficient input validation or depth limits.

**XML injection / XXE (XML External Entity)**: Malicious XML input processed by a vulnerable XML parser — can lead to SSRF or local file disclosure.

### Platform-Specific Examples
- A live stream comment containing a `<script>` tag that redirects to an attacker-controlled domain to steal cookies (stored XSS).
- A search endpoint constructs a SQL query by string concatenation — injecting SQL metacharacters manipulates the query.
- A file upload endpoint passes the filename to a processing command without escaping — injecting shell metacharacters causes unintended execution.
- A GraphQL mutation accepts raw filter expressions that reach the database without validation.
- A creator bio field renders unescaped HTML, allowing injection of iframes or event handlers.

### Prevention
- Use a safe API that avoids interpreter use entirely, or provides a parameterised interface (prepared statements for SQL, ORM query builders).
- Positive server-side input validation — allowlisting of expected characters and formats.
- For residual dynamic queries: escape special characters using the escape syntax specific to the interpreter.
- Use LIMIT and other SQL controls within queries to prevent mass disclosure.
- For XSS: use a context-aware output encoding library; implement Content Security Policy (CSP).
- For template injection: use sandbox or restricted mode, or avoid user-controlled input in templates.
- Integrate SAST tools in CI/CD to detect injection vulnerabilities at code review time.

---

## A04:2021 — Insecure Design

**New category in 2021.** Focuses on design flaws, distinct from implementation failures.

### Description
Insecure design refers to missing or ineffective control design. It is not the same as insecure implementation — a correctly implemented insecure design cannot be fixed by perfect coding. Threat modelling and secure design patterns must be applied from the outset.

### How It Manifests
- Business logic flaws that allow unintended actions (e.g., booking a slot without completing payment by manipulating the booking flow).
- Missing rate limiting on sensitive operations (password reset, OTP entry, account creation) — enables brute force and enumeration.
- Relying on client-supplied values to determine trust levels, prices, or entitlements.
- Re-using the same token for multiple purposes (authentication + CSRF prevention + password reset).
- Failing to design abuse prevention into user flows (no mechanism to prevent fake accounts or review fraud).
- Design that requires collecting more data than necessary (violates GDPR data minimisation).
- Missing separation of duties — any single person or API key can perform all sensitive operations.

### Platform-Specific Examples
- A payment flow where the client sends the price to charge, not the server — an attacker changes the amount to $0.
- A password reset link never expires and the expiry check is performed client-side only.
- No limit on the number of failed login attempts, enabling credential stuffing at scale.
- An admin action (banning a user) can be triggered via a GET request — susceptible to CSRF.

### Prevention
- Establish and use a secure development lifecycle; integrate security activities into all phases.
- Implement threat modelling for critical authentication, access control, business logic, and data flows before coding begins.
- Use design patterns including plausibility checks, layered defence, and fail-secure defaults.
- Write unit and integration tests to validate that critical flows cannot be abused or skipped.
- Segregate tier layers — limit what each tier can do to only what it needs (least privilege at the architectural level).
- Apply rate limiting to protect against automated attacks on all sensitive operations.
- Never trust client-supplied values for security or business-critical decisions (prices, roles, entitlements, status).

---

## A05:2021 — Security Misconfiguration

**Moved from #6 to #5.** Found in 90% of applications tested.

### Description
Security misconfiguration results from insecure default configurations, incomplete or ad-hoc configurations, open cloud storage, misconfigured HTTP headers, verbose error messages, or unnecessary features enabled.

### How It Manifests
- Missing appropriate security hardening on any part of the application stack (OS, runtime, framework, database, cloud).
- Unnecessary features enabled or installed (unused ports, services, pages, accounts, privileges).
- Default accounts and passwords still enabled or unchanged.
- Error handling reveals stack traces or overly informative error messages to users.
- Latest security features disabled or not configured securely after system upgrades.
- Security settings in application servers, frameworks, libraries, and databases not set to secure values.
- Missing or incorrect HTTP security headers (CSP, X-Frame-Options, HSTS, X-Content-Type-Options).
- CORS headers too permissive on authenticated endpoints.
- Cloud storage (S3 buckets, Azure Blob Storage) publicly accessible when it should be private.
- XML external entity processing not disabled in XML parsers.
- Directory listing enabled on web server.
- Verbose error messages expose internal path structures, version numbers, or database query text.

### Platform-Specific Examples
- The database has Row Level Security (RLS) disabled on a sensitive multi-tenant table.
- Admin interfaces accessible from the public internet with no IP restriction.
- `NODE_ENV=development` deployed in production — enables stack traces and debug endpoints.
- AWS S3 bucket containing user-uploaded content has `ListBucket` public — allows enumeration of all objects.
- API returns detailed error messages including database query text and internal paths.
- Missing `Strict-Transport-Security` header allows downgrade attacks.

### Prevention
- Implement a repeatable hardening process for all environments (dev, staging, production). Use Infrastructure-as-Code (IaC) to enforce configuration.
- Maintain a minimal platform — remove unused features, services, components, and documentation.
- Review and configure cloud storage access controls — default-deny for all buckets and blob containers.
- Set all HTTP security headers: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- Disable or restrict detailed error messages in production environments.
- Run automated misconfiguration scanning in CI/CD (e.g., AWS Config, Azure Policy, checkov, trivy).
- Enable RLS on all database tables that contain multi-tenant data.

---

## A06:2021 — Vulnerable and Outdated Components

**Previously #9 (2017). CWE-1104: Use of Unmaintained Third-Party Components.**

### Description
Components such as libraries, frameworks, and other software modules run with the same privileges as the application. If a vulnerable component is exploited, it can facilitate serious data loss or server takeover. Applications using components with known vulnerabilities undermine all other defences.

### How It Manifests
- Not knowing the versions of all components used (both client-side and server-side), including nested or transitive dependencies.
- Using software that is unsupported, unpatched, or no longer maintained.
- Failing to regularly scan for vulnerabilities (SAST, SCA, OWASP Dependency-Check).
- Not upgrading the underlying platform (OS, web server, database, APIs, runtime environments, libraries, frameworks) in a timely, risk-based manner.
- Software developers not testing compatibility of updated, upgraded, or patched libraries.
- Not securing the configuration of components themselves (see A05).
- Installing packages from public registries without verifying their integrity (supply chain risk — typosquatting, dependency confusion).

### Platform-Specific Examples
- A React application uses a version of `lodash` with a known prototype pollution vulnerability.
- A Node.js `npm` package has a typosquatted malicious variant that was accidentally installed.
- An image processing library (e.g., ImageMagick, Sharp) has an unpatched remote code execution vulnerability exploited via user-uploaded images.
- A client SDK library is two major versions out of date, missing security patches.
- A `Dockerfile` uses an end-of-life base image with unfixed OS-level vulnerabilities.

### Prevention
- Remove unused dependencies, unnecessary features, components, files, and documentation.
- Continuously inventory versions of both client-side and server-side components using tools (`npm audit`, Dependabot, Snyk, OWASP Dependency-Check).
- Monitor sources like CVE/NVD, vendor security advisories, and security mailing lists for vulnerabilities.
- Obtain components only from official sources over secure links; prefer signed packages.
- Monitor for unmaintained libraries; plan migration where maintenance has ended.
- Automate dependency update PRs (Dependabot, Renovate) and address high-severity findings promptly.
- Fail builds on high-severity vulnerability findings in CI/CD.
- Pin Docker base image digests; use minimal base images (distroless where possible).

---

## A07:2021 — Identification and Authentication Failures

**Previously "Broken Authentication" (#2 in 2017); slipped to #7.**

### Description
Confirmation of user identity, authentication, and session management is critical. Failures allow attackers to assume other users' identities, compromise accounts, and access privileged functions.

### How It Manifests
- Permitting automated attacks such as credential stuffing (attacker has a list of valid usernames and passwords from prior data breaches).
- Permitting brute force or other automated attacks on login without rate limiting.
- Permitting default, weak, or well-known passwords without enforcement of password policies.
- Using weak or ineffective credential recovery mechanisms (e.g., knowledge-based security questions).
- Storing passwords in plaintext or using weak hashing (MD5, SHA1 without salt).
- Missing or ineffective multi-factor authentication.
- Exposing session identifiers in URLs.
- Reusing session identifiers after login (session fixation attack surface).
- Not properly invalidating session tokens after logout, inactivity, or password change.
- JWT tokens without expiry, using the `none` algorithm, or with the secret stored insecurely.

### Platform-Specific Examples
- A user resets their password but old session tokens remain valid — an attacker who obtained an old token retains access indefinitely.
- A login endpoint has no rate limit or CAPTCHA — credential stuffing with a 10,000-entry breach list succeeds within minutes.
- JWTs are accepted with `alg: none` — any claimed identity is accepted without signature verification.
- Refresh tokens never expire and are stored in `localStorage` (accessible to JavaScript, so accessible to XSS attacks).
- Password reset emails the new password in plaintext rather than a time-limited reset link.
- Session cookies are missing `HttpOnly` and `Secure` flags.

### Prevention
- Implement multi-factor authentication (MFA) — particularly for high-privilege operations such as admin actions.
- Do not ship or deploy with default credentials.
- Implement weak password checks — reject passwords that appear on lists of known-breached passwords.
- Use strong password hashing: Argon2, bcrypt, scrypt, or PBKDF2.
- Enforce account lockout or exponential backoff after repeated authentication failures; log and alert on credential stuffing patterns.
- Use secure, server-side, random session IDs with sufficient entropy; do not include session IDs in URLs.
- Generate a new session ID after login (to prevent session fixation).
- Invalidate all active sessions on logout and enforce a fixed inactivity timeout.
- For JWTs: use short expiry on access tokens (15 minutes); store refresh tokens in HttpOnly cookies; validate signature and claims server-side; reject `alg: none`.
- Session cookies: set `HttpOnly`, `Secure`, `SameSite=Strict` (or `Lax`).

---

## A08:2021 — Software and Data Integrity Failures

**New category in 2021 — incorporates supply chain risk and insecure deserialization.**

### Description
Failures related to code and infrastructure that does not protect against integrity violations. Includes insecure deserialization and CI/CD pipeline compromises. Particularly relevant given software supply chain attacks (SolarWinds, log4shell ecosystem, malicious npm packages).

### How It Manifests
- **Insecure deserialization**: Objects or data are encoded into a structure that an attacker can modify — deserialising untrusted data can lead to remote code execution, replay attacks, or injection.
- **Insecure auto-update**: Applications that auto-update without verifying the integrity of updates — a compromised update server can push malicious code.
- **Dependency confusion / typosquatting**: Relying on public package registries without integrity verification; malicious packages published with similar names to internal packages.
- **Unsigned code**: Using plugins, libraries, or modules from untrusted sources without verifying digital signatures.
- **CI/CD pipeline compromise**: Build and deploy pipelines without sufficient access controls or integrity checks — attackers can inject malicious code during the build process.
- **Insecure cookies**: Relying on a serialised object in a cookie without a digital signature — attacker modifies the object to change their role or entitlements.

### Platform-Specific Examples
- A role cookie contains a Base64-encoded JSON object `{"role":"fan"}` — an attacker changes it to `{"role":"admin"}` (no signature verification).
- An npm dependency in a CI pipeline is resolved from a public registry where a malicious package was published with a higher version number than an internal private package (dependency confusion attack).
- A video processing worker deserialises a job queue message without validation — a malicious message triggers unintended behaviour.
- An auto-update mechanism downloads binaries over HTTP without checking a cryptographic signature.
- A CI/CD environment has overly permissive IAM roles — a compromised build step can push to production.

### Prevention
- Consume libraries and dependencies from trusted repositories and verify integrity (using lock files with integrity hashes, Subresource Integrity for CDN-served scripts).
- Verify digital signatures of software or data to confirm provenance and integrity.
- Maintain a Software Bill of Materials (SBOM) to track all components.
- Review code and configuration changes through a mandatory review process before deployment (PRs, code review, four-eyes principle).
- Ensure CI/CD pipelines have proper segmentation, configuration, and access control.
- Do not send serialised objects to untrusted clients without digital signatures; if you must, validate on receipt.
- Use SRI `integrity` attributes for CDN-served JavaScript and CSS.
- Implement pipeline-level security controls: signed commits, protected branch rules, deployment approvals.

---

## A09:2021 — Security Logging and Monitoring Failures

**Previously "Insufficient Logging & Monitoring" (#10 in 2017); elevated to #9.**

### Description
Without sufficient logging and monitoring, breaches cannot be detected. Most breach studies show the average time to detect a breach is over 200 days — and most are detected by external parties, not internal controls. Insufficient logging and alerting enables attackers to dwell undetected, pivot to more systems, and exfiltrate data.

### How It Manifests
- Auditable events (logins, failed logins, high-value transactions) are not logged.
- Warnings and errors generate no, inadequate, or unclear log messages.
- Logs of applications and APIs are not monitored for suspicious activity.
- Logs only stored locally and destroyed if the application server is compromised.
- No alerting thresholds or incident response escalation processes exist.
- Penetration testing and automated scanning activities do not trigger alerts.
- Application is unable to detect, escalate, or alert for active attacks in real time or near real time.
- Logs contain sensitive data (passwords, access tokens, PII) — a log breach also becomes a data breach.

### Platform-Specific Examples
- Failed login attempts are not logged — 50,000 credential stuffing attempts go undetected.
- Stripe webhook events are not logged — a failed payment event is silently dropped; a user receives premium access without paying.
- An admin action (deleting a user account) is not logged — post-incident investigation cannot establish what happened.
- Logs include user passwords in plaintext (logged as part of a request body in debug mode).
- No alerting when more than 100 accounts are accessed from a single IP address within an hour.
- Log files stored in the application's web-accessible directory — exposed via a misconfiguration.

### Prevention
- Log all login attempts, access control failures, and server-side input validation failures with sufficient user context to identify suspicious accounts.
- Generate logs in a format that log management solutions can consume (structured logging — JSON).
- Encode log data correctly to prevent log injection attacks.
- Ensure high-value transactions have an audit trail with integrity controls to prevent tampering.
- Centralise logs in an append-only store outside the application tier (CloudWatch Logs, ELK stack, Datadog) — so an application compromise does not destroy logs.
- Establish effective monitoring and alerting — define thresholds; create alerts for brute force, IDOR enumeration, privilege escalation, and unusual geographic access patterns.
- Establish and test an incident response and recovery plan.
- Never log sensitive data: passwords, access tokens, payment card numbers, or full PII beyond what is needed for investigation.
- Implement log retention policies consistent with legal obligations.

---

## A10:2021 — Server-Side Request Forgery (SSRF)

**New category in 2021 — added due to severity and increasing prevalence in modern architectures.**

### Description
SSRF flaws occur whenever a web application fetches a remote resource without validating the user-supplied URL. It allows an attacker to coerce the application to send a crafted request to an unexpected destination, even when protected by a firewall, VPN, or network ACL.

### How It Manifests
- An application accepts a URL from user input and fetches that URL server-side (webhook destinations, URL preview generation, PDF generation from HTML, image URL import, feed importers).
- Attacker supplies internal network addresses to probe internal services — e.g., the AWS instance metadata endpoint (`http://169.254.169.254/`) or internal admin services (`http://localhost:8080/admin`).
- Attacker uses SSRF to bypass firewall controls and access internal APIs, databases, or admin consoles not intended to be externally reachable.
- Blind SSRF: the attacker does not receive the response directly but can infer what is accessible via timing, error messages, or DNS lookups.
- SSRF via file upload: XML, SVG, or PDF parsers that fetch external resources referenced within the file.
- Protocol smuggling: using alternative URI schemes (`file://`, `dict://`, `gopher://`, `ftp://`) to reach unexpected destinations.

### Platform-Specific Examples
- A "link preview" feature accepts a URL from the user and fetches the page to generate a card — an attacker provides the AWS metadata endpoint URL and retrieves IAM credentials.
- A webhook URL field in creator settings accepts any URL — an attacker sets it to an internal service endpoint and triggers unintended actions.
- A profile image import via URL does not validate the scheme — internal service ports can be probed.
- A PDF export feature renders HTML from user-supplied content including an embedded reference to a local file path.
- A video thumbnail fetcher does not validate the URL and can be used to probe internal microservices on non-standard ports.

### Prevention
- Sanitise and validate all client-supplied input data, including URLs.
- Enforce URL schema allowlists — only permit `http://` and `https://` to an explicitly approved set of external domains.
- Do not relay raw responses to clients — sanitise and validate that the response conforms to expectations.
- Disable HTTP redirections from fetched URLs, or validate that redirect targets also pass the allowlist.
- Reject requests to internal, loopback, or private IP ranges (RFC 1918 ranges, loopback, link-local, IPv6 ULAs).
- Use DNS allowlisting or blocklisting to prevent DNS rebinding attacks.
- On cloud infrastructure: configure the metadata service to require session tokens (AWS IMDSv2) — harder to exploit via SSRF than IMDSv1.
- Apply network-level controls: firewall rules restricting the application server from making outbound requests to internal services.
- Log all outbound requests from the server — monitor for requests to unexpected internal addresses.

---

## References

- OWASP Top 10 2021: https://owasp.org/Top10/
- CWE (Common Weakness Enumeration): https://cwe.mitre.org/
- OWASP Testing Guide v4: https://owasp.org/www-project-web-security-testing-guide/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- NIST National Vulnerability Database (NVD): https://nvd.nist.gov/
