# Blockchain Hook Reference

> **Regenerate this file** after copying to a new project.
>
> Run: `/skill-sync hooks`

Complete catalog of hooks in `src/hooks/blockchain/`. All hooks use `ChainContainer` for wallet/chain state.

## Service Layer (`services/`)

These are internal utilities used by write hooks. Never call directly from components.

| Hook                             | Purpose                                                                                                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useContractWriteWithState`      | Transaction lifecycle manager: simulate -> sign -> submit -> confirm. Handles Safe wallets, gas estimation, error toasts, geofencing, query invalidation. Returns `ContractWriteQuery`. |
| `useSimulateContractWithAccount` | Wrapper around wagmi's `useSimulateContract` that auto-injects the connected account from `ChainContainer`.                                                                             |

## Read Hooks (`useGet*`)

(Run `/skill-sync hooks` to populate from your `src/hooks/blockchain/`)

## Write Hooks (`use[Action]`)

(Run `/skill-sync hooks` to populate from your `src/hooks/blockchain/`)

## Hook Templates

### Read Hook

```typescript
export const useGetSomething = (address: Address | undefined) => {
  const { chainId, supportedChain } = ChainContainer.useContainer();
  return useReadContract({
    address,
    abi: YourAbi,
    functionName: "functionName",
    chainId,
    query: { enabled: !!address && supportedChain },
  });
};
```

### Write Hook

```typescript
export const useDoAction = (params: ActionParams | undefined) => {
  const { chainId, supportedChain } = ChainContainer.useContainer();

  const simulation = useSimulateContractWithAccount({
    address: params?.contractAddress,
    abi: YourAbi,
    functionName: "actionName",
    args: params ? [params.arg1, params.arg2] : undefined,
    chainId,
    query: { enabled: !!params && supportedChain },
  });

  const write = useContractWriteWithState({
    onSuccess: () => {
      // Invalidate relevant queries
    },
  });

  return { simulation, write };
};
```
