# Ponder Schema & Query Reference

> **Regenerate this file** after copying to a new project.
>
> Run: `/skill-sync ponder`

Supplementary reference for query patterns, hook catalog, and schema overview.

## Schema Overview

Source: `src/services/ponder/ponder.schema.ts`

All tables use `onchainTable` from `ponder`. Entity IDs follow the format `{chainId}-{address}` (lowercase). Event IDs use `{chainId}-{txHash}-{logIndex}`.

### Tables

(Run `/skill-sync ponder` to populate from your schema)

## Ponder Hooks (`src/hooks/ponder/`)

(Run `/skill-sync ponder` to populate from your codebase)

## Transform Hooks (`src/hooks/blockchain/useGet*Live.ts`)

(Run `/skill-sync ponder` to populate from your codebase)

## Query Patterns

### List Query (no live updates)

```typescript
const { data } = usePonderQuery({
  queryFn: (db) =>
    db.select().from(schema.yourTable).limit(50),
  live: false,
  enabled: supportedChain,
});
```

### Detail Query (live SSE updates)

```typescript
const { data } = usePonderQuery({
  queryFn: (db) =>
    db.select().from(schema.yourTable).where(eq(schema.yourTable.id, entityId!)),
  live: true,
  enabled: !!entityId && supportedChain,
});
```

### Transform Pattern

```typescript
const transformedData = useMemo(() => {
  if (!data) return undefined;
  return transformPonderEntity(data);
}, [data]);
```
