# Application Security — Assess Mode

## Goal
Produce a structured security risk assessment of a feature, code change, or architecture. Be specific about vulnerabilities, their severity, and how to fix them.

## Steps

1. **Understand what's being assessed** — if not clear, ask:
   - What does the feature do? (auth, file upload, API endpoint, payment, etc.)
   - Is any code available to review?
   - What data does it handle? (user data, payment data, files, admin operations?)
   - What's the technology stack?

2. **Load knowledge files**:
   - Always load `knowledge/owasp-top-10.md`
   - Load `knowledge/auth-patterns.md` if auth/session/JWT/OAuth is involved
   - Load `knowledge/secure-coding.md` if the question involves input handling, secrets, or coding practices

3. **Map the feature to OWASP categories** — go through the Top 10 and identify which apply. Not all 10 will apply to every feature — focus on the relevant ones.

4. **Produce the assessment** using the output format below.

---

## Output format

```markdown
# Security Assessment: [Feature / Component Name]

## Summary
[1–2 sentences: overall risk level and the most critical issues]

---

## Risk Level
**[CRITICAL / HIGH / MEDIUM / LOW]**

---

## Identified Risks

### 🔴 Critical / High

**[Risk Name] — [OWASP Category if applicable]**
- **Description**: [What the vulnerability is]
- **Impact**: [What an attacker could do if they exploited this]
- **Mitigation**: [Specific fix]

[Repeat for each high/critical risk]

### 🟡 Medium

**[Risk Name]**
- **Description**: [What the vulnerability is]
- **Impact**: [What could happen]
- **Mitigation**: [Specific fix]

### 🟢 Low / Best Practice

**[Risk Name]**
- **Description**: [What could be improved]
- **Mitigation**: [What to do]

---

## OWASP Top 10 Coverage

| Category | Applies | Finding |
|---|---|---|
| A01 Broken Access Control | Yes/No | [Summary or "None identified"] |
| A02 Cryptographic Failures | Yes/No | [Summary] |
| A03 Injection | Yes/No | [Summary] |
| A04 Insecure Design | Yes/No | [Summary] |
| A05 Security Misconfiguration | Yes/No | [Summary] |
| A06 Vulnerable Components | Yes/No | [Summary] |
| A07 Auth Failures | Yes/No | [Summary] |
| A08 Integrity Failures | Yes/No | [Summary] |
| A09 Logging Failures | Yes/No | [Summary] |
| A10 SSRF | Yes/No | [Summary] |

---

## Recommended Actions (Prioritised)

1. [Most urgent fix]
2. [Second most urgent]
3. ...
```

---

## Severity guidance

**Critical**: Exploitable remotely, no authentication required, leads to data breach, RCE, or full account takeover. Fix before any production traffic.

**High**: Requires authentication or specific conditions to exploit, but leads to significant data exposure, privilege escalation, or bypass of security controls. Fix before launch.

**Medium**: Limited impact, requires specific conditions, or the attack surface is narrow. Fix in next sprint.

**Low / Best Practice**: Defence in depth improvements, logging improvements, minor hardening. Fix in backlog.
