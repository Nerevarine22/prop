# AceTrader Prop-Firm Research Brief

## 1. Executive Brief and Operating Model
AceTrader operates as a decentralized capital allocation model within the crypto proprietary trading sector. It functions as a gatekeeper to institutional-grade liquidity, leveraging a "revocable mandate" structure. Under this legal framework, AceTrader maintains absolute ownership of all capital; traders are not depositors but service providers acting as fund managers. 

**Trader Lifecycle**
The progression is strictly tiered to mitigate firm-side risk:
1.  **Evaluation/Paper Trading**: A recurring subscription-based phase where traders must meet specific profit and consistency metrics in a simulated environment.
2.  **Funded Status**: Following successful KYC and target achievement, traders are granted access to a "Trade Fund."
3.  **Payout**: Distribution of profit splits (80–90%) via on-chain settlement, provided the trader maintains a "Safety Net."

**Comparison of Operating Environments**

| Feature | Evaluation / Paper Trading | Instant Fund | AceTrade Arena |
| :--- | :--- | :--- | :--- |
| **Operational Goal** | Skill qualification & data collection | Immediate capital deployment | Community-based ROI competition |
| **Risk Assignment** | Risk-free simulation | Live/Simulated (Firm-owned) | Competitive simulation |
| **Pricing Model** | Recurring 30-day subscription | One-time non-refundable fee | Automatic entry for paid users |
| **Execution Path** | Internal Simulator | Hyperliquid / Proprietary Infra | Internal Simulator |
| **Capital Ownership** | Simulated | Revocable Mandate (Firm-owned) | Prize-based Trade Funds |

**Execution vs. Simulation**
While Evaluation and Arena environments are entirely simulated, the Trade Fund utilizes a hybrid execution model. Execution is powered by the Hyperliquid decentralized exchange and AceTrader’s proprietary copy-trading infrastructure. The trader interacts with a frontend that mirrors live market conditions, but the actual asset movement occurs on firm-controlled wallets.

---

## 2. Programs, Pricing, and Eligibility
AceTrader differentiates its tiers by capital size and funding speed. Note that $MEME and $HYPE payments grant access to higher capital ceilings.

**Tier Analysis (As of Sept 2, 2026)**

| Tier | Capital Size | Eval. Price (30-day) | Instant Price (One-time) | Max Loss Limit (MLL) |
| :--- | :--- | :--- | :--- | :--- |
| **Lite** | $200 | N/A | $9 | $20 |
| **Starter** | $1,000 | $9 | $49 | $100 |
| **Standard** | $10,000 | $99 | $499 | $600 |
| **Pro** | $20,000* | $169 | $999 | $1,200 |

*\*Pro capital increases to $24,000 ($1,440 MLL) and Standard to $12,000 ($720 MLL) if paying in $MEME or $HYPE.*

**Trade Fund Eligibility Criteria**
To qualify for a funded mandate, Evaluation traders must satisfy three distinct pillars:
*   **Profit Target**: Plan-specific (e.g., $3,000 for Standard).
*   **Consistency Target**: An investigative safeguard designed to filter "gamblers." The profit from a trader's single best day must not exceed 50% of the total realized profit.
    *   *Investigator Note:* This rule forces traders to demonstrate repeatable strategy rather than relying on a single volatility event (e.g., a CPI print).
    *   *Formula*: `Extra profit needed = (Best Day Profit ÷ 50%) − Profit Target`.
*   **Minimum Trading Days**: Historically 3–5 days, though social media communications indicate a move toward 0 days for modern plans.

---

## 3. Payouts and Trader Compensation
AceTrader employs a conservative payout formula to ensure the firm’s principal capital is never exposed to "payout-induced" drawdowns.

**Payout Mechanics**
The **Adjusted Payout Balance** is calculated as:
`min(min(Total PnL, Realized PnL) − safetyNet, Withdrawable)`

**Requirement Grid**

| Metric | USDC/T Payments | $MEME / $HYPE Payments |
| :--- | :--- | :--- |
| **Winning Days** | 0 Days (Verified on X) | 0 Days (Verified on X) |
| **Min. Safety Net** | MLL + 200 USDC (Eval) | Equal to MLL (Eval) |
| **Safety Net (Instant)** | $0 (Per Pricing Page) | $0 (Per Pricing Page) |
| **Min. Payout** | $100 (Default) | $100 (Default) |
| **Plan Exceptions** | **Starter**: $20 / **Lite**: $50 | **Starter**: $20 / **Lite**: $50 |
| **Profit Split** | 80% to Trader | 90% to Trader |

**Technical Distribution**
Payouts are settled via **Arbitrum USDC**. Traders must provide an EVM-compatible wallet. Any breach of risk rules (MLL or Unlisted Coins) results in the immediate forfeiture of all pending payouts and account deactivation.

---

## 4. Trading Environment
The environment is restricted to favor the firm’s risk management protocols, utilizing the HIP-3 protocol for synthetic asset exposure.

*   **Platform & Venue**: Decentralized backend via **Hyperliquid**.
*   **Risk Constraints**: Forced **One-Way Mode** (prevents hedging) and **Isolated Margin** (caps risk per trade). These constraints theoretically favor the house by preventing complex recovery strategies.
*   **Instrument Catalog**:
    *   **Crypto (33 Assets)**: BTC, ETH, XRP, BNB, SOL, DOGE, TRX, ADA, HYPE, SUI, BCH, LINK, AVAX, XLM, TON, HBAR, LTC, DOT, UNI, AAVE, TAO, APT, NEAR, ETC, ONDO, MEME, kPEPE, kSHIB, PENGU, ZEC, XMR, PENDLE, VVV.
    *   **HIP-3/Synthetic (25 Assets)**: SILVER, GOLD, XYZ100, USA500, NVDA, BRENTOIL, OIL, USOIL, CL, SP500, MU, SNDK, CRCL, INTC, COPPER, NATGAS, TSLA, SKHX, EWY, GOOGL, AMZN, MSFT, META, AAPL, SPCX.
*   **Unlisted Coin Rule**: A critical "trap" rule. Trading any asset outside the lists above constitutes a terminal breach, leading to immediate account closure and profit forfeiture.

**Prohibited Strategies**
Market manipulation, price rigging, insider dealing, and unauthorized automated crawlers are strictly prohibited.

---

## 5. Risk Mechanics
The **Maximum Loss Limit (MLL)** is a trailing drawdown based on equity and balance.

*   **Trailing Behavior**: The MLL floor moves up only based on the **End-of-Day (EOD) high-water mark** of the wallet balance.
*   **Intraday Breaches**: During the trading day, the system monitors **Account Value (Realized + Unrealized PnL)**. If the value drops below the established MLL floor at any time, the account is terminated.
*   **Ceiling**: The MLL is capped at 6% of initial capital. Once the MLL floor reaches the initial balance, it stops trailing.

**Breach Consequences**
*   **Evaluation**: Account fails; requires a Reset Fee or use of a recurring Reset Credit.
*   **Trade Fund**: Permanent deactivation and loss of all accrued profits.

---

## 6. Legal Entity and Availability
AceTrader operates with significant corporate opacity. No specific registration number or physical headquarters is provided.

*   **Governing Context**: Documentation references BVI, Singapore, and US (OFAC) sanctions, suggesting a fragmented offshore legal strategy.
*   **Prohibited Jurisdictions**: USA, China, Ontario (Canada), Afghanistan, Belarus, Central African Republic, Congo, Crimea, Cuba, Iran, Iraq, North Korea, Syria, Venezuela, and others.
*   **Document Hierarchy**: The **Terms of Use** (last updated July 13, 2026) supersede all marketing and social media content.

---

## 7. Rewards and Ecosystem
**AceTrade Arena**
A weekly ROI-based competition. Rank rewards for both Free and Paid pools include:
*   **Rank 1**: $20,000 Trade Fund
*   **Rank 2–3**: $10,000 Trade Fund
*   **Rank 4–5**: $1,000 Trade Fund

**Community Reward Pool**
A monthly draw where $1 spent = 1 ticket. Rewards scale with community purchase volume:
*   **<50 purchases**: 1 Standard + 1 Pro fund ($30k pool).
*   **501+ purchases**: 20 Starter + 15 Standard + 8 Pro funds ($330k pool).

**Referral Rebates**
Monthly payouts in Arbitrum USDC (min. $50 threshold):
*   **Evaluation**: $4 (Starter), $40 (Standard), $68 (Pro).
*   **Instant Fund**: $20 (Starter), $200 (Standard), $400 (Pro).

---

## 8. Transparency and Operating Statistics
Data as of **September 2, 2026**:
*   **Subscribed (Eval)**: 1,397 | **Funded**: 165 (11.8% pass rate).
*   **Total Funded Capital**: $6,122,400 (Combined Eval and Instant).
*   **Total Payouts Processed**: $94,524.50 (73 total payouts).
*   **Avg. Time to Accrue Payout**: 23.4 days.
*   **Avg. Time to Process Payout**: 2.3 days.
*   **Largest Single Payout**: $10,260.00.

---

## 9. Reviews and Reputation
*   **Trustpilot**: 4.4/5. 
*   **Sentiment**: Community branding focuses on "printing" and "acceleration." High-profile traders like "CookieGuymeta" are used as social proof of the firm’s solvency.
*   **Firm Stance**: AceTrader markets "Funded" status as a "social status," positioning itself as a prestige platform for crypto-native "pros."

---

## 10. Red Flags and Green Flags

**Green Flags**
*   **Verified On-Chain Payouts**: Public transaction hashes provided for all 73 payouts.
*   **Infrastructure**: Direct integration with Hyperliquid provides decentralized transparency for execution.
*   **Sustainability**: High "Safety Net" requirements and the "Consistency Target" suggest the firm prioritizes long-term capital preservation over high churn.

**Red Flags/Risks**
*   **Predatory "Unlisted Coin" Rule**: A single trade in an unlisted high-cap asset (not on the 33+25 approved list) results in total account forfeiture.
*   **Documentation Discrepancies**: Significant conflicts exist between the Terms of Use (which mandate Winning Days and high Safety Nets) and the Pricing/Social pages (which claim $0 Safety Nets and 0 Winning Days). The Terms of Use explicitly state they take precedence.
*   **Operational Opacity**: Founders and corporate registration remain anonymous.
*   **Mandate Discretion**: The firm reserves the right to suspend accounts based on "Unusual Ordering Behavior" or "Market Misconduct" at its sole discretion.

---

## 11. Sources and Conflict Resolution
**Primary Sources**
*   AceTrader Terms of Use (July 13, 2026).
*   Official Transparency Dashboard (Sept 2, 2026).
*   Official Pricing and FAQ Documentation.

**Conflict Resolution Note**
Traders should be aware that while AceTrader social media accounts (X) announced the removal of "Minimum Winning Days" on August 20, 2026, the static Documentation still lists these requirements. Under Clause 1.1 of the Terms of Use, the "Trading Rules" on the Website are the final authority, effectively making the social media/pricing page updates the operative rules for current participants.