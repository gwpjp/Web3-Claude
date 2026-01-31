# Ralph Loop Guardrails

Complete safety checklist and recommended configuration for autonomous Ralph Loop operation.

## Pre-Flight Checklist

Before starting any ralph-loop:

- [ ] **Not on main/master branch** - Create a feature branch first
- [ ] **Sandbox enabled** - Run `/sandbox` for OS-level isolation
- [ ] **Deny rules configured** - Check `.claude/settings.json`
- [ ] **Max iterations set** - Always specify (default: 3)
- [ ] **Clear completion criteria** - Task has measurable exit condition

## Recommended Deny Rules

These rules should be in `.claude/settings.json`:

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(chmod 777 *)",
      "Read(.env)",
      "Read(.env.*)",
      "Read(.aws/**)",
      "Read(.ssh/**)",
      "Read(**/*credentials*)",
      "Read(**/*secret*)",
      "Read(.git/config)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Bash(nc *)",
      "Bash(netcat *)",
      "Bash(*> /dev/tcp/*)",
      "Bash(npm publish*)",
      "Bash(yarn publish*)",
      "Bash(git push *)",
      "Bash(git push)",
      "WebFetch"
    ]
  }
}
```

### Rule Categories

| Category            | Rules                                                     | Purpose                            |
| ------------------- | --------------------------------------------------------- | ---------------------------------- |
| **Destructive ops** | `rm -rf`, `sudo`, `chmod 777`                             | Prevent filesystem damage          |
| **Secrets**         | `.env`, `.aws/**`, `.ssh/**`, `*credentials*`, `*secret*` | Protect sensitive data             |
| **Network**         | `curl`, `wget`, `nc`, `netcat`, `/dev/tcp`, `WebFetch`    | Prevent data exfiltration          |
| **Publishing**      | `npm publish`, `yarn publish`                             | Prevent accidental releases        |
| **Git push**        | `git push`                                                | Force manual review before pushing |

## Layer Defense

Ralph Loop uses four layers of protection:

```
┌─────────────────────────────────────┐
│  Layer 1: Branch Guard              │  ← Blocks main/master
├─────────────────────────────────────┤
│  Layer 2: Deny Rules                │  ← Blocks dangerous operations
├─────────────────────────────────────┤
│  Layer 3: Sandbox (OS-level)        │  ← Filesystem/network isolation
├─────────────────────────────────────┤
│  Layer 4: Max Iterations            │  ← Prevents infinite loops
└─────────────────────────────────────┘
```

### Why All Four?

| Layer          | What It Catches                                       |
| -------------- | ----------------------------------------------------- |
| Branch guard   | Accidental changes to production code                 |
| Deny rules     | Known dangerous operations                            |
| Sandbox        | Unknown/novel dangerous operations (defense in depth) |
| Max iterations | Stuck loops, impossible tasks                         |

## Safe Iteration Limits

| Task Type                      | Recommended Max          |
| ------------------------------ | ------------------------ |
| Simple fix (typo, small bug)   | 3                        |
| Single component/feature       | 5-10                     |
| Multi-file refactor            | 10-15                    |
| Complex feature implementation | 15-20                    |
| Large-scale changes            | 20-30 (use with caution) |

## Prompt Template

Use this template for well-structured ralph-loop tasks:

```
<task description - specific and measurable>

Requirements:
- Requirement 1
- Requirement 2
- Requirement 3

Verification:
- yarn typecheck must pass
- yarn lint must pass
- yarn build must succeed

After <N> iterations without completion:
- Document what's blocking progress
- List what was attempted
- Suggest alternative approaches

Output <promise>DONE</promise> when all requirements are met and verification passes.
```

## Emergency Stop

If ralph-loop becomes stuck or behaves unexpectedly:

1. Run `/ralph-loop:cancel` (or `/cancel-ralph` directly)
2. If that fails, press `Ctrl+C` to interrupt
3. Review changes with `git diff`
4. Discard unwanted changes with `git checkout .` (if needed)

## What Ralph CAN Do (with guardrails)

- Read and write files in the project directory
- Run yarn/npm scripts (dev, build, test, lint)
- Git operations: add, commit, status, diff, branch, checkout
- Create new files and directories
- Modify existing code

## What Ralph CANNOT Do (blocked by deny rules)

- Push to remote repositories
- Publish packages
- Read secrets/credentials
- Make network requests to external servers
- Run destructive shell commands
- Access files outside the sandbox
