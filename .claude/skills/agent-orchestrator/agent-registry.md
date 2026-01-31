# Agent Registry

Complete inventory of all agents, their capabilities, sub-agent relationships, and managed knowledge files. This is the authoritative reference for the agent-orchestrator.

## Agent Hierarchy

```
agent-orchestrator
├── ui-designer
│   ├── design-dialogue (orchestrates design critic dialogue)
│   │   ├── ui-design-specialist (anti-slop critic, read-only)
│   │   ├── ui-design-jony-ive (Jony Ive consultant, read-only)
│   │   └── theme-ui-specialist (theme knowledge, shared)
│   ├── theme-ui-specialist
│   ├── react-specialist
│   ├── visual-qa (Chrome visual QA, read-only)
│   │   ├── visual-qa-chrome-profiler (Chrome DevTools Performance panel)
│   │   ├── visual-qa-react-devtools-profiler (React DevTools Profiler)
│   │   ├── visual-qa-lighthouse (Lighthouse performance audits)
│   │   └── visual-qa-react-analyzer (static React anti-pattern detection)
│   └── ui-refactor-specialist (auto-invoked after UI work)
├── web3-implementer
│   ├── ponder-schema-specialist (schema reference, read-only)
│   ├── wagmi-specialist
│   ├── react-query-specialist
│   └── code-refactor-specialist (auto-invoked after hook work)
├── typescript-specialist (shared across both trees)
│   └── types-refactor-specialist (auto-invoked after type work)
└── ralph-loop (autonomous loops, user-invoked only)
```

## Agent Profiles

### `/ui-designer` -- UI Orchestrator

**Role:** Primary entry point for ALL UI changes. Orchestrates theme and React sub-agents.

**Owns:**

- Layout composition, visual hierarchy, spacing
- Component selection and arrangement
- Responsive behavior and breakpoints
- Animation and motion decisions
- Design system decisions

**Sub-agents:**

- `/design-dialogue` -- Design critic dialogue orchestrator. Invokes `/ui-design-specialist` and `/ui-design-jony-ive` as sub-agents, facilitates multi-round dialogue between them, and returns unified recommendations. Invoked on every UI task before implementation.
- `/theme-ui-specialist` -- Palette, typography, `styled()`, MUI overrides, component styling
- `/react-specialist` -- Component logic, hooks, state management, performance
- `/visual-qa` -- Chrome visual QA inspector (read-only, invoked after UI changes)
- `/ui-refactor-specialist` -- Auto-invoked after UI implementation. Extracts duplicate JSX, enforces Common components.

**Knowledge files:**
| File | Purpose |
|------|---------|
| `ui-designer/design-patterns.md` | Concrete UI patterns (page layouts, card sections, form patterns, motion config) |

**When to invoke:**

- Any new page, section, or component creation
- Layout changes or responsive adjustments
- Component redesign or visual updates
- Visual hierarchy or spacing adjustments

---

### `/design-dialogue` -- Design Critic Dialogue Orchestrator

**Role:** Orchestrates structured 2-3 round dialogue between `/ui-design-specialist` and `/ui-design-jony-ive`. Facilitates genuine back-and-forth debate and returns unified recommendations. Sub-agent of `/ui-designer`.

**Owns:**

- Multi-round design critique orchestration
- Passing outputs between Specialist and Jony for genuine dialogue
- Unified recommendation synthesis
- Documentation of creative tensions and evolved ideas
- Resolution of conflicts between perspectives

**Sub-agents:**

- `/ui-design-specialist` -- Anti-slop design critic (invoked for tactical distinctiveness review)
- `/ui-design-jony-ive` -- Jony Ive design consultant (invoked for holistic coherence review)
- `/theme-ui-specialist` -- Theme knowledge (invoked to provide palette/typography context to critics)

**Knowledge files:**
| File | Purpose |
|------|---------|
| `design-dialogue/dialogue-format.md` | Dialogue templates, good/bad examples, emergence signals |

**When to invoke:**

- **Every UI task** (always consulted by `/ui-designer` before implementation)
- When design review needs creative tension and refined thinking
- When unified recommendations are more valuable than separate critiques

**Constraints:**

- Read-only: reads code, does not write or modify files
- Produces dialogue record + unified recommendations
- Orchestrates actual sub-agent invocations (not embedded perspectives)
- Ideas should visibly evolve through the dialogue rounds

---

### `/ui-design-specialist` -- Anti-Slop Design Critic

**Role:** Design critic that reviews UI for generic "AI slop" patterns. Read-only sub-agent of `/design-dialogue`. Consults `/theme-ui-specialist` for theme knowledge.

**Owns:**

- Anti-slop review methodology (six dimensions: typography contrast, color commitment, layout dynamism, visual hierarchy, spatial rhythm, atmospheric depth)
- Design distinctiveness evaluation
- Creative alternative proposals using the project's actual theme values

**Consults:**

- `/theme-ui-specialist` -- For palette, typography, and component knowledge when proposing alternatives

**Knowledge files:**
| File | Purpose |
|------|---------|
| `ui-design-specialist/anti-slop-patterns.md` | Catalog of generic patterns and creative alternatives |

**When to invoke:**

- Invoked by `/design-dialogue` during the dialogue process
- Can be invoked directly for quick tactical checks (outside normal workflow)

**Constraints:**

- Read-only: reads code, does not write or modify files
- All suggestions must use actual theme values (consult `/theme-ui-specialist`)
- Returns structured critique to `/design-dialogue` for dialogue

---

### `/ui-design-jony-ive` -- Senior Design Consultant

**Role:** Senior design consultant embodying Jony Ive's philosophy. Reviews holistic product design for true simplicity, inevitability, and coherence. Read-only sub-agent of `/design-dialogue`. Consults `/theme-ui-specialist` for theme knowledge.

**Owns:**

- Holistic design coherence evaluation
- True simplicity assessment (essence, not just clutter removal)
- Design inevitability review ("of course" test)
- Care & craft evaluation (attention to detail)
- Refinement of `/ui-design-specialist` recommendations for global consistency

**Consults:**

- `/theme-ui-specialist` -- For understanding the design system when evaluating coherence

**Knowledge files:**
| File | Purpose |
|------|---------|
| `ui-design-jony-ive/design-philosophy.md` | Complete Jony Ive philosophy reference with quotes and principles |

**When to invoke:**

- Invoked by `/design-dialogue` during the dialogue process (receives Specialist's output)
- Can be invoked directly for quick holistic checks (outside normal workflow)

**Constraints:**

- Read-only: reads code, does not write or modify files
- All suggestions must serve the design's essence, not decoration
- Returns structured critique to `/design-dialogue` for dialogue

---

### `/theme-ui-specialist` -- Theme & Styling

**Role:** MUI theming, palette enforcement, Common component styling. Sub-agent of `/ui-designer`.

**Owns:**

- `src/theme/themeConfig.tsx` -- Theme configuration
- `src/theme/palette.d.ts` -- Palette type augmentations
- `src/theme/typography.d.ts` -- Typography type augmentations
- `src/components/Common/` styling aspects
- Theme compliance enforcement (no hardcoded colors/fonts)

**Knowledge files:**
| File | Purpose |
|------|---------|
| `docs/theme-reference.md` | Full palette, typography, and component override tables |
| `docs/component-reference.md` | Common component APIs (shared with `/react-specialist`) |

**When to invoke:**

- Palette or typography questions
- `styled()` component creation
- MUI theme override changes
- Theme compliance auditing
- Common component styling changes

---

### `/react-specialist` -- Component Logic

**Role:** React component architecture, hooks, state management, performance. Sub-agent of `/ui-designer`.

**Owns:**

- Component composition and architecture patterns
- Custom hook design (non-blockchain, non-ponder)
- State management (local state, containers)
- Performance optimization (memoization, lazy loading)
- Common component behavior and API design

**Knowledge files:**
| File | Purpose |
|------|---------|
| `docs/component-reference.md` | Common component APIs (shared with `/theme-ui-specialist`) |

**When to invoke:**

- Component architecture decisions
- Hook design (non-blockchain)
- State management patterns
- Performance optimization
- Reusable component design

---

### `/visual-qa` -- Chrome Visual QA Inspector

**Role:** Navigates the running app in Chrome to detect visual bugs, layout issues, console errors, and network failures. Read-only sub-agent of `/ui-designer`. Orchestrates performance profiling sub-agents.

**Owns:**

- Visual inspection of rendered pages in Chrome
- Console error detection and filtering
- Network request failure detection
- Screenshot-based visual regression awareness
- Coordination of performance profiling sub-agents

**Sub-agents:**

- `/visual-qa-chrome-profiler` -- Chrome DevTools Performance panel analysis
- `/visual-qa-react-devtools-profiler` -- React DevTools Profiler for component render analysis
- `/visual-qa-lighthouse` -- Lighthouse CLI performance audits
- `/visual-qa-react-analyzer` -- Static code analysis for React anti-patterns

**Knowledge files:** None (stateless inspector)

**When to invoke:**

- After implementing UI changes (to verify rendered output)
- After fixing visual bugs (to confirm the fix)
- On-demand full-app health checks
- When debugging rendering issues reported by users

**Constraints:**

- Read-only: inspects but never modifies code or app state
- Requires dev server running (always up; port in `vite.config.ts`). Never run `yarn dev`.
- Requires Chrome extension connected
- Requires wallet connected for data-dependent pages
- Reports findings but does not make design recommendations (that's `/ui-design-specialist`'s job)

---

### `/visual-qa-chrome-profiler` -- Chrome DevTools Performance Panel

**Role:** Chrome DevTools Performance panel specialist. Analyzes flame charts, FPS, CPU usage, timeline events, and Core Web Vitals. Sub-agent of `/visual-qa`.

**Owns:**

- Performance panel profiling (Main, Network, Frames, GPU, Interactions, Layout Shifts, Animations, Timings tracks)
- Flame chart analysis (call stack, duration, warnings)
- FPS and frame drop detection
- CSS selector stats analysis
- Core Web Vitals measurement (LCP, CLS, INP)
- CPU throttling configuration

**Knowledge files:** None (uses Chrome DevTools directly)

**When to invoke:**

- When `/visual-qa` detects slow page loads or interactions
- For deep browser-level performance profiling
- To analyze timeline events (Loading, Scripting, Rendering, Painting)
- To identify forced reflows and long tasks

**Constraints:**

- Read-only: profiles but never modifies code
- Uses production build (`yarn build && yarn preview` on port 4173)
- Requires Chrome extension connected

---

### `/visual-qa-react-devtools-profiler` -- React DevTools Profiler

**Role:** React DevTools Profiler specialist. Uses the React DevTools extension to analyze component render behavior, commit timings, and "Why did this render?" data. Sub-agent of `/visual-qa`.

**Owns:**

- React DevTools Profiler tab analysis
- Commit-based profiling (render duration per commit)
- "Why did this render?" analysis (props changed, state changed, parent re-rendered)
- React Performance Tracks (Scheduler track for React 19.2+)
- Component render count and timing

**Knowledge files:** None (uses React DevTools directly)

**When to invoke:**

- When `/visual-qa` detects sluggish UI or excessive re-renders
- To profile React component rendering behavior
- To identify components re-rendering unnecessarily
- After UI changes to verify render efficiency

**Constraints:**

- Read-only: profiles but never modifies code
- **Uses dev server** (always running; port in `vite.config.ts`) -- React profiling requires dev mode. Never run `yarn dev`.
- Requires React DevTools extension installed
- Focus on relative comparisons (dev mode has overhead)
- Does not make code changes -- delegates to `/react-specialist`

---

### `/visual-qa-lighthouse` -- Lighthouse Performance Audits

**Role:** Lighthouse performance audit specialist. Runs Lighthouse CLI to measure performance scores, Core Web Vitals, and identify optimization opportunities. Sub-agent of `/visual-qa`.

**Owns:**

- Lighthouse CLI execution and configuration
- Performance score analysis (0-100)
- Core Web Vitals metrics (FCP, LCP, TBT, CLS, Speed Index)
- Performance opportunities identification
- Performance diagnostics analysis

**Knowledge files:** None (uses Lighthouse CLI)

**When to invoke:**

- When `/visual-qa` needs comprehensive performance audit
- For baseline performance measurement
- To identify optimization opportunities (unused JS/CSS, render-blocking resources, etc.)
- Before/after performance optimization work

**Constraints:**

- Read-only: audits but never modifies code
- Uses production build (`yarn build && yarn preview` on port 4173)
- Requires Lighthouse CLI (globally installed)
- Performance-only audits (not accessibility, SEO, best practices)

---

### `/visual-qa-react-analyzer` -- Static React Anti-Pattern Detection

**Role:** Static React code analyzer for performance anti-patterns. Scans source code for patterns that cause unnecessary re-renders. Sub-agent of `/visual-qa`.

**Owns:**

- Static code analysis for React anti-patterns
- Detection of: inline objects/functions in props, missing memo, unstable hook deps, context provider issues
- Code pattern scanning via Grep/Glob
- Anti-pattern severity classification

**Knowledge files:**
| File | Purpose |
|------|---------|
| `visual-qa-react-analyzer/anti-patterns.md` | Complete catalog of React anti-patterns with detection patterns and fixes |

**When to invoke:**

- After `/visual-qa-react-devtools-profiler` identifies problem components
- For proactive code review of performance-sensitive components
- When investigating "Parent re-rendered" issues
- Before merging PRs with new components

**Constraints:**

- Read-only: analyzes but never modifies code
- Delegates fixes to `/react-specialist`
- Does not execute code or run the application
- Focus on patterns that cause re-renders, not general code quality

---

### `/web3-implementer` -- Blockchain Orchestrator

**Role:** Primary entry point for ALL blockchain and ponder-indexer work. Orchestrates wagmi and React Query sub-agents.

**Owns:**

- Ponder hooks (`src/hooks/ponder/`)
- Transform hooks (`src/hooks/blockchain/useGet*Live.ts`)
- Contract read hooks (`src/hooks/blockchain/useGet*.ts`)
- Contract write hooks (`src/hooks/blockchain/use[Action].ts`)
- Schema queries and data flow debugging
- Hook architecture decisions (which layer, what data source)

**Sub-agents:**

- `/ponder-schema-specialist` -- Schema reference (read-only): table lookups, column types, relationships, indexes
- `/wagmi-specialist` -- Complex tx state machines, Safe wallet, gas estimation
- `/react-query-specialist` -- Cache invalidation, staleTime/gcTime, query key architecture
- `/code-refactor-specialist` -- Auto-invoked after hook implementation. Consolidates duplicate hooks, extracts utils.

**Knowledge files:**
| File | Purpose |
|------|---------|
| `web3-implementer/ponder-reference.md` | Ponder schema overview, existing hook catalog, query patterns |
| `web3-implementer/hook-patterns.md` | Templates for creating ponder, transform, read, and write hooks |

**When to invoke:**

- New data hook creation (ponder or contract read)
- Transform hook creation (useGet\*Live)
- Contract write hook creation
- Ponder schema queries or debugging
- Data flow architecture decisions

---

### `/ponder-schema-specialist` -- Schema Reference

**Role:** Read-only Ponder schema reference agent. Answers questions about table structure, column types, relationships, indexes, and ID formats without requiring reads of the 2,900-line `ponder.schema.ts`. Sub-agent of `/web3-implementer`.

**Owns:**

- Schema knowledge: all ~70 tables, columns, types, indexes, relations
- Table/column lookups and relationship traversal
- ID format conventions and query pattern suggestions

**Knowledge files:**
| File | Purpose |
|------|---------|
| `ponder-schema-specialist/schema-reference.md` | Condensed schema reference (auto-generated from ponder.schema.ts) |

**When to invoke:**

- Schema questions ("What columns does X table have?")
- Table discovery ("Which table tracks liquidations?")
- Relationship queries ("How do I join table X to table Y?")
- Index availability checks ("Is there an index on entityId in events?")
- ID format lookups ("How do I construct a managerPosition ID?")

**Constraints:**

- Read-only: reads code and schema, does not write or modify files
- No hook creation or architecture decisions — delegates back to `/web3-implementer`
- Schema reference may lag behind source; verify with live schema when in doubt

---

### `/wagmi-specialist` -- Blockchain Interactions

**Role:** wagmi v3, viem v2, contract interactions, transaction lifecycle. Sub-agent of `/web3-implementer`.

**Owns:**

- `src/hooks/blockchain/services/` -- useContractWriteWithState, useSimulateContractWithAccount
- Contract read/write hook implementations
- Transaction state machine (TxType lifecycle)
- Safe wallet support
- Address safety patterns

**Knowledge files:**
| File | Purpose |
|------|---------|
| `wagmi-specialist/hook-reference.md` | Complete catalog of all blockchain hooks (reads, writes, queue, execute) |

**When to invoke:**

- Complex transaction flows or Safe wallet issues
- Gas estimation edge cases
- New contract interaction patterns
- ABI encoding/decoding
- Event log parsing

---

### `/react-query-specialist` -- Data Caching

**Role:** TanStack Query v5, caching strategies, query architecture. Sub-agent of `/web3-implementer`.

**Owns:**

- QueryClient configuration (`src/containers/providers.tsx`)
- Query key conventions and architecture
- Cache invalidation strategies
- staleTime/gcTime tuning

**Knowledge files:**
| File | Purpose |
|------|---------|
| `react-query-specialist/best-practices.md` | Query patterns, key conventions, invalidation strategies, anti-patterns |

**When to invoke:**

- Cache invalidation strategy design
- Query key architecture decisions
- staleTime/gcTime tuning
- Debugging stale data or refetch issues
- Query performance optimization

---

### `/typescript-specialist` -- Type System (Shared)

**Role:** Advanced TypeScript, full-stack type safety, domain types. Shared across both agent trees.

**Owns:**

- `src/types/` -- All domain type definitions and transform functions
- Type hierarchy (domain entity types)
- Ponder-to-domain transform functions
- Type augmentations for MUI theme

**Knowledge files:**
| File | Purpose |
|------|---------|
| `typescript-specialist/type-index.json` | Complete index of all types, interfaces, transforms in `src/types/` |
| `typescript-specialist/project-config.json` | TS config, path aliases, project conventions |

**Sub-agents:**

- `/types-refactor-specialist` -- Auto-invoked after type implementation work. Scans for duplicate types and inline types to extract.

**When to invoke:**

- New type definitions or modifications to `src/types/`
- Complex generics or type transforms
- Type errors that require architectural understanding
- bigint-to-number transform patterns

---

### `/ui-refactor-specialist` -- UI Component Refactoring

**Role:** Scans UI components for refactoring opportunities after implementation. Auto-invoked by `/ui-designer` after UI work completes. Sub-agent of `/ui-designer`.

**Owns:**

- Duplicate JSX pattern detection and extraction
- Common component enforcement (raw MUI → Common components)
- Styling pattern consistency (hardcoded values → theme refs)

**Knowledge files:** None (references shared docs)

**When to invoke:**

- **Auto-invoked** by `/ui-designer` after implementing UI changes
- Can be invoked manually for targeted refactoring scans

**Constraints:**

- Applies changes automatically (no approval step)
- Produces refactoring report
- Runs verification after changes (`yarn typecheck && yarn lint && yarn prettier && yarn build`)
- Threshold: 2+ duplicates for extraction, any raw MUI with Common equivalent

---

### `/code-refactor-specialist` -- Hook & Utility Refactoring

**Role:** Scans hooks and utilities for refactoring opportunities after implementation. Auto-invoked by `/web3-implementer` after hook work completes. Sub-agent of `/web3-implementer`.

**Owns:**

- Duplicate hook logic consolidation
- Utility function extraction from repeated inline code
- Hook composition opportunities (splitting monolithic hooks)

**Knowledge files:** None (references shared docs)

**When to invoke:**

- **Auto-invoked** by `/web3-implementer` after implementing hooks or utilities
- Can be invoked manually for targeted refactoring scans

**Constraints:**

- Applies changes automatically (no approval step)
- Produces refactoring report
- Runs verification after changes (`yarn typecheck && yarn lint && yarn prettier && yarn build`)
- Threshold: 2+ duplicates for consolidation, 3+ lines repeated 2+ times for extraction

---

### `/types-refactor-specialist` -- Type Definition Refactoring

**Role:** Scans type definitions for refactoring opportunities after implementation. Auto-invoked by `/typescript-specialist` after type work completes. Sub-agent of `/typescript-specialist`.

**Owns:**

- Duplicate type unification (extends, Pick, Omit)
- Inline type extraction to `src/types/`
- Type index maintenance (`type-index.json` updates)

**Knowledge files:** None (references shared docs)

**When to invoke:**

- **Auto-invoked** by `/typescript-specialist` after implementing types
- Can be invoked manually for targeted refactoring scans

**Constraints:**

- Applies changes automatically (no approval step)
- Produces refactoring report
- Runs verification after changes (`yarn typecheck && yarn lint && yarn prettier && yarn build`)
- Threshold: 2+ types with 80%+ overlap for unification, inline types used 2+ times or > 3 fields for extraction

---

## Standalone Workflow Skills

These are user-invoked workflow skills that span domains. They are NOT part of the agent hierarchy tree -- they are invoked directly via `/skill-name` and run independently.

| Skill                    | Type   | Purpose                                                                                                             |
| ------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------- |
| `/verify`                | Fork   | Lightweight verification -- typecheck, lint, prettier (auto-fix), build. Reports pass/fail, offers lint auto-fix    |
| `/analyze-theme`         | Inline | Theme compliance auditor -- finds hardcoded colors, fonts, weights across all components                            |
| `/verify-app`            | Fork   | Comprehensive verification -- typecheck, lint, prettier, build, code quality, security checks                       |
| `/code-simplifier`       | Fork   | Post-implementation cleanup -- removes unnecessary complexity, extracts repeated code                               |
| `/skill-sync`            | Inline | Knowledge file sync -- detects stale reference files and regenerates from source (hooks, types, schema, theme)      |
| `/new-component`         | Inline | Component scaffold -- creates typed React components following project conventions                                  |
| `/new-hook`              | Inline | Hook scaffold -- creates custom hooks with layer-appropriate templates                                              |
| `/visual-qa`             | Fork   | Visual QA -- navigates app in Chrome, detects visual bugs, console errors, network failures                         |
| `/accessibility-auditor` | Fork   | A11y audit -- checks ARIA labels, keyboard navigation, focus management via Chrome accessibility tree               |
| `/responsive-tester`     | Fork   | Responsive QA -- tests app at mobile/tablet/desktop breakpoints for layout issues                                   |
| `/performance-auditor`   | Fork   | Performance measurement -- page load timing, Core Web Vitals, network efficiency                                    |
| `/form-edge-case-tester` | Fork   | Form validation QA -- tests empty submits, boundary values, field interdependencies, error recovery                 |
| `/ralph-loop`            | Inline | Autonomous task loops -- start, cancel, status, help commands with safety guardrails (sandbox, deny rules, PR-only) |
| `/monitor`               | Inline | Safety monitor -- catches destructive commands, malicious packages, secrets exposure. Block and alert on danger.    |

**Note:** These skills reference shared docs (`docs/project-rules.md`, `docs/component-reference.md`, `docs/theme-reference.md`) for project conventions rather than embedding rules inline.

### `/ralph-loop` -- Autonomous Task Manager

**Role:** Manages the Ralph Wiggum plugin for autonomous task execution with safety guardrails.

**Commands:**

| Command              | Purpose                                   |
| -------------------- | ----------------------------------------- |
| `/ralph-loop:start`  | Pre-flight checks + start autonomous loop |
| `/ralph-loop:cancel` | Cancel active ralph loop                  |
| `/ralph-loop:status` | Check if ralph loop is active             |
| `/ralph-loop:help`   | Explain Ralph Loop and show usage         |

**Guardrails enforced:**

1. **Branch guard**: Cannot run on main/master (blocking)
2. **Sandbox check**: Warns if sandbox not enabled
3. **Deny rules**: Verifies `.claude/settings.json` has required protections
4. **Max iterations**: Always required (default: 3)

**Knowledge files:**
| File | Purpose |
|------|---------|
| `ralph-loop/guardrails.md` | Safety checklist, deny rules reference, prompt templates |

**When orchestrator proposes ralph-loop:**

- Task has clear, measurable completion criteria
- Task is self-contained (no ongoing user decisions needed)
- Task involves multiple files or iterative refinement
- User indicates desire for autonomous operation

**Constraints:**

- **Never auto-invoked** -- orchestrator proposes, user must confirm
- User must explicitly run `/ralph-loop:start`
- All four guardrail layers should be active for safe operation

## Knowledge File Update Matrix

Quick reference for which files need updating after common changes:

| Change Made                                                 | Files to Update                                          |
| ----------------------------------------------------------- | -------------------------------------------------------- |
| New ponder hook in `src/hooks/ponder/`                      | `web3-implementer/ponder-reference.md` (hook catalog)    |
| New transform hook in `src/hooks/blockchain/useGet*Live.ts` | `wagmi-specialist/hook-reference.md`                     |
| New contract read hook in `src/hooks/blockchain/useGet*.ts` | `wagmi-specialist/hook-reference.md`                     |
| New contract write hook in `src/hooks/blockchain/use*.ts`   | `wagmi-specialist/hook-reference.md`                     |
| New/modified type in `src/types/`                           | `typescript-specialist/type-index.json`                  |
| New Common component in `src/components/Common/`            | `docs/component-reference.md`                            |
| Modified Common component API                               | `docs/component-reference.md`                            |
| New UI pattern established                                  | `ui-designer/design-patterns.md`                         |
| Design philosophy principles refined                        | `ui-design-jony-ive/design-philosophy.md`                |
| Dialogue format or examples refined                         | `design-dialogue/dialogue-format.md`                     |
| New query pattern or convention                             | `react-query-specialist/best-practices.md`               |
| New hook creation template                                  | `web3-implementer/hook-patterns.md`                      |
| Project config change (tsconfig, paths, etc.)               | `typescript-specialist/project-config.json`              |
| New ponder schema table                                     | `web3-implementer/ponder-reference.md` (schema overview) |
| Ponder schema change (any table/column/index/relation)      | Run `npx tsx scripts/generate-schema-reference.ts`       |
| Theme palette or typography change                          | `docs/theme-reference.md`                                |
| Project convention change                                   | `docs/project-rules.md`                                  |
| New React anti-pattern identified                           | `visual-qa-react-analyzer/anti-patterns.md`              |
| Ralph Loop guardrails or deny rules changed                 | `ralph-loop/guardrails.md`                               |

> **Tip:** Instead of manually updating these files, run `/skill-sync` to automatically detect stale files and regenerate them from source. See `skills/skill-sync/sync-targets.md` for detailed regeneration instructions.

## Cross-Agent Communication

### Data Flow

```
ponder.schema.ts (source of truth)
    ↓
Ponder Hook (src/hooks/ponder/) -- raw DB query
    ↓
Transform Hook (src/hooks/blockchain/) -- typed domain object
    ↓
Component (src/components/ or src/pages/) -- UI rendering
```

**Key rule:** Components only consume transform hooks. Never raw ponder hooks. Never direct contract reads.

### Agent Handoff Points

| From                     | To                                   | Handoff Point                                                                |
| ------------------------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| `/ui-designer`           | `/design-dialogue`                   | "Review this design" (every UI task, before impl)                            |
| `/design-dialogue`       | `/ui-design-specialist`              | "Provide anti-slop critique" (Round 1 opening)                               |
| `/design-dialogue`       | `/ui-design-jony-ive`                | "Respond to Specialist's critique" (Round 1 response, Round 2)               |
| `/design-dialogue`       | `/theme-ui-specialist`               | "Provide theme context" (shared knowledge for critics)                       |
| `/ui-design-specialist`  | `/theme-ui-specialist`               | "What are the actual palette/typography values?"                             |
| `/ui-design-jony-ive`    | `/theme-ui-specialist`               | "What does the design system allow?"                                         |
| `/ui-designer`           | `/visual-qa`                         | "Verify these UI changes render correctly in Chrome" (after implementing)    |
| `/ui-designer`           | `/web3-implementer`                  | "I need a hook that returns X data"                                          |
| `/web3-implementer`      | `/typescript-specialist`             | "I need a type definition for X"                                             |
| `/ui-designer`           | `/react-specialist`                  | "Build component logic for X layout"                                         |
| `/ui-designer`           | `/theme-ui-specialist`               | "Ensure X uses correct palette values"                                       |
| `/web3-implementer`      | `/ponder-schema-specialist`          | "What table/columns/indexes exist for X?"                                    |
| `/web3-implementer`      | `/wagmi-specialist`                  | "Handle the contract write for X"                                            |
| `/web3-implementer`      | `/react-query-specialist`            | "Design cache strategy for X"                                                |
| `/visual-qa`             | `/visual-qa-chrome-profiler`         | "Profile this page with Chrome DevTools Performance panel"                   |
| `/visual-qa`             | `/visual-qa-react-devtools-profiler` | "Analyze React component render behavior"                                    |
| `/visual-qa`             | `/visual-qa-lighthouse`              | "Run Lighthouse performance audit"                                           |
| `/visual-qa`             | `/visual-qa-react-analyzer`          | "Scan this component for React anti-patterns"                                |
| `/ui-designer`           | `/ui-refactor-specialist`            | "Scan for UI refactoring opportunities" (auto-invoked after UI impl)         |
| `/web3-implementer`      | `/code-refactor-specialist`          | "Scan for hook refactoring opportunities" (auto-invoked after hook impl)     |
| `/typescript-specialist` | `/types-refactor-specialist`         | "Scan for type refactoring opportunities" (auto-invoked after type impl)     |
| `agent-orchestrator`     | `/ralph-loop`                        | "This task is suited for autonomous execution" (propose only, user confirms) |

### Shared Resources

These resources are used across agent boundaries:

| Resource            | Location                                       | Used By                                             |
| ------------------- | ---------------------------------------------- | --------------------------------------------------- |
| ChainContainer      | `src/containers/ChainContainer.tsx`            | All agents (wallet/chain state)                     |
| Number formatting   | `src/utils/numberFormat.ts`, `NumberFormatter` | UI + data agents                                    |
| Time constants      | `src/utils/time.ts`                            | All agents                                          |
| nullAddress         | `src/utils/blockchain.ts`                      | Data agents                                         |
| Contract addresses  | `src/services/contracts/addresses/*.json`      | Data agents                                         |
| Generated ABIs      | `src/services/contracts/generated.ts`          | Data agents                                         |
| Ponder schema       | `src/services/ponder/ponder.schema.ts`         | Data agents                                         |
| Ponder client       | `src/services/ponder/ponderClient.ts`          | Data agents                                         |
| Project rules       | `docs/project-rules.md`                        | All agents (single source of truth for conventions) |
| Component reference | `docs/component-reference.md`                  | UI agents (Common component APIs)                   |
| Theme reference     | `docs/theme-reference.md`                      | UI agents (palette, typography tables)              |
| Data patterns       | `docs/data-patterns.md`                        | Data agents (Ponder query + write templates)        |
