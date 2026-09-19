# Northbook Proprietary Trading Research Brief

## 1. Project Identity and Operating Model
Northbook is a specialized proprietary trading firm "built on-chain," providing a performance-tracking infrastructure where traders can monetize their market signals without deploying personal capital. The firm distinguishes itself through a "simulated-to-hedged" model, where all accounts—including funded stages—are legally defined as simulated environments. 

**Operating Model and Technical Infrastructure**
*   **Execution Framework:** Northbook utilizes Hyperliquid as its primary pricing and execution reference. Currently, the firm operates a "B-book" (internal matching) model, where fills, P&L, and equity are simulated against Hyperliquid’s live order book. "A-book hedging," involving the mirroring of trader signals into live markets, is under active development.
*   **Built On-Chain:** Unlike traditional prop firms, Northbook integrates smart-contract settlement. Payouts are verifiable on the blockchain via transaction hashes, promoting a level of transparency the firm describes as "auditable trading."
*   **Legal Nature of Arrangement:** The relationship between Northbook and the trader is a performance-based reward arrangement. The trader does not own real financial instruments or the underlying capital; rather, they receive a reward based on how their trading signals perform within the simulated environment.

## 2. The Trader Lifecycle
The progression from registration to capital allocation is designed to be mechanical and free of discretionary hurdles:

1.  **Entry:** Traders select a product type and account size ($5k to $100k), paying a one-time fee in USDC. No KYC is required to begin.
2.  **Evaluation:** Under the "One challenge, one phase" model, traders must hit a specific profit target. There are no time limits, minimum trading days, or consistency rules.
3.  **Promotion:** Transition to the "Funded" status is automatic upon reaching the profit target, provided no risk limits were breached.
4.  **Funding:** The trader receives a funded account with the same starting balance and risk limits (Daily Loss and Max Drawdown), but the profit target is removed.
5.  **Payout:** Profit-based rewards are requested on-demand. Settlement occurs in USDC on-chain via smart contract, ensuring instant, verifiable delivery of funds.

## 3. Funding Rules and Offers

### Funding Rules and Offers
| Product Type | Account Size | Entry Cost | Profit Target (%) | Daily Loss (%) | Max Drawdown (%) | Drawdown Type | Profit Split |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1-Step Base | $5,000 | Not Disclosed | 9% | 3% | 3% | Static | 80% |
| 1-Step Base | $10,000 | Not Disclosed | 9% | 3% | 3% | Static | 80% |
| 1-Step Base | $25,000 | Not Disclosed | 9% | 3% | 3% | Static | 80% |
| 1-Step Base | $50,000 | Not Disclosed | 9% | 3% | 3% | Static | 80% |
| 1-Step Base | $100,000 | Not Disclosed | 9% | 3% | 3% | Static | 80% |
| 1-Step Classic | $5,000 | Not Disclosed | 10% | 3% | 6% | Static | 80% |
| 1-Step Classic | $10,000 | Not Disclosed | 10% | 3% | 6% | Static | 80% |
| 1-Step Classic | $25,000 | Not Disclosed | 10% | 3% | 6% | Static | 80% |
| 1-Step Classic | $50,000 | Not Disclosed | 10% | 3% | 6% | Static | 80% |
| 1-Step Classic | $100,000 | Not Disclosed | 10% | 3% | 6% | Static | 80% |
| 1-Step Prime | $5,000 | Not Disclosed | 10% | 3% | 8% | Static | 80% |
| 1-Step Prime | $10,000 | Not Disclosed | 10% | 3% | 8% | Static | 80% |
| 1-Step Prime | $25,000 | Not Disclosed | 10% | 3% | 8% | Static | 80% |
| 1-Step Prime | $50,000 | Not Disclosed | 10% | 3% | 8% | Static | 80% |
| 1-Step Prime | $100,000 | Not Disclosed | 10% | 3% | 8% | Static | 80% |

**Key Advantage: Absence of Trailing HWM**
Unlike industry competitors that use a trailing High-Water Mark (HWM) drawdown, Northbook utilizes a **Static Drawdown**. The floor is set once at account creation (e.g., $94,000 for a $100k Classic account) and never moves upward. This ensures that as the trader generates profit, their risk cushion widens, rather than tightening relative to account peaks.

**Optional Add-ons:**
*   **Split 90:** Increases the trader’s profit share from 80% to 90% for the life of the account.
*   **Fee Rebate:** Returns the initial challenge fee with the first successful payout.

## 4. Risk Enforcement and Breach Mechanics
Risk is enforced via two primary equity-based guardrails. Because enforcement is based on **Equity** (Balance + Floating P&L), a "momentary touch" results in an immediate and permanent breach.

### Max Daily Loss
This limit resets at 00:00 UTC daily and is calculated based on the start-of-day balance.
*   **Formula:** `Equity floor = Start-of-day balance - (Start-of-day balance x 0.03)`
*   **Snapshot Mechanic:** The system captures the realized balance at the UTC reset. If profit is realized during the day, the allowance for the *following* day increases.

### Max Drawdown
An absolute floor beneath the account, calculated as: `Starting balance x (1 - drawdown %)`.

### The Breach Dossier: Auditable Transparency
Northbook’s identity is centered on "solving ambiguity by design." When an account is terminated, the system automatically issues a **Breach Dossier**. This evidentiary record contains:
*   **Trade Log:** Fills, instruments, prices, and timestamps.
*   **Breach Event:** The specific tick that crossed the limit and the venue data behind it.
*   **Account Overview:** Final status of targets and limits.
This dossier ensures the firm's decisions are verifiable and auditable by the trader.

## 5. Trading Parameters and Restrictions

### Permitted Activities
| Activity | Status | Notes |
| :--- | :--- | :--- |
| News Trading | Permitted | Trade during any market event or high-volatility release. |
| Weekend Holding | Permitted | Crypto markets remain open 24/7. |
| Overnight Holding | Permitted | No end-of-day flattening required. |
| Bots/Automation | Permitted | API access is currently under development. |
| Copy Trading | Permitted | Allowed between your own Northbook accounts. |
| Consistency Rules | **None** | No cap on single-day profit as a percentage of total gains. |
| Mandatory Stop-Loss| **None** | Recommended but not enforced by the risk engine. |
| Anti-Gambling Rules| **None** | Only the two equity limits serve as guardrails. |

### Prohibited Conduct
Conduct rules focus on systemic abuse rather than trading strategy. Enforcement utilizes **IP/device fingerprinting, cross-account correlation, and trade pattern analysis**.
1. Cross-account hedging.
2. Coordinated group trading/collusion.
3. Account sharing or sale.
4. Identity fraud.
5. Exploiting platform defects (price feed anomalies).
6. Latency arbitrage and tick sniping.
7. Account cycling (binary betting/lottery-ticket behavior).
8. Wash/simulated trading (no genuine market risk).
9. Insider information/front-running.
10. High-frequency trading (quote stuffing).

### Leverage Caps
| Asset Class | Max Leverage |
| :--- | :--- |
| BTC / ETH / SOL Perpetuals | 10x |
| Other Crypto Perpetuals | 2x |
| Equities Perpetuals | 4x |
| SP500 / Nasdaq Indices | 10x |
| Other Index Perpetuals | 5x |
| Gold, Silver, WTI, Brent | 8x |
| Other Commodity Perpetuals | 5x |
| Forex (Majors) | To be determined (available in dashboard) |

**Account Limits:** Maximum active capital is capped at **$200,000** per trader across all account types.

## 6. Execution and Custody
*   **Internal Matching:** Current execution is B-book, meaning orders are not placed on Hyperliquid's matching engine but are priced against its live liquidity.
*   **Fee Structure:** Northbook applies "Growth mode" rates, which are significantly tighter than standard venue rates:
    *   **HL Native Perps:** 0.008% Maker / 0.035% Taker.
    *   **HIP-3 Perps:** 0.0008% Maker / **0.0035%** Taker.
*   **Pricing:** Hyperliquid provides the order book depth and funding rates, which are debited or credited to the account equity.

## 7. Payout and Compensation Mechanics
*   **Eligibility:** Requires all positions closed, a full profit sweep, and completed KYC.
*   **On-Chain Settlement:** Payouts are executed via smart contract in USDC.
*   **Balance Reset:** After a payout, the account resets to its starting balance; the static drawdown floor remains unchanged.
*   **Solvency Claims:** Northbook maintains a public on-chain USDC vault at ≥15-20% of funded capital, ensuring liquidity for all potential payout liabilities.

## 8. Compliance and Jurisdictional Data
*   **KYC:** Required before the first payout. Documentation involves a government-issued photo ID and a live selfie. **No proof of address is required.**
*   **Jurisdictions:** Service is restricted in sanctioned territories (e.g., OFAC-sanctioned regions). Use of a VPN to bypass these restrictions results in immediate termination without refund.

## 9. Sources, Conflicts, and Unresolved Questions

### Sources
*   Official "How it works" (v0.5)
*   Official "Legal" (v0.5)
*   Official "Rulebook"
*   Official "Rules" (v0.5)
*   Official Website data

### Contradictions
*   **Minimum Payout:** There is a discrepancy between Source 1 ($20 minimum) and the Source 4 Quick Reference table ($50 minimum).

### Unresolved Questions
*   **Pricing:** The specific USDC cost for each challenge tier ($5k–$100k) is not listed in the current documentation.
*   **FX Leverage:** While Forex is listed as a tradeable market (EUR/USD, GBP/USD, USD/JPY), the specific leverage caps are not yet published in the rulebook.
*   **Development Timelines:** No fixed dates are provided for the release of API access or A-book hedging.
*   **Corporate Entity:** The registration jurisdiction and physical headquarters of Northbook are not disclosed.