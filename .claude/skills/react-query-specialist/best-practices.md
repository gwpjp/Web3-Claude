# React Query Best Practices Reference

Comprehensive TanStack Query (React Query) v5 best practices for this project. This is the authoritative reference for query architecture, caching strategies, and data fetching patterns.

## Important Defaults

Understanding React Query's defaults prevents unexpected behavior.

### Default Behavior

| Default                | Value                                          | Implication                                                                  |
| ---------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `staleTime`            | `0`                                            | Data is immediately stale after fetch; background refetches can trigger      |
| `gcTime`               | `300000` (5 min)                               | Inactive query data stays in memory 5 minutes after last subscriber unmounts |
| `refetchOnMount`       | `true`                                         | Stale queries refetch when component mounts                                  |
| `refetchOnWindowFocus` | `true` (overridden to `false` in this project) | Stale queries refetch on tab focus                                           |
| `refetchOnReconnect`   | `true`                                         | Stale queries refetch on network reconnect                                   |
| `retry`                | `3`                                            | Failed queries retry 3 times with exponential backoff                        |
| `structuralSharing`    | `true`                                         | Keeps reference identity if data hasn't changed                              |

### This Project's Overrides

```typescript
// src/containers/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
```

### staleTime vs gcTime

```
Component mounts → fetch → data in cache (fresh for staleTime)
                                    ↓
                    staleTime expires → data is "stale"
                                    ↓
            refetch on mount/focus/reconnect if stale
                                    ↓
        Component unmounts → gcTime countdown starts
                                    ↓
            gcTime expires → data removed from cache
```

**Rule:** `gcTime` should always be >= `staleTime`. Otherwise data is garbage collected while still considered "fresh".

### When to Customize staleTime

```typescript
// Data that rarely changes (e.g., geofence location)
useQuery({
  queryKey: ["geofence"],
  queryFn: geofence,
  staleTime: 30 * 1000 * 1000, // 30,000 seconds
});

// Data that changes frequently (e.g., live entity stats)
// Use default staleTime: 0 (always refetch)

// Data that changes occasionally (e.g., token list)
useQuery({
  queryKey: ["coingecko-tokens", params],
  queryFn: fetchTokens,
  staleTime: 60_000, // Fresh for 1 minute
});
```

## Query Keys

### Structure: Generic to Specific

Always structure keys from broad category to specific identifier:

```typescript
// Level 0: Domain
["coingecko-tokens"][
  // Level 1: Entity type
  ("coingecko-tokens", "search")
][
  // Level 2: Scope (chainId, user address)
  ("coingecko-token", chainId, address)
][
  // Level 3: Specific parameters
  ("coingecko-tokens", { chainId, symbol, limit, offset })
];
```

### Key as Dependency Array

Treat query keys like React's `useEffect` dependency array. Include every variable the `queryFn` depends on:

```typescript
// BAD - key doesn't reflect params
useQuery({
  queryKey: ["tokens"],
  queryFn: () => fetchTokens(chainId, symbol),
});

// GOOD - key includes all dependencies
useQuery({
  queryKey: ["tokens", chainId, symbol],
  queryFn: () => fetchTokens(chainId, symbol),
});
```

### Hierarchical Invalidation

Structured keys enable invalidation at any granularity:

```typescript
// Invalidate ALL ponder data
queryClient.invalidateQueries({ queryKey: ["ponder"] });

// Invalidate all ponder entity data
queryClient.invalidateQueries({ queryKey: ["ponder", "entityDetails"] });

// Invalidate specific entity
queryClient.invalidateQueries({
  queryKey: ["ponder", "entityDetails", chainId, address],
});
```

### Query Key Factory Pattern (Recommended for New Features)

For complex features, use a query key factory:

```typescript
export const tokenKeys = {
  all: () => ["tokens"] as const,
  lists: () => [...tokenKeys.all(), "list"] as const,
  list: (params: TokenParams) => [...tokenKeys.lists(), params] as const,
  details: () => [...tokenKeys.all(), "detail"] as const,
  detail: (chainId: number, address: string) =>
    [...tokenKeys.details(), chainId, address] as const,
};

// Usage
useQuery({ queryKey: tokenKeys.list({ chainId, limit: 25 }) });
queryClient.invalidateQueries({ queryKey: tokenKeys.lists() }); // All lists
```

## Query Functions

### Proper Typing

Let TypeScript infer types from properly typed query functions:

```typescript
// BAD - manual generics
const { data } = useQuery<Token[], Error>({
  queryKey: ["tokens"],
  queryFn: fetchTokens,
});

// GOOD - infer from queryFn return type
async function fetchTokens(): Promise<Token[]> {
  const res = await fetch("/api/tokens");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

const { data } = useQuery({
  queryKey: ["tokens"],
  queryFn: fetchTokens,
  // data is inferred as Token[] | undefined
});
```

### Error Handling in queryFn

Always throw errors (never return them):

```typescript
// BAD - returning error state
queryFn: async () => {
  const res = await fetch(url);
  if (!res.ok) return { error: true }; // React Query won't know this failed
  return res.json();
};

// GOOD - throwing on failure
queryFn: async () => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};
```

## The `enabled` Option

### Dependent Queries

Chain queries by using data from one as the `enabled` condition for another:

```typescript
const { data: entity } = useGetEntityLive(entityAddress);

const { data: children } = usePonderQuery({
  queryFn: (db) =>
    db
      .select()
      .from(schema.entityChild)
      .where(eq(schema.entityChild.entityId, entity?.id!)),
  enabled: !!entity?.id, // Only fetch when entity is loaded
  live: false,
});
```

### Conditional Queries

Wait for user input or other conditions:

```typescript
// Only search after 2+ characters
useQuery({
  queryKey: ["coingecko-token-search", query, chainId],
  queryFn: () => searchTokens(query),
  enabled: query.length >= 2,
});
```

### Guard Pattern (Critical in This Project)

Every query with optional parameters MUST have an `enabled` guard:

```typescript
// BAD - may query with undefined params
usePonderQuery({
  queryFn: (db) =>
    db.select().from(schema.entity).where(eq(schema.entity.id, entityId!)),
  live: true,
  // Missing enabled guard!
});

// GOOD - guarded
usePonderQuery({
  queryFn: (db) =>
    db.select().from(schema.entity).where(eq(schema.entity.id, entityId!)),
  live: true,
  enabled: !!entityId && !!chainId && supportedChain,
});
```

## Data Transformation

### Use `select` for In-Query Transforms (Standard useQuery)

```typescript
useQuery({
  queryKey: ["tokens", params],
  queryFn: fetchRawTokens,
  select: (data) => data.map(transformToken), // Transform at read time
});
```

### Use `useMemo` for Transform Hooks (This Project's Pattern)

This project transforms Ponder data in hooks using `useMemo`:

```typescript
const entity = useMemo(() => {
  if (!rawData?.[0]) return undefined;
  return transformPonderEntity(rawData[0], chainId);
}, [rawData, chainId]);
```

### Never Copy Server State to Local State

```typescript
// BAD - disconnects from cache updates
const { data } = useQuery({ queryKey: ["entity"], queryFn: fetchEntity });
const [entity, setEntity] = useState(data); // Stale copy!

// GOOD - use data directly
const { data: entity } = useQuery({
  queryKey: ["entity"],
  queryFn: fetchEntity,
});
// Use entity directly in render
```

## Cache Invalidation

### After Mutations

Always invalidate affected queries after successful blockchain transactions:

```typescript
const handleSuccess = (receipt: TransactionReceipt) => {
  // Invalidate balance (always do after tx)
  queryClient.invalidateQueries({ queryKey: ["balance", { chainId }] });

  // Invalidate specific domain data
  queryClient.invalidateQueries({
    queryKey: ["ponder", "entityDetails", chainId, entityAddress],
  });
};
```

### Fuzzy vs Exact Matching

```typescript
// Fuzzy match (default) - invalidates all queries starting with this prefix
queryClient.invalidateQueries({ queryKey: ["ponder", "entityDetails"] });

// Exact match - only invalidates this exact key
queryClient.invalidateQueries({
  queryKey: ["ponder", "entityDetails", chainId, address],
  exact: true,
});
```

### invalidateQueries vs setQueryData vs removeQueries

| Method              | Use When                                            |
| ------------------- | --------------------------------------------------- |
| `invalidateQueries` | Data changed on server; refetch needed              |
| `setQueryData`      | You already have the new data (optimistic updates)  |
| `removeQueries`     | Data is no longer valid; remove from cache entirely |

This project uses `removeQueries` for clearing stale simulation data:

```typescript
queryClient.removeQueries({
  queryKey: ["simulateContract", { functionName }],
});
```

## Error Handling

### Global Error Handling

Configure on `QueryCache` for toast notifications:

```typescript
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Query failed: ${error.message}`);
    },
  }),
});
```

### Per-Query Error Handling

Use `throwOnError` to propagate to Error Boundaries:

```typescript
useQuery({
  queryKey: ["critical-data"],
  queryFn: fetchCriticalData,
  throwOnError: true,  // Propagate to nearest Error Boundary
});

// Or conditionally:
throwOnError: (error) => error.status >= 500,  // Only 5xx to boundary
```

### Error State in Components

```typescript
const { data, error, isError } = useQuery({ ... });

if (isError) {
  return <ErrorDisplay message={error.message} />;
}
```

## Performance Patterns

### Structural Sharing

React Query uses structural sharing by default -- if the refetched data is deeply equal to the cached data, references are preserved. This prevents unnecessary re-renders.

### Referential Stability with `useMemo`

Transform hooks should memoize to avoid recreating objects on every render:

```typescript
// GOOD - stable reference
const entity = useMemo(() => {
  if (!data) return undefined;
  return transformPonderEntity(data, chainId);
}, [data, chainId]);

// BAD - new object every render
const entity = data ? transformPonderEntity(data, chainId) : undefined;
```

### Avoid Over-fetching

Set appropriate `staleTime` for data that doesn't change often:

```typescript
// Token metadata changes rarely
useQuery({
  queryKey: ["token-metadata", address],
  queryFn: () => fetchTokenMetadata(address),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### keepPreviousData for Pagination

Use `placeholderData: keepPreviousData` to avoid loading flashes during pagination:

```typescript
import { keepPreviousData } from "@tanstack/react-query";

useQuery({
  queryKey: ["tokens", page],
  queryFn: () => fetchTokens(page),
  placeholderData: keepPreviousData,
});
```

## TypeScript Integration

### Let Inference Work

Don't specify generics manually when the `queryFn` is properly typed:

```typescript
// BAD - redundant generics
useQuery<Token[], Error, Token[], string[]>({
  queryKey: ["tokens"],
  queryFn: fetchTokens, // Already returns Promise<Token[]>
});

// GOOD - inferred
useQuery({
  queryKey: ["tokens"],
  queryFn: fetchTokens,
});
```

### Type Narrowing with Status Checks

Keep the query result object intact for type narrowing:

```typescript
// BAD - destructured, no narrowing
const { data, isSuccess } = useQuery({ ... });
if (isSuccess) {
  data; // Still Token[] | undefined -- no narrowing
}

// GOOD - intact object, narrowing works
const query = useQuery({ ... });
if (query.isSuccess) {
  query.data; // Token[] -- narrowed!
}
```

### Typing Query Options

Use `queryOptions` helper for type-safe reusable query configs (v5+):

```typescript
import { queryOptions } from "@tanstack/react-query";

const tokenQueryOptions = (chainId: number, address: string) =>
  queryOptions({
    queryKey: ["token", chainId, address],
    queryFn: () => fetchToken(chainId, address),
    staleTime: 60_000,
  });

// Usage
useQuery(tokenQueryOptions(chainId, address));
queryClient.prefetchQuery(tokenQueryOptions(chainId, address));
```

## Testing Patterns

### QueryClient for Tests

Create a fresh QueryClient per test with no retries:

```typescript
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
```

### Wrapper for Testing Hooks

```typescript
function createWrapper() {
  const queryClient = createTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

## Anti-Patterns to Avoid

### 1. State Synchronization

```typescript
// ANTI-PATTERN: syncing query data to local state
const { data } = useQuery({ ... });
useEffect(() => { setLocalData(data); }, [data]);

// FIX: use query data directly, or use select for transforms
```

### 2. Manual Refetch Loops

```typescript
// ANTI-PATTERN: polling with setInterval
useEffect(() => {
  const id = setInterval(() => refetch(), 5000);
  return () => clearInterval(id);
}, []);

// FIX: use refetchInterval option
useQuery({
  queryFn: fetchData,
  refetchInterval: 5000,
});
```

### 3. Missing Query Key Dependencies

```typescript
// ANTI-PATTERN: key doesn't match queryFn params
useQuery({
  queryKey: ["data"],
  queryFn: () => fetchData(filter, sort), // filter/sort not in key!
});

// FIX: include all queryFn dependencies in key
useQuery({
  queryKey: ["data", filter, sort],
  queryFn: () => fetchData(filter, sort),
});
```

### 4. Overly Broad Invalidation

```typescript
// ANTI-PATTERN: nuclear option
queryClient.invalidateQueries(); // Invalidates EVERYTHING

// FIX: scope invalidation precisely
queryClient.invalidateQueries({
  queryKey: ["ponder", "entityDetails", chainId],
});
```

### 5. Using useMutation for Blockchain Tx

```typescript
// ANTI-PATTERN in this project: React Query mutation for blockchain writes
const mutation = useMutation({ mutationFn: sendTransaction });

// FIX: use wagmi's useWriteContract + useContractWriteWithState
// See /wagmi-specialist for the correct pattern
```

## Quick Reference: Hook Patterns

### Ponder Data Hooks (src/hooks/ponder/)

| Hook                    | Data                   | Query Type                  |
| ----------------------- | ---------------------- | --------------------------- |
| `usePonderEntities`     | All entities for chain | `usePonderQuery` (one-shot) |
| `usePonderEntity`       | Single entity          | `usePonderQuery` (one-shot) |
| `usePonderActivity`     | Activity log           | `usePonderQuery`            |
| `useCoingeckoTokens`    | Token list             | `useQuery` (REST API)       |
| `useCoingeckoToken`     | Single token           | `useQuery` (REST API)       |

### Transform Hooks (src/hooks/blockchain/)

| Hook                        | Returns    | Live?     |
| --------------------------- | ---------- | --------- |
| `useGetEntityLive`          | `Entity`   | Yes (SSE) |
| `useGetEntities`            | `Entity[]` | Yes       |
| `useGetEntitiesByAddresses` | `Entity[]` | No        |

### Utility Hooks

| Hook          | Purpose                 | Query Type                     |
| ------------- | ----------------------- | ------------------------------ |
| `useGeofence` | Country geofencing      | `useQuery` (staleTime: 30M ms) |
| `useBaseName` | ENS/basename resolution | `useQuery`                     |

### Cache Management (src/hooks/blockchain/services/)

| Pattern                         | Location                    | Purpose                          |
| ------------------------------- | --------------------------- | -------------------------------- |
| `queryClient.invalidateQueries` | `useContractWriteWithState` | Refresh balance after every tx   |
| `queryClient.invalidateQueries` | Entity mutation hooks       | Refresh entity data              |
| `queryClient.removeQueries`     | `useContractWriteWithState` | Clear stale simulations on reset |
