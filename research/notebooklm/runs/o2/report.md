# Research Report: o2 Turbo Prop Trading Model

## 1. Project Overview and Operating Model
o2 Turbo is an instant, on-chain proprietary (prop) trading platform developed by Fuel Labs (Breathe Speed Inc.). In a departure from traditional "Challenge" firms that require traders to navigate multi-stage evaluation phases, o2 Turbo utilizes a "Premium + Margin" model to provide immediate access to up to $10,000 in simulated or on-chain capital.

**The Operating Model:**
*   **The Trader:** Initiates the session by paying a fixed, non-refundable **Premium** (the cost of capital access) and depositing a refundable **Margin** (the loss buffer).
*   **o2 Turbo:** Grants the trader access to capital for a defined duration. 
*   **Core Differentiator:** By moving the model on-chain and removing "targets" or "minimum days," o2 Turbo shifts the risk profile from evaluation-based gating to a direct capital efficiency model.

## 2. Trader Lifecycle Analysis
The o2 Turbo experience follows a streamlined, five-stage chronological path:

1.  **Entry:** The trader connects a compatible wallet (Ethereum, Base, BNB Chain, or Fuel) and configures account parameters using the live configurator (Plan, Track, and Duration).
2.  **Activation:** Upon payment of the non-refundable premium and the minimum required margin deposit, the account is funded instantly. 
3.  **Trading & Execution:** Traders engage with the markets using directional bets (Long/Short) or spot-backed assets. The environment is high-performance, leveraging the FuelVM for rapid execution with 0.00% maker and 0.01% taker fees.
4.  **Risk Enforcement:** If net losses reach the maximum drawdown (equal to the deposited margin), automated liquidation mechanics trigger. Importantly, **profits already withdrawn** to the trader's main wallet are immune to liquidation; only the remaining margin and current unrealized PnL are at risk.
5.  **Settlement & Payout:** At the conclusion of the term—or upon manual closure—the trader receives their margin (net of losses) plus 100% of realized profits.

## 3. Mechanical Deep-Dives: Rules and Calculations

### Capital Efficiency and Leverage
From a quantitative perspective, the o2 Turbo model provides significant **Capital Efficiency**. By requiring only a 2.5% margin for "Focused" accounts, the platform offers up to **40x leverage** on the trader's deposited margin. For example, a $10,000 "Pro" account requires a $250 margin deposit, effectively amplifying the trader's risk-on capital by 40 times while capping the absolute loss at the margin amount.

### Liquidation and Slippage Mitigation
Liquidation occurs automatically at the margin threshold. To protect the platform and the trader from cascading liquidations on thin DEX liquidity, o2 Turbo utilizes an **"unwound off-market"** mechanic. This design choice is critical for on-chain prop firms to ensure that liquidation events do not cause significant slippage that could exceed the deposited margin buffer.

### Timing and Structure
*   **Duration:** Fixed options of 6 hours, 1 day, 1 week, or 1 month.
*   **No Funding Drift:** Unlike perpetual futures, o2 Turbo does not charge borrow APR or variable funding rates. This provides a structural advantage for directional hedges held over longer durations (e.g., 1 month), where funding costs often erode the profitability of traditional perp positions.
*   **Auto-extend:** An opt-in mechanic allows the session to roll over into a new period at the same premium rate.

## 4. Funding Rules and Offers
The following table outlines the configurations available via the o2 Turbo configurator. All "Min. Margin" values represent the minimum threshold to activate the account.

| Plan Name | Track Type | Account Size | Margin % | Min. Required Margin (≥) | Max Drawdown | Market Access |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Starter** | Focused | $2,500 | 2.5% | $62.50 | $62.50 | Major Crypto Only |
| **Starter** | Broad | $2,500 | 5% | $125.00 | $125.00 | All Markets |
| **Standard** | Focused | $5,000 | 2.5% | $125.00 | $125.00 | Major Crypto Only |
| **Standard** | Broad | $5,000 | 5% | $250.00 | $250.00 | All Markets |
| **Pro** | Focused | $10,000 | 2.5% | $250.00 | $250.00 | Major Crypto Only |
| **Pro** | Broad | $10,000 | 5% | $500.00 | $500.00 | All Markets |

**Illustrative Premium Benchmarks (1-Week Duration):**
*   **Starter ($2.5k):** ~$60
*   **Standard ($5k):** ~$110
*   **Pro ($10k):** ~$200

**Track Mechanics:**
*   **Focused:** Optimized for "Major" assets (wBTC, ETH, XAUT) with a lower margin requirement (2.5%).
*   **Broad:** Provides access to the full 16-asset book but requires a higher margin (5%) to account for the increased volatility of altcoin assets.

## 5. Trading Permissions and Constraints

### Supported Markets
Traders can access 16 assets categorized as follows:
*   **Major Assets (Long & Short):** Wrapped Bitcoin (wBTC), Ethereum (ETH), Tether Gold (XAUT).
*   **Spot Assets (Likely Only Long):** BNB, UNI, LINK, AAVE, ONDO, LIT, WLD, VVV, PYUSD, ENA, FUEL, USDT, USDC.

### Execution Permissions
*   **Cost Structure:** 0.00% maker / 0.01% taker fees. Zero gas costs for trading on the o2 internal layer.
*   **Hedging:** Traders are permitted to run a Turbo account alongside their primary book to isolate directional bets or specific hedges.
*   **Permissions Nuance:** Evidence from the UI suggests that while Major assets support Long/Short capabilities, the "Broad" track alts (+13 spot assets) appear to be limited to "Only Long" execution.

### Prohibited Strategies
*   **Not Disclosed:** Official sources do not currently specify restrictions on High-Frequency Trading (HFT), news trading, or copy trading. Specific definitions for "prohibited strategies" remain undefined in the public documentation.

## 6. Execution, Custody, and Technology
*   **Technical Stack:** Built on **Fuel**, the high-performance execution layer for Ethereum. The system utilizes the **FuelVM** for parallel transaction execution, providing a low-latency environment comparable to centralized exchanges.
*   **Custody & Settlement:** The platform is decentralized and wallet-based. Profits are realized and settled in **USDC**. Gains can be transferred to the trader's main wallet at any time without ending the Turbo session.
*   **Multi-Chain Support:** Traders can fund their accounts from Ethereum, Base, BNB Chain, and Fuel.

## 7. Payout and Compensation Mechanics
*   **Profit Split:** 100% to the trader. o2 Turbo does not charge performance fees or engage in revenue sharing.
*   **Withdrawal Velocity:** Payouts are handled programmatically with no minimum thresholds, no waiting periods, and no manual review cycles. 
*   **Costs:** o2 does not charge platform-level withdrawal fees; however, standard network gas fees on the source chain (e.g., Ethereum) apply when moving funds back to a primary wallet.

## 8. Corporate and Programmatic Context
*   **Corporate Entity:** o2 is operated by **Breathe Speed Inc.**, a Panama-based entity.
*   **Referral Program:** A tiered system (Tier 3-4) provides referrers with a **20-25% cut** of opening premiums. 
*   **Referred Users:** Receive a **10% discount on premiums** paid during their first 30 days. This discount does not apply to the margin deposit.
*   **Gamification:** The platform utilizes an **"o2 Legend Score"** and hosts periodic USDC trading competitions to drive engagement.

## 9. Sources, Conflicts, and Unresolved Questions

### Source List
*   o2 Official Website (o2.app)
*   o2 Turbo Application & FAQ (trade.o2.app/turbo)
*   o2 Terms of Use (Updated Dec 15, 2025)
*   Official Research Ledger (Data as of Aug 16, 2026)

### Documented Conflicts
1.  **Liquidation Fee:** The Research Ledger cites a **1% deduction** from leftover margin upon liquidation, while the FAQ/Website text explicitly states a **2% fee**. 
2.  **Broad Track Permissions:** The FAQ suggests general Long/Short capabilities for "Major" assets, but the UI configurator labels the Broad track spot assets as **"Only Long."** It is unclear if shorting is restricted solely to the three "Major" assets regardless of the track chosen.

### Unresolved Questions
*   **Position Limits:** Maximum position sizes or lot-size constraints per trade are not disclosed.
*   **Automation:** There is no specific data regarding the availability of APIs or restrictions on trading bots.
*   **Consistency Rules:** The platform does not specify if traders must follow particular volume or consistency rules common in traditional prop firms.