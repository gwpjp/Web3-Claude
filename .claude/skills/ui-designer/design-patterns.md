# Design Patterns Reference

> **Update this file** after copying to a new project with your actual page layouts.

Concrete design patterns used throughout this project, extracted from the actual codebase.

## Page Layout Patterns

### Dashboard Page

Full-width layout with responsive padding, staggered entrance animations:

```tsx
<Box width="100%" px={{ xs: 2, sm: 4, lg: 6 }} py={4}>
  <motion.div variants={containerVariants} initial="hidden" animate="show">
    {/* Header: title + action buttons, responsive row/column */}
    <motion.div variants={itemVariants}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
        mb={3}>
        <Box>
          <Typography variant="h2" mb={1}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview description text.
          </Typography>
        </Box>
        <ActionButtons />
      </Box>
    </motion.div>

    {/* Content sections with staggered animation */}
    <motion.div variants={itemVariants}>
      <ContentSection />
    </motion.div>
  </motion.div>
</Box>
```

### Detail Page

(Add your detail page patterns here)

### Form Page

(Add your form page patterns here)

## Card Patterns

### Data Card

```tsx
<CommonCard>
  <Box p={3}>
    <Typography variant="caption" color="text.secondary">
      LABEL
    </Typography>
    <Typography variant="h3">
      <NumberFormatter value={value} preset="currency" />
    </Typography>
  </Box>
</CommonCard>
```

## Animation Config

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
```
