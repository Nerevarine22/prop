# Research Brief: Size Project Analysis

### 1. Operating Model and Project Essence
Size is a simulated skill-based entertainment service operated by **Trench Labs Group Ltd.** From a regulatory and operational standpoint, the project is explicitly classified as an entertainment service to distinguish its activities from those of a regulated brokerage, investment firm, or financial intermediary.

The ecosystem utilizes a "Key and Trial" model to gate access to "Lives" (Virtual Funded Accounts). 
*   **The Key and Trial System:** Participants pay a fixed entry fee (the Key) to compete in a high-stakes, 15-minute evaluation. This represents the participant's primary capital risk.
*   **The Life System:** A "Life" is a simulated funded account providing "Virtual Credit" or "Simulated Capital." This stage carries performance-risk rather than capital-risk; the participant is not trading actual firm capital in live markets but is instead operating within a simulated environment.
*   **Infrastructure:** Size is non-custodial, operating on the **HyperEVM** network. Financial settlements are handled via USDC smart contracts, ensuring transparency in the compensation process without the platform taking custody of participant-earned profits.

### 2. The Trader Lifecycle: From Key to Payout
The participant journey is a strictly linear progression designed to filter for high-performance traders:

*   **Entry:** Participants acquire "Keys" for specific tiers. This represents the only point of personal capital outlay.
*   **Evaluation (The Trial):** The participant enters a 15-minute competitive "Trial" conducted on live market data. To advance, the participant must secure first place in their specific session.
*   **Funding (The Life):** Upon winning a Trial, the participant is awarded a "Life." This transition moves the trader from a "competitor" to a "simulated funded trader."
*   **Trading & Risk:** Participants manage the simulated account. At this stage, the trader has no personal capital at risk—only the "Life" itself is at stake. The objective is to generate simulated profit while avoiding a "Hard Breach" of risk parameters.
*   **Compensation:** Performance-based rewards are requested as payouts. This is the conversion of simulated profit into liquid USDC.

### 3. Detailed Rules and Risk Enforcement
Risk management is enforced through automated drawdown triggers. Any violation of these thresholds constitutes a **Hard Breach**, resulting in the immediate termination of the "Life."

*   **Alpha through Gold Tiers:** 5% Daily Loss Limit / 10% Total Drawdown.
*   **Diamond and Ruby Tiers:** 4% Daily Loss Limit / 8% Total Drawdown.

**Risk Calculation Ambiguity:** The "Calculation Basis" (whether drawdown is measured against starting balance, trailing equity, or end-of-day balance) is not explicitly defined in current documentation. Consequently, traders must operate under the assumption of the most restrictive interpretation until further clarification is provided (see *Unresolved Questions*).

### 4. Funding Rules and Offers
The following table delineates the specifications for each documented tier as of August 16, 2026.

| Tier Name | Entry Cost | Simulated Capital (Size) | Daily Loss Limit | Max Drawdown | Profit Split | Awarded Life Value |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Alpha** | $1 | $100 | 5% | 10% | 80% | USDC on HyperEVM |
| **Bronze** | $9 (Docs) / Free (Terms) | $1,000 | 5% | 10% | 60-85%* | USDC on HyperEVM |
| **Silver** | $49 | $5,000 | 5% | 10% | 60-85%* | USDC on HyperEVM |
| **Gold** | $199 | $25,000 | 5% | 10% | 60-85%* | USDC on HyperEVM |
| **Diamond** | $799 | $100,000 | 4% | 8% | 60-85%* | USDC on HyperEVM |
| **Ruby** | $1,499 | $200,000 | 4% | 8% | 60-85%* | USDC on HyperEVM |

*\*Note: The specific criteria for moving within the 60-85% range (e.g., leveling or performance milestones) are not currently disclosed.*

#### Pricing Discrepancies
A material conflict exists regarding the **Bronze Tier** entry cost. The Product Documentation (v.2026) lists the Bronze Key at **$9**, whereas the legal Terms of Service Schedule identifies it as **Free**. 

### 5. Execution, Custody, and Settlement
*   **Execution Environment:** All trading occurs in a simulated environment derived from live market feeds. There is no direct market impact from participant trades.
*   **Wallet and Permissions:** Users utilize a proprietary "Size wallet." The non-custodial nature of the platform means payouts are settled via smart contracts directly to the user's controlled environment.
*   **Settlement Path:** 
    *   **Cadence:** Payouts are available on-demand with **no review-cycle window**, facilitating high-frequency payout requests for successful traders.
    *   **Minimums:** A $5 minimum is required for payout requests.
    *   **Fees:** Size charges no internal payout fees. However, a **$1 external network/gas cost** is applied to withdrawals from the Size wallet to an external wallet.

### 6. Payout Mechanics and Trader Compensation
Trader compensation is determined by the Profit Split, which generally ranges from 60% to 85% (with Alpha fixed at 80%). 

**Critical Analysis of Balance Effects:** 
From an analyst's perspective, traders must account for the impact of payouts on their risk "buffer." Because the Maximum Drawdown is typically a fixed threshold, a payout reduces the account balance and, by extension, the distance to the liquidation point. 
*   *Example:* If a $10,000 account has a $9,200 Max Drawdown ($800 buffer) and the trader takes a $500 payout, the new balance is $9,500, but the Max Drawdown remains at $9,200. The trader's effective buffer is reduced to $300, significantly increasing the risk of a Hard Breach.

### 7. Ecosystem: XP, Rewards, and Restrictions
The ecosystem incorporates gamification elements to drive engagement within the "entertainment" framework:
*   **XP (Experience Points):** A permanent loyalty score earned via Trial wins, payouts, referrals, and Key purchases. Notably, XP is also earned through "Practice" sessions and specific "Missions," emphasizing the skill-development aspect of the service.
*   **Preseason:** A competitive phase where XP standings determine the distribution of funded-Life prizes.
*   **Token Status:** No proprietary liquid tokens or airdrops are documented as of August 2026.
*   **Compliance & Identity:** Identity verification (KYC) is mandatory. Per the **June 30, 2026** Terms of Service, participation is strictly prohibited for individuals in restricted jurisdictions.

### 8. Sources, Conflicts, and Unresolved Questions

**Sources Used:**
*   Official Website (size.club)
*   Official Rulebook: Product Tiers, Keys, and Lives
*   Official FAQ (Trials, Lives, and Payouts)
*   Pricing & Checkout Documentation
*   Legal Terms of Service (Trench Labs Group Ltd., Effective June 30, 2026)
*   Payout Policy (Profit Split and Settlement)
*   Token Rewards Documentation (XP and Leveling)

**Documented Conflicts:**
*   **Bronze Key Pricing:** Contradiction between Product Docs ($9) and Terms Schedule (Free).

**Unresolved Questions (Information Not Disclosed):**
*   **Drawdown Type:** It is not disclosed if the Max Drawdown is *Static* (fixed) or *Trailing* (increasing with peak equity).
*   **Calculation Basis:** It is not disclosed if risk limits are calculated based on *Balance* or *Equity*.
*   **Prohibited Strategies:** No data on restrictions regarding arbitrage, HFT, or exploitation.
*   **News Trading Rules:** Limitations regarding high-impact economic events are not documented.
*   **Consistency Rules:** No mention of mandatory trade volume or sizing consistency.
*   **Leverage Ratios:** Specific leverage available within the simulated Lives is not disclosed.
*   **Supported Markets:** A comprehensive list of tradable asset classes (FX, Crypto, Indices) is missing.