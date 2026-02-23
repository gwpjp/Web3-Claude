# Claude Project Instructions

## Quick Reference

- **Package manager:** `yarn` (never npm)
- **Dev server:** Always running. **Never start it yourself.**
- **Verify:** `yarn typecheck && yarn lint && yarn prettier && yarn build` -- ALL FOUR, every time
- **Theme:** `src/theme/themeConfig.tsx`
- **Chrome:** Tab is always open. Navigate directly.
- **Orchestration:** ALL planning and execution goes through `/agent-orchestrator`

## Guardrails (NEVER Override)

Hard prohibitions. Silently avoid. Warn the user if tempted to break one.

| #   | Guardrail |
| --- | --------- |
| G1  | **NEVER push or merge to main.** All merges via GitHub PRs by the user only. |
| G2  | **NEVER start the dev server** (`yarn dev`). It's already running. |
| G3  | **NEVER skip verification steps.** All four: typecheck, lint, prettier, build. |
| G4  | **NEVER plan or execute implementation directly.** Invoke `/agent-orchestrator`. |
| G5  | **NEVER use `npm`.** Only `yarn`. |
| G6  | **NEVER use `as Address` on potentially undefined values.** Use `!` (with enabled guard), `?? nullAddress`, or `as Address \| undefined`. |
| G7  | **NEVER use `useReadContract`/`useReadContracts` in components.** Create hooks in `src/hooks/blockchain/`. |
| G8  | **NEVER use raw Ponder hooks in components.** Use transform hooks (two-layer pattern). |
| G9  | **NEVER hardcode colors, fonts, or weights.** Use palette refs and Typography variants. |
| G10 | **NEVER use `any` type.** Explicit types always. |

## Just Act (Do Silently)

Mechanical rules with no ambiguity. Follow without explanation.

### Code Patterns

| Rule | Right | Wrong | Ref |
| ---- | ----- | ----- | --- |
| Number formatting | `<NumberFormatter preset="percent" />` | Custom formatter | [project-rules.md#4](docs/project-rules.md#4-number-formatting) |
| Common components | `CommonButton`, `CTAButton` | Raw MUI `Button` | [project-rules.md#10](docs/project-rules.md#10-common-components) |
| Blockchain actions | `CTAButton` | `CommonButton` for tx | [project-rules.md#10](docs/project-rules.md#10-common-components) |
| Input components | `CommonAmountInput`, `CommonTextInput` | Raw MUI `TextField` | [project-rules.md#10](docs/project-rules.md#10-common-components) |
| Chain data access | `ChainContainer.useContainer()` | `useAccount`, `useChainId` | [project-rules.md](docs/project-rules.md) |
| Time constants | `SECONDS_IN_A_DAY` from `utils/time.ts` | `days * 24 * 60 * 60` | [project-rules.md](docs/project-rules.md) |
| TypeScript interfaces | `interface` for objects, `type` for unions | Mixed usage | [project-rules.md](docs/project-rules.md) |
| Type imports | `import type { Foo }` | `import { Foo }` for types | [project-rules.md](docs/project-rules.md) |
| React Query | `usePonderQuery` for Ponder, `useQuery` for REST | `useMutation` for blockchain | [data-patterns.md](docs/data-patterns.md) |
| Query encapsulation | All queries in hooks with `enabled` guards | Queries in components | [data-patterns.md](docs/data-patterns.md) |
| Two-layer hooks | Component -> Transform Hook -> Ponder Hook | Component -> Ponder Hook | [project-rules.md#9](docs/project-rules.md#9-two-layer-hook-pattern) |
| Check before creating | Search `src/utils/`, `src/components/Common/` | Creating duplicates | -- |

### Session Workflows

| Trigger | Action |
| ------- | ------ |
| Session start | `bd list --json \| jq '[.[] \| {id,title,status,priority}]'` then `bd ready --json` |
| Discover bug/task | `bd create "description" -t type -p priority` immediately |
| Code change complete | Run all four verification commands |
| Session end | File issues -> verify -> push feature branch -> create PR -> `bd sync` |

## Act but Explain

Changes the user should know about. Proceed, then summarize what and why.

| Situation | Example |
| --------- | ------- |
| Cross-package refactor | Moving shared code between modules |
| Introducing new pattern | First use of a hook composition or utility pattern |
| Updating knowledge files | Adding entries to `.claude/knowledge/` |
| Modifying agent specs | Updating `.claude/agents/` definitions |
| Creating new hooks | Adding hooks in `src/hooks/blockchain/` |
| Resolving type conflicts | When generics or unions need restructuring |
| Applying Beads state changes | Closing, updating, or creating related beads |

## Ask First

Hard-to-reverse or high-impact changes. Stop, present options, wait for approval.

| Situation | Why |
| --------- | --- |
| Adding new dependencies | Affects bundle size, security surface |
| Changing public API contracts | Breaks consumers |
| Architecture changes | Hook patterns, state management, routing |
| Deleting files | May contain work-in-progress |
| Modifying CI/CD config | Affects all branches |
| Changing `.claude/CLAUDE.md` | Affects all agent behavior |
| Creating new agent specs | Expands agent hierarchy |
| Modifying security rules | Firestore, storage, RTDB |
| Force operations | `git reset`, `--force`, `--no-verify` |

## Agent Orchestrator

**The root agent MUST NOT plan or execute implementation work directly.**

- Invoke `/agent-orchestrator` for ANY non-trivial task
- Orchestrator selects agents from the [full hierarchy](docs/agent-hierarchy.md)
- Without it, Claude uses generic `Task` agents lacking domain expertise

## Verification

**Run ALL FOUR after ANY code change:**

```bash
yarn typecheck && yarn lint && yarn prettier && yarn build
```

For UI: Visually verify in the existing Chrome tab.

## Reference Documents

| Document | Contents |
| -------- | -------- |
| [docs/project-rules.md](docs/project-rules.md) | All coding rules, safety patterns, anti-patterns |
| [docs/theme-reference.md](docs/theme-reference.md) | Full palette and typography tables |
| [docs/data-patterns.md](docs/data-patterns.md) | Ponder query patterns, blockchain write templates |
| [docs/PROTOCOL_SPECIFICATION.md](docs/PROTOCOL_SPECIFICATION.md) | Protocol-level domain entity design |
| [docs/beads-patterns.md](docs/beads-patterns.md) | Beads memory patterns, decision tracking |
| [docs/skills-reference.md](docs/skills-reference.md) | Commands, skills, and agent catalog |
| [docs/agent-hierarchy.md](docs/agent-hierarchy.md) | Full agent orchestrator tree |
| [docs/session-workflow.md](docs/session-workflow.md) | Beads reference + session completion workflow |

## Session Memory (Beads)

Persistent memory via git-synced issue tracking. Treat bead lists as lightweight indexes.

```bash
# Session start
bd list --json | jq '[.[] | {id, title, status, priority}]'
bd ready --json

# Session end
bd create "..." -t type -p priority    # File discovered work
bd update <id> --status closed         # Close finished items
bd sync                                # Sync to git
```

Full reference: [docs/session-workflow.md](docs/session-workflow.md)

## Git Rules

- **NEVER push or merge to main.** Feature branches only. User merges via PRs.
- Sub-branches merge to parent branch, not main.
- Push feature branch + create PR before session ends.
- Work is NOT complete until `git push` succeeds.
- NEVER stop before pushing -- that strands work locally.

## Gotchas (Hard-Won Lessons)

1. **Dev server is running.** `yarn dev` will fail or create a conflicting instance.
2. **Data before UI.** Wire hooks and verify data flow before building components.
3. **Check existing code first.** `src/utils/`, `src/components/Common/` -- duplicates are the #1 review comment.
4. **File beads immediately.** If you discover a bug or task, `bd create` NOW, not "later."
5. **Sync beads before ending.** `bd sync` or changes stay local.
6. **Visually verify UI changes.** The Chrome tab is already open -- navigate and check.
