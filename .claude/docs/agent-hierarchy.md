# Agent Hierarchy

Full agent orchestrator tree for Web3-Claude.

```
/agent-orchestrator
├── ui-designer .............. All UI changes, layout, visual design (agent)
│   ├── design-dialogue ...... Design critic dialogue (agent)
│   │   ├── ui-design-specialist Anti-slop critic (agent)
│   │   └── ui-design-jony-ive  Senior design consultant (agent)
│   ├── theme-ui-specialist ... Palette, typography, styled(), MUI (agent)
│   ├── react-specialist ..... Component logic, hooks, state (agent)
│   ├── visual-qa ............ Chrome visual QA (after changes) (agent)
│   └── ui-refactor-specialist Auto cleanup after UI work (agent)
├── web3-implementer ......... All blockchain + ponder data work (agent)
│   ├── ponder-schema-specialist Schema reference (agent)
│   ├── wagmi-specialist ..... Contract reads/writes, tx lifecycle (agent)
│   ├── react-query-specialist Cache strategy, query keys (agent)
│   └── code-refactor-specialist Auto cleanup after hook work (agent)
├── typescript-specialist .... Advanced types, generics (shared agent)
│   └── types-refactor-specialist Auto cleanup after type work (agent)
└── /ralph-loop ............... Autonomous task loops (user-invoked)
```

## Ownership Rule

The root Claude Code agent MUST NOT plan or execute implementation work directly. ALL work goes through `/agent-orchestrator`.

When a plan is created (via `EnterPlanMode`), it MUST be executed with `/agent-orchestrator` loaded:

1. Plans should include: `> **Execution Requirement:** Before implementing, invoke /agent-orchestrator`
2. If context is cleared before execution, re-invoke `/agent-orchestrator` first
3. Never execute implementation plans with generic `Task` agents

**Anti-pattern:** Creating a plan with agent-orchestrator, clearing context, then executing with `general-purpose` Task agents.
