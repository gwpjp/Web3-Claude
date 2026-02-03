# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please follow these steps:

1. **Do NOT** open a public issue
2. Send a description of the vulnerability to the repository maintainers via GitHub's private vulnerability reporting feature
3. Include steps to reproduce the issue if possible
4. Allow time for the maintainers to address the issue before public disclosure

## Security Best Practices

This repository contains configuration templates for Claude Code. When using these templates:

### Never Commit Sensitive Data

- **API keys, tokens, and secrets**: Use environment variables (`.env` files) and ensure they are in `.gitignore`
- **Credentials**: Keep credentials in secure locations outside the repository
- **Private keys**: Never commit private keys, especially blockchain private keys
- **Environment files**: The `.gitignore` already excludes `.env*` files

### Configuration Files

The `.claude/settings.json` file includes deny rules to prevent accidental exposure of:
- Environment variables (`.env`, `.env.*`)
- AWS credentials (`.aws/**`)
- SSH keys (`.ssh/**`)
- Files containing "credentials" or "secret" in the name

### Before Making Your Repository Public

1. Review all files for hardcoded secrets
2. Check git history for accidentally committed secrets
3. Ensure `.gitignore` properly excludes sensitive files
4. Verify no personal information is committed
5. Review all documentation for sensitive information

## Supported Versions

This is a configuration template repository. Security updates will be applied to the main branch as needed.

## Security Features

The monitor skill (`/monitor`) included in this configuration helps detect:
- Destructive commands
- Malicious packages
- Secrets exposure attempts
- Dangerous operations

Use this skill when reviewing changes before committing.
