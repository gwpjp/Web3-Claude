# Session Workflow

## Beads Quick Reference

| Action                    | Command                                                         |
| ------------------------- | --------------------------------------------------------------- |
| See ready work            | `bd ready --json`                                               |
| Lightweight index         | `bd list --json \| jq '[.[] \| {id, title, status, priority}]'` |
| Full context for one bead | `bd show <id> --json`                                           |
| Create new bead           | `bd create "title" -t bug\|task\|feature\|epic\|chore -p 0-4`   |
| Close completed           | `bd close <id> --reason "summary"`                              |
| Update status             | `bd update <id> --status ready\|in_progress\|blocked\|closed`   |
| Add dependency            | `bd dep add <id> --blocks <other-id>`                           |
| Add labels                | `bd label add <id> label1,label2`                               |
| Filter by label           | `bd list --label decision --json`                               |
| Sync to git               | `bd sync`                                                       |

## Session Start

1. Build lightweight index: `bd list --json | jq '[.[] | {id, title, status, priority}]'`
2. Check ready work: `bd ready --json`
3. Check in-progress: `bd list --status in_progress --json`

## Session End (Land the Plane)

**Work is NOT complete until `git push` succeeds.**

1. **File discovered work:** `bd create "description" -t bug|task|feature -p 0-4`
2. **Run quality gates** (if code changed): `yarn typecheck && yarn lint && yarn prettier && yarn build`
3. **Update worked items:** `bd update <id> --status in_progress|closed`
4. **Push to remote** (MANDATORY):
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Hand off:** Provide context for next session

**Critical rules:**
- NEVER stop before pushing -- that leaves work stranded locally
- NEVER say "ready to push when you are" -- YOU must push
- If push fails, resolve and retry until it succeeds

## Spawning Agents

- Assign by bead ID, not prose: "Work on bd-a1b2"
- Spawned agent fetches context: `bd show bd-a1b2 --json`
- On completion: `bd close bd-a1b2 --reason "summary of what was done"`

## Patterns

### Index-First

Keep orchestrator context small by treating bead lists as indexes that point to full data.

```bash
# Step 1: Build lightweight index (small context footprint)
bd list --json | jq '[.[] | {id, title, status, priority}]'

# Step 2: Plan work assignment from index

# Step 3: Spawned agents fetch full context only for their beads
bd show bd-specific-id --json
```

### Decision Tracking

Capture architectural decisions as durable artifacts using labels:

```bash
bd create "Use Zustand over Redux" -t task -p 4 -l decision,architecture \
  --note "Rationale: Simpler API, smaller bundle, sufficient for current scale"
```

### Outcome Labels

Track whether completed work succeeded or failed:

```bash
bd close <id> --reason "Shipped in PR #142"
bd label add <id> outcome:success
```

See also: [docs/beads-patterns.md](docs/beads-patterns.md) for extended patterns.
