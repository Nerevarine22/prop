# Hypernova: On-Chain Prop Trading Research Brief

### 1. Project Profile and Operating Model
Hypernova is a permissionless proprietary trading protocol architected on the Hyperliquid L1. Currently operating in a **Closed Beta / Invite Only** status, the project distinguishes itself by anchoring rule enforcement, trader state data, and payout reserves directly to blockchain smart contracts. This "on-chain" approach ensures that risk parameters are governed by a latency-sensitive risk engine rather than manual desk reviews.

The protocol utilizes a simulated trading environment. Participants interact with accounts that mirror live market conditions with liquidity sourced from Hyperliquid, though they do not trade "real money." Hypernova maintains the right to utilize trader-generated signals for its central book; traders are notified in-app if their signals are being utilized for live execution.

### 2. The Trader Lifecycle
The participant journey is structured to identify and scale high-alpha strategies through three distinct phases:

1.  **Entry and Evaluation:** Participants enter via a "1-step assessment" or the "Fast Track" program.
2.  **Funded Stage:** Upon reaching the profit target, traders receive a funded account. While the profit target is removed, the risk parameters—specifically the Daily Loss and Max Drawdown limits—carry over unchanged from the evaluation to ensure strategy consistency.
3.  **Scale Up Program:** Top-performing traders are reviewed for the "funding ladder," which facilitates progression from initial sizes (e.g., $25k) to $200k and eventually to a Scale Up tier. This program includes monthly cash grants and priority access to new features as a reward for realized performance.

### 3. Entry and Evaluation Pathways
Hypernova provides two primary onboarding rails for capital allocation:

*   **1-Step Assessment:** A streamlined evaluation requiring traders to meet a balance-based profit target without breaching equity-based risk limits.
*   **Fast Track:** A bypass mechanism for established traders. By connecting trading history from external venues—including Binance, Bybit, or Hyperliquid—participants receive a trading score. Qualifying scores allow traders to skip the evaluation phase entirely.

**Fee Policy:** Assessment fees are one-time charges with no recurring platform or data costs. Fees are strictly non-refundable once the sub-account is activated.

### 4. Technical Risk Framework and Rule Mechanics
The protocol's risk engine enforces two primary equity floors to manage unrealized P&L volatility.

| Mechanic | Maximum Daily Loss | Maximum Drawdown |
| :--- | :--- | :--- |
| **Calculation Basis** | Snapshot of Balance at 00:00 UTC. | Original starting balance at activation. |
| **Reset Frequency** | Recalculated daily; dynamic reset. | **Static Floor:** Fixed at creation; never moves. |
| **Enforcement** | Real-time Equity-based (Floating P&L). | Real-time Equity-based (Floating P&L). |
| **Strategic Note** | Limits intraday drawdown relative to the prior day. | Widens the "buffer" as profits are realized. |

**Nuance on Measurement:** While breaches are enforced in real-time by the risk engine, the documentation notes that drawdown is measured on closed equity at the end-of-day for certain reporting purposes. A breach results in immediate position liquidation and permanent account termination with no reset or appeal options.

### 5. Funding Rules and Offers
The following table synthesizes the risk tiers and account configurations available within the protocol.

| Risk Tier | Account Size | One-time Fee | Profit Target | Daily Loss (%) | Max Drawdown | Drawdown Floor ($) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tight** | $5,000 | $25 | 9% | 3% | 3% | $4,850 |
| **Tight** | $10,000 | $50 | 9% | 3% | 3% | $9,700 |
| **Tight** | $25,000 | $120 | 9% | 3% | 3% | $24,250 |
| **Tight** | $50,000 | $200 | 9% | 3% | 3% | $48,500 |
| **Tight** | $100,000 | $400 | 9% | 3% | 3% | $97,000 |
| **Tight** | $200,000 | $800 | 9% | 3% | 3% | $194,000 |
| **Low** | $5,000 | $60 | 10% | 3% | 6% | $4,700 |
| **Low** | $10,000 | $115 | 10% | 3% | 6% | $9,400 |
| **Low** | $25,000 | $275* | 10% | 3% | 6% | $23,500 |
| **Low** | $50,000 | $495 | 10% | 3% | 6% | $47,000 |
| **Low** | $100,000 | $999 | 10% | 3% | 6% | $94,000 |
| **Low** | $200,000 | $1,850 | 10% | 3% | 6% | $188,000 |
| **Medium** | $5,000 | $80 | 10% | 4% | 7% | $4,650 |
| **Medium** | $10,000 | $150 | 10% | 4% | 7% | $9,300 |
| **Medium** | $25,000 | $365 | 10% | 4% | 7% | $23,250 |
| **Medium** | $50,000 | $675 | 10% | 4% | 7% | $46,500 |
| **Medium** | $100,000 | $1,350 | 10% | 4% | 7% | $93,000 |
| **Medium** | $200,000 | **TBD** | 10% | 4% | 7% | $186,000 |
| **High** | $5,000 | **TBD** | 10% | 5% | 8% | $4,600 |
| **High** | $10,000 | **TBD** | 10% | 5% | 8% | $9,200 |
| **High** | $25,000 | **TBD** | 10% | 5% | 8% | $23,000 |
| **High** | $50,000 | **TBD** | 10% | 5% | 8% | $46,000 |
| **High** | $100,000 | **TBD** | 10% | 5% | 8% | $92,000 |
| **High** | $200,000 | **Restricted**| 10% | 5% | 8% | $184,000 |

***Note:** Refer to Section 9 for fee discrepancies.*

**Parameter Legend:**
*   **Drawdown Floor ($):** `Starting Balance * (1 - Max Drawdown %)`. An absolute value the account equity must never touch.
*   **Daily Loss ($):** `00:00 UTC Balance Snapshot * (Daily Loss %)`. Sets the dynamic floor for the current 24-hour window.

### 6. Trading Permissions and Strategy Restrictions
Hypernova adopts a "guardrail-only" philosophy, allowing significant freedom within its two equity limits.

**Explicitly Permitted Conduct:**
*   Full access to 140+ markets (**79 Crypto, 61 TradFi**).
*   News trading and 24/7 weekend holding.
*   Algorithmic trading via Expert Advisors (EAs) or custom bots.
*   No consistency rules or minimum trading day requirements.

**Prohibited Conduct:**
*   **Cross-Account Hedging:** Opposing positions across different Hypernova or third-party accounts.
*   **Third-Party Copy Trading:** Mirroring signals from social media or off-the-shelf "assessment passing" strategies.
*   **Strategy Switching:** Materially changing trading approaches between assessment and funding phases.
*   **Non-Replicable Strategies:** Exploiting the simulator through auto-deleveraging risks or pricing anomalies.
*   **Liquidity Provider Harm:** Any conduct that jeopardizes relationships with upstream liquidity sources.

### 7. Execution Architecture and Payout Mechanics
The protocol’s stack is designed for trustless settlement latency. 

*   **Architecture:** Hypernova provides a **typed REST + WebSocket API and open SDKs** (TypeScript/Python) for low-latency market data and programmatic order routing.
*   **Settlement Path:** Funds are held in a public "Payout Reserve" (Cold Reserve + Operational Vault). Smart contracts execute payouts 24/7 in USDC without manual intervention.
*   **80% Profit Split:** Traders retain 80% of generated profit. During payout, 100% of the profit is removed from the account (80% to trader, 20% to Hypernova), returning the account balance to its starting point.
*   **Conditions:** No minimum payout amount and no waiting periods. Average processing time is documented at **6.1 seconds**.

### 8. Legal, Compliance, and Residency
*   **Legal Entity:** Hypernova Systems, headquartered in Grand Cayman, Cayman Islands.
*   **Eligibility:** 18+ years of age with full legal capacity.
*   **Restricted Jurisdictions:** No service for residents/nationals of OFAC-sanctioned regions, specifically **Iran, North Korea, Cuba, Syria, and Russia**. VPN circumvention is strictly prohibited.
*   **Compliance:** KYC verification is mandatory for all funded account activations and payout settlements.

### 9. Sources, Conflicts, and Unresolved Questions
**Official Sources:**
*   Hypernova FAQ, Rulebook (v1.1), Pricing/Checkout, Terms of Use, and Official Website.

**Documented Conflicts:**
*   **Payout Latency:** The Rulebook (Section 10) claims processing under **0.02 seconds**, while the Website and FAQ cite an average of **6.1 seconds**.
*   **Low Risk Pricing:** The Pricing Comparison table lists the $25k Low Risk fee at **$275**, whereas the Rulebook fee schedule lists it at **$280**.
*   **Payout Correction (v1.0.1):** Documentation previously implied a $50k account with $6k profit would reset to $51,200; this was corrected to **$50,000** to reflect the full distribution of the 20% platform share.

**Unresolved Questions:**
*   **High Risk Tier:** Exact eligibility criteria and fee structures for "eligible users" remain TBD.
*   **Talent Scaling:** Specifics regarding "improved profit splits" for top-tier performers are not yet published.
*   **Market Selection:** The specific "markets package" selection process and how it limits the tradable universe per user is currently undefined.