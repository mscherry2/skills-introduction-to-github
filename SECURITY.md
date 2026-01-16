# Security Guidelines

## Protecting API Keys and Secrets

This document outlines best practices for handling sensitive information like API keys, tokens, and other secrets in this repository.

### ⚠️ Never Commit Secrets

**DO NOT** commit the following to the repository:
- API keys (OpenAI, AWS, Google Cloud, etc.)
- Authentication tokens
- Passwords
- Private keys (.key, .pem files)
- Database credentials
- Any other sensitive information

### ✅ Best Practices

1. **Use Environment Variables**
   - Store secrets in `.env` files (which are gitignored)
   - Copy `.env.example` to `.env` and fill in your actual values
   - Never commit your `.env` file

2. **Use GitHub Secrets**
   - For GitHub Actions workflows, use [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
   - Configure secrets in repository settings under Settings > Secrets and variables > Actions

3. **Rotate Compromised Keys Immediately**
   - If you accidentally commit a secret, assume it's compromised
   - Immediately revoke/rotate the key through the service provider
   - Remove it from git history (consider using tools like [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/))

4. **Use Secret Scanning**
   - Enable [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
   - Review and act on any alerts promptly

### 📝 What to Do If You Commit a Secret

1. **Revoke the secret immediately** through your service provider
2. **Generate a new key/token**
3. **Remove the secret from git history**
4. **Update your `.env` file** with the new secret

### 🔒 Example: Using Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values
# This file is gitignored and won't be committed
```

In your code:
```javascript
// Load environment variables
require('dotenv').config();

// Use the API key
const apiKey = process.env.OPENAI_API_KEY;
```

```python
# Load environment variables
import os
from dotenv import load_dotenv

load_dotenv()

# Use the API key
api_key = os.getenv('OPENAI_API_KEY')
```

### 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Git Secret](https://git-secret.io/) - A tool for encrypting secrets in git
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - Remove secrets from git history

## Reporting Security Issues

If you discover a security vulnerability in this repository, please report it by creating a security advisory or contacting the repository maintainers directly.
