# Research Brief: Breakout Proprietary Trading Project

### 1. Project Overview and Operating Model
Breakout is a cryptocurrency-focused proprietary trading evaluation platform that allows traders to access firm capital by demonstrating market proficiency. The operating model functions as a two-tiered system: **Breakout Trading Group, LLC** serves as the user-facing interface and evaluation entity, while **Payward Oceanic, Ltd (POL)** acts as the funding and capital allocation entity. 

Traders enter a contractual relationship where they pay a one-time evaluation fee in exchange for a demo environment. Upon successfully meeting performance benchmarks, they transition to a "funded" status. In this phase, traders manage capital provided by Breakout—leveraging **Kraken**-backed infrastructure and tier-1 exchange liquidity—to generate profits. The core value proposition centers on shifting the trader’s risk from their personal liquid net worth to a fixed, one-time evaluation fee, while maintaining a significant share of the generated upside.

### 2. The Trader Lifecycle

**Stage 1: Evaluation Entry**
The lifecycle begins with the selection of a specific evaluation track (Classic, Pro, Turbo, or 2-Step) and the payment of a non-refundable entry fee. These fees are tiered based on the requested capital allocation.

**Stage 2: Performance Evaluation**
Traders must achieve a specified profit target while adhering to strict daily loss limits and maximum drawdown rules. A significant feature of this stage is the **auto-upgrade** mechanic: once the profit target is hit, the account is immediately transitioned to funded status, even if positions remain open during the transition.

**Stage 3: Funding and Capital Allocation**
Successful candidates are granted access to a funded account. It is critical to note that the capital belongs to Breakout; the trader is effectively a service provider earning a performance-based fee. The trader’s financial exposure is limited to their initial evaluation fee.

**Stage 4: Live Trading and Risk Management**
In the funded phase, the firm enforces continuous risk management protocols. Traders must navigate the "Static Drawdown" and daily loss limits. Failure to comply with these parameters results in immediate account termination and loss of funded status.

**Stage 5: Payout and Compensation**
Profitability is rewarded via a performance split (standard 80/20). Settlement is conducted in **USDC** on the **Ethereum (ERC-20)** network, provided the trader meets the $50 minimum threshold and maintains an account free of breaches.

### 3. Detailed Program Rule Mechanics

**Daily Loss Limits**
There is a documented discrepancy between marketing collateral and formal rules. While the homepage advertises a 3% daily loss limit for all products, the formal 2-Step Program rules specify a **4% limit**. Breaching these limits results in immediate liquidation and account forfeiture.

**Drawdown Mechanics**
Breakout utilizes a **Static Drawdown** model for its Classic, Pro, and Turbo tracks (6%, 5%, and 3% respectively). Unlike trailing drawdowns used by many competitors, these limits are fixed relative to the initial starting balance and do not move upward as the account equity increases.

**Leverage Ambiguity**
Leverage limits present a significant conflict between marketing claims and operational reality. While marketing suggests "up to 10x," the Program Rules and pricing pages provide more restrictive figures:
*   **BTC/ETH:** 5x leverage.
*   **Other Instruments:** 2x leverage.
*   **Major-Market Leverage:** Some documentation cites "up to 5x" for major markets without explicitly defining which assets beyond BTC/ETH qualify for this tier.

### 4. Funding Rules and Offers Table

#### Breakout Program Comparison
| Program Name | Account Size | Entry Fee (80/20) | Profit Target | Daily Loss Limit | Max Drawdown | Drawdown Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1-Step Classic** | $5K | $45 | 10% | 3% | 6% | Static |
| **1-Step Classic** | $100K | $800 | 10% | 3% | 6% | Static |
| **1-Step Pro** | $5K | $33 | 12% | 3% | 5% | Static |
| **1-Step Pro** | $100K | $545 | 12% | 3% | 5% | Static |
| **1-Step Pro** | $200K | Not documented | 12% | 3% | 5% | Static |
| **1-Step Turbo** | $5K | $20 | 9% | 3% | 3% | Static |
| **1-Step Turbo** | $100K | $330 | 9% | 3% | 3% | Static |
| **1-Step Turbo** | $200K | Not documented | 9% | 3% | 3% | Static |
| **2-Step Program** | $5K | Not documented | 5% (St. 1) / 10% (St. 2) | 4% | 6% | Static |
| **2-Step Program** | $100K | Not documented | 5% (St. 1) / 10% (St. 2) | 4% | 6% | Static |
| **2-Step Program** | $200K | Not documented | 5% (St. 1) / 10% (St. 2) | 4% | 6% | Static |

**Explanatory Footnotes:**
*   **Static Drawdown:** The maximum loss limit is anchored to the initial account balance; it does not trail or adjust based on realized or unrealized profits.
*   **Performance Split:** Traders retain 80% of profits by default. A 90/10 split is available as a paid upgrade at checkout.

### 5. Trading Permissions and Restrictions
Breakout operates with a "No Arbitrary Rules" philosophy, removing common hurdles found in traditional prop firms:
*   **No News Restrictions:** Trading during high-impact events is permitted.
*   **No Consistency Rules:** No requirements for uniform position sizing or daily volume.
*   **No Profit Caps:** No upper limit on potential earnings.
*   **Market Coverage:** Access to 62 crypto pairs.
*   **Not Documented:** The use of automation, Expert Advisors (EAs), bots, API access, or copy trading is currently not addressed in the source material and should be considered unverified.

### 6. Technical Execution and Settlement
Execution occurs via the proprietary **Breakout Terminal**. The settlement path is strictly defined:
*   **Asset/Network:** USDC via Ethereum (ERC-20).
*   **Technical Risks:** The Payout Policy explicitly warns of counterparty and infrastructure risks, including smart contract bugs, network congestion, incorrect gas fees, and **nonce issues** (transaction ordering).
*   **Market Risk:** Breakout does not compensate for USDC price fluctuations during the processing window.
*   **Bot Risks:** The policy cites potential front-running by third-party bots during the on-chain transfer process.

### 7. Payout and Compensation Framework
The payout workflow is a two-step process that reveals a significant operational bottleneck:

1.  **Request:** The trader submits a request for at least $50 (post-split). This requires all positions to be closed and a clean account record.
2.  **Approval and Disbursement:** Contrary to "instant" marketing claims, **Payward Oceanic, Ltd (POL) must approve the payout** before the system even requests the trader’s wallet address.

**Note on Payout Timing:** The requirement for POL approval creates a "bottleneck" that contradicts marketing claims of "24/7 on-demand payouts with no approval wait." This internal review process represents a potential point of friction for traders expecting immediate liquidity.

### 8. Corporate, Compliance, and Legal
*   **Entities:** Breakout Trading Group, LLC and Payward Oceanic, Ltd.
*   **Legal Framework:** Terms of Use effective June 10, 2025.
*   **Eligibility:** Minimum age of 18.
*   **Compliance:** Mandatory KYC (Know Your Customer) procedures for all evaluation and funded participants.

### 9. Sources, Conflicts, and Unresolved Questions

**Sources Consulted:**
*   Official Website (breakoutprop.com)
*   Formal Program Rulebook
*   Official FAQ/Help Center
*   Pricing Checkout Documentation
*   Terms of Use & Payout Policy

**Documented Conflicts:**
| Subject | Marketing/Homepage Claim | Formal Rule/Policy | Analyst Risk Assessment |
| :--- | :--- | :--- | :--- |
| **Daily Loss Limit** | 3% for all products | 4% for 2-Step Program | High: Discrepancy may lead to termination disputes. |
| **Leverage** | Up to 10x | 5x (BTC/ETH); 2x (Others) | Moderate: Traders may over-leverage based on marketing. |
| **Payout Speed** | No approval wait or delays | POL must approve prior to address request | Moderate: Bottleneck may delay liquidity access. |

**Unresolved Questions:**
*   What are the specific criteria for "major-market" assets that qualify for 5x leverage?
*   What is the exact price of the 90/10 profit split upgrade?
*   What are the entry fees for the $200K Pro/Turbo tiers and the 2-Step Program?
*   Which specific jurisdictions are restricted (noting investigator ZachXBT's mention of "low quality" regions like Canada, the UK, India, and Nigeria)?
*   What is the official stance on API-based automation and trading bots?