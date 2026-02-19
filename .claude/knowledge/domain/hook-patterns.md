# Hook Creation Patterns

Complete guide to creating ponder hooks, transform hooks, contract read hooks, and contract write hooks.

## 1. Ponder Hook (Layer 1: Raw Data)

Location: `src/hooks/ponder/usePonder[Entity].ts`

### Template: Single Entity Lookup

```typescript
import { usePonderQuery } from "@ponder/react";
import { eq } from "@ponder/client";
import { schema } from "src/services/ponder/ponderClient";
import { ChainContainer } from "src/containers/ChainContainer";

/**
 * Hook to fetch a single entity by address with live updates.
 */
export function usePonderEntity(entityAddress?: string) {
  const { chainId, supportedChain } = ChainContainer.useContainer();

  // Ponder entity ID format: {chainId}-{address}
  const entityId = entityAddress
    ? `${chainId}-${entityAddress.toLowerCase()}`
    : undefined;

  const { data, isLoading, error, refetch } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(schema.yourTable)
        .where(eq(schema.yourTable.id, entityId!)),
    live: true, // SSE for detail views
    enabled: !!entityId && supportedChain,
  });

  return { data: data?.[0], isLoading, error, refetch };
}
```

### Template: List Query

```typescript
export function usePonderEntityList() {
  const { chainId, supportedChain } = ChainContainer.useContainer();

  return usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(schema.yourTable)
        .where(eq(schema.yourTable.chainId, chainId!))
        .orderBy(desc(schema.yourTable.createdAt))
        .limit(50),
    live: false, // No SSE for lists
    enabled: !!chainId && supportedChain,
  });
}
```

## 2. Transform Hook (Layer 2: Typed Domain Objects)

Location: `src/hooks/blockchain/useGet[Entity]Live.ts`

```typescript
import { useMemo } from "react";
import { usePonderQuery } from "@ponder/react";
import { eq } from "@ponder/client";
import { schema } from "src/services/ponder/ponderClient";
import { ChainContainer } from "src/containers/ChainContainer";
import type { YourDomainType } from "src/types";
import { transformPonderEntity } from "src/types";

export function useGetEntityLive(entityAddress?: string): {
  data: YourDomainType | undefined;
  isLoading: boolean;
} {
  const { chainId, supportedChain } = ChainContainer.useContainer();
  const entityId = entityAddress
    ? `${chainId}-${entityAddress.toLowerCase()}`
    : undefined;

  const { data: rawData, isLoading } = usePonderQuery({
    queryFn: (db) =>
      db.select().from(schema.yourTable).where(eq(schema.yourTable.id, entityId!)),
    live: true,
    enabled: !!entityId && supportedChain,
  });

  const data = useMemo(() => {
    if (!rawData?.[0]) return undefined;
    return transformPonderEntity(rawData[0]);
  }, [rawData]);

  return { data, isLoading };
}
```

## 3. Contract Read Hook

Location: `src/hooks/blockchain/useGet[Something].ts`

```typescript
import type { Address } from "viem";
import { useReadContract } from "wagmi";
import { ChainContainer } from "src/containers/ChainContainer";
import { YourContractAbi } from "src/services/contracts/generated";

export const useGetSomething = (address: Address | undefined) => {
  const { chainId, supportedChain } = ChainContainer.useContainer();

  return useReadContract({
    address,
    abi: YourContractAbi,
    functionName: "functionName",
    chainId,
    query: {
      enabled: !!address && supportedChain,
    },
  });
};
```

## 4. Contract Write Hook

Location: `src/hooks/blockchain/use[Action].ts`

```typescript
import type { Address } from "viem";
import { ChainContainer } from "src/containers/ChainContainer";
import { useSimulateContractWithAccount } from "src/hooks/blockchain/services/useSimulateContractWithAccount";
import { useContractWriteWithState } from "src/hooks/blockchain/services/useContractWriteWithState";
import { YourContractAbi } from "src/services/contracts/generated";
import { useQueryClient } from "@tanstack/react-query";

interface ActionParams {
  contractAddress: Address;
  arg1: bigint;
  arg2: Address;
}

export const useDoAction = (params: ActionParams | undefined) => {
  const { chainId, supportedChain } = ChainContainer.useContainer();
  const queryClient = useQueryClient();

  // Step 1: Simulate
  const simulation = useSimulateContractWithAccount({
    address: params?.contractAddress,
    abi: YourContractAbi,
    functionName: "actionName",
    args: params ? [params.arg1, params.arg2] : undefined,
    chainId,
    query: {
      enabled: !!params && supportedChain,
    },
  });

  // Step 2: Write with state management
  const write = useContractWriteWithState({
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["yourQueryKey", chainId] });
    },
  });

  return { simulation, write };
};
```

## Key Rules

1. **Always use `ChainContainer`** for `chainId` and `supportedChain`
2. **Always use `enabled` guards** to prevent queries with undefined params
3. **Use `useMemo`** around transform operations for referential stability
4. **Use `live: true`** for detail views, `live: false` for lists
5. **Entity IDs** follow format: `{chainId}-{address.toLowerCase()}`
