# Ponder Schema Reference

> **Regenerate this file** after copying to a new project.
>
> Run: `npx tsx scripts/generate-schema-reference.ts`
> Or use: `/skill-sync schema`

## ID Conventions

- **Entity IDs:** `{chainId}-{address}` (address lowercase)
- **Event IDs:** `{chainId}-{txHash}-{logIndex}` or logId
- **Position IDs:** `{chainId}-{entity1}-{entity2}` (composite)
- **Snapshot IDs:** `{entityId}-{date}` or `{entityId}-{timestamp}`

## Column Type Legend

- `PK` = primary key | `!` = NOT NULL | `?` = nullable | `=val` = default value
- Types: `text` (default), `int`, `bigint`, `bool`, `double`, `json`
- Relations: `→` = references (one), `←` = referenced by (many)

## Tables

(Run `/skill-sync schema` to populate from your `ponder.schema.ts`)
