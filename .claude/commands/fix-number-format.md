# Fix Number Formatting

Review and fix number formatting to use the project's standard formatters.

## Standard Formatters

1. **`displayNumber(val, preset?, currency?, locale?)`** - Function from `src/utils/numberFormat.ts`
   - Returns a formatted string
   - Use in plain strings, template literals, non-JSX contexts

2. **`NumberFormatter` component** - Default export from `src/components/Number.tsx`
   - Use in JSX for rendering with optional tooltip support
   - Props: `value`, `preset`, `showToolTip`, `fractionDigits`

**Available presets:** `"input"` | `"tooltip"` | `"percent"` | `"currency"` | `"number"` | `"full"` | `"fullPercent"`

## Instructions

1. Search for anti-patterns in `src/components/` and `src/pages/`:

   ```bash
   # Find toFixed calls
   grep -rn "\.toFixed(" src/components src/pages --include="*.tsx" --include="*.ts"

   # Find toLocaleString calls
   grep -rn "\.toLocaleString(" src/components src/pages --include="*.tsx" --include="*.ts"

   # Find manual percent formatting
   grep -rn "\* 100" src/components src/pages --include="*.tsx" --include="*.ts"

   # Find inline Intl.NumberFormat
   grep -rn "Intl.NumberFormat" src/components src/pages --include="*.tsx" --include="*.ts"
   ```

2. For each issue found, replace with standard formatters:

   | Anti-pattern                 | Replacement                                |
   | ---------------------------- | ------------------------------------------ |
   | `value.toFixed(2)`           | `displayNumber(value, "number")`           |
   | `value.toLocaleString()`     | `displayNumber(value)`                     |
   | `` `${value * 100}%` ``      | `displayNumber(value, "percent")`          |
   | `` `$${value}` ``            | `displayNumber(value, "currency")`         |
   | `new Intl.NumberFormat(...)` | `displayNumber()` or `<NumberFormatter />` |

3. Add imports where needed:

   ```typescript
   // For functions
   import { displayNumber } from "src/utils/numberFormat";

   // For components
   import NumberFormatter from "src/components/Number";
   ```

4. Run verification:
   ```bash
   yarn typecheck
   yarn lint
   ```

## What NOT to Fix

- Files in `src/utils/numberFormat.ts` (the source of truth)
- Files in `src/components/Number.tsx` (the component itself)
- Test files
- Type definition files
- Intentional raw number displays (e.g., form inputs that need raw values)

## Report

List each fix made:

- File path and line number
- Before/after code snippet
- Any issues that need manual review
