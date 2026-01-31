# MUI Theme Reference

> Source: `src/theme/themeConfig.tsx` (shared across multiple projects)

## Palette Colors

| Category    | Values                                                          |
| ----------- | --------------------------------------------------------------- |
| `primary`   | `main` (#ed7e50)                                                |
| `secondary` | `main` (#9dc4fa)                                                |
| `tertiary`  | `main` (#AEA7F9)                                                |
| `error`     | `main` (#DC2626)                                                |
| `success`   | `main` (#00BA62)                                                |
| `warning`   | `main` (#F7941A)                                                |
| `text`      | `primary`, `secondary`, `neutral`                               |
| `border`    | `primary`, `secondary`, `neutral`                               |
| `paper`     | `primary` (#F2F4F7)                                             |
| `percent`   | `primary`, `neutral`                                            |
| `chart`     | `primary`, `secondary`, `tertiary`, `default`, `active`, `idle` |
| `activity`  | `deposit`, `withdrawal`, `allocation`, `repayment`, `interest`  |
| `button`    | `disabled`                                                      |
| `divider`   | #DCDEE0                                                         |

## Typography Variants

| Variant     | Size | Weight | Font                  | Use For            |
| ----------- | ---- | ------ | --------------------- | ------------------ |
| `title`     | 64px | 400    | Aeonik                | Hero titles        |
| `h1`        | 36px | 600    | Aeonik                | Page titles        |
| `h2`        | 32px | 500    | Aeonik                | Section headers    |
| `h3`        | 24px | 500    | Aeonik                | Card titles        |
| `h4`        | 20px | 500    | Aeonik                | Subsection headers |
| `h5`        | 18px | 400    | Aeonik                | Large body text    |
| `h6`        | 15px | 400    | Aeonik                | Small headers      |
| `subtitle1` | 16px | 400    | Aeonik                | Emphasized body    |
| `subtitle2` | 12px | 400    | Aeonik                | Secondary labels   |
| `body1`     | 14px | 400    | Aeonik                | Default body text  |
| `body2`     | 12px | 400    | Aeonik                | Small body text    |
| `caption`   | 12px | 600    | PP Neue Montreal Mono | Labels (uppercase) |
| `footer`    | 12px | 400    | Aeonik                | Footer text        |
| `button`    | 14px | 400    | Aeonik                | Button text        |
| `overline`  | 10px | 500    | Aeonik                | Overline text      |

## Quick Usage

```typescript
// Colors
<Box bgcolor="paper.primary" />
<Typography color="text.secondary" />
<Box sx={{ borderColor: "border.primary" }} />

// Typography
<Typography variant="h3">Title</Typography>
<Typography variant="body1">Content</Typography>
<Typography variant="caption">LABEL</Typography>

// With alpha transparency
import { alpha, useTheme } from "@mui/material";
const theme = useTheme();
bgcolor={alpha(theme.palette.success.main, 0.1)}
```
