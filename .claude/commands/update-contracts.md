# Update Contracts

Walk the user through updating contract ABIs and addresses after a new deployment.

## Overview

When contracts are updated, you need to update these files:

1. **`src/services/contracts/generated.ts`** - Contract ABIs
2. **`src/services/contracts/addresses/*.json`** - Chain-specific addresses

## Instructions

Guide the user through each file one at a time using AskUserQuestion.

### Step 1: ABIs (generated.ts)

Ask the user:

**"Do you have updated ABIs to paste into `generated.ts`?"**

Options:

- Yes, I have new ABIs
- No, ABIs haven't changed
- Skip this step

If yes:

1. Open `src/services/contracts/generated.ts` for the user
2. Ask them to paste the new ABI content
3. Verify the file still exports the expected ABIs

### Step 2: Chain Addresses

For each chain address file that exists in `src/services/contracts/addresses/`:

Ask the user:

**"Do you have updated addresses for [chain name]?"**

Options:

- Yes, I have new addresses
- No, addresses haven't changed
- Skip this step

If yes:

1. Open the appropriate address JSON file for the user
2. Ask them to paste the new addresses JSON
3. Verify the JSON structure matches the expected format (chain, chainId, contracts, etc.)

### Step 3: Verification

After all updates are complete:

1. Run TypeScript check:

   ```bash
   yarn typecheck
   ```

2. Run the build to ensure everything compiles:

   ```bash
   yarn build
   ```

3. Report any errors found

## File Structure Reference

### generated.ts exports:

- Contract ABIs as const arrays
- Each export should end with `Abi` suffix

### Address JSON structure:

```json
{
  "chain": "chainName",
  "chainId": 1234,
  "deployedAt": "ISO timestamp",
  "deployer": "0x...",
  "contracts": {
    "ContractName": "0x..."
  },
  "startBlock": number
}
```

## Notes

- The `errorsAbi.ts` file imports from `generated.ts` and combines ABIs for error decoding
- The `useContracts.ts` hook imports the address JSON files
- Always verify the build passes after updating contracts
