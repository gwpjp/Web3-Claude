# Claude Project Instructions

## Quick Reference

- **Package manager:** `yarn` (never npm)
- **Dev server:** Always running (port in `vite.config.ts` → `server.port`). **Never start it yourself.**
- **Verify:** `yarn typecheck && yarn lint && yarn prettier && yarn build`
- **Theme:** `src/theme/themeConfig.tsx` (shared across projects)
- **UI Testing:** Chrome tab is always open. Navigate directly -- don't launch browsers.

## Project Structure

```
src/
├── components/     # React components (use subfolders for groups)
├── hooks/          # Custom hooks
│   ├── blockchain/ # Contract write hooks + transform hooks
│   ├── ponder/     # Raw Ponder data hooks (never use in components)
│   └── ...         # Other hooks
├── pages/          # Route pages
├── types/          # TypeScript types + transformation functions
├── utils/          # Utility functions
├── services/       # External services, ABIs
└── config/         # Configuration
```

## Top 5 Rules

### 1. Address Type Safety

**Never use `as Address` on potentially undefined values.** Safe patterns:

- `value!` -- when `enabled` guard guarantees defined
- `value ?? nullAddress` -- fallback for contract simulation
- `value as Address | undefined` -- optional returns from hooks

See [docs/project-rules.md](docs/project-rules.md#3-address-type-safety) for full code examples.

### 2. Number Formatting

```typescript
<NumberFormatter value={0.08} preset="percent" />
displayNumber(1234.56, "currency")
```

Presets: `percent`, `currency`, `number`, `full`, `fullPercent`, `input`, `tooltip`.
Never create custom formatters. See [docs/project-rules.md](docs/project-rules.md#4-number-formatting).

### 3. Common Components Over Raw MUI

**Always check `src/components/Common/` before using raw MUI components.**

Key components: `CommonButton`, `CTAButton` (blockchain actions), `CommonCard`, `CommonDialog`, `CommonSearchInput`, `CommonTextInput`, `CommonAmountInput`, `CommonPercentInput`, `CommonAddressInput`, `CommonSelect`, `CommonMenuItem`, `CommonTooltip`, `TooltipIcon`, `CopyableAddress`, `TokenSymbol`, `NumberFormatter`.

See [docs/project-rules.md](docs/project-rules.md#10-common-components) for full mapping table.

### 4. Contract Reads in Hooks Only

**Never use `useReadContract` or `useReadContracts` in components or pages.**
Create hooks in `src/hooks/blockchain/`. See [docs/project-rules.md](docs/project-rules.md#8-contract-reads) for template.

### 5. Two-Layer Hook Pattern

Components use **transform hooks** (not raw Ponder hooks):

```
Component → Transform Hook (hooks/blockchain/) → Ponder Hook (hooks/ponder/)
            Returns typed domain object           Returns raw data
```

See [docs/project-rules.md](docs/project-rules.md#9-two-layer-hook-pattern) for architecture diagram.

## Additional Rules

- **TypeScript**: Explicit types, no `any`, `interface` for objects, `type` for unions, `import type` for type-only imports
- **MUI Theming**: Use palette refs (`bgcolor="paper.primary"`) and Typography variants, never hardcoded colors/fonts/weights. See [docs/theme-reference.md](docs/theme-reference.md).
- **Chain Data**: Always `ChainContainer.useContainer()`, never wagmi hooks (`useAccount`, `useChainId`) directly in components
- **Time Constants**: Use `SECONDS_IN_A_DAY` etc. from `src/utils/time.ts`, never hardcode calculations like `days * 24 * 60 * 60`
- **React Query**: `usePonderQuery` for Ponder data, `useQuery` for REST APIs, never `useMutation` for blockchain tx. Always use `enabled` guards. Encapsulate all queries in hooks.

Full details on all rules: [docs/project-rules.md](docs/project-rules.md)

## Verification

Always verify before completing a task:

1. `yarn typecheck`
2. `yarn lint`
3. `yarn prettier` (format all files)
4. `yarn build`
5. For UI: Visually verify in the existing Chrome tab (dev server is always running; port in `vite.config.ts`)

## Slash Commands & Skills

**Commands** (simple workflows):

| Command              | Purpose                             |
| -------------------- | ----------------------------------- |
| `/fix-lint`          | Fix linting and formatting          |
| `/fix-number-format` | Fix number formatting anti-patterns |
| `/commit-push-pr`    | Commit, push, and create PR         |
| `/update-contracts`  | Update contract ABIs and addresses  |
| `/verify-ui`         | UI verification checklist           |

**Skills** (complex, domain-aware):

| Skill                    | Purpose                                                 |
| ------------------------ | ------------------------------------------------------- |
| `/verify`                | Run typecheck, lint, prettier (auto-fix), build         |
| `/analyze-theme`         | Find theme violations (hardcoded colors, fonts)         |
| `/verify-app`            | Comprehensive verification with code quality + security |
| `/code-simplifier`       | Post-implementation cleanup and simplification          |
| `/skill-sync`            | Sync .claude knowledge files with codebase              |
| `/new-component`         | Scaffold new React component                            |
| `/new-hook`              | Scaffold new custom hook                                |
| `/visual-qa`             | Visual QA in Chrome -- bugs, console errors, network    |
| `/accessibility-auditor` | A11y audit -- ARIA labels, keyboard nav, focus mgmt     |
| `/responsive-tester`     | Test app at mobile/tablet/desktop breakpoints           |
| `/performance-auditor`   | Measure load times, network efficiency, CWV             |
| `/form-edge-case-tester` | Test form validation, edge cases, error recovery        |
| `/monitor`               | Safety monitor -- catches destructive commands, malicious packages |

## Agent Orchestrator (CRITICAL)

**For any non-trivial implementation task, invoke `/agent-orchestrator` FIRST.**

The agent-orchestrator provides access to the full skill hierarchy:

```
/agent-orchestrator
├── /ui-designer .............. All UI changes, layout, visual design
│   ├── /theme-ui-specialist .. Palette, typography, styled(), MUI
│   ├── /react-specialist ..... Component logic, hooks, state
│   └── /visual-qa ............ Chrome visual QA (after changes)
├── /web3-implementer ......... All blockchain + ponder data work
│   ├── /wagmi-specialist ..... Contract reads/writes, tx lifecycle
│   └── /react-query-specialist Cache strategy, query keys
└── /typescript-specialist .... Advanced types, generics (shared)
```

**Why this matters:** Without `/agent-orchestrator` loaded, Claude falls back to generic `Task` agents (`general-purpose`, `Explore`) which lack domain expertise, theme knowledge, and project conventions.

### Plan Execution Rule

When a plan is created (via `EnterPlanMode`), it **MUST** be executed with `/agent-orchestrator` loaded:

1. Plans should include: `> **Execution Requirement:** Before implementing, invoke /agent-orchestrator`
2. If context is cleared before execution, re-invoke `/agent-orchestrator` first
3. Never execute implementation plans with generic Task agents

**Anti-pattern:** Creating a plan with agent-orchestrator, clearing context, then executing with `general-purpose` Task agents.

## Reference Documents

| Document                                                                   | Contents                                             |
| -------------------------------------------------------------------------- | ---------------------------------------------------- |
| [docs/project-rules.md](docs/project-rules.md)                             | All coding rules, safety patterns, and anti-patterns |
| [docs/theme-reference.md](docs/theme-reference.md)                         | Full palette and typography tables                   |
| [docs/data-patterns.md](docs/data-patterns.md)                             | Ponder query patterns, blockchain write templates    |
| [docs/PROTOCOL_SPECIFICATION.md](docs/PROTOCOL_SPECIFICATION.md)           | Protocol-level domain entity design                  |

## Common Mistakes

- Running `yarn dev` or starting the dev server (it's already running -- just use the existing Chrome tab)
- Using `npm` instead of `yarn`
- Hardcoded colors/fonts (run `/analyze-theme`)
- Creating duplicate utilities (check `src/utils/` first)
- Custom number formatting (use `NumberFormatter` or `displayNumber`)
- Using wagmi directly (use `ChainContainer`)
- Using `useReadContract`/`useReadContracts` in components (create hooks in `src/hooks/blockchain/`)
- Using raw Ponder hooks (`usePonder*`) in components (use transform hooks like `useGet*Live`)
- Using raw MUI `Button` instead of `CommonButton` (check `src/components/Common/` first)
- Using `CommonButton` for blockchain actions instead of `CTAButton`
- Using raw MUI `TextField` instead of Common Input components (`CommonSearchInput`, `CommonAmountInput`, etc.)
- Using `as Address` to cast potentially undefined values (use `!` with enabled guards or `?? nullAddress`)
