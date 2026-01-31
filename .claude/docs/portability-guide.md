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

### Skills (`skills/`)

#### Agent Orchestration (PARAMETERIZED)

| Skill                                  | Classification    | Notes                               |
| -------------------------------------- | ----------------- | ----------------------------------- |
| `agent-orchestrator/SKILL.md`          | **PARAMETERIZED** | Update entity names in examples     |
| `agent-orchestrator/agent-registry.md` | **PARAMETERIZED** | Update entity names, keep structure |

#### UI Domain (MOSTLY COPY)

| Skill                                        | Classification       | Notes                          |
| -------------------------------------------- | -------------------- | ------------------------------ |
| `ui-designer/SKILL.md`                       | **COPY**             | Design patterns universal      |
| `ui-designer/design-patterns.md`             | **PROJECT-SPECIFIC** | Contains actual page layouts   |
| `theme-ui-specialist/SKILL.md`               | **COPY**             | MUI theming patterns universal |
| `react-specialist/SKILL.md`                  | **COPY**             | React patterns universal       |
| `design-dialogue/SKILL.md`                   | **COPY**             | Dialogue pattern universal     |
| `design-dialogue/dialogue-format.md`         | **COPY**             | Format universal               |
| `ui-design-specialist/SKILL.md`              | **COPY**             | Anti-slop patterns universal   |
| `ui-design-specialist/anti-slop-patterns.md` | **COPY**             | Patterns universal             |
| `ui-design-jony-ive/SKILL.md`                | **COPY**             | Philosophy universal           |
| `ui-design-jony-ive/design-philosophy.md`    | **COPY**             | Philosophy universal           |

#### Web3 Domain (PARAMETERIZED)

| Skill                                          | Classification    | Notes                                 |
| ---------------------------------------------- | ----------------- | ------------------------------------- |
| `web3-implementer/SKILL.md`                    | **PARAMETERIZED** | Update table names in examples        |
| `web3-implementer/hook-patterns.md`            | **PARAMETERIZED** | Templates generic, update table names |
| `web3-implementer/ponder-reference.md`         | **REGENERATE**    | Catalog actual ponder hooks           |
| `wagmi-specialist/SKILL.md`                    | **COPY**          | wagmi/viem patterns universal         |
| `wagmi-specialist/hook-reference.md`           | **REGENERATE**    | Catalog actual blockchain hooks       |
| `wagmi-specialist/contracts-reference.md`      | **REGENERATE**    | Summary of generated.ts ABIs          |
| `react-query-specialist/SKILL.md`              | **COPY**          | Query patterns universal              |
| `react-query-specialist/best-practices.md`     | **COPY**          | Best practices universal              |
| `ponder-schema-specialist/SKILL.md`            | **COPY**          | Pattern universal                     |
| `ponder-schema-specialist/schema-reference.md` | **REGENERATE**    | From ponder.schema.ts                 |

#### TypeScript Domain (PARAMETERIZED)

| Skill                                       | Classification    | Notes                     |
| ------------------------------------------- | ----------------- | ------------------------- |
| `typescript-specialist/SKILL.md`            | **COPY**          | TS patterns universal     |
| `typescript-specialist/project-config.json` | **PARAMETERIZED** | Update paths if different |
| `typescript-specialist/type-index.json`     | **REGENERATE**    | Index actual types        |

#### QA Skills (COPY)

All QA skills are **COPY** - they use Chrome/browser APIs, not project-specific code:

- `visual-qa/SKILL.md`
- `visual-qa-chrome-profiler/SKILL.md`
- `visual-qa-lighthouse/SKILL.md`
- `visual-qa-react-devtools-profiler/SKILL.md`
- `visual-qa-react-analyzer/SKILL.md`
- `visual-qa-react-analyzer/anti-patterns.md`
- `accessibility-auditor/SKILL.md`
- `responsive-tester/SKILL.md`
- `performance-auditor/SKILL.md`
- `form-edge-case-tester/SKILL.md` (update form field names)

**Exception:** `routes.json` is **PROJECT-SPECIFIC** - defines pages to test.

#### Refactoring Specialists (COPY)

All refactoring specialists are **COPY** - patterns are universal:

- `ui-refactor-specialist/SKILL.md`
- `code-refactor-specialist/SKILL.md`
- `types-refactor-specialist/SKILL.md`

#### Workflow Skills (COPY)

- `verify/SKILL.md` - **COPY**
- `verify-app/SKILL.md` - **COPY**
- `code-simplifier/SKILL.md` - **COPY**
- `skill-sync/SKILL.md` - **COPY** (universal for ponder + wagmi + MUI stack)
- `skill-sync/sync-targets.md` - **COPY** (regeneration instructions are stack-universal)
- `skills-creator/SKILL.md` - **COPY**
- `ralph-loop/SKILL.md` - **COPY**
- `ralph-loop/guardrails.md` - **COPY**
- `monitor/SKILL.md` - **COPY** (Safety monitor, universal)
- `monitor/patterns.md` - **COPY** (Dangerous pattern catalog, universal)
- `analyze-theme/SKILL.md` - **COPY** (MUI theme auditor, universal)
- `new-component/SKILL.md` - **COPY** (React + MUI scaffold, universal)
- `new-hook/SKILL.md` - **COPY** (Hook scaffold, universal)

#### Supporting Files

- `qa-prerequisites.md` - **COPY** (port assumption universal)

---

## Instructions for Skills-Creator Agent

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

# Skills - Copy entire folders
skills/verify/
skills/verify-app/
skills/code-simplifier/
skills/skill-sync/
skills/skills-creator/
skills/ralph-loop/
skills/monitor/
skills/analyze-theme/
skills/new-component/
skills/new-hook/

skills/ui-designer/SKILL.md
skills/theme-ui-specialist/
skills/react-specialist/
skills/design-dialogue/
skills/ui-design-specialist/
skills/ui-design-jony-ive/

skills/wagmi-specialist/SKILL.md
skills/react-query-specialist/
skills/ponder-schema-specialist/SKILL.md
skills/typescript-specialist/SKILL.md

skills/ui-refactor-specialist/
skills/code-refactor-specialist/
skills/types-refactor-specialist/

skills/visual-qa/
skills/visual-qa-chrome-profiler/
skills/visual-qa-lighthouse/
skills/visual-qa-react-devtools-profiler/
skills/visual-qa-react-analyzer/
skills/accessibility-auditor/
skills/responsive-tester/
skills/performance-auditor/

skills/qa-prerequisites.md
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
- `skills/agent-orchestrator/agent-registry.md`
- `skills/web3-implementer/SKILL.md`
- `skills/web3-implementer/hook-patterns.md`
- `skills/typescript-specialist/project-config.json`
- `skills/form-edge-case-tester/SKILL.md`

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

**2. Ponder Schema Reference (`skills/ponder-schema-specialist/schema-reference.md`)**

If the project has a schema generation script:

```bash
npx tsx scripts/generate-schema-reference.ts
```

Otherwise, read `ponder.schema.ts` and extract tables, columns, indexes, relations.

**3. Hook References**

- `wagmi-specialist/hook-reference.md` — Scan `src/hooks/blockchain/`
- `wagmi-specialist/contracts-reference.md` — Scan `src/services/contracts/generated.ts`
- `web3-implementer/ponder-reference.md` — Scan `src/hooks/ponder/`

**4. Type Index (`skills/typescript-specialist/type-index.json`)**

Scan `src/types/` and index all exported interfaces, types, and transform functions.

### Phase 4: Create Project-Specific Files

#### 1. Routes Configuration (`skills/routes.json`)

Create a new routes.json with the project's actual pages:

```json
{
  "$schema": "Routes configuration for QA skills",
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

#### 2. Design Patterns (`skills/ui-designer/design-patterns.md`)

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
   - `/visual-qa` - Should connect to Chrome

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

| Change Location                       | Update File                               |
| ------------------------------------- | ----------------------------------------- |
| `src/hooks/ponder/`                   | `web3-implementer/ponder-reference.md`    |
| `src/hooks/blockchain/`               | `wagmi-specialist/hook-reference.md`      |
| `src/services/contracts/generated.ts` | `wagmi-specialist/contracts-reference.md` |
| `src/types/`                          | `typescript-specialist/type-index.json`   |
| `src/components/Common/`              | `docs/component-reference.md`             |
| `src/theme/themeConfig.tsx`           | `docs/theme-reference.md`                 |
| `ponder.schema.ts`                    | Run schema generation script              |

> **Tip:** Use `/skill-sync` to automatically detect stale files and regenerate them. Run it after adding hooks, types, or schema changes, or before major releases.

---

## Checklist for New Project Setup

```
[ ] Phase 1: Copy universal files
    [ ] Root config files (settings.json, hooks.json)
    [ ] Universal commands
    [ ] Universal skills

[ ] Phase 2: Parameterize entity names
    [ ] CLAUDE.md
    [ ] README.md
    [ ] docs/project-rules.md
    [ ] agent-orchestrator files
    [ ] web3-implementer files

[ ] Phase 3: Regenerate from source
    [ ] Run `/skill-sync all` (recommended - handles all files below)
    [ ] -- OR manually regenerate: --
    [ ] docs/theme-reference.md (from themeConfig.tsx)
    [ ] ponder-schema-specialist/schema-reference.md (from ponder.schema.ts)
    [ ] wagmi-specialist/hook-reference.md (from src/hooks/blockchain/)
    [ ] wagmi-specialist/contracts-reference.md (from generated.ts)
    [ ] web3-implementer/ponder-reference.md (from src/hooks/ponder/)
    [ ] typescript-specialist/type-index.json (from src/types/)

[ ] Phase 4: Create project-specific files
    [ ] skills/routes.json (QA routes)
    [ ] skills/ui-designer/design-patterns.md
    [ ] commands/update-contracts.md (if applicable)
    [ ] docs/PROTOCOL_SPECIFICATION.md (if applicable)

[ ] Phase 5: Validate
    [ ] yarn typecheck && yarn lint && yarn build passes
    [ ] /verify skill works
    [ ] /agent-orchestrator loads
    [ ] CLAUDE.md loads in new session
```
