# Data & Blockchain Patterns

## Ponder Backend (Read Operations)

This frontend uses a **Ponder** backend for indexed blockchain data. Follow a two-layer hook pattern.

See [docs/project-rules.md](./project-rules.md#9-two-layer-hook-pattern) for the two-layer hook rule.

### Layer 1: Raw Data Hooks (`src/hooks/ponder/`)

Query Ponder directly with `usePonderQuery` from `@ponder/react`. Use `live: true` for detail views (SSE real-time updates), `live: false` for list views.

### Layer 2: Transform Hooks (`src/hooks/blockchain/`)

Consume raw data and transform to typed domain objects using `transformPonder*` functions with `useMemo`.

### Transformation Functions

Define in `src/types/` alongside type definitions. Create functions like:

- `transformPonderEntity` - Transform raw Ponder data to typed domain object
- `sliceAddress` - Truncate address for display
- `percentToBps`, `bpsToPercentString` - Basis point conversions

---

## Blockchain Writes

Follow the simulate-then-write pattern using `useSimulateContractWithAccount` and `useContractWriteWithState`.

See `web3-implementer/hook-patterns.md` for full write hook templates and the complete simulate/execute/invalidation pattern.

### Key Points

- ABIs are in `src/services/contracts/generated.ts`
- Always simulate before writing
- Invalidate relevant queries on success
- Place write hooks in `src/hooks/blockchain/`
- Use `ChainContainer` for chain/wallet state
- Use `CTAButton` in UI for blockchain action buttons
