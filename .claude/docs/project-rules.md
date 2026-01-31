# Project Rules (Single Source of Truth)

All coding conventions, safety patterns, and anti-patterns for this project. Every skill and agent references this file.

---

## 1. Tooling

| Item            | Value                                                        |
| --------------- | ------------------------------------------------------------ |
| Package manager | `yarn` (NEVER `npm`)                                         |
| Dev server      | Always running (port in `vite.config.ts`). Never start it.   |
| Verify          | `yarn typecheck && yarn lint && yarn prettier && yarn build` |
| Theme config    | `src/theme/themeConfig.tsx`                                  |

---

## 2. TypeScript Conventions

- Explicit types on all declarations -- no `any` without justification
- `interface` for object shapes, `type` for unions/intersections
- `import type { ... }` for type-only imports (required by `verbatimModuleSyntax`)
- Use path aliases: `import { Entity } from "src/types"`, not relative paths across directories
- Leverage inference -- avoid redundant type annotations
- `bigint` for all on-chain values; convert with `fixedToFloat(BigInt(value), decimals)`

---

## 3. Address Type Safety

**NEVER use `as Address` to cast potentially undefined values.**

```typescript
// PATTERN 1: Non-null assertion with enabled guard
const enabled = !!address && !!poolAddress;
args: [address!, poolAddress!]; // address guaranteed defined when enabled is true

// PATTERN 2: nullAddress fallback for simulation args
import { nullAddress } from "utils/index";
args: [params?.asset ?? nullAddress];

// PATTERN 3: Optional address return from hooks
const result: Address | undefined = data?.[0] as Address | undefined;
```

| Pattern                         | Use when                                        |
| ------------------------------- | ----------------------------------------------- |
| `value!`                        | `enabled` condition guarantees value is defined |
| `value ?? nullAddress`          | Need a valid fallback for contract simulation   |
| `value as Address \| undefined` | Returning optional addresses from hooks         |

`nullAddress` is `viem.zeroAddress` exported from `src/utils/blockchain.ts`.

---

## 4. Number Formatting

Use existing utilities. **Never create custom formatters.**

```typescript
<NumberFormatter value={0.08} preset="percent" />
displayNumber(1234.56, "currency")
```

Presets: `percent`, `currency`, `number`, `full`, `fullPercent`, `input`, `tooltip`

---

## 5. Time Constants

Use constants from `src/utils/time.ts`. **Never hardcode time calculations.**

```typescript
import { SECONDS_IN_A_DAY } from "src/utils/time";
const seconds = days * SECONDS_IN_A_DAY;
```

Available: `SECONDS_IN_A_MINUTE`, `SECONDS_IN_A_HOUR`, `SECONDS_IN_A_DAY`, `SECONDS_IN_A_YEAR`, and `MS_IN_A_*` equivalents.

---

## 6. MUI Theming

Use theme values. **Never hardcode colors, font sizes, font weights, or font families.**

```typescript
<Box bgcolor="paper.primary" />
<Typography color="text.secondary" variant="h3">Title</Typography>

const theme = useTheme();
<Box sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }} />
```

See `docs/theme-reference.md` for full palette and typography tables. Run `/analyze-theme` to find violations.

---

## 7. Chain Data

Always use `ChainContainer`. **Never import wagmi hooks directly in components.**

```typescript
const { address, chainId, supportedChain } = ChainContainer.useContainer();
```

Exception: `useConnection` inside `ChainContainer` and `useContractWriteWithState` only.

---

## 8. Contract Reads

**Never use `useReadContract` or `useReadContracts` in components or pages.** Encapsulate in `src/hooks/blockchain/`.

```typescript
export const useGetSomething = (address: Address | undefined) => {
  const { chainId, supportedChain } = ChainContainer.useContainer();
  return useReadContract({
    address,
    abi: YourContractAbi,
    functionName: "totalAssets",
    chainId,
    query: { enabled: !!address && supportedChain },
  });
};
```

---

## 9. Two-Layer Hook Pattern

Components must **never** use raw Ponder hooks directly. Always use transform hooks.

```
Component --> Transform Hook (hooks/blockchain/) --> Ponder Hook (hooks/ponder/)
              Returns typed domain object             Returns raw data
```

- **Layer 1**: Ponder Hooks (`src/hooks/ponder/`) -- Raw database queries
- **Layer 2**: Transform Hooks (`src/hooks/blockchain/`) -- Typed domain objects with `useMemo`

Create transform hooks like `useGetEntityLive` that wrap raw Ponder queries and return typed domain objects.

See [docs/data-patterns.md](./data-patterns.md) for Ponder query patterns and blockchain write templates.

---

## 10. Common Components

**Always check `src/components/Common/` before using raw MUI components.** See [docs/component-reference.md](./component-reference.md) for full APIs.

| Need              | Use                               | Not                 |
| ----------------- | --------------------------------- | ------------------- |
| Standard button   | `CommonButton`                    | `<Button>`          |
| Blockchain action | `CTAButton`                       | `CommonButton`      |
| Card container    | `CommonCard`                      | `<Card>`            |
| Dialog/modal      | `CommonDialog`                    | `<Dialog>`          |
| Search input      | `CommonSearchInput`               | `<TextField>`       |
| Text input        | `CommonTextInput`                 | `<TextField>`       |
| Token amount      | `CommonAmountInput`               | `<TextField>`       |
| Percentage        | `CommonPercentInput`              | `<TextField>`       |
| Address input     | `CommonAddressInput`              | `<TextField>`       |
| Dropdown          | `CommonSelect` + `CommonMenuItem` | `<Select>`          |
| Tooltip           | `CommonTooltip` / `TooltipIcon`   | `<Tooltip>`         |
| Address display   | `CopyableAddress`                 | Manual copy         |
| Token display     | `TokenSymbol`                     | Manual stack        |
| Number display    | `NumberFormatter`                 | `Intl.NumberFormat` |

---

## 11. React Query Rules

- **Ponder data**: `usePonderQuery` (NOT `useQuery`)
- **REST APIs**: `useQuery` from `@tanstack/react-query`
- **Blockchain writes**: wagmi write pattern. **Never `useMutation`.**
- Always use `enabled` guards
- Use `useMemo` around transform operations
- Never copy server state to `useState`
- Encapsulate all queries in hooks
- Structure keys hierarchically: `[domain, entity, scope, id]`
- Invalidate after mutations with `chainId` scope

---

## 12. What NOT to Do

### Tooling

- Never use `npm` (always `yarn`)
- Never skip verification

### TypeScript

- Never use `any` without justification
- Never use `as Address` on potentially undefined values

### Components and Styling

- Never use raw MUI `Button`, `TextField`, `Card` (use Common equivalents)
- Never use `CommonButton` for blockchain actions (use `CTAButton`)
- Never hardcode colors, font sizes, font weights, or font families
- Never create custom number formatters or time calculations
- Never create duplicate utilities (check `src/utils/` first)

### Data and Hooks

- Never use `useReadContract` in components (use `src/hooks/blockchain/`)
- Never use raw Ponder hooks in components (use transform hooks)
- Never import wagmi hooks directly (use `ChainContainer`)
- Never hardcode chain IDs
- Never skip `enabled` guards
- Never use `useMutation` for blockchain tx
- Never copy server state into `useState`
- Never forget `useMemo` around transforms
- Never invalidate queries without `chainId` scope

### Blockchain

- Never call `useSimulateContract` directly (use `useSimulateContractWithAccount`)
- Never create custom tx state management (use `useContractWriteWithState`)

### Design

- Never add decoration without function
- Never add animation without communication purpose
- Never design without reading existing code first
