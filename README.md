# Web3-Claude Configuration Template

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, reusable Claude Code configuration template for React + Web3 + React Query projects. This template provides specialized agents, workflows, and documentation to accelerate Web3 application development with AI assistance.

## 🚀 Quick Start

1. Copy the `.claude` folder to your project root
2. Follow the [portability guide](.claude/docs/portability-guide.md) to customize for your project
3. Run `/skill-sync all` to regenerate project-specific files

> **Using this template?** See [.claude/docs/portability-guide.md](.claude/docs/portability-guide.md) for detailed instructions on what's reusable, what needs parameterization, and what must be regenerated.

## ⚠️ Security Notice

**Before using in production:**
- Never commit API keys, secrets, or private keys
- Review `.gitignore` to ensure sensitive files are excluded
- Read [SECURITY.md](SECURITY.md) for security best practices
- Use environment variables for all sensitive configuration

## 📁 Repository Structure

| File / Directory | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `.claude/CLAUDE.md`      | Project instructions loaded automatically every conversation |
| `.claude/settings.json`  | Pre-allowed permissions to reduce prompts                    |
| `.claude/hooks.json`     | Automatic actions (currently: Prettier on file save)         |
| `.claude/commands/`      | Simple slash commands for common workflows                   |
| `.claude/skills/`        | Specialized agents and complex workflow skills               |
| `.claude/docs/`          | Shared reference documents (single source of truth)          |

---

## Architecture

### Shared Reference Documents (`docs/`)

These are the **single source of truth** for project knowledge. Skills reference them instead of embedding duplicate content.

| Document                           | Contents                                             |
| ---------------------------------- | ---------------------------------------------------- |
| `docs/project-rules.md`            | All coding rules, safety patterns, anti-patterns     |
| `docs/component-reference.md`      | Common component APIs and usage examples             |
| `docs/theme-reference.md`          | Full palette and typography tables                   |
| `docs/data-patterns.md`            | Ponder query patterns, blockchain write templates    |
| `docs/portability-guide.md`        | Guide for porting .claude to new projects            |
| `docs/PROTOCOL_SPECIFICATION.md`   | Protocol-level entity design (project-specific)      |

### Agent Hierarchy

```
agent-orchestrator .............. Top-level task routing
├── ui-designer ................ All UI changes, layout, visual design
│   ├── ui-design-specialist ... Anti-slop design critic (read-only)
│   ├── theme-ui-specialist .... Palette, typography, styled(), MUI overrides
│   └── react-specialist ....... Component logic, hooks, state, performance
├── web3-implementer ........... All blockchain + ponder data work
│   ├── wagmi-specialist ....... Contract reads/writes, tx lifecycle, viem
│   └── react-query-specialist . Cache strategy, query keys, invalidation
└── typescript-specialist ...... Advanced types, generics, type safety (shared)
```

### Standalone Workflow Skills

These are user-invoked skills that span domains (not part of the agent hierarchy):

| Skill              | Type   | Purpose                                                       |
| ------------------ | ------ | ------------------------------------------------------------- |
| `/analyze-theme`   | Inline | Theme compliance auditor                                      |
| `/verify-app`      | Fork   | Comprehensive verification (typecheck, lint, build, security) |
| `/code-simplifier` | Fork   | Post-implementation cleanup                                   |
| `/skill-sync`      | Inline | Sync .claude knowledge files with codebase                    |
| `/new-component`   | Inline | Component scaffold following project conventions              |
| `/new-hook`        | Inline | Hook scaffold with layer-appropriate templates                |

---

## Commands

Simple slash commands in `commands/`. Type `/command-name` to invoke.

| Command              | Purpose                              |
| -------------------- | ------------------------------------ |
| `/verify`            | Run typecheck, lint, prettier, build |
| `/fix-lint`          | Auto-fix linting and formatting      |
| `/fix-number-format` | Fix number formatting anti-patterns  |
| `/commit-push-pr`    | Commit, push, and create PR          |
| `/update-contracts`  | Update contract ABIs and addresses   |
| `/verify-ui`         | UI verification checklist            |

---

## Recommended Workflows

### Standard Feature Development

1. Start in **Plan mode** (Shift+Tab twice)
2. Discuss and refine the plan with Claude
3. Switch to normal mode and implement
4. Run `/verify` to check for issues
5. Run `/code-simplifier` to clean up
6. Run `/commit-push-pr` to ship

### Quick Fix

1. Make the fix
2. Run `/fix-lint`
3. Run `/commit-push-pr`

### Pre-Release Check

1. Run `/verify-app` for comprehensive verification
2. Address any issues found
3. Run `/commit-push-pr`

### Theme Audit

1. Run `/analyze-theme` to find violations
2. Review the report and choose fix scope
3. Run `/verify` after fixes

---

## Customization

### Adding New Skills

Use `/skills-creator` to create new skills. It guides you through requirements gathering, design review, and agent hierarchy integration.

### Adding New Commands

Create a `.md` file in `commands/`. The filename becomes the command name. Use commands for simple workflows (< 50 lines, no domain knowledge, no supporting files).

### Updating Project Context

- **CLAUDE.md**: Quick reference card, top rules, slash command table
- **docs/project-rules.md**: All detailed coding rules and conventions
- **docs/component-reference.md**: Common component API reference
- **docs/theme-reference.md**: Palette and typography lookup tables

### Hooks

Edit `hooks.json` to add automatic actions. Available hooks: `PostToolUse`, `PreToolUse`, `Stop`.

---

## Porting to New Projects

This `.claude` folder is **~85% reusable** for any React + wagmi + Ponder project with the same design system approach.

### What's Universal (Copy As-Is)

- All QA skills (visual-qa, accessibility, responsive, performance)
- All design philosophy skills (ui-design-specialist, ui-design-jony-ive, design-dialogue)
- All refactoring specialists
- Core workflow skills (verify, code-simplifier, skills-creator)
- Permission settings (settings.json, hooks.json)

### What Needs Entity Name Replacement

- CLAUDE.md, README.md, project-rules.md
- agent-orchestrator files
- web3-implementer files
- Hook pattern examples

Replace entity placeholders with your domain entities.

### What Must Be Regenerated

Run `/skill-sync all` after copying the skill-sync folder — it handles all of these:

- `.claude/docs/theme-reference.md` — from `themeConfig.tsx`
- `ponder-schema-specialist/schema-reference.md` — from `ponder.schema.ts`
- `wagmi-specialist/hook-reference.md` — from `src/hooks/blockchain/`
- `wagmi-specialist/contracts-reference.md` — from `generated.ts`
- `web3-implementer/ponder-reference.md` — from `src/hooks/ponder/`
- `typescript-specialist/type-index.json` — from `src/types/`
- `skills/routes.json` — from router config + `src/pages/`

### Quick Start: Setup Prompt

After copying `.claude` to a new project, invoke `/skills-creator setup` and tell it about your project:

**New protocol (different entities):**

```
/skills-creator setup

I copied this .claude folder from another project. This is a new lending
protocol called "Aqueduct". My primary entity is "pool" and secondary
entity is "aggregator". Same tech stack: React + wagmi + Ponder + MUI.
```

**Same protocol family (shared indexer/contracts):**

```
/skills-creator setup

I copied this .claude folder from a sibling app. This project shares the
same ponder.schema.ts and generated.ts (same indexer and contracts). Same
entities, just different theme and pages.
```

### Full Guide

See **[.claude/docs/portability-guide.md](.claude/docs/portability-guide.md)** for:

- Complete file-by-file classification
- Step-by-step setup instructions
- Same-family setup (shared indexer/contracts)
- Architectural patterns reference
- Setup checklist

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

Please review our [Security Policy](SECURITY.md) before using this template in production. Never commit secrets, API keys, or private keys to your repository.

## 💡 Support

- 📚 Read the [documentation](.claude/docs/)
- 🐛 Report bugs via [GitHub Issues](https://github.com/gwpjp/Web3-Claude/issues)
- 💬 Share your experience and improvements

---

**Note**: This is a configuration template for Claude Code. It does not contain application code, but rather AI agent configurations and workflows to assist in Web3 development.
