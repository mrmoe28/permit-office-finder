# 🔒 Secrets Protection Rule

## **RULE: NEVER Commit Secrets to Git**

**ALWAYS** protect sensitive information from being committed to version control.

### ✅ **Correct Approach:**
1. Use `.env` files for local development
2. Add `.env*` to `.gitignore`
3. Use placeholder values in documentation
4. Set real values in deployment platforms (Vercel, etc.)
5. Use GitHub Secrets for CI/CD

### ❌ **Incorrect Approach:**
1. Commit actual API keys, tokens, or secrets
2. Put real credentials in documentation
3. Hardcode secrets in source code
4. Ignore `.gitignore` patterns

## **Implementation:**

### 1. Always Use Placeholders in Documentation
```bash
# ✅ CORRECT - Use placeholders
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# ❌ WRONG - Never use real values
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_actual_key_here
CLERK_SECRET_KEY=sk_test_actual_secret_here
```

### 2. Environment Files Structure
```
project/
├── .env.example          # Template with placeholders
├── .env.local           # Local development (gitignored)
├── .env                 # Local development (gitignored)
└── .gitignore           # Must include .env*
```

### 3. Gitignore Protection
```gitignore
# Environment variables
.env
.env.local
.env.development
.env.production
.env.*.local
.env.*.development
.env.*.production

# API keys and secrets
*.key
*.pem
secrets/
credentials/
```

### 4. Documentation Template
```markdown
## Environment Variables

Set these in your `.env.local` file:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

**Get your keys from:**
- Clerk: https://dashboard.clerk.com
- Google: https://console.cloud.google.com
```

## **This rule prevents:**
- ✅ Accidental secret exposure
- ✅ GitHub push protection violations
- ✅ Security vulnerabilities
- ✅ Credential theft
- ✅ Repository compromise

## **When you need to set real values:**
1. **Local Development**: Use `.env.local` (gitignored)
2. **Vercel Deployment**: Set in Vercel dashboard
3. **GitHub Actions**: Use repository secrets
4. **Team Sharing**: Share `.env.example` with placeholders

## **Emergency Response:**
If secrets are accidentally committed:
1. **IMMEDIATELY** revoke the exposed credentials
2. Remove from git history: `git filter-branch` or `BFG Repo-Cleaner`
3. Force push: `git push --force-with-lease`
4. Regenerate new credentials
5. Update all environments with new values
