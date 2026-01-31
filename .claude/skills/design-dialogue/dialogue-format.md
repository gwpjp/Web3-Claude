# Dialogue Format Reference

This document provides examples and guidance for conducting effective design dialogues.

## Example: Good Dialogue

Here's an example showing genuine engagement between perspectives:

### Round 1: Opening Positions

#### SPECIALIST (Anti-Slop Lens)

**Dimension Scores:**

- Typography Contrast: slop
- Color Commitment: adequate
- Layout Dynamism: slop
- Visual Hierarchy: adequate
- Spatial Rhythm: slop
- Atmospheric Depth: slop

**Patterns Identified:**

1. **Uniform header sizes** — h4 (20px) used for all section headers → Use h2 (32px) for primary sections, h4 for subsections (2.3x ratio)
2. **Equal-width columns** — 50/50 split for entity details → 60/40 split with main content dominant
3. **Monotone cards** — All cards paper.primary with no depth → Use alpha(paper.secondary, 0.5) for nested cards

**Opening Recommendations:**

1. Increase primary header to h2 for 3x+ typography contrast
2. Change to asymmetric 60/40 layout
3. Add surface variation with alpha tints

---

#### JONY (Holistic Lens)

**On the Specialist's Analysis:**

The typography observation is sharp — the uniform sizes do create a flat reading experience. However, I question whether the 60/40 split serves the design's _essence_.

This is an entity detail page. The user's goal is understanding their position. Currently both columns show equally important information: left shows the numbers, right shows the actions. Making one "primary" could create false hierarchy — suggesting the numbers matter more than the actions, or vice versa.

**What Specialist Missed:**

The real problem isn't equal columns — it's that there's no clear entry point. The user arrives and must scan everything to orient themselves. Before changing layout ratios, we should ask: what is the ONE thing this page wants to communicate first?

If it's "your current position is healthy" — that needs a dominant hero element that neither column arrangement addresses.

---

### Round 2: Refinement

#### SPECIALIST responds:

**Defending:**
Typography contrast and surface depth — these serve scanning efficiency, which IS the user goal. Professional users need to quickly differentiate sections.

**Conceding:**
The 60/40 split was a reflex toward "asymmetry is better." You're right that equal columns may actually reflect equal importance here. The real issue is the missing entry point.

**Refined Recommendations:**

1. Add a hero summary at top (h2, dominant color) showing position health status
2. Keep 50/50 columns below, but increase typography contrast within each
3. Add surface depth between hero and detail sections

---

#### JONY synthesizes:

**Convergence:**
We agree the page lacks a focal point. Adding a hero summary that answers "am I okay?" gives users their entry point before diving into details.

**Resolution:**
The 50/50 layout stays — it honestly represents that both information types matter equally. But the hero above creates the reading path: summary first, details second, actions available.

**The "Of Course" Vision:**
An entity detail page that immediately tells you whether to relax or act, then lets you explore why — with the confidence to keep equal columns because both genuinely matter.

---

### Unified Recommendations

1. Add hero summary section (h2, `primary.main` accent for healthy status or `error.main` for attention-needed)
2. Increase section headers from h4 to h3 within the detail columns
3. Add `alpha(paper.secondary, 0.3)` background to the hero to create depth separation
4. Keep 50/50 column layout (equal importance is honest to the content)

### Creative Tensions

- The "asymmetry is better" instinct was challenged by "equal importance is honest" — resulting in asymmetry where it matters (hero prominence) and symmetry where equality is true (detail columns)
- Entry point problem was invisible to Specialist's dimension-by-dimension analysis but became the central insight

---

## Dialogue Anti-Patterns

### Anti-Pattern: Shallow Agreement

❌ **Bad:**

```
JONY: The Specialist's recommendations are excellent. I agree that asymmetric layout
and typography contrast will improve the design. The 60/40 split serves inevitability.
```

Why it's bad: No genuine engagement. No pushback. No added insight.

✅ **Good:**

```
JONY: The typography contrast recommendation is sound — it serves scanning. But the
60/40 split concerns me. What is the essence of this page? If both columns genuinely
carry equal importance...
```

### Anti-Pattern: Talking Past

❌ **Bad:**

```
SPECIALIST: Typography is slop. Use 3x jumps.
JONY: True simplicity means every element serves purpose. This page has too many elements.
SPECIALIST: Color is also timid. Use more primary.main.
```

Why it's bad: Perspectives don't respond to each other. Parallel monologues.

✅ **Good:**

```
SPECIALIST: Typography is slop. Use 3x jumps.
JONY: The typography point is valid for scanning, but before sizing, consider: are
all these labels necessary? Fewer elements at better sizes may achieve more than
re-scaling the current complexity.
SPECIALIST: Fair point. The "Status" and "State" labels are redundant. Remove "State,"
then apply the 3x typography to what remains.
```

### Anti-Pattern: Split-the-Difference

❌ **Bad:**

```
UNIFIED RECOMMENDATIONS:
1. Some asymmetric layout (40/60 instead of 60/40)
2. Moderate typography contrast (2x instead of 3x)
3. Partial surface depth (alpha 0.15 instead of 0.3)
```

Why it's bad: Averaging positions doesn't produce design insight. It produces mush.

✅ **Good:**

```
UNIFIED RECOMMENDATIONS:
1. Asymmetric hero section (spans full width, dominant)
2. Symmetric detail columns (50/50 — honest to equal importance)
3. Strong surface depth on hero only (alpha 0.3)
```

Why it's good: Each element is a clear decision, not a compromise. Some Specialist ideas won, some Jony ideas won, based on which served the design essence.

---

## Emergence Signals

Good dialogues produce ideas that **neither perspective stated initially**. Watch for:

- "I hadn't considered..." or "That reframes the problem..."
- A recommendation in Round 2 that didn't exist in Round 1
- The "Creative Tensions" section having substantive entries, not just "none"
- One perspective withdrawing a recommendation after considering the other's point

If Round 2 looks like Round 1 with politer language, the dialogue failed. Push for genuine engagement.
