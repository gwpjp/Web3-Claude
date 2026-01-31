# Extended Pattern Catalog

Detailed reference for dangerous patterns. Load this file when you need comprehensive pattern matching.

## Destructive Command Patterns

### File System Destruction

```bash
# CRITICAL - Block immediately
rm -rf /
rm -rf /*
rm -rf ~
rm -rf ~/*
rm -rf $HOME
rm -rf .
rm -rf ..
sudo rm -rf /
find / -delete
find . -delete -name "*"

# HIGH - Block unless explicitly requested
rm -rf node_modules .git  # Combined = unrecoverable
rm -rf *                   # In project root
rm -r * .*                 # Including hidden files
```

### Git History Destruction

```bash
# CRITICAL - Block on main/master
git push --force origin main
git push --force origin master
git push -f origin main
git push -f origin master

# HIGH - Block unless explicitly requested
git reset --hard HEAD~N    # Discards commits
git reset --hard origin/*  # Discards local work
git clean -fd              # Removes untracked files
git clean -fdx             # Also removes ignored files
git checkout -- .          # Discards all changes
git restore .              # Discards all changes (modern)
```

### System Damage

```bash
# CRITICAL - Always block
dd if=/dev/zero of=/dev/sda
dd if=/dev/random of=/dev/sda
mkfs.ext4 /dev/sda
fdisk /dev/sda
:(){ :|:& };:              # Fork bomb
chmod -R 777 /
chmod -R 777 ~
chown -R nobody /
```

### Database Destruction

```sql
-- CRITICAL - Block unless explicitly requested
DROP DATABASE
DROP TABLE
TRUNCATE TABLE
DELETE FROM table_name  -- Without WHERE clause
```

### Arbitrary Code Execution

```bash
# HIGH - Block from untrusted sources
curl http://... | bash
curl http://... | sh
wget http://... -O - | bash
wget http://... -O - | sh
eval "$(curl ...)"
```

## Malicious Package Patterns

### Known Typosquats

| Legitimate Package | Typosquat Variants |
|-------------------|-------------------|
| `electron` | `electorn`, `electon`, `electron-native`, `electronn` |
| `cross-env` | `cross-env.js`, `crossenv`, `cross-env-js` |
| `coffee-script` | `coffe-script`, `coffescript`, `coffee-scripts` |
| `lodash` | `lodahs`, `lodash-js`, `lodashs` |
| `express` | `expres`, `expresss`, `express-js` |
| `react` | `recat`, `reactjs`, `react-js` |
| `webpack` | `webpck`, `web-pack`, `webpackjs` |
| `babel` | `bable`, `babel-js`, `babels` |
| `eslint` | `eslint`, `es-lint`, `eslint-js` |
| `typescript` | `typescipt`, `type-script`, `typescripts` |
| `axios` | `axois`, `axios-js`, `axiosjs` |
| `moment` | `momnet`, `moment-js`, `momentjs` |
| `mongoose` | `mongose`, `mongoosejs`, `mongo-ose` |

### Suspicious Package Name Patterns

```regex
# Credential stealing indicators
.*-stealer$
.*-grabber$
.*-logger$
.*-dumper$
.*wallet.*hack.*
.*crypto.*steal.*
.*password.*grab.*
.*cookie.*extract.*

# Browser/system targeting
.*chrome.*extension.*inject.*
.*browser.*hijack.*
.*keylog.*
```

### Compromised Package Versions

| Package | Compromised Versions | Issue |
|---------|---------------------|-------|
| `event-stream` | 3.3.6 | Malicious flatmap-stream dependency |
| `colors` | 1.4.1+ | Intentional infinite loop |
| `faker` | 6.6.6+ | Intentional breaking change |
| `ua-parser-js` | 0.7.29, 0.8.0, 1.0.0 | Crypto miner injection |
| `coa` | 2.0.3+ | Malicious code injection |
| `rc` | 1.2.9+ | Malicious code injection |

### Post-Install Script Red Flags

Scripts that access:
- `~/.ssh/` - SSH keys
- `~/.aws/` - AWS credentials
- `~/.config/` - Application configs
- `~/Library/Application Support/Google/Chrome/` - Browser data (macOS)
- `~/.config/google-chrome/` - Browser data (Linux)
- `~/AppData/Local/Google/Chrome/` - Browser data (Windows)
- `~/.ethereum/` or `~/.config/ethereum/` - Ethereum wallets
- `~/Library/Keychains/` - macOS keychain
- Environment variables containing `KEY`, `SECRET`, `TOKEN`, `PASSWORD`

## Credential Exposure Patterns

### API Key Formats

```regex
# AWS
AKIA[0-9A-Z]{16}
aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}

# GitHub
ghp_[A-Za-z0-9]{36}
gho_[A-Za-z0-9]{36}
github_pat_[A-Za-z0-9]{22}_[A-Za-z0-9]{59}

# OpenAI
sk-[A-Za-z0-9]{48}

# Stripe
sk_live_[A-Za-z0-9]{24}
sk_test_[A-Za-z0-9]{24}
pk_live_[A-Za-z0-9]{24}
pk_test_[A-Za-z0-9]{24}

# Slack
xoxb-[0-9]{11}-[0-9]{11}-[A-Za-z0-9]{24}
xoxp-[0-9]{11}-[0-9]{11}-[A-Za-z0-9]{24}

# Google
AIza[0-9A-Za-z_-]{35}

# Twilio
SK[0-9a-fA-F]{32}

# SendGrid
SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}

# Generic patterns
api[_-]?key\s*[:=]\s*['"][A-Za-z0-9]{20,}['"]
secret[_-]?key\s*[:=]\s*['"][A-Za-z0-9]{20,}['"]
access[_-]?token\s*[:=]\s*['"][A-Za-z0-9]{20,}['"]
```

### Private Key Patterns

```
-----BEGIN RSA PRIVATE KEY-----
-----BEGIN DSA PRIVATE KEY-----
-----BEGIN EC PRIVATE KEY-----
-----BEGIN OPENSSH PRIVATE KEY-----
-----BEGIN PGP PRIVATE KEY BLOCK-----
-----BEGIN PRIVATE KEY-----
```

### Wallet/Crypto Patterns

```regex
# Ethereum private key (64 hex chars)
0x[a-fA-F0-9]{64}

# Bitcoin WIF
[5KL][1-9A-HJ-NP-Za-km-z]{50,51}

# Mnemonic phrases (12/24 words from BIP39 wordlist)
# Look for 12 or 24 space-separated lowercase words
```

### Environment Variable Exposure

```javascript
// DANGEROUS - logging all env vars
console.log(process.env)
console.log(JSON.stringify(process.env))
logger.info(process.env)

// DANGEROUS - specific sensitive vars in logs
console.log(process.env.API_KEY)
console.log(process.env.SECRET)
console.log(process.env.PASSWORD)
console.log(process.env.TOKEN)
console.log(process.env.PRIVATE_KEY)
```

### Connection String Patterns

```regex
# Database URLs with credentials
postgres://[^:]+:[^@]+@
mysql://[^:]+:[^@]+@
mongodb://[^:]+:[^@]+@
mongodb\+srv://[^:]+:[^@]+@
redis://:[^@]+@
```

## False Positive Exceptions

### Legitimate Cleanup Commands

```bash
# OK - common development cleanup
rm -rf node_modules
rm -rf dist
rm -rf build
rm -rf .next
rm -rf .cache
rm -rf coverage
rm -rf .turbo
rm -rf .parcel-cache
```

### Test/Mock Credentials

Files matching these patterns may contain fake credentials for testing:
- `*.test.*`
- `*.spec.*`
- `__tests__/*`
- `__mocks__/*`
- `fixtures/*`
- `test-data/*`
- Files containing `mock`, `fake`, `test`, `dummy`, `example` in variable names

### Documentation

Markdown files (`.md`) may reference credential patterns in documentation without actual credentials.

### Environment Variable References

```javascript
// OK - referencing env vars without exposing values
const apiKey = process.env.API_KEY
const config = { apiKey: process.env.API_KEY }
```

vs.

```javascript
// DANGEROUS - hardcoded values
const apiKey = "sk-abc123..."
const config = { apiKey: "sk-abc123..." }
```
