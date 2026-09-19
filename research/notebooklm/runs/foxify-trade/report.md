# Research Brief: FUNDED by FOXIFY Infrastructure and Operating Model

### 1. Project Identity and Core Operating Model
FUNDED by FOXIFY is a decentralized "A-Book Prop Firm Infrastructure" layer. Unlike traditional prop firms that operate as standalone, centralized brokerages, FUNDED is designed as a modular "plug-in" protocol that integrates directly into decentralized exchanges (DEXs) to drive volume and liquidity.

The fundamental differentiator is the A-Book execution model. Traditional prop firms typically utilize "B-Book" environments—simulated demo accounts where the firm profits from trader losses. In contrast, FUNDED provides real capital deployed on real orderbooks. Every trade executed by a funded trader contributes to the actual liquidity of the host platform, with profits derived from market performance rather than participant failure.

| Feature | FUNDED by FOXIFY (A-Book) | Traditional Prop Firms (B-Book) |
| :--- | :--- | :--- |
| **Account Type** | Real USDC on real DEX orderbooks | Synthetic / Demo accounts |
| **Order Routing** | Direct to live market liquidity | Internalized (Firm takes the opposite side) |
| **Evaluation Phase** | None; instant funding upon deposit | 1–3 month "challenge" periods |
| **KYC Requirements** | None (Permissionless Web3 wallet) | Full ID verification / KYC required |
| **Revenue Source** | Trading fees and performance share | Evaluation fees and trader losses |
| **Transparency** | 100% on-chain verifiable | Opaque internal "Black Box" |
| **Platform Impact** | Strengthens DEX liquidity and volume | Extracts liquidity from the ecosystem |

### 2. The Trader Lifecycle
The protocol utilizes an automated journey designed for performance-based scaling, removing human intervention via smart contracts.

1.  **Onboarding:** Users connect a Web3 wallet (MetaMask, Rabby, etc.) to a supported DEX. There is a strict **No KYC** policy. Traders must ensure they hold USDC for collateral and the specific gas token for the chosen chain (e.g., BERA for Berachain, arbETH for Arbitrum).
2.  **Activation:** The trader selects a Track (Entry, Pro, or Elite) and deposits the required USDC collateral into the FUNDED vault. Funding is instant.
3.  **Trading & Performance:** Success is governed by dual metrics: achieving a **Profit Target** (USD) and a **Points Target** (100 points). Points are earned through a combination of consistent trading activity and realized P&L.
4.  **Scaling:** Upon meeting targets, the trader is promoted to the next level. This instantly increases the available capital and potential profit share.
5.  **Termination/Payout:** 
    *   **Payout:** Successful traders can withdraw 80% of profits instantly on-chain. FOXIFY provides a **$50,000 Payout Guarantee**, promising this amount to any trader if a valid payout is denied without cause—a significant protocol-level trust mechanism.
    *   **Termination:** If the "Max Drawdown" or "Daily Drawdown" limit is breached, the account is liquidated. Losses are first deducted from the trader's collateral; remaining losses are absorbed by the FUNDED vault.

### 3. Account Tracks and Progression Levels
FUNDED offers three distinct tracks with varying capital multipliers and risk parameters.

**Entry Track**
Accessible entry point requiring a **$100 deposit** for **$500 starting capital** (5x multiplier). It is the only track featuring the **Spark** starting level. Traders scale through **Spark, Surge, Bronze, Silver, Gold, and Platinum** to a **$10,000 ceiling**.

**Pro Track**
Designed for experienced traders, requiring a **$500 deposit** for **$2,500 starting capital** (5x multiplier). It bypasses initial tiers, starting at **Bronze** and scaling through **Silver, Gold, and Platinum** to a **$10,000 ceiling**.

**Elite Track (Coming Soon)**
High-tier track for professional traders. A **$500 deposit** unlocks **$5,000 starting capital** (10x multiplier). Levels include **Silver, Platinum, Diamond, and Elite**, scaling to the maximum protocol ceiling of **$20,000**.

### 4. Funding Rules and Offers Table

| Track Name | Level Name | Status | Entry Deposit | Funded Capital | Profit Target | Points Target | Max Drawdown % | Max Drawdown $ | Profit Share % |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Entry** | Spark | Available | $100 | $500 | $75 | 100 | 20% | $100 | 80% |
| **Entry** | Surge | Available | — | $1,250 | $187.50 | 100 | 15% | $187.50 | 80% |
| **Entry** | Bronze | Available | — | $2,500 | $375 | 100 | 15% | $375 | 80% |
| **Entry** | Silver | Available | — | $5,000 | $750 | 100 | 12% | $600 | 80% |
| **Entry** | Gold | Available | — | $7,500 | $1,125 | 100 | 10% | $750 | 80% |
| **Entry** | Platinum | Available | — | $10,000 | $1,500 | 100 | 10% | $1,000 | 80% |
| **Pro** | Bronze | Available | $500 | $2,500 | $375 | 100 | 20% | $500 | 80% |
| **Pro** | Silver | Available | — | $5,000 | $750 | 100 | 15% | $750 | 80% |
| **Pro** | Gold | Available | — | $7,500 | $1,125 | 100 | 12% | $900 | 80% |
| **Pro** | Platinum | Available | — | $10,000 | $1,500 | 100 | 12% | $1,200 | 80% |
| **Elite** | Silver | Coming Soon | $500 | $5,000 | $750 | 100 | 10% | $500 | 80% |
| **Elite** | Platinum | Coming Soon | — | $10,000 | $1,500 | 100 | 8% | $800 | 80% |
| **Elite** | Diamond | Coming Soon | — | $15,000 | $2,250 | 100 | 7% | $1,050 | 80% |
| **Elite** | Elite | Coming Soon | — | $20,000 | $3,000 | 100 | 6% | $1,200 | 80% |

#### Technical Glossary for Table Variables
*   **Max Drawdown:** The maximum total loss permitted, calculated from the initial funded balance.
*   **Daily Drawdown:** A secondary risk guardrail that limits the maximum permissible loss within a rolling 24-hour window.
*   **Points Target:** A performance score (100 pts) required for promotion, earned via trading volume, time active, and realized P&L.

### 5. Advanced Mechanics: Drawdown, Resets, and Fees
*   **Drawdown Mechanics:** Hitting the Max Drawdown percentage results in instant liquidation. The system first drains the trader's collateral to cover losses; if the loss exceeds the collateral, the FUNDED vault absorbs the difference.
*   **Drawdown Reset:** Traders may pay a **Reset Fee** to restore their account health. This resets both the Max Drawdown and the Daily Drawdown limits to 0% used, allowing the trader to maintain their current level and points progress rather than restarting the track.
*   **Inactivity & Borrow Fees:** If an account remains in an "Extended Idle" state (no trades opened for a specific period), dynamic borrow fees begin accruing against the collateral. If the collateral is exhausted by these fees, the challenge is terminated. Specific rates and idle thresholds are dynamic and displayed in the live trading UI.

### 6. Trading Permissions and Strategy Restrictions (Rules of Engagement)
Because FUNDED operates an A-Book model that profits from volume and fees, it actively encourages strategies that centralized firms often ban.

- [x] **News Trading:** Permitted; trade all major market events.
- [x] **Weekend & Overnight Holding:** Permitted without restriction.
- [x] **Automation:** Bots, Expert Advisors (EAs), and API access are fully supported.
- [x] **Scalping & Grid Trading:** Permitted.
- [x] **Multi-Account Management:** Permitted.
- [x] **Copy Trading:** Permitted.
- [x] **Limits:** No consistency rules or daily P&L caps are enforced. Drawdown limits are the only functional guardrails.

### 7. Execution and Settlement Infrastructure
*   **Execution:** FUNDED currently routes trades through **Kodiak Finance**, **what.exchange**, and **PERPTools**. 
*   **Networks & Gas:** 
    *   **Berachain:** Uses **BERA** for gas.
    *   **Arbitrum:** Uses **arbETH** for gas.
    *   **Sonic:** Native host for the FOX ecosystem and token.
*   **Custody:** Non-custodial system where funded capital is held in the FUNDED vault and managed by audited smart contracts.
*   **Settlement:** All settlements are in **USDC**. Smart contracts execute the 80/20 profit split automatically, sending the trader's portion directly to their Web3 wallet without manual approval.

### 8. Automated FUNDED Accounts (Beta)
This "hands-free" product allows users to deploy funded capital into AI-driven strategy vaults.

*   **Operating Model:** Traders deposit collateral and select curated strategy vaults with verifiable on-chain track records. The system handles all execution and scaling.
*   **Comparative Analysis:**

| Feature | Standard FUNDED | Automated FUNDED (Beta) |
| :--- | :--- | :--- |
| **Trader Effort** | Active Manual Execution | Passive / Hands-free |
| **Profit Share** | 80% to Trader | 70% to Trader |
| **Pass Rate** | 13.9% | **78.0%** |

*   **Performance:** Automated accounts significantly outperform manual accounts in pass rates. The documented average APR for these accounts is **11,123%** (based on extrapolated weekly cashouts).

### 9. Ecosystem: Tokens, NFTs, and Staking
*   **Bonus NFTs:** Users can hold "FOXIFY Trading Co" NFTs to increase their capital. **Silver NFTs (+10%)** and **Gold NFTs (+25%)** serve as funding multipliers.
*   **NFT Merge Mechanic:** A "burn-to-upgrade" system allows traders to merge **five Bronze NFTs** to create **one Silver NFT**, impacting secondary market liquidity.
*   **FOX Token:** A deflationary utility token on Sonic/Berachain. It features a fixed supply of ~12.18M and a "Buy and Burn" mechanic where 30% of platform net fees are used to buy FOX and distribute to stakers.
*   **Staking (ebFOX):** The "Earn and Burn" pool provides tiered roles:
    *   **Cunning Fox (1,000 FOX):** Signals and private chat.
    *   **Golden Fox (2,000 FOX):** Enhanced perks.
    *   **Platinum Fox (5,000 FOX):** Full premium access.

### 10. Sources, Conflicts, and Unresolved Questions
**Source Categorization**
*   Current Documentation (Gitbook), Live Website/Stats, Waitlist/v2, and Legacy (t2e).

**Identified Conflicts**
*   **Profit Share:** Standard docs cite **80%**, while the v2/Waitlist page mentions up to **90%**.
*   **Market Count:** Gitbook lists **125+** markets, while the live website claims **220+**.
*   **Trading Fees:** Rates vary by platform, with **7.5bps** on Kodiak/What vs. **9bps** on PERPTools.

**Legacy Distinction**
The historical "7-day qualification" model (Trade2Earn) is a legacy product. Unlike the current model's **instant funding** with level-specific drawdown percentages (e.g., 6% to 20%), the legacy model required a 115% net growth and 45% win ratio over 7 days, marketing "no drawdown limits" while enforcing a static 6% stop-out.

**Unresolved Questions**
*   The exact mathematical weight of "Activity" vs "P&L" in the **Points** calculation is proprietary/undisclosed.
*   Specific dollar-value **Borrow Fees** are dynamic and only visible in the live trading interface.
*   **Flash Funding** (v2) collateral ratios and specific interest rates are not yet fully detailed in technical documentation.