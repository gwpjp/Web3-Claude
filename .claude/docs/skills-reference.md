# Skills Reference

## Commands (Simple Workflows)

| Command              | Purpose                             |
| -------------------- | ----------------------------------- |
| `/fix-lint`          | Fix linting and formatting          |
| `/fix-number-format` | Fix number formatting anti-patterns |
| `/commit-push-pr`    | Commit, push, and create PR         |
| `/update-contracts`  | Update contract ABIs and addresses  |
| `/verify-ui`         | UI verification checklist           |

## Skills (User-Invocable)

| Skill            | Purpose                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `/verify`        | Run typecheck, lint, prettier (auto-fix), build                    |
| `/analyze-theme` | Find theme violations (hardcoded colors, fonts)                    |
| `/verify-app`    | Comprehensive verification with code quality + security            |
| `/skill-sync`    | Sync .claude knowledge files with codebase                         |
| `/new-component` | Scaffold new React component                                       |
| `/new-hook`      | Scaffold new custom hook                                           |
| `/monitor`       | Safety monitor -- catches destructive commands, malicious packages |

## Agents (Auto-Delegated via Agent Orchestrator)

| Agent                    | Purpose                                                 |
| ------------------------ | ------------------------------------------------------- |
| `visual-qa`              | Visual QA in Chrome -- bugs, console errors, network    |
| `accessibility-auditor`  | A11y audit -- ARIA labels, keyboard nav, focus mgmt     |
| `responsive-tester`      | Test app at mobile/tablet/desktop breakpoints           |
| `performance-auditor`    | Measure load times, network efficiency, CWV             |
| `form-edge-case-tester`  | Test form validation, edge cases, error recovery        |
| `code-simplifier`        | Post-implementation cleanup and simplification          |
