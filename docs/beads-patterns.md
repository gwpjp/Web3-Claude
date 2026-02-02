# Beads Patterns Reference

Comprehensive patterns for using Beads (persistent agent memory) with the orchestrator workflow.

**Core principle:** Use Beads as a dynamic index layer that makes your orchestrator's context feel infinite while keeping actual context small.

---

## Core Patterns

### 1. Index-First Pattern

Keep orchestrator context small by treating bead lists as indexes that point to full data.

**Orchestrator workflow:**

```bash
# Step 1: Build lightweight index (small context footprint)
bd list --json | jq '[.[] | {id, title, status, priority, tags}]'

# Step 2: Plan work assignment from index
# (orchestrator decides which beads go to which agents)

# Step 3: Spawned agents fetch full context only for their beads
bd show bd-a1b2 --json
```

**Why this works:** The orchestrator sees the shape of all work without loading full descriptions. Specialists get complete context only for what they're actively working on.

### 2. Composable Queries

Chain bead commands with jq for complex filtering without custom tooling:

```bash
# High-priority ready work
bd list --status ready --json | jq '[.[] | select(.priority < 2)]'

# All bug IDs for batch assignment
bd list --tag bug --json | jq -r '.[].id'

# What's blocking a specific bead
bd deps bd-a1b2 --json | jq '.blocking[]'

# Count by status (quick health check)
bd list --json | jq 'group_by(.status) | map({status: .[0].status, count: length})'

# Find beads touched today
bd list --json | jq '[.[] | select(.updated > "2024-01-15")]'
```

**Piping pattern:** Query -> Filter -> Extract -> Assign

### 3. Hierarchical Context Loading

Match context detail to need:

| Need | Command | Context Size |
|------|---------|--------------|
| Planning | `bd list --json \| jq '[.[] \| {id, title, status}]'` | Minimal |
| Triage | `bd show <id> --summary` | Small |
| Active work | `bd show <id> --json` | Full |
| Deep dive | `bd show <id> --json` + linked beads | Large |

### 4. Paging for Large Result Sets

When bead count exceeds comfortable context:

```bash
# First page of ready work
bd ready --json | jq '.[0:20]'

# Next page
bd ready --json | jq '.[20:40]'

# Or filter aggressively
bd ready --json | jq '[.[] | select(.priority == 0)]'
```

### 5. Context Overflow Recovery

If a command returns too much data:

1. **Abort the full fetch**
2. **Apply filters:**
   ```bash
   bd list --status ready --json          # filter by status
   bd list --tag backend --json           # filter by tag
   bd list --json | jq '[.[] | select(.priority < 2)]'  # filter by priority
   ```
3. **Use summary mode:** `bd show <id> --summary`
4. **Delegate subsets:** Assign filtered results to spawned agents

---

## Orchestrator Integration

### Before Beads (prose-based)

```
Orchestrator: "There's an auth bug where tokens aren't validating correctly.
              The issue is in useAuth hook. Also we found a race condition
              in the websocket reconnection logic that needs fixing."

Spawned Agent: (receives wall of text, may lose details)
```

### After Beads (ID-based)

```
Orchestrator: bd ready --json | jq '[.[] | {id, title, priority}]'
              -> [{id: "bd-a1b2", title: "Auth token validation", priority: 1},
                 {id: "bd-c3d4", title: "Websocket race condition", priority: 2}]

              "Take bd-a1b2"

Spawned Agent: bd show bd-a1b2 --json
              -> (full context, dependencies, history)

              (works on it)

              bd close bd-a1b2 --reason "Added validation in useAuth, tested with expired tokens"
```

### Agent Discovery Pattern

When a spawned agent discovers new work:

```bash
# Agent finds a bug while working on bd-a1b2
bd create "Found null pointer in token refresh" -t bug -p 1 --blocks bd-a1b2

# Or discovers related work
bd create "Refactor auth to use new token format" -t task -p 3 --related bd-a1b2
```

The orchestrator sees these on next `bd ready` query--nothing is lost.

### Dependency-Aware Assignment

```bash
# Find work that's actually unblocked
bd ready --json

# See what's blocking stuck work
bd list --status blocked --json | jq '.[].id' | xargs -I {} bd deps {} --json

# Assign blocker first, then dependent work
```

---

## Session Lifecycle

### Cold Start (New Session)

```bash
# 1. Orient
bd ready --json | jq '[.[] | {id, title, priority}]'
bd list --status in_progress --json | jq '[.[] | {id, title, assignee}]'

# 2. Decide
# - Resume in_progress work?
# - Pick highest priority ready?
# - Spawn agents for parallel work?

# 3. Load context only for active work
bd show <chosen-id> --json
```

### Warm Handoff (Mid-Session Agent Spawn)

```bash
# Orchestrator creates bead for work chunk
bd create "Implement caching layer for API responses" -t task -p 2 --parent bd-epic-123

# Get the new ID
NEW_ID=$(bd list --json | jq -r '.[0].id')

# Spawn agent with just the ID
# Agent runs: bd show $NEW_ID --json
```

### Landing the Plane (Session End)

```bash
# 1. File anything discovered but not tracked
bd create "TODO: investigate memory leak in prod" -t task -p 3

# 2. Update statuses
bd update bd-a1b2 --status in_progress  # not done, but started
bd close bd-c3d4 --reason "Completed, PR #142"

# 3. Add notes for next session
bd update bd-a1b2 --note "Left off at: tests passing locally, need to check CI"

# 4. Sync
bd sync
```

---

## Decision Tracking Pattern

Beyond tasks and bugs, capture **architectural decisions** as durable artifacts. This implements "judgment once, execute many"--when agents make non-obvious choices, record them so future agents don't re-infer.

### Using Labels for Decision Types

Beads supports `bug`, `feature`, `task`, `epic`, `chore` types. For decisions, use **labels**:

```bash
# Record an architectural decision
bd create "Use Zustand over Redux for state management" \
  -t task \
  -p 4 \
  -l decision,architecture \
  --note "Rationale: Simpler API, smaller bundle, sufficient for current scale. Considered Redux Toolkit but overhead not justified for app size."

# Record a library choice
bd create "Chose React Query for server state" \
  -t task \
  -p 4 \
  -l decision,dependencies \
  --note "Rationale: Built-in caching, deduplication, background refresh. SWR considered but React Query has better devtools."

# Link decision to related feature work
bd dep add <decision-id> <feature-id> --type related
```

### Querying Past Decisions

Future agents can query decision history:

```bash
# All decisions
bd list --label decision --json | jq '[.[] | {id, title, notes}]'

# Architecture decisions only
bd list --label decision,architecture --json

# Decisions related to a feature
bd dep tree <feature-id> --json | jq '.related[] | select(.labels | contains(["decision"]))'
```

### When to File Decisions

Agents should file decision beads when:

- Choosing between competing libraries/frameworks
- Selecting architectural patterns (monolith vs microservices, REST vs GraphQL)
- Making performance tradeoffs (caching strategy, pagination approach)
- Deviating from project conventions with good reason
- Any choice a future agent might question or re-evaluate

### Decision Lifecycle

```bash
# Initial decision
bd create "Use server components for data fetching" -t task -p 4 -l decision,react

# Later: decision revisited
bd update <id> --note "2024-02: Still valid. Considered client components for interactivity but RSC covers 90% of cases."

# Decision superseded
bd close <id> --reason "Superseded by bd-xyz: Migrating to tRPC for type safety"
```

---

## Outcome Tracking Pattern

Track whether completed work succeeded or failed. This closes the "code is policy, bug report is reward signal" loop.

### Adding Outcome Labels

```bash
# Successful completion
bd close <id> --reason "Shipped in PR #142, metrics improved 15%"
bd label add <id> outcome:success

# Partial success
bd close <id> --reason "Shipped but perf regression in edge case"
bd label add <id> outcome:partial

# Failure / rollback
bd close <id> --reason "Rolled back - caused production errors"
bd label add <id> outcome:failure
```

### Analyzing Outcomes

```bash
# Success rate
bd list --status closed --json | jq '
  group_by(.labels | map(select(startswith("outcome:"))) | .[0] // "outcome:unknown")
  | map({outcome: .[0].labels | map(select(startswith("outcome:"))) | .[0], count: length})
'

# Failed tasks for retrospective
bd list --label outcome:failure --json | jq '[.[] | {id, title, reason: .close_reason}]'

# What kinds of tasks fail most?
bd list --label outcome:failure --json | jq 'group_by(.type) | map({type: .[0].type, count: length})'
```

---

## Anti-Patterns to Avoid

### Loading everything into context

```bash
# Don't do this
bd list --json  # (then paste entire output into prompt)
```

### Index, then selective load

```bash
# Do this
bd list --json | jq '[.[] | {id, title, status}]'  # lightweight index
bd show bd-specific-one --json  # full context only when needed
```

### Prose descriptions to spawned agents

```
"Fix the auth bug, it's the one where tokens don't validate,
we talked about it yesterday, it's related to the websocket stuff..."
```

### Bead ID assignment

```
"Work on bd-a1b2"
```

### Orphan work

Agent discovers bug -> mentions it in conversation -> session ends -> forgotten

### File immediately

Agent discovers bug -> `bd create "description" -t bug` -> persists in git

---

## Quick Reference

| Action | Command |
|--------|---------|
| See ready work | `bd ready --json` |
| Lightweight index | `bd list --json \| jq '[.[] \| {id, title, status, priority}]'` |
| Full context for one bead | `bd show <id> --json` |
| Create new bead | `bd create "title" -t bug\|task\|feature\|epic\|chore -p 0-4` |
| Close completed | `bd close <id> --reason "summary"` |
| Update status | `bd update <id> --status ready\|in_progress\|blocked\|closed` |
| Add dependency | `bd dep add <id> --blocks <other-id>` |
| Add labels | `bd label add <id> label1,label2` |
| Filter by label | `bd list --label decision --json` |
| Sync to git | `bd sync` |

---

## The Mental Model

Think of Beads as providing the same memory hierarchy that made CPUs fast:

| CPU Memory | Agent Memory | Purpose |
|------------|--------------|---------|
| Registers | Current context window | Active work |
| L1 Cache | `bd show <id>` results | Recently accessed |
| RAM | `bd list` index | All tracked work |
| Disk | Git repository | Persistent across sessions |

The orchestrator's job is cache management: keep hot work in context, index everything else, and never lose state to compaction.

---

## The Bigger Picture

This setup implements key principles from modern agent architecture research:

1. **Software as substrate** -- Your agents emit code (durable software), not just runtime inference. Beads tracks what they build.

2. **Judgment once, execute many** -- Decision beads capture architectural choices so future agents don't re-infer them.

3. **Symbolic + adaptive** -- Beads provides auditability and determinism (queryable, version-controlled state) while your agents provide adaptability (judgment, problem-solving).

4. **Composable tools** -- Unix-style piping (`bd list | jq | xargs`) lets you build complex queries without custom tooling.

5. **Hierarchical context** -- Index-first pattern keeps orchestrator context small while specialists get full detail.

The result: your orchestrator becomes a **buildtime RL loop** where code is policy, deployment is episode, and bug reports (filed as beads) are the reward signal. The system learns and improves across sessions.
