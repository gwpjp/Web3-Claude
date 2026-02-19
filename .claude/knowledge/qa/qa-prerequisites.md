# QA Prerequisites (Shared)

This file defines the prerequisite check pattern for all browser-based QA skills.

## Assumption

The dev server is **always running**. The user always has:

1. Dev server running (port in `vite.config.ts` → `server.port`)
2. A Chrome tab open with the app loaded
3. Wallet connected

**CRITICAL:** Never run `yarn dev` or start the dev server. It's already running. The port is defined in `vite.config.ts` under `server.port`.

## Verification Flow

### Step 1: Check Chrome Extension

Call `tabs_context_mcp` to verify the Chrome MCP extension is connected.

- **If successful**: Proceed to Step 2
- **If fails**: Ask user to set up (see Step 3)

### Step 2: Verify App State

Take a screenshot of the current tab to verify:

1. The app is loaded at localhost (port from `vite.config.ts`)
2. A wallet address is visible in the header (indicating connected wallet)

- **If both conditions met**: Proceed with QA tasks
- **If either fails**: Ask user to set up (see Step 3)

### Step 3: Ask User to Set Up

If prerequisites are not met, use `AskUserQuestion` with this pattern:

```
Question: "The browser doesn't appear to be set up for QA testing. Can you set it up?"
Header: "Browser Setup"
Options:
  1. "Ready now" - "I've opened the app in Chrome with wallet connected"
  2. "Need help" - "Show me what needs to be done"
```

**If user selects "Need help"**, provide these instructions:

1. The dev server should already be running (check `vite.config.ts` for the port)
2. Open Chrome and navigate to that localhost URL
3. Connect your wallet using the button in the header
4. Return here and confirm when ready

**If user selects "Ready now"**, re-run the verification (Step 1-2) to confirm setup is complete. If still not ready, ask again.

## What NOT to Do

- **NEVER run `yarn dev`** -- the dev server is always running
- Do NOT attempt to open Chrome or create browser tabs from scratch
- Do NOT attempt to connect the wallet programmatically
- Do NOT proceed with QA if prerequisites aren't confirmed

## Usage in Skills

Reference this file in your Prerequisites section:

```markdown
## Prerequisites

See [qa-prerequisites.md](../qa-prerequisites.md) for the standard QA setup check.

**Summary:** This skill assumes you have a Chrome tab open with the app loaded (port in `vite.config.ts`) and wallet connected. If not set up, you'll be asked to do so before the skill proceeds.
```
