# Contracts Reference

> **Regenerate this file** after copying to a new project.
>
> Run: `/skill-sync contracts`

Quick reference for all contracts in `src/services/contracts/generated.ts`.

## Contract Categories

(Run `/skill-sync contracts` to populate from your `generated.ts`)

## ABI Import Pattern

```typescript
import { YourContractAbi } from "src/services/contracts/generated";
```

## Contract Address Pattern

```typescript
import { CONTRACT_ADDRESSES } from "src/config/contracts";

const address = CONTRACT_ADDRESSES[chainId]?.YourContract;
```
