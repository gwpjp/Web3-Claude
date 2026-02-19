# DeFi Risk Patterns Reference

Known patterns of protocol failures, centralization risks, and unsustainable economics. Used by `protocol-risk-analyst` as a comparative checklist during investigations.

---

## 1. Known Rug Pull & Collapse Patterns

### Wonderland / TIME (Jan 2022)

**Pattern:** Anonymous treasury manager with criminal history.

- Treasury managed by pseudonymous "Sifu" (0xSifu), later identified as Michael Patryn (co-founder of QuadrigaCX)
- Community discovered identity; team initially denied, then confirmed
- Treasury allegedly used for personal trades
- **Indicators:** Anonymous team managing large treasury, defensive response to identity questions, high-yield rebasing with unsustainable APY (>80,000%)

### Celsius Network (Jun 2022)

**Pattern:** CeFi masquerading as DeFi; opaque rehypothecation.

- Customer deposits lent out in high-risk DeFi strategies without disclosure
- Massive losses in Terra/Luna and stETH depeg hidden from depositors
- Withdrawal halt -> bankruptcy
- **Indicators:** Unsustainable yield promises on stablecoins (17-18% APY), no public proof of reserves, CEO with prior regulatory issues (Alex Mashinsky), aggressive marketing spend exceeding revenue

### FTX / Alameda Research (Nov 2022)

**Pattern:** Exchange self-dealing with customer funds via related trading firm.

- Customer deposits funneled to Alameda Research for leveraged trading
- FTT token used as collateral for loans (circular value)
- Balance sheet revealed by CoinDesk showed massive FTT concentration
- **Indicators:** Own-token as balance sheet asset, related-party trading firm, resistance to proof of reserves, aggressive acquisition spending, celebrity endorsements

### Terra / Luna (May 2022)

**Pattern:** Algorithmic stablecoin death spiral.

- UST peg maintained by minting/burning LUNA (no real collateral)
- Anchor Protocol offered 19.5% "yield" on UST, subsidized by foundation reserves
- Large coordinated UST dump triggered depeg -> LUNA hyperinflation -> death spiral
- **Indicators:** Yield with no identifiable source (Anchor reserve depletion visible on-chain), aggressive "it's not a Ponzi" messaging, circular economic dependencies, team dismissing risk analysis as "FUD"

### Mango Markets (Oct 2022)

**Pattern:** Oracle manipulation exploit on thin-liquidity markets.

- Attacker Avraham Eisenberg manipulated MNGO price on illiquid markets
- Used inflated collateral to drain protocol lending pools ($114M)
- **Indicators:** Low-liquidity governance tokens used as collateral, oracle manipulation surface area, insufficient circuit breakers

---

## 2. Centralization Vectors

### Admin Key Risks

| Risk Level   | Pattern                                      | Example                                      |
| ------------ | -------------------------------------------- | -------------------------------------------- |
| **Critical** | Single EOA with admin/owner role             | Can drain funds, pause, or upgrade instantly |
| **Critical** | Multisig with <3 signers or unknown signers  | Effectively single-party control             |
| **High**     | Timelock < 24 hours on critical functions    | Insufficient time for community to react     |
| **High**     | Upgradeability proxy with no governance vote | Team can change logic at will                |
| **Medium**   | Timelock 24-48 hours                         | Marginal safety, depends on monitoring       |
| **Medium**   | Governance-controlled but <5 unique voters   | Plutocracy or insider control                |
| **Low**      | Timelock > 48h + multisig + governance vote  | Reasonable decentralization                  |

### Upgrade Proxy Patterns

- **Transparent Proxy:** Admin can upgrade implementation. Check who controls admin.
- **UUPS Proxy:** Implementation contains upgrade logic. Can be bricked, but also self-upgradeable.
- **Diamond/EIP-2535:** Modular upgrades per facet. Hard to audit comprehensively.
- **Beacon Proxy:** Single beacon controls many proxies. Single point of failure for all instances.

### Permission Functions to Check

```
mint()           - Can create tokens from nothing
pause()          - Can freeze all operations
blacklist()      - Can block specific addresses
setFee()         - Can change fees to 100%
withdraw()       - Admin can pull funds
emergencyWithdraw() - Bypass normal withdrawal logic
setOracle()      - Can manipulate price feeds
setGuardian()    - Can change who has emergency powers
```

---

## 3. Ponzi Tokenomics Indicators

### Emission-Based Yield

**Red flags:**

- Protocol pays yield exclusively in its own token (no real revenue distribution)
- Emission rate exceeds protocol revenue by >5x
- Token has no utility beyond staking for more tokens (recursive yield)
- APY is only maintainable if token price stays flat or rises (reflexivity trap)
- "Real yield" marketing but yield source is actually emissions + treasury spending

### Circular Dependency Patterns

```
Deposit Token A -> Receive Token B (receipt)
Stake Token B -> Earn Token C (reward)
Token C price depends on Token A deposits
Token A deposits motivated by Token C yields
-> Circular: Any leg breaking causes cascade
```

### Sustainability Checklist

| Question                                         | Healthy Answer                                                     | Warning Answer                     |
| ------------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------- |
| Where does yield come from?                      | Identifiable: trading fees, lending interest, liquidation premiums | "Tokenomics" or "ecosystem growth" |
| Does protocol earn revenue in non-native tokens? | Yes, in ETH/USDC/etc.                                              | No, only in own token              |
| What happens if token price drops 80%?           | Protocol still functions, yield adjusts                            | Depositors flee, death spiral risk |
| Is emission schedule decreasing?                 | Yes, halving or diminishing schedule                               | Flat or increasing emissions       |
| Revenue vs emissions ratio?                      | Revenue > 50% of emissions value                                   | Revenue < 10% of emissions value   |

---

## 4. Unsustainable Yield Warning Signs

### Yield Source Classification

| Source               | Sustainability                     | Verification                      |
| -------------------- | ---------------------------------- | --------------------------------- |
| Trading fees         | Sustainable if volume is organic   | Check DEX volume vs TVL ratio     |
| Lending interest     | Sustainable if utilization is real | Check borrow utilization rate     |
| Liquidation premiums | Episodic but real                  | Check liquidation history         |
| Token emissions      | Unsustainable long-term            | Compare emission value to revenue |
| Treasury subsidies   | Time-limited                       | Check treasury runway             |
| Points/airdrops      | One-time, speculative              | No sustainable yield              |
| Leverage/looping     | Amplified risk, not new yield      | Check recursive position depth    |

### Red Flag Thresholds

- Stablecoin yield > 15% APY with no clear source -> investigate immediately
- Any yield > 100% APY -> almost certainly emissions-driven or unsustainable
- "Risk-free" yield on any asset -> no such thing; find the hidden risk
- Yield that doesn't decrease as TVL increases -> likely subsidized

### Recursive Strategy Detection

Protocols that offer high yield via:

1. Deposit collateral
2. Borrow against it
3. Re-deposit borrowed assets
4. Repeat N times

This amplifies both yield AND liquidation risk. The "yield" is really leverage. Check if:

- Protocol encourages or automates looping
- Displayed APY assumes maximum leverage
- Liquidation cascades would affect the entire TVL

---

## 5. Social Engineering & Marketing Red Flags

### Paid Promotion Patterns

- Influencer endorsements without disclosure (check for #ad or sponsorship disclaimers)
- "Ambassador programs" that pay per referral without product substance
- Airdrop farming campaigns that prioritize social media engagement over protocol usage
- Telegram/Discord artificially inflated with bot members

### Narrative Red Flags

- "We're different from all other protocols" without technical differentiation
- Dismissing all criticism as "FUD" or "you don't understand"
- Comparisons only to successful protocols, never to failed ones
- "Backed by [big name]" used as primary trust signal (verify independently)
- Roadmap focused on marketing milestones, not technical ones

### Documentation Red Flags

- Docs are marketing copy, not technical specification
- No source code links in documentation
- Architecture diagrams without contract addresses
- "Coming soon" on critical security features (timelock, multisig, governance)
- Whitepaper heavy on tokenomics, light on mechanism design

---

## 6. On-Chain Investigation Checklist

### Contract Verification

- [ ] All contracts verified on block explorer
- [ ] Deployed bytecode matches verified source
- [ ] No unverified proxy implementations
- [ ] Constructor arguments are reasonable

### Token Distribution

- [ ] Top 10 holders don't control >50% of supply
- [ ] Team allocation has vesting with on-chain enforcement
- [ ] No suspicious wallet clusters (funded from same source)
- [ ] Liquidity pool depth is sufficient for TVL

### Transaction Patterns

- [ ] Early transactions aren't exclusively insider wallets
- [ ] No circular transfer patterns inflating volume
- [ ] Protocol interactions show organic usage patterns
- [ ] No large unexplained transfers to exchanges before announcements

### Governance

- [ ] Governance proposals have >10 unique voters
- [ ] No single wallet can pass proposals alone
- [ ] Historical proposals show genuine community debate
- [ ] Emergency actions have been used appropriately (if ever)
