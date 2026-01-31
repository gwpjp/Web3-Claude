# Common Component API Reference

Complete API reference for all components in `src/components/Common/` and key shared components.

## Buttons

### CommonButton

**File:** `src/components/Common/CommonButton.tsx`
**Use for:** All standard buttons

```typescript
interface TProps extends ButtonProps {
  text?: string;
  buttonType:
    | "primary"
    | "secondary"
    | "tertiary"
    | "outlined"
    | "contained"
    | "text";
  styles?: SxProps<Theme>;
  buttonHeight?: "sm" | "md" | "lg" | "xl"; // 32px | 40px | 48px | 56px (default: "md")
}
```

**Key behaviors:**

- Maps `buttonType` to MUI `variant` and `color` automatically
- `contained` buttonType uses `color="inherit"` (black button)
- Default: `size="large"`, `fullWidth={true}`, `buttonHeight="md"`
- Applies `white-space: nowrap`

```typescript
<CommonButton buttonType="primary" onClick={handleClick}>Submit</CommonButton>
<CommonButton buttonType="outlined" buttonHeight="lg" fullWidth={false}>Cancel</CommonButton>
```

### CTAButton

**File:** `src/components/CTAButton.tsx`
**Use for:** Any button triggering blockchain transactions

```typescript
interface CTAButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  text: string;
  tooltip?: string;
  styles?: SxProps<Theme>;
  actionChainId: number; // Required - the chain this action targets
}
```

**Key behaviors:**

- Shows "Connect Wallet" if user not connected (always enabled)
- Shows "Switch Network" if on wrong chain
- Shows animated SineWave loader when `isLoading`
- Wraps `CommonButton` with `buttonType="contained"`

```typescript
<CTAButton text="Submit" onClick={handleSubmit} isLoading={isPending} actionChainId={chainId} />
```

## Cards

### CommonCard

**File:** `src/components/Common/CommonCard.tsx`

```typescript
interface TProps extends Omit<CardProps, "variant"> {
  styles?: SxProps<Theme>;
  variant?: "default" | "table" | "action";
}
```

Wraps MUI `Card` with `padding: 1` default. Theme applies: borderRadius 10, border with white alpha, bg `paper.primary`.

**Variants:**

- `"default"` - Plain card with `paper.primary` background (from theme)
- `"table"` - Subtle coral tint gradient for table containers
- `"action"` - Blue/purple tint gradient for action forms

**Note:** Both `styles` and `sx` props are merged with internal styles (variant styles applied first, then `styles`, then `sx`).

```typescript
<CommonCard styles={{ p: 3 }}>Content</CommonCard>
<CommonCard variant="table" sx={{ p: 0, overflow: "hidden" }}>Table</CommonCard>
<CommonCard variant="action">Form content</CommonCard>
```

## Inputs

### CommonSearchInput

**File:** `src/components/Common/CommonSearchInput.tsx`
**Use for:** Search/filter fields

```typescript
interface CommonSearchInputProps extends Omit<
  TextFieldProps,
  "onChange" | "variant"
> {
  value: string;
  onChange: (value: string) => void; // Returns string directly, not event
}
```

- Built-in `SearchIcon` start adornment
- Default `size="small"`, `placeholder="Search..."`

```typescript
<CommonSearchInput value={search} onChange={setSearch} placeholder="Filter items..." />
```

### CommonTextInput

**File:** `src/components/Common/CommonTextInput.tsx`
**Use for:** Names, symbols, general text

```typescript
interface CommonTextInputProps extends Omit<
  TextFieldProps,
  "onChange" | "variant"
> {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number; // Shows "X/Y characters" counter
  transform?: "uppercase" | "lowercase" | "none";
}
```

- Auto-enforces `maxLength` and shows character counter in helper text
- Default `size="small"`, `fullWidth`

```typescript
<CommonTextInput value={name} onChange={setName} maxLength={32} label="Name" />
<CommonTextInput value={symbol} onChange={setSymbol} maxLength={6} transform="uppercase" label="Symbol" />
```

### CommonAmountInput

**File:** `src/components/Common/CommonAmountInput.tsx`
**Use for:** Token amounts (deposit, withdraw, thresholds)

```typescript
interface CommonAmountInputProps {
  value?: string;
  label?: string;
  balance?: number; // Shows error (red text) when amount exceeds balance
  onChange: (value: string) => void;
  endAdornment?: React.ReactNode;
  placeholder?: string; // Default: "0"
  disabled?: boolean;
}
```

- Uses `variant="standard"` with `disableUnderline`
- Typography `h5` for input text
- `inputMode="decimal"` with numeric pattern
- Applies `makeStringNumeric()` to input

```typescript
<CommonAmountInput
  value={amount}
  onChange={setAmount}
  balance={userBalance}
  endAdornment={<MaxButton />}
/>
```

### CommonPercentInput

**File:** `src/components/Common/CommonPercentInput.tsx`
**Use for:** Rates, fees, thresholds

```typescript
interface CommonPercentInputProps extends Omit<
  TextFieldProps,
  "onChange" | "variant" | "type"
> {
  value: string; // e.g., "8" for 8%
  onChange: (value: string) => void;
  min?: number;
  max?: number; // Auto-validates and shows error helper text
}
```

- Built-in `%` end adornment
- Auto-validates against min/max with error messages
- Uses `makeStringNumeric()` for input sanitization

```typescript
<CommonPercentInput value={rate} onChange={setRate} min={0} max={100} label="Rate" />
```

### CommonAddressInput

**File:** `src/components/Common/CommonAddressInput.tsx`
**Use for:** Ethereum addresses

```typescript
interface CommonAddressInputProps extends Omit<
  TextFieldProps,
  "onChange" | "variant"
> {
  value: string;
  onChange: (value: string) => void;
  showValidation?: boolean; // Default: true - shows green checkmark for valid addresses
}
```

- Uses `viem.isAddress()` for validation
- Shows `CheckCircleIcon` (green) for valid addresses
- Shows "Invalid address format" error for invalid input
- Monospace font for address display
- Default `placeholder="0x..."`

```typescript
<CommonAddressInput value={address} onChange={setAddress} label="Address" />
```

## Dropdowns & Selects

### CommonSelect

**File:** `src/components/Common/CommonSelect.tsx`
**Use for:** Generic dropdown selects with custom rendering

```typescript
type TProps<
  S,
  T extends { name: string; id: string | number; subMenu?: S[] },
> = {
  options: T[];
  onChange?: (event: SelectChangeEvent<T["id"]>, child: ReactNode) => void;
  styles?: SxProps<Theme>;
  stylesMenuItem?: SxProps<Theme>;
  itemHeader?: () => React.ReactNode;
  renderItem: (item: T) => React.ReactNode;
  renderSubMenuItem?: (subItem: S) => React.ReactNode;
  itemToString: (arg0: T | undefined) => string | undefined;
  itemToValue: (arg0: T | undefined) => number | string | undefined;
  disabledIndices?: number[];
  hiddenActive?: boolean;
  hiddenArrow?: boolean;
};
```

Generic component with custom render functions. Supports sub-menus and custom item headers.

### TokenDropdown

**File:** `src/components/Common/TokenDropdown.tsx`
**Use for:** Token selection (single or multi-select)

```typescript
// Single select
interface SingleSelectProps {
  multiple?: false;
  value: Address | "";
  onChange: (address: Address) => void;
  tokens: Token[];
  isLoading?: boolean;
  label?: string;
  disabled?: boolean;
  ve?: boolean; // Show "ve" prefix for voting escrow
  size?: "small" | "medium";
  showNetworkFilter?: boolean; // Chain filter dropdown
}

// Multi-select
interface MultiSelectProps {
  multiple: true;
  value: Address[];
  onChange: (addresses: Address[]) => void;
  // ...same base props
}
```

- Popover with search by name, symbol, or address
- Optional network filter via `showNetworkFilter`
- Multi-select mode keeps popover open with checkboxes
- Shows token icon, symbol, name, and sliced address

```typescript
// Single select
<TokenDropdown value={selectedToken} onChange={setSelectedToken} tokens={tokens} label="Asset" />

// Multi-select
<TokenDropdown multiple value={selectedTokens} onChange={setSelectedTokens} tokens={tokens} />
```

## Tooltips & Info

### CommonTooltip

**File:** `src/components/Common/CommonTooltip.tsx`

```typescript
// Extends TooltipProps
<CommonTooltip title="Helper text">
  <Box>Hover target</Box>
</CommonTooltip>
```

- Default `placement="top"`
- Themed: dark bg (`text.neutral`), white text (`background.paper`), `body2` typography
- Max width 215px

### TooltipIcon

**File:** `src/components/Common/TooltipIcon.tsx`

```typescript
interface TooltipIconProps {
  title: string;
}
```

Renders a small info icon (16px) with a tooltip. Use next to labels that need explanation.

```typescript
<Stack direction="row" spacing={0.5}>
  <Typography>APY</Typography>
  <TooltipIcon title="Annual Percentage Yield calculated over 7 days" />
</Stack>
```

## Display Components

### TokenSymbol

**File:** `src/components/Common/TokenSymbol.tsx`

```typescript
interface TokenSymbolProps {
  token: Token;
  size?: number; // Icon size, default: 24
}
```

Renders token icon + bold symbol text in a horizontal stack.

```typescript
<TokenSymbol token={assetToken} size={20} />
```

### CopyableAddress

**File:** `src/components/Common/CopyableAddress.tsx`

```typescript
interface CopyableAddressProps {
  address: string;
  variant?: "body1" | "body2" | "caption"; // Default: "body2"
  color?: string; // Default: "text.secondary"
  iconSize?: number; // Default: 14
}
```

Shows sliced address with monospace font and a copy-to-clipboard button.

```typescript
<CopyableAddress address={contractAddress} />
```

### ActivityStatus

**File:** `src/components/Common/ActivityStatus.tsx`

```typescript
interface ActivityStatusProps {
  status: "success" | "failed";
}
```

Renders a status badge. "success" shows a green-bordered pill with checkmark icon. "failed" renders empty.

### NumberFormatter

**File:** `src/components/NumberFormatter.tsx`
**Use for:** All formatted number displays

```typescript
interface NumberFormatterProps extends Omit<BoxProps, "style"> {
  value: number | undefined;
  preset?:
    | "percent"
    | "currency"
    | "number"
    | "full"
    | "fullPercent"
    | "input"
    | "tooltip";
  format?: Intl.NumberFormatOptions;
  showToolTip?: boolean;
  fractionDigits?: number; // Default: 2
}
```

- Returns `-` for undefined/null/NaN values
- `type="limit"` shows `<$0.01` or `<1%` for very small values
- Tooltip shows full precision value

```typescript
<NumberFormatter value={stats.apy} preset="percent" />
<NumberFormatter value={tvl} preset="currency" showToolTip />
```

### String utility

```typescript
import { displayNumber } from "src/utils/numberFormat";
const formatted = displayNumber(1234.56, "currency"); // "$1,234.56"
```

## Tab Panels

### CustomTabPanel

**File:** `src/components/Common/CustomTabPanel.tsx`

```typescript
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Helper for a11y
export function a11yProps(index: number): {
  id: string;
  "aria-controls": string;
};
```

```typescript
<Tabs value={tab} onChange={(_, v) => setTab(v)}>
  <Tab label="Overview" {...a11yProps(0)} />
  <Tab label="Details" {...a11yProps(1)} />
</Tabs>
<CustomTabPanel value={tab} index={0}>Overview content</CustomTabPanel>
<CustomTabPanel value={tab} index={1}>Details content</CustomTabPanel>
```

## Menu Items

### CommonMenuItem

**File:** `src/components/Common/CommonMenuItem.tsx`

```typescript
interface TProps extends MenuItemProps {
  hiddenActive?: boolean; // Hide selected background
  styles?: SxProps<Theme>;
}
```

Responsive menu item: larger padding/font on mobile (max-width: 768px).
