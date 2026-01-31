# Anti-Slop Pattern Catalog

Concrete examples of generic AI design patterns and their creative alternatives, using this project's theme system.

## Typography Slop

### The Incremental Hierarchy

**Slop:**

```tsx
<Typography variant="h4">Section Title</Typography>     {/* 20px */}
<Typography variant="body1">Description</Typography>     {/* 14px */}
<Typography variant="body2">Detail text</Typography>     {/* 12px */}
```

Sizes: 20 → 14 → 12. Ratio: 1.4x → 1.2x. Barely distinguishable.

**Creative alternative:**

```tsx
<Typography variant="h2">Section Title</Typography>     {/* 32px */}
<Typography variant="body1">Description</Typography>     {/* 14px */}
<Typography variant="caption">DETAIL LABEL</Typography>  {/* 12px mono */}
```

Sizes: 32 → 14 → 12. Ratio: 2.3x jump + font family change for labels. Clear hierarchy.

### The Uniform Weight

**Slop:** Every heading uses the same weight variant. All body text at weight 400. No contrast.

**Creative alternative:** Pair `h2` (500 weight) headers with `caption` (600 weight, mono) labels. The weight + font family shift creates two distinct "voices" — editorial and data.

### The Default Label

**Slop:**

```tsx
<Typography variant="body2" color="text.secondary">Total Value Locked</Typography>
<Typography variant="h4">$1,234,567</Typography>
```

**Creative alternative:**

```tsx
<Typography variant="caption">TOTAL VALUE LOCKED</Typography>  {/* 12px/600/mono/uppercase */}
<Typography variant="h3">$1,234,567</Typography>              {/* 24px/500 */}
```

The `caption` variant is mono, uppercase, 600 weight — a deliberate visual contrast from the value it labels.

## Color Slop

### The Grayscale Default

**Slop:** 90% of the interface is `text.primary` (black) and `text.secondary` (gray) on `paper.primary` (light gray). Color only appears in buttons. The palette exists but goes unused.

**Creative alternative:** Use the full status palette semantically:

- `success.main` for positive financial metrics (revenue, profit, positive APY)
- `warning.main` for attention-needed states (pending changes, low utilization)
- `error.main` for negative states (losses, validation errors)
- `primary.main` for primary CTAs and key metrics
- `alpha()` tints of these colors for background badges: `alpha(theme.palette.success.main, 0.1)` for positive metric backgrounds

### The Even Color Distribution

**Slop:** Every section gets a different accent color in equal proportion. No dominant color. Looks like a color sampler, not a designed interface.

**Creative alternative:** One dominant palette for the page's primary purpose:

- Dashboard overview: `primary.main` dominates — it's the brand, it's the CTA color
- Success/earnings views: `success.main` dominates — the content is about gains
- Warning/action-needed: `warning.main` dominates — urgency drives the palette
- Other colors appear as accents, not co-equals

### The Naked Card

**Slop:**

```tsx
<CommonCard>
  {/* Content directly inside with no visual treatment */}
</CommonCard>
```

**Creative alternative:**

```tsx
<CommonCard sx={{ p: 3 }}>
  <Box display="flex" alignItems="center" gap={2} mb={2}>
    <Box
      sx={{
        p: 1,
        borderRadius: 2,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        display: "flex",
      }}>
      <MetricIcon />
    </Box>
    <Typography variant="caption">METRIC LABEL</Typography>
  </Box>
  {/* Content */}
</CommonCard>
```

The colored icon badge creates a visual anchor and category signal.

## Layout Slop

### The Perfect Grid

**Slop:**

```tsx
<Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={3}>
  <Card>Same height</Card>
  <Card>Same height</Card>
  <Card>Same height</Card>
</Box>
```

Three identical cards. No hierarchy. User doesn't know where to look first.

**Creative alternative:**

```tsx
<Box display="grid" gridTemplateColumns={{ md: "2fr 1fr" }} gap={3}>
  <CommonCard sx={{ p: 3 }}>
    {/* Primary content — bigger, more prominent */}
  </CommonCard>
  <Stack spacing={3}>
    <CommonCard sx={{ p: 2 }}>{/* Secondary metric */}</CommonCard>
    <CommonCard sx={{ p: 2 }}>{/* Tertiary metric */}</CommonCard>
  </Stack>
</Box>
```

The 2:1 split creates a clear primary reading path. The stacked secondary cards occupy less visual weight.

### The Centered Everything

**Slop:** Every section center-aligned. No left anchor. Text blocks centered (hard to scan). Buttons centered. Headers centered.

**Creative alternative:** Left-align content blocks (easier to scan). Reserve centering for:

- Empty states (deliberate focus on the single message)
- Hero moments (one per page, at most)
- Single CTAs at the bottom of a form

### The Equal Column Split

**Slop:**

```tsx
<Stack direction="row" spacing={3}>
  <Box flex={1}>Left content</Box>
  <Box flex={1}>Right content</Box>
</Stack>
```

**Creative alternative:**

```tsx
<Stack direction={{ xs: "column", md: "row" }} spacing={3}>
  <Box flex={3}>{/* Primary content — tables, charts, main data */}</Box>
  <Box flex={2}>{/* Supporting content — summary, actions, filters */}</Box>
</Stack>
```

60/40 split signals which content is primary vs supporting.

## Visual Hierarchy Slop

### The Flat Data Wall

**Slop:** A page showing 10+ metrics all at the same visual weight. Every number in `body1` or `h5`. No metric is more important than any other.

**Creative alternative:** Choose the 1-2 most important metrics and make them dominant:

```tsx
{/* Hero metric */}
<Typography variant="h1">
  <NumberFormatter value={totalTVL} preset="currency" />
</Typography>
<Typography variant="caption">TOTAL VALUE LOCKED</Typography>

{/* Supporting metrics in smaller cards */}
<Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2}>
  {metrics.map(m => (
    <Box key={m.key}>
      <Typography variant="caption">{m.label}</Typography>
      <Typography variant="h5">
        <NumberFormatter value={m.value} preset={m.preset} />
      </Typography>
    </Box>
  ))}
</Box>
```

### The No-Entry-Point Page

**Slop:** User lands on a page and every section competes for attention equally. No visual "start here."

**Creative alternative:** Design one clear entry point per page:

- Dashboard: Total TVL or portfolio value as the dominant hero number
- Entity detail: Entity name + APY as the anchor
- Creation form: Progress indicator or section title that orients the user

## Spatial Rhythm Slop

### The Uniform Gap

**Slop:**

```tsx
<Stack spacing={2}>
  <Header />
  <Description />
  <InputGroup />
  <AnotherInputGroup />
  <SubmitButton />
</Stack>
```

Every element has the same 16px gap. No grouping. No breathing room variation.

**Creative alternative:**

```tsx
<Stack spacing={3}>
  {/* Header group — tight internal spacing */}
  <Box>
    <Typography variant="h3" mb={1}>
      Section Title
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Description text
    </Typography>
  </Box>

  {/* Input group — tight internal spacing */}
  <Stack spacing={1.5}>
    <Typography variant="caption">FIELD LABEL</Typography>
    <InputComponent />
  </Stack>

  {/* Another input group */}
  <Stack spacing={1.5}>
    <Typography variant="caption">ANOTHER FIELD</Typography>
    <InputComponent />
  </Stack>

  {/* Action — extra breathing room above */}
  <Box mt={1}>
    <CTAButton text="Submit" onClick={handle} actionChainId={chainId} />
  </Box>
</Stack>
```

Tight spacing (1-1.5) within groups, generous spacing (3-4) between groups. Creates visual clusters.

### The Padding-Everywhere Card

**Slop:** Every card uses identical padding (`p={3}`). Internal content has no spatial variation.

**Creative alternative:** Vary padding based on card purpose:

- Stat cards: `p={3}` (breathing room for the key metric)
- Dense data cards: `p={{ xs: 1.5, md: 2.5 }}` (responsive, efficient for tables)
- Action cards: `p={3}` top/sides, extra `pt={2}` for the CTA area
- Empty state cards: `p={6}` (generous space focuses on the message)

## Atmospheric Depth Slop

### The Flat White Page

**Slop:** White background. White cards. No depth. No visual layers. Everything exists on the same plane.

**Creative alternative:** Create depth through surface variation:

- Page background: `background.default` (#FFF)
- Primary cards: `paper.primary` (#F2F4F7)
- Nested containers within cards: `alpha(theme.palette.divider, 0.3)` or a subtle `1px solid` border
- Active/selected states: `alpha(theme.palette.primary.main, 0.08)` background tint

### The Borderless Blob

**Slop:** Content sections blur together with no visual separation. Or: every element has the same border treatment.

**Creative alternative:** Use borders purposefully:

- `divider` for horizontal section dividers within cards
- `border.primary` for subtle card boundaries
- `border.secondary` for interactive element boundaries (outlined buttons, selects)
- No border when cards already have sufficient `paper.primary` background contrast against the page

## Motion Slop

### The Sprinkled Micro-Interaction

**Slop:** Random hover effects, arbitrary fade-ins on every element, bouncy buttons. Animation everywhere with no coherent purpose.

**Creative alternative:** One orchestrated entrance per page using `containerVariants` + `itemVariants` from `src/config/motionConfig.ts`. Each major section fades and slides up in sequence (50px, 0.4s, 0.05s stagger). Then the page is static — no more animation until a user action triggers a state change.

### The Missing Entrance

**Slop:** Page loads with all content instantly visible. No sense of arrival or orientation.

**Creative alternative:** Staggered entrance with `containerVariants`:

```tsx
<motion.div variants={containerVariants} initial="hidden" animate="show">
  <motion.div variants={itemVariants}>{/* Header section */}</motion.div>
  <motion.div variants={itemVariants}>{/* Stats section */}</motion.div>
  <motion.div variants={itemVariants}>{/* Content section */}</motion.div>
</motion.div>
```

The stagger (0.05s between sections) guides the eye from top to bottom, giving the user a natural reading order.

## Meta-Pattern: The "Could Be Any App" Test

The ultimate slop test: if you removed the logo and brand colors, would this UI be indistinguishable from any other DeFi dashboard?

Signs you'd fail this test:

- Generic card grid with equal-weight metrics
- Standard left sidebar navigation
- Blue/purple gradient hero section
- Identical table rows with no visual differentiation
- "Create New" button in the top right with a plus icon
- Toast notifications in the bottom right

Signs you'd pass:

- Typography hierarchy that creates a distinctive reading rhythm
- Color usage that reflects the content's meaning, not just brand placement
- Layout choices that prioritize this app's specific information architecture
- Spatial rhythm that groups information into meaningful clusters
- A clear visual identity that persists across pages
