# .claude Folder Portability Guide

This guide documents what's reusable, parameterized, and project-specific in the `.claude` folder. Use this when setting up a new React + wagmi + Ponder project with the same tech stack and design patterns.

## Target Stack Assumptions

This guide assumes the new project uses:

- **React 18+** with TypeScript
- **TanStack Query (React Query) v5** for data fetching/caching
- **wagmi v3 + viem v2** for blockchain interactions
- **Ponder indexer** with `@ponder/react` for indexed blockchain data
- **MUI v5+** with a custom theme (different colors/typography, same structure)
- **Vite** as build tool
- **yarn** as package manager

---

## Quick Classification

| Category             | Count     | Description                             |
| -------------------- | --------- | --------------------------------------- |
| **Copy as-is**       | ~25 files | Zero changes needed                     |
| **Parameterized**    | ~15 files | Replace entity names for your domain    |
| **Regenerate**       | ~5 files  | Run scripts or extract from source      |
| **Project-specific** | ~3 files  | Must rewrite for domain                 |

---

## File-by-File Classification

### Root Files

| File                  | Classification    | Notes                                               |
| --------------------- | ----------------- | --------------------------------------------------- |
| `CLAUDE.md`           | **PARAMETERIZED** | Update entity names in examples, hook names         |
| `README.md`           | **PARAMETERIZED** | Update project name, keep structure                 |
| `settings.json`       | **COPY**          | Permission rules are universal                      |
| `settings.local.json` | **COPY**          | Local override pattern                              |
| `hooks.json`          | **COPY**          | Prettier auto-format hook                           |

### Commands (`commands/`)

| File                   | Classification       | Notes                                       |
| ---------------------- | -------------------- | ------------------------------------------- |
| `fix-number-format.md` | **COPY**             | NumberFormatter pattern is universal        |
| `commit-push-pr.md`    | **COPY**             | Git workflow is universal                   |
| `update-contracts.md`  | **PROJECT-SPECIFIC** | Contract address paths are project-specific |

### Documentation (`docs/`)

| File                       | Classification       | Notes                                                   |
| -------------------------- | -------------------- | ------------------------------------------------------- |
| `project-rules.md`         | **PARAMETERIZED**    | Replace hook names in examples                          |
| `component-reference.md`   | **PARAMETERIZED**    | Common components likely same, update APIs if different |
| `theme-reference.md`       | **REGENERATE**       | Extract from new project's `themeConfig.tsx`            |
| `data-patterns.md`         | **COPY**             | Patterns are generic                                    |
| `PROTOCOL_SPECIFICATION.md`| **PROJECT-SPECIFIC** | Domain knowledge, delete or replace                     |

### Agents (`agents/`)

#### Domain Agents (`agents/domain/`) - MOSTLY COPY

| Agent                                  | Classification    | Notes                          |
| -------------------------------------- | ----------------- | ------------------------------ |
| `agents/domain/ui-designer.md`         | **COPY**          | Design patterns universal      |
| `agents/domain/theme-ui-specialist.md` | **COPY**          | MUI theming patterns universal |
| `agents/domain/react-specialist.md`    | **COPY**          | React patterns universal       |
| `agents/domain/design-dialogue.md`     | **COPY**          | Dialogue pattern universal     |
| `agents/domain/web3-implementer.md`    | **PARAMETERIZED** | Update table names in examples |
| `agents/domain/wagmi-specialist.md`    | **COPY**          | wagmi/viem patterns universal  |
| `agents/domain/ponder-schema-specialist.md` | **COPY**     | Pattern universal              |
| `agents/domain/react-query-specialist.md`   | **COPY**     | Query patterns universal       |
| `agents/domain/typescript-specialist.md`    | **COPY**     | TS patterns universal          |
| `agents/domain/code-refactor-specialist.md` | **COPY**     | Refactoring patterns universal |

#### Design Agents (`agents/design/`) - ALL COPY

| Agent                                        | Classification | Notes                        |
| -------------------------------------------- | -------------- | ---------------------------- |
| `agents/design/ui-design-specialist.md`      | **COPY**       | Anti-slop patterns universal |
| `agents/design/ui-design-jony-ive.md`        | **COPY**       | Philosophy universal         |

#### QA Agents (`agents/qa/`) - ALL COPY

All QA agents are **COPY** - they use Chrome/browser APIs, not project-specific code:

- `agents/qa/visual-qa.md`
- `agents/qa/visual-qa-chrome-profiler.md`
- `agents/qa/visual-qa-lighthouse.md`
- `agents/qa/visual-qa-react-devtools-profiler.md`
- `agents/qa/visual-qa-react-analyzer.md`
- `agents/qa/accessibility-auditor.md`
- `agents/qa/responsive-tester.md`
- `agents/qa/performance-auditor.md`
- `agents/qa/form-edge-case-tester.md` (update form field names)

**Exception:** `agents/qa/routes.json` is **PROJECT-SPECIFIC** - defines pages to test.

#### Refactor Agents (`agents/refactor/`) - ALL COPY

All refactoring agents are **COPY** - patterns are universal:

- `agents/refactor/ui-refactor-specialist.md`
- `agents/refactor/code-simplifier.md`
- `agents/refactor/types-refactor-specialist.md`

### Knowledge Files (`knowledge/`)

#### Domain Knowledge (`knowledge/domain/`)

| File                                         | Classification    | Notes                                 |
| -------------------------------------------- | ----------------- | ------------------------------------- |
| `knowledge/domain/hook-patterns.md`          | **PARAMETERIZED** | Templates generic, update table names |
| `knowledge/domain/ponder-reference.md`       | **REGENERATE**    | Catalog actual ponder hooks           |
| `knowledge/domain/hook-reference.md`         | **REGENERATE**    | Catalog actual blockchain hooks       |
| `knowledge/domain/contracts-reference.md`    | **REGENERATE**    | Summary of generated.ts ABIs         |
| `knowledge/domain/schema-reference.md`       | **REGENERATE**    | From ponder.schema.ts                 |
| `knowledge/domain/react-query-best-practices.md` | **COPY**     | Best practices universal              |
| `knowledge/domain/type-index.json`           | **REGENERATE**    | Index actual types                    |
| `knowledge/domain/project-config.json`       | **PARAMETERIZED** | Update paths if different             |
| `knowledge/domain/design-patterns.md`        | **PROJECT-SPECIFIC** | Contains actual page layouts       |

#### Design Knowledge (`knowledge/design/`) - ALL COPY

| File                                         | Classification | Notes              |
| -------------------------------------------- | -------------- | ------------------ |
| `knowledge/design/dialogue-format.md`        | **COPY**       | Format universal   |
| `knowledge/design/anti-slop-patterns.md`     | **COPY**       | Patterns universal |
| `knowledge/design/design-philosophy.md`      | **COPY**       | Philosophy universal |

#### QA Knowledge (`knowledge/qa/`) - ALL COPY

| File                                     | Classification | Notes                  |
| ---------------------------------------- | -------------- | ---------------------- |
| `knowledge/qa/qa-prerequisites.md`       | **COPY**       | Port assumption universal |
| `knowledge/qa/react-anti-patterns.md`    | **COPY**       | Patterns universal     |

#### Orchestrator Knowledge (`knowledge/orchestrator/`)

| File                                         | Classification    | Notes                               |
| -------------------------------------------- | ----------------- | ----------------------------------- |
| `knowledge/orchestrator/agent-registry.md`   | **PARAMETERIZED** | Update entity names, keep structure |

### Skills (`skills/`) - User-Invocable

| Skill                                  | Classification    | Notes                               |
| -------------------------------------- | ----------------- | ----------------------------------- |
| `skills/agent-orchestrator/SKILL.md`   | **PARAMETERIZED** | Update entity names in examples     |
| `skills/verify/SKILL.md`              | **COPY**          | Verification universal              |
| `skills/verify-app/SKILL.md`          | **COPY**          | Comprehensive verification          |
| `skills/skill-sync/SKILL.md`          | **COPY**          | Sync universal for stack            |
| `skills/skill-sync/sync-targets.md`   | **COPY**          | Regeneration instructions           |
| `skills/skills-creator/SKILL.md`      | **COPY**          | Skill creation universal            |
| `skills/ralph-loop/SKILL.md`          | **COPY**          | Autonomous loop universal           |
| `skills/ralph-loop/guardrails.md`     | **COPY**          | Guardrails universal                |
| `skills/monitor/SKILL.md`             | **COPY**          | Safety monitor universal            |
| `skills/monitor/patterns.md`          | **COPY**          | Dangerous patterns universal        |
| `skills/analyze-theme/SKILL.md`       | **COPY**          | MUI theme auditor universal         |
| `skills/new-component/SKILL.md`       | **COPY**          | React + MUI scaffold universal      |
| `skills/new-hook/SKILL.md`            | **COPY**          | Hook scaffold universal             |

### Scripts (`scripts/`)

| File                    | Classification | Notes                                 |
| ----------------------- | -------------- | ------------------------------------- |
| `scripts/defillama.mjs` | **COPY**       | Standalone Node.js, no project deps   |

---

## Instructions for Setting Up a New Project

When setting up `.claude` for a new project, follow this sequence:

### Phase 1: Copy Universal Files

Copy these files/folders without modification:

```
# Root
settings.json
settings.local.json
hooks.json

# Commands
commands/fix-number-format.md
commands/commit-push-pr.md

# Docs
docs/data-patterns.md

# Scripts
scripts/defillama.mjs

# Skills - Copy entire folders
skills/verify/
skills/verify-app/
skills/skill-sync/
skills/skills-creator/
skills/ralph-loop/
skills/monitor/
skills/analyze-theme/
skills/new-component/
skills/new-hook/

# Agents - Domain
agents/domain/ui-designer.md
agents/domain/theme-ui-specialist.md
agents/domain/react-specialist.md
agents/domain/design-dialogue.md
agents/domain/wagmi-specialist.md
agents/domain/react-query-specialist.md
agents/domain/ponder-schema-specialist.md
agents/domain/typescript-specialist.md
agents/domain/code-refactor-specialist.md

# Agents - Design
agents/design/ui-design-specialist.md
agents/design/ui-design-jony-ive.md

# Agents - QA
agents/qa/visual-qa.md
agents/qa/visual-qa-chrome-profiler.md
agents/qa/visual-qa-lighthouse.md
agents/qa/visual-qa-react-devtools-profiler.md
agents/qa/visual-qa-react-analyzer.md
agents/qa/accessibility-auditor.md
agents/qa/responsive-tester.md
agents/qa/performance-auditor.md

# Agents - Refactor
agents/refactor/ui-refactor-specialist.md
agents/refactor/code-simplifier.md
agents/refactor/types-refactor-specialist.md

# Knowledge - Design
knowledge/design/dialogue-format.md
knowledge/design/anti-slop-patterns.md
knowledge/design/design-philosophy.md

# Knowledge - QA
knowledge/qa/qa-prerequisites.md
knowledge/qa/react-anti-patterns.md

# Knowledge - Domain (universal only)
knowledge/domain/react-query-best-practices.md
```

### Phase 2: Parameterize Entity Names

For files marked as PARAMETERIZED, replace domain-specific entity names with your project's entities. Common replacements include:

- Primary entity names (e.g., pool, market, position)
- Secondary entity names (e.g., aggregator, basket)
- Hook names that reference these entities
- Transform function names

Files to parameterize:

- `CLAUDE.md`
- `README.md`
- `docs/project-rules.md`
- `docs/component-reference.md` (if Common components change)
- `skills/agent-orchestrator/SKILL.md`
- `knowledge/orchestrator/agent-registry.md`
- `agents/domain/web3-implementer.md`
- `knowledge/domain/hook-patterns.md`
- `knowledge/domain/project-config.json`
- `agents/qa/form-edge-case-tester.md`

### Phase 3: Regenerate From Source

These files must be regenerated from the new project's source code. **The easiest approach is to run `/skill-sync all`** after copying the skill-sync skill in Phase 1.

#### Option A: Run `/skill-sync all` (Recommended)

Since `/skill-sync` was copied in Phase 1, simply run:

```
/skill-sync all
```

This will automatically:

1. Detect that all knowledge files are missing/stale
2. Regenerate each one from the project's source files
3. Report completion status

#### Option B: Manual Regeneration

If you prefer to regenerate files manually or `/skill-sync` encounters issues:

**1. Theme Reference (`docs/theme-reference.md`)**

Read `src/theme/themeConfig.tsx` and extract:

- All palette colors (primary, secondary, error, success, warning, text, border, paper, etc.)
- All typography variants (sizes, weights, fonts)
- Any custom palette extensions

**2. Ponder Schema Reference (`knowledge/domain/schema-reference.md`)**

If the project has a schema generation script:

```bash
npx tsx scripts/generate-schema-reference.ts
```

Otherwise, read `ponder.schema.ts` and extract tables, columns, indexes, relations.

**3. Hook References**

- `knowledge/domain/hook-reference.md` -- Scan `src/hooks/blockchain/`
- `knowledge/domain/contracts-reference.md` -- Scan `src/services/contracts/generated.ts`
- `knowledge/domain/ponder-reference.md` -- Scan `src/hooks/ponder/`

**4. Type Index (`knowledge/domain/type-index.json`)**

Scan `src/types/` and index all exported interfaces, types, and transform functions.

### Phase 4: Create Project-Specific Files

#### 1. Routes Configuration (`agents/qa/routes.json`)

Create a new routes.json with the project's actual pages:

```json
{
  "$schema": "Routes configuration for QA agents",
  "addressSource": "Description of how to find test addresses",
  "routes": [
    {
      "path": "/",
      "name": "Dashboard",
      "requiresAddress": false,
      "focus": {
        "visual-qa": "What to check",
        "accessibility": "What to check",
        "responsive": "What to check"
      }
    }
    // ... add all routes
  ]
}
```

#### 2. Design Patterns (`knowledge/domain/design-patterns.md`)

Create new design patterns document with:

- Page layout patterns for this project's pages
- Card section patterns
- Form patterns
- Any project-specific motion config

#### 3. Contract Update Command (`commands/update-contracts.md`)

If the project has contract ABIs/addresses to update:

- Document the contract address JSON paths
- Document the ABI generation process
- Create the update workflow

#### 4. Protocol Specification (optional)

If the project has domain-specific protocol knowledge:

- Create `docs/PROTOCOL_SPECIFICATION.md`
- Document domain entities and their relationships
- Document business logic rules

### Phase 5: Validate Setup

After setup, verify:

1. **Run verification:**

   ```bash
   yarn typecheck && yarn lint && yarn prettier && yarn build
   ```

2. **Test key skills:**
   - `/verify` - Should run all checks
   - `/agent-orchestrator` - Should load without errors
   - Visual QA agents -- Should connect to Chrome

3. **Check CLAUDE.md loads:**
   - Start a new Claude Code session
   - Verify project rules are understood

---

## Architectural Patterns (Reference)

### Two-Layer Hook Pattern

```
Component → Transform Hook → Ponder Hook
           (typed domain)   (raw data)
```

**Layer 1 (Ponder Hooks):** `src/hooks/ponder/`

- Raw `usePonderQuery` calls
- Return untyped data
- Never used directly in components

**Layer 2 (Transform Hooks):** `src/hooks/blockchain/useGet*Live.ts`

- Import ponder hooks or use `usePonderQuery` directly
- Transform with `transformPonder*` functions
- Wrap in `useMemo` for referential stability
- Return typed domain objects

### Agent Hierarchy

```
agent-orchestrator
├── ui-designer
│   ├── design-dialogue
│   │   ├── ui-design-specialist (read-only critic)
│   │   └── ui-design-jony-ive (read-only critic)
│   ├── theme-ui-specialist
│   ├── react-specialist
│   ├── visual-qa (+ 4 profiling sub-agents)
│   └── ui-refactor-specialist (auto-invoked)
├── web3-implementer
│   ├── ponder-schema-specialist (read-only)
│   ├── wagmi-specialist
│   ├── react-query-specialist
│   └── code-refactor-specialist (auto-invoked)
└── typescript-specialist
    └── types-refactor-specialist (auto-invoked)
```

### Knowledge File Update Matrix

After changes to these locations, update corresponding files:

| Change Location                       | Update File                                    |
| ------------------------------------- | ---------------------------------------------- |
| `src/hooks/ponder/`                   | `knowledge/domain/ponder-reference.md`         |
| `src/hooks/blockchain/`               | `knowledge/domain/hook-reference.md`           |
| `src/services/contracts/generated.ts` | `knowledge/domain/contracts-reference.md`      |
| `src/types/`                          | `knowledge/domain/type-index.json`             |
| `src/components/Common/`              | `docs/component-reference.md`                  |
| `src/theme/themeConfig.tsx`           | `docs/theme-reference.md`                      |
| `ponder.schema.ts`                    | Run schema generation script                   |

> **Tip:** Use `/skill-sync` to automatically detect stale files and regenerate them. Run it after adding hooks, types, or schema changes, or before major releases.

---

## Checklist for New Project Setup

```
[ ] Phase 1: Copy universal files
    [ ] Root config files (settings.json, hooks.json)
    [ ] Universal commands
    [ ] Universal skills
    [ ] Agent files (domain, design, qa, refactor)
    [ ] Knowledge files (design, qa, universal domain)
    [ ] Scripts (defillama.mjs)

[ ] Phase 2: Parameterize entity names
    [ ] CLAUDE.md
    [ ] README.md
    [ ] docs/project-rules.md
    [ ] agent-orchestrator + agent-registry
    [ ] web3-implementer + hook-patterns
    [ ] form-edge-case-tester

[ ] Phase 3: Regenerate from source
    [ ] Run `/skill-sync all` (recommended - handles all files below)
    [ ] -- OR manually regenerate: --
    [ ] docs/theme-reference.md (from themeConfig.tsx)
    [ ] knowledge/domain/schema-reference.md (from ponder.schema.ts)
    [ ] knowledge/domain/hook-reference.md (from src/hooks/blockchain/)
    [ ] knowledge/domain/contracts-reference.md (from generated.ts)
    [ ] knowledge/domain/ponder-reference.md (from src/hooks/ponder/)
    [ ] knowledge/domain/type-index.json (from src/types/)

[ ] Phase 4: Create project-specific files
    [ ] agents/qa/routes.json (QA routes)
    [ ] knowledge/domain/design-patterns.md
    [ ] commands/update-contracts.md (if applicable)
    [ ] docs/PROTOCOL_SPECIFICATION.md (if applicable)

[ ] Phase 5: Validate
    [ ] yarn typecheck && yarn lint && yarn build passes
    [ ] /verify skill works
    [ ] /agent-orchestrator loads
    [ ] CLAUDE.md loads in new session
```
