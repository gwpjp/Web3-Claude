# Sync Targets Reference

Detailed documentation of each knowledge file that requires sync, including the source of truth, what to extract, and the expected format.

---

## 1. Schema Reference

**Target:** `.claude/knowledge/domain/schema-reference.md`
**Source:** `ponder.schema.ts` or `src/services/ponder/ponder.schema.ts`
**Trigger:** Any change to ponder schema (tables, columns, indexes, relations)

### What to Extract

```typescript
// From onchainTable() calls:
export const entity = onchainTable("entity", (t) => ({
  id: t.text().primaryKey(), // → Column: id (text, PK)
  chainId: t.integer().notNull(), // → Column: chainId (integer, NOT NULL)
  owner: t.hex(), // → Column: owner (hex, nullable)
  // ...
}));

// From index() calls within tables:
(table) => ({
  chainIdIdx: index().on(table.chainId), // → Index: chainIdIdx on chainId
});

// From relations() calls:
export const entityRelations = relations(entity, ({ one, many }) => ({
  children: many(childEntity), // → Relation: entity → many childEntity
  parent: one(parentEntity), // → Relation: entity → one parentEntity
}));
```

### Output Format

```markdown
## Tables

### entity

| Column  | Type    | Nullable | Notes                           |
| ------- | ------- | -------- | ------------------------------- |
| id      | text    | No       | PK, format: {chainId}-{address} |
| chainId | integer | No       |                                 |
| owner   | hex     | Yes      |                                 |

**Indexes:** chainIdIdx (chainId), ownerIdx (owner)
**Relations:** children (many childEntity), parent (one parentEntity)

### childEntity

...
```

### Regeneration Script

If `scripts/generate-schema-reference.ts` exists, run it:

```bash
npx tsx scripts/generate-schema-reference.ts
```

---

## 2. Wagmi Hook Reference

**Target:** `.claude/knowledge/domain/hook-reference.md`
**Source:** `src/hooks/blockchain/`
**Trigger:** Hook added, removed, renamed, or signature changed

### What to Extract

**For each `.ts` file in src/hooks/blockchain/:**

1. **Read Hooks** (useGet*.ts, excluding *Live.ts):

   ```typescript
   export const useGetEntityTotalAssets = (
     entityAddress: Address | undefined
   ) => {
     // ...
     return { data, isLoading, error };
   };
   ```

   Extract: name, parameters, return shape

2. **Transform Hooks** (useGet\*Live.ts):

   ```typescript
   export const useGetEntityLive = (entityAddress: Address | undefined) => {
     // Uses usePonderQuery internally
     // Returns typed Entity
   };
   ```

   Extract: name, what ponder data it uses, return type

3. **Write Hooks** (use\*.ts with useContractWriteWithState):
   ```typescript
   export const useDeposit = (
     entityAddress: Address | undefined,
     amount: bigint,
     simulateEnabled: boolean,
     // ...
   ) => { ... };
   ```
   Extract: name, contract function, parameters

### Output Format

```markdown
## Read Hooks

| Hook                    | File                       | Parameters             | Returns                            |
| ----------------------- | -------------------------- | ---------------------- | ---------------------------------- |
| useGetEntityTotalAssets | useGetEntityTotalAssets.ts | entityAddress: Address | { data: bigint, isLoading, error } |

## Transform Hooks (Live SSE)

| Hook             | File                | Ponder Source                 | Returns |
| ---------------- | ------------------- | ----------------------------- | ------- |
| useGetEntityLive | useGetEntityLive.ts | entity, entityChild tables    | Entity  |

## Write Hooks

| Hook       | File          | Contract Function | Key Parameters        |
| ---------- | ------------- | ----------------- | --------------------- |
| useDeposit | useDeposit.ts | deposit           | entityAddress, amount |
```

---

## 3. Ponder Hook Reference

**Target:** `.claude/knowledge/domain/ponder-reference.md`
**Source:** `src/hooks/ponder/`
**Trigger:** Ponder hook added, removed, or query pattern changed

### What to Extract

**From src/hooks/ponder/index.ts:**

```typescript
export * from "./usePonderEntity";
export * from "./usePonderEntities";
// ...
```

**From each hook file:**

```typescript
export function usePonderEntity(entityAddress?: string) {
  const { data } = usePonderQuery({
    queryFn: (db) => db.select().from(schema.entity).where(...),
    live: true,  // ← Note: live vs one-shot
    enabled: !!entityAddress,
  });
}
```

### Output Format

```markdown
## Ponder Hooks

| Hook                     | Table(s)    | Live | Parameters                       |
| ------------------------ | ----------- | ---- | -------------------------------- |
| usePonderEntity          | entity      | Yes  | entityAddress: string            |
| usePonderEntities        | entity      | No   | chainId: number, limit?: number  |
| usePonderEntityChildren  | entityChild | No   | entityId: string                 |
```

---

## 4. Type Index

**Target:** `.claude/knowledge/domain/type-index.json`
**Source:** `src/types/`
**Trigger:** Type added, removed, or significantly modified

### What to Extract

**From each file in src/types/:**

1. **Interfaces:**

   ```typescript
   export interface Entity extends BaseEntity {
     children: EntityChild[];
     // ...
   }
   ```

2. **Type aliases:**

   ```typescript
   export type EntityStatus = "active" | "paused" | "deprecated";
   ```

3. **Transform functions:**
   ```typescript
   export function transformPonderEntity(
     raw: PonderEntity,
     chainId: number
   ): Entity { ... }
   ```

### Output Format

```json
{
  "lastSync": "2024-01-29T14:00:00Z",
  "interfaces": [
    {
      "name": "Entity",
      "file": "entity.ts",
      "extends": "BaseEntity",
      "description": "Full entity with children and computed fields"
    },
    {
      "name": "BaseEntity",
      "file": "entity.ts",
      "extends": null,
      "description": "Core entity properties from ponder"
    }
  ],
  "types": [
    {
      "name": "EntityStatus",
      "file": "entity.ts",
      "kind": "union",
      "values": ["active", "paused", "deprecated"]
    }
  ],
  "transforms": [
    {
      "name": "transformPonderEntity",
      "file": "entity.ts",
      "input": "PonderEntity",
      "output": "Entity",
      "description": "Converts raw ponder data to typed Entity"
    }
  ],
  "utilities": [
    {
      "name": "percentToBps",
      "file": "utils.ts",
      "signature": "(percent: number) => number"
    }
  ]
}
```

---

## 5. Theme Reference

**Target:** `.claude/docs/theme-reference.md`
**Source:** `src/theme/themeConfig.tsx`
**Trigger:** Palette color change, typography variant change, new theme key

### What to Extract

**Palette:**

```typescript
palette: {
  primary: { main: "#ed7e50" },
  secondary: { main: "#9dc4fa" },
  text: {
    primary: "#000",
    secondary: "#777",
    neutral: "#141414",
  },
  // ...
}
```

**Typography:**

```typescript
typography: {
  h1: { fontSize: 36, fontWeight: 600, fontFamily: "Aeonik" },
  body1: { fontSize: 14, fontWeight: 400, fontFamily: "Aeonik" },
  caption: { fontSize: 12, fontWeight: 600, fontFamily: "PP Neue Montreal Mono" },
  // ...
}
```

### Output Format

```markdown
## Palette Colors

| Category    | Values                            |
| ----------- | --------------------------------- |
| `primary`   | `main` (#ed7e50)                  |
| `secondary` | `main` (#9dc4fa)                  |
| `text`      | `primary`, `secondary`, `neutral` |

## Typography Variants

| Variant   | Size | Weight | Font                  | Use For            |
| --------- | ---- | ------ | --------------------- | ------------------ |
| `h1`      | 36px | 600    | Aeonik                | Page titles        |
| `body1`   | 14px | 400    | Aeonik                | Default body text  |
| `caption` | 12px | 600    | PP Neue Montreal Mono | Labels (uppercase) |
```

---

## 6. Component Reference

**Target:** `.claude/docs/component-reference.md`
**Source:** `src/components/Common/`
**Trigger:** New Common component, props change, behavior change

### What to Extract

**For each component file:**

1. **Props interface:**

   ```typescript
   interface CommonButtonProps extends ButtonProps {
     buttonType: "primary" | "secondary" | "outlined";
     buttonHeight?: "sm" | "md" | "lg";
   }
   ```

2. **Key implementation details:**
   - Default values
   - Special behaviors
   - What it wraps (if applicable)

3. **Usage patterns** (from JSDoc or infer)

### Output Format

````markdown
## CommonButton

**File:** `src/components/Common/CommonButton.tsx`
**Use for:** All standard buttons

```typescript
interface Props extends ButtonProps {
  buttonType: "primary" | "secondary" | "outlined" | "text";
  buttonHeight?: "sm" | "md" | "lg"; // 32px | 40px | 48px
}
```
````

**Key behaviors:**

- Maps buttonType to MUI variant and color
- Default: size="large", fullWidth={true}

```tsx
<CommonButton buttonType="primary" onClick={handleClick}>
  Submit
</CommonButton>
```

````

---

## 7. Routes Config

**Target:** `.claude/agents/qa/routes.json`
**Source:** Router configuration + `src/pages/`
**Trigger:** Page added, removed, or route path changed

### What to Extract

1. **Route paths** from router config (e.g., react-router setup)
2. **Page names** from file names or component names
3. **Address requirements** (`:address` params)
4. **Focus areas** for each QA skill (infer from page content)

### Output Format

```json
{
  "routes": [
    {
      "path": "/",
      "name": "Dashboard",
      "requiresAddress": false,
      "focus": {
        "visual-qa": "Layout renders, tables load",
        "accessibility": "Table navigation, row selection",
        "responsive": "Table columns adapt"
      }
    },
    {
      "path": "/entity/:address",
      "name": "Entity Detail",
      "requiresAddress": true,
      "focus": {
        "visual-qa": "Entity data loads, charts display",
        "accessibility": "Data display, action buttons"
      }
    }
  ]
}
````

---

## 8. Contracts Reference

**Target:** `.claude/knowledge/domain/contracts-reference.md`
**Source:** `src/services/contracts/generated.ts`
**Trigger:** Contract ABI added, removed, or function signatures changed

### What to Extract

The `generated.ts` file contains auto-generated contract ABIs. Extract a summary reference:

1. **Contract names and ABI exports:**

   ```typescript
   export const YourContractAbi = [...] as const;
   export const YourFactoryAbi = [...] as const;
   // → Contract: YourContract, Export: YourContractAbi
   ```

2. **Categorize by domain:**
   - Core Contracts
   - Factory Contracts
   - Access Control Contracts
   - Oracle Contracts

3. **Key functions by use case:** Extract common function signatures used by hooks

4. **Hook-to-contract mapping:** Which hooks use which contracts

### Output Format

```markdown
## Contract Categories

### Core Contracts

| Contract       | ABI Export        | Purpose                             |
| -------------- | ----------------- | ----------------------------------- |
| `YourContract` | `YourContractAbi` | Main contract - deposits, withdrawals |

### Factory Contracts

...

## Key Functions by Use Case

### Core Operations

\`\`\`typescript
deposit(assets: bigint, receiver: Address) → shares: bigint
withdraw(assets: bigint, receiver: Address, owner: Address) → shares: bigint
\`\`\`

## Contracts Used by Hooks

| Hook                        | Contract(s) Used   |
| --------------------------- | ------------------ |
| `useDeposit`, `useWithdraw` | `YourContractAbi`  |
```

### Staleness Detection

```typescript
// Count ABI exports in generated.ts
const content = await read("src/services/contracts/generated.ts");
const abiExports = content.match(/export const \w+Abi = /g);
const actualCount = abiExports?.length ?? 0;

// Count in reference
const refContent = await read("contracts-reference.md");
const documentedAbis = refContent.match(/`\w+Abi`/g);
// Compare unique counts
```

---

## Staleness Indicators

Signs that a knowledge file is stale:

1. **Claude mentions a hook that doesn't exist** → hook-reference.md is stale
2. **Claude uses wrong table/column names** → schema-reference.md is stale
3. **Claude suggests wrong type names** → type-index.json is stale
4. **Claude uses wrong palette colors** → theme-reference.md is stale
5. **QA skills skip new pages** → routes.json is stale
6. **Claude doesn't know about new Common components** → component-reference.md is stale
7. **Claude references wrong contract ABIs or missing contracts** → contracts-reference.md is stale

---

## Sync Frequency Recommendations

| File                   | Sync Frequency                     |
| ---------------------- | ---------------------------------- |
| schema-reference.md    | After any ponder.schema.ts change  |
| hook-reference.md      | After adding/removing hooks        |
| contracts-reference.md | After contract ABI changes (rare)  |
| ponder-reference.md    | After adding/removing ponder hooks |
| type-index.json        | Weekly or after type refactors     |
| theme-reference.md     | After theme changes (rare)         |
| component-reference.md | After Common component changes     |
| routes.json            | After adding new pages             |

**Recommended:** Run `/skill-sync` before major releases or after large refactors.
