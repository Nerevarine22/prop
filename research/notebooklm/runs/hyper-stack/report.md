# Hyper Stack Project Research Brief

### 1. Operating Model and Project Identity
Hyper Stack utilizes a bifurcated operating model that distinguishes between the brand’s marketing front-end and the technical back-end infrastructure. Under this framework, Hyper Stack acts strictly as an authorized marketing partner, while **Vanta** serves as the "Operator" and primary counterparty.

From an operational and risk perspective, this creates a clear division of responsibility. Hyper Stack manages the project’s identity and user acquisition, but Vanta maintains absolute control over the simulated trading environment, the validation of results, and all financial flows. Participants should note the significant **counterparty risk** inherent in this structure: all entry fees are paid directly to Vanta, and Vanta holds the ultimate discretionary authority over eligibility decisions and reward distributions. There is no direct contractual relationship between the trader and Hyper Stack regarding the execution of the evaluation or the settlement of performance rewards.

### 2. The Trader Lifecycle
The transition from a prospective participant to a compensated contractor is a non-linear process governed by the following sequence:

1.  **Entry:** The participant purchases a simulated evaluation challenge. All fees are denominated and paid exclusively in USDC directly to Vanta.
2.  **Evaluation:** The participant engages in a Vanta-powered "one-step" challenge. This is a simulated environment designed to test risk management and strategy consistency.
3.  **Validation:** Success is defined by reaching a 10% profit target relative to the initial simulated capital while adhering to all drawdown and inactivity constraints.
4.  **Transition:** Unlike retail-focused marketing might suggest, passing the evaluation does not grant automatic access to a funded state. Instead, successful participants enter a **discretionary invitation phase**. Advancement is contingent upon Vanta’s approval, successful KYC/AML screening, and the execution of a separate Independent Contractor Agreement (ICA).
5.  **Compensation:** Once onboarded as an independent contractor, participants are eligible for monthly rewards based on the simulated performance of their "Scaled Account," settled on-chain.

### 3. Detailed Rule Mechanics
The Hyper Stack evaluation phase is governed by specific risk parameters that dictate account longevity and success.

*   **Intraday Daily-Loss Limit (5%):** This is a hard-breach limit calculated as 5% of the account's starting value for the current trading day. 
    *   *Technical Note:* The source context does not explicitly define whether this is based on "Starting Balance" or "Starting Equity." For the purposes of this analysis, this remains a technical ambiguity that could affect traders holding significant floating PnL across day-breaks. 
*   **EOD Trailing-Loss Limit (5%):** This functions as a trailing maximum drawdown based on the account's "high-water mark" at the end of each trading day (EOD). As the account realizes profits and increases its EOD balance, the breach level trails upward. If the account equity falls 5% below this trailing high-water mark, the account is terminated.
*   **Profit Target (10%):** The net simulated gain required to qualify for the next stage of the lifecycle.
*   **Inactivity Rule (30 Days):** An account is subject to immediate elimination (hard breach) if no trading activity is recorded for 30 consecutive days. This serves as a "soft" time limit, requiring active engagement without a fixed deadline for the profit target.

### 4. Funding Rules and Offers
The following table details the account tiers available through the Vanta infrastructure. All entry costs represent one-time fees paid to Vanta.

| Account Size (Capital) | Entry Cost (USDC) | Stages | Profit Target | Daily Loss | Max Drawdown | Drawdown Type | Time Limit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $1,000 | $0 | One-Step | 10% | 5% | 5% | EOD Trailing | 30-Day Inactivity |
| $5,000 | $74 | One-Step | 10% | 5% | 5% | EOD Trailing | 30-Day Inactivity |
| $10,000 | $135 | One-Step | 10% | 5% | 5% | EOD Trailing | 30-Day Inactivity |
| $25,000 | $309 | One-Step | 10% | 5% | 5% | EOD Trailing | 30-Day Inactivity |
| $50,000 | $579 | One-Step | 10% | 5% | 5% | EOD Trailing | 30-Day Inactivity |
| $100,000 | $999 | One-Step | 10% | 5% | 5% | EOD Trailing | 30-Day Inactivity |

**Table Key:**
*   **EOD Trailing:** The drawdown floor trails the account high-water mark based on the balance recorded at the end of the trading day.
*   **USDC-only:** All financial interactions—including entry fees paid to Vanta and performance rewards—are settled via USDC.

### 5. Trading Permissions and Constraints
The environment provides broad latitude for various trading methodologies, which is indicative of a focus on performance outcomes rather than style restrictions:

*   **News Trading:** Permitted. Participants are not restricted from trading during high-volatility economic releases.
*   **Weekend/Overnight Holding:** Permitted. There is no requirement to flatten positions before market closes.
*   **Algorithmic/Bot Trading:** Permitted. The use of EAs and automated strategies is allowed within the simulated environment.
*   **Documented Gaps:** There is currently no data regarding maximum position limits (lot size constraints), leverage ratios, or the permissibility of copy-trading services.

### 6. Execution, Custody, and Payout Mechanics
It must be emphasized that all trading occurs within a **simulated execution environment**. No capital is deployed into live markets; instead, payouts are generated based on the performance data recorded in the virtual account.

*   **Reward Distribution:** Qualified contractors retain 90% of the simulated profit (90/10 split).
*   **Payout Cycle:** Rewards are calculated and distributed on a 30-day (monthly) cycle.
*   **Currency & Settlement:** Settlements are conducted on-chain via USDC, categorized as independent-contractor compensation for services rendered (performance data generation).
*   **Scaling & Bonuses:**
    *   **Scaling:** To increase the account size, a trader must achieve a 5% quarterly return while maintaining a Sharpe ratio greater than 1.
    *   **Quarterly Bonus:** A bonus of 25% of realized PnL is available for traders achieving a 2% quarterly return with a Sharpe ratio greater than 1.

### 7. Legal, Compliance, and Jurisdictional Data
Traders participate as **independent contractors**. This classification is critical, as it removes the project from the realm of traditional brokerage or investment management. Final eligibility for a Scaled Account is not a right earned by hitting a profit target, but a discretionary invitation issued by Vanta. Consequently, the stated "Rules" serve as the **minimum technical requirements** for consideration, not a guarantee of a contract or payout. KYC and a signed ICA are mandatory prerequisites for any reward eligibility.

### 8. Sources, Conflicts, and Unresolved Questions

**Sources Used**
*   Hyper Stack Official Website and Rulebook.
*   Vanta-Hyper Stack Pricing and Checkout Portals.
*   Platform FAQ and Legal Terms of Service.

**Documented Conflicts**
The most significant conflict identified is the discrepancy between marketing narrative and legal reality:
*   **The Marketing Claim:** Promotion materials suggest that hitting the 10% profit target "activates a scaled account immediately" with "automatic" rewards.
*   **The Legal Reality:** The Terms of Service state that reaching the target "does not guarantee" an invitation to a Scaled Account. Vanta retains absolute discretion to deny an invitation or withhold compensation regardless of performance, necessitating a separate, manual onboarding process (ICA/KYC).

**Unresolved Questions**
The following operational details are missing from the ledger and should be treated as unknown:
*   **Asset Coverage:** Specific supported markets (e.g., FX pairs, specific cryptos, or indices) are not listed.
*   **Leverage:** The maximum allowable leverage for simulated positions is undisclosed.
*   **Geographic Restrictions:** There is no documentation regarding prohibited jurisdictions or sanctioned regions.
*   **Position Limits:** Maximum allowable open interest or lot size constraints per instrument are not defined.