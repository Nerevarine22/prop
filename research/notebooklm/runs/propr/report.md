# Propr Project Research Brief: On-Chain Proprietary Trading Analysis

### 1. Project Identity and Operating Model

**Mission**
Propr is a next-generation, on-chain proprietary trading firm built exclusively on the Hyperliquid infrastructure. The project’s objective is to decentralize the "prop firm" model by providing skilled traders with access to simulated capital for trading cryptocurrency perpetual futures, equities, and commodities, with execution and payouts verified via the blockchain.

**Core Operating Model**
The firm utilizes a standardized "Evaluation-to-Funded" pipeline. Traders pay an upfront, non-refundable evaluation fee to access a challenge account. Upon reaching specific profit targets without breaching stringent equity-based risk parameters, the trader is transitioned to a funded account. In this stage, the trader is eligible for performance-based payouts, retaining 80% of realized profits while the firm provides the underlying liquidity.

**Operational Philosophy**
Propr’s risk management is governed by a streamlined "Two-Rule" philosophy, focusing on Daily Loss and Maximum Drawdown limits. Unlike legacy prop firms that obscure execution data, Propr emphasizes "Radical Transparency," utilizing a hybrid A-Book/B-Book model where trades and payouts are verifiable through on-chain data and public wallet addresses.

### 2. The Trader Lifecycle

The journey from applicant to funded trader is structured into four distinct phases:

1.  **Purchase:** The trader selects an evaluation track and account size (ranging from $5,000 to $200,000). Upon payment, the account is activated.
2.  **Trade:** The trader operates on a simulated account to reach a profit target. Propr distinguishes itself by imposing no time limits and no minimum trading day requirements.
3.  **Pass/Verification:** Once the profit target is met, the evaluation is automatically passed. Prior to funded account activation, traders must complete a mandatory one-time Identity Verification (KYC) including government ID and a live selfie.
4.  **Funded Trading:** The trader receives a funded account with the same starting balance as the evaluation. Profits generated here are eligible for on-demand payouts via USDC.

### 3. Program Architecture and Evaluation Tracks

Propr offers four primary tracks, each catering to different risk profiles:

*   **Classic 1-Step:** Requires a 10% profit target with a 6% static drawdown.
*   **Turbo 1-Step:** A high-velocity track with a lower 9% profit target and a tighter 3% static drawdown. **Note:** While the Rulebook mentions sizes up to $200k, the v1.0.3 Changelog caps Turbo accounts at $100k.
*   **Pro 1-Step:** A balanced model requiring a 12% profit target with a 5% static drawdown.
*   **Classic 2-Step:** A dual-phase model. Step 1 requires a 5% target; Step 2 requires 10%. This track utilizes a 5% daily loss limit and an 8% trailing drawdown.

**Account Scaling**
Standard account sizes include $5k, $10k, $25k, $50k, $100k, and $200k. The aggregate funded balance limit per trader is $300,000.

### 4. Advanced Risk Mechanics: Equity Limits

Risk enforcement is conducted in real-time based on account equity (including floating P&L) rather than realized balance.

*   **Calculation Basis:**
    *   `Balance`: Realized P&L from closed positions.
    *   `Equity`: `Balance + Unrealized (Floating) P&L`.
*   **Maximum Daily Loss:** Recalculated daily at 00:00 UTC. The limit is a percentage of the **start-of-day balance** (3% for 1-Step, 5% for 2-Step).
    *   `Equity Floor = Start-of-day Balance - (Start-of-day Balance * Daily Loss %)`
    *   The dollar value of this limit scales as the account grows or shrinks each day.
*   **Maximum Drawdown (Static):** Employed in 1-Step accounts. The floor is fixed at account inception and remains at that absolute dollar value regardless of account growth.
*   **Maximum Drawdown (Trailing):** Employed in 2-Step accounts. The floor trails the account’s High Water Mark (HWM), which includes floating P&L.
    *   `Max Drawdown Equity Limit = HWM - (8% * Starting Balance)`
    *   The trailing limit is capped at the starting balance; once the floor reaches the starting balance, it stops moving upward.
*   **Breach Consequences:** There is no grace period. If equity touches the calculated floor for even a millisecond, all positions are closed and the account is permanently terminated.

### 5. Funding Rules and Offers Table

| Track Name | Account Size | Entry Fee | Profit Target (%) | Daily Loss (%) | Max Drawdown (%) | Drawdown Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Classic 1-Step | $5k–$200k | $60–$1,998 | 10% | 3% | 6% | Static |
| Turbo 1-Step | $5k–$100k* | $25–$450 | 9% | 3% | 3% | Static |
| Pro 1-Step | $5k–$200k | $45–$1,399 | 12% | 3% | 5% | Static |
| Classic 2-Step | $5k–$200k | $50–$1,499 | 5% / 10% | 5% | 8% | Trailing |

*\*Note: See Section 10 regarding $200k Turbo account availability.*

*   **Start-of-day Balance:** The snapshot taken at 00:00 UTC to determine the daily equity floor.
*   **High Water Mark (HWM):** The peak equity reached; used to trail the 2-Step drawdown limit.

### 6. Trading Permissions and Strategy Restrictions

Propr utilizes a "Freedom of Strategy" framework. Unlike competitors, it explicitly permits:
*   **News Trading:** No restrictions during market-moving events.
*   **Holding Rules:** Overnight and weekend holding is fully permitted.
*   **Automated Trading:** EAs, Bots, and API trading are allowed.
*   **Structural Freedom:** No Consistency Rules, No Profit Caps, and No Risk-per-trade rules.

**Leverage Schedule**
Traders are granted asset-specific leverage caps that cannot be modified:

| Asset Class | Max Leverage |
| :--- | :--- |
| BTC, ETH, SOL Perpetuals | 10x |
| SP500, XYZ100 (Nasdaq) | 10x |
| Gold, Silver, CL, Brent Oil | 8x |
| Other Indices / Commodities | 5x |
| Equities Perpetuals | 4x |
| Other Crypto Perpetuals | 2x |
| FX Perpetuals | 25x |

**Prohibited Conduct**
Violations resulting in immediate termination include:
*   **Opposite Hedging:** Offsetting positions across accounts to "game" the evaluation.
*   **Third-party Coordination:** Colluding with other traders.
*   **Account Cycling:** Treating evaluations as lottery tickets via high-risk binary bets.
*   **Technical Exploits:** Latency arbitrage, tick sniping, or wash trading.
*   **Drawdown Manipulation:** Exploiting the payout/drawdown interaction on 2-Step accounts.

### 7. Execution and On-Chain Custody

Propr operates a hybrid execution model to manage firm-wide delta risk and capital efficiency.

| A-Book (Market Execution) | B-Book (Internal Book Entry) |
| :--- | :--- |
| Orders routed directly to Hyperliquid. | Orders recorded internally; no market impact. |
| Firm assumes market risk (delta). | Firm assumes counterparty risk. |
| On-chain verifiable via block explorer. | P&L calculated internally; results are identical. |

**Analytical Insight:** The hybrid model allows Propr to optimize its revenue stream. B-booking is typically used to manage "toxic flow" or capture the spread on low-edge traders (maximizing revenue from unsuccessful participants), while A-booking is reserved for high-conviction traders or to offset aggregate directional exposure that exceeds the firm's internal risk thresholds. 

**Execution Factors:** Discretionary factors for B-booking include current market liquidity, aggregate exposure across all funded traders, and internal capital pool utilization.

**Venue Integration:**
*   **Hyperliquid:** Primary venue for perps.
*   **Polymarket:** Utilized for prediction markets. Note that Prediction Markets represent a separate account type with distinct mechanics not covered in the standard Hyperliquid rulebook.

### 8. Payout and Compensation Mechanics

*   **Profit Split:** Flat 80% to the trader.
*   **Withdrawal Parameters:** On-demand requests via USDC, processed within 24 hours.
*   **The "Sweep" Rule:** Payouts require all positions to be closed. A payout triggers a full profit sweep, resetting the account balance to the initial funded amount.
*   **2-Step Reset:** In 2-Step accounts, a payout reduces the HWM by the payout amount and resets the HWM to the starting balance, effectively resetting the trailing drawdown limit to its original starting level.

### 9. Governance and Institutional Context

*   **Legal Compliance:** Propr is unavailable in Russia, OFAC-sanctioned countries, and the Crimea/Donetsk/Luhansk regions of Ukraine.
*   **Account Caps:** Maximum aggregate funded limit of $300,000.
*   **Organizational Pedigree:** Developed by startup studio XBorg and backed by SwissBorg (AUM $2B+). The team includes former risk quants from Credit Suisse and crypto leads from Rothschild & Co.

### 10. Sources, Conflicts, and Unresolved Questions

**Data Contradictions**
1.  **Minimum Payout:** The Rulebook/FAQ specifies a $20 minimum, whereas the v1.0 Launch Changelog cites $50.
2.  **Turbo Account Size:** Rulebook Section 02 lists a $200k Turbo account, but Changelog v1.0.3 explicitly states Turbo accounts are only available up to $100k.
3.  **Turbo Risk Param:** One website graphic shows 4% Daily Loss for Turbo accounts, while the Rulebook and pricing tiers confirm 3%.
4.  **Market Specifics:** The website markets Polymarket access, but the Rulebook lacks the specific technical risk parameters (leverage, drawdown) for prediction markets.

**Unresolved Questions**
The v1.0.1 Changelog notes a "Scaling program" is available, but no documentation exists regarding the requirements for balance increases or the criteria for firm-side capital expansion for top-tier traders.