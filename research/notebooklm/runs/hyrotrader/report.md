# HyroTrader Research Brief: Operating Model and Technical Specifications

## 1. Project Definition and Operating Model
HyroTrader is a cryptocurrency-focused proprietary trading firm founded in 2022. The firm utilizes a **Simulated Evaluation** model where all phases—Challenge, Verification, and the "Funded" phase—occur exclusively within a simulated environment. Under Section 3 of the General Terms and Conditions (GTC), all trading involves virtual units with no real capital or live market execution. This structure allows the firm to provide notional exposure to the cryptocurrency markets while mitigating the risks associated with custodial brokerage.

The corporate framework comprises three distinct entities to facilitate global operations and regulatory arbitrage:
*   **HYRO TECHNOLOGIES FZ-LLC (The Provider):** Based in the UAE (Ras Al Khaimah), this is the primary contracting party responsible for evaluation services.
*   **HYROTRADER TECHNOLOGIES LTD (Platform IP Owner & Funded Trader Entity):** Based in the British Virgin Islands (BVI), this entity holds all intellectual property and is the sole party to the "Funded Trader Agreement." Responsibility for performance-based compensation rests exclusively with this BVI entity.
*   **Hyro Finance j.s.a. (EEA Commercial Agent):** Based in the Slovak Republic, this entity acts as an authorized agent for the European market to facilitate fiat payment collection. As per §P.3, this is a **transitional** entity expected to be withdrawn once the UAE-based Provider can accept card payments directly.

## 2. The Trader Lifecycle
The transition from applicant to compensated trader follows a rigorous chronological path:

*   **Phase 1: Entry & Setup:** Registration involves selecting a notional account size and placing a **Refundable Challenge Deposit**. This deposit acts as a contractual debt owed to the trader upon meeting specific milestones, rather than a fee for service.
*   **Phase 2: Evaluation:** Traders navigate the One-Step or Two-Step evaluation tracks (Challenge and Verification) to demonstrate proficiency in risk management and slippage emulation strategies.
*   **Phase 3: Activation:** Accounts must be manually "Activated" within the platform to begin the evaluation. Traders are subject to a **six-month validity period**; failure to activate within this window results in the automatic expiration of the challenge and a return of the deposit (§8.1A).
*   **Phase 4: Transition:** Completion of the evaluation is a prerequisite but does not guarantee funding. The Provider retains absolute discretion to decline a Funded Trader Agreement based on KYC/AML/Sanctions results or the firm's current "capital allocation capacity" (§6.2). Entry into the reward phase requires a separate agreement with the BVI entity.
*   **Phase 5: Performance & Payout:** Rewards are calculated based on simulated profits. The Refundable Challenge Deposit is returned alongside the first successful payout milestone.

## 3. Program Structures and Funding Routes
HyroTrader offers One-Step (Popular) and Two-Step evaluation tracks across tiers ranging from 5,000 to 200,000 USDT.

**Specialized Accounts and Enhancements:**
*   **Complementary Accounts:** These benefit-based accounts are restricted to **exactly one payout**. There are two distinct categories: Participation benefits (typically a **10% profit split** or lower) and Giveaway/Referral accounts (offering an **80% profit split**).
*   **Swing Daily Drawdown Upgrade:** An optional modification for swing traders. Statistical data from the source context indicates that traders using the Swing upgrade experience a **53% lower failure rate** compared to the default risk parameters.

## 4. Technical Analysis of Risk and Performance Rules
Traders must adhere to strict Notional Exposure Limits and risk management parameters:

*   **Daily Drawdown (4%):** A hard limit calculated based on the **higher of** equity or balance at the start of the trading day. 
*   **Maximum Loss (6%):** The absolute drawdown limit relative to the initial notional balance. 
*   **Low-Cap Altcoin Rule:** To prevent excessive volatility exposure, assets with a market capitalization below $100M cannot exceed 5% of the initial account balance.
*   **Risk Management Standards (Section 10.5):** Unlike automatic breaches, behaviors such as sudden position size escalation, trade-splitting, or "all-or-nothing" patterns are treated as **"Indicators"** of non-compliance. These may trigger proportionate measures such as leverage reduction or account reviews rather than immediate termination.

## 5. Funding Rules and Offers Table

| Program Type | Notional Capital (USDT) | Entry Deposit (USD) | Stages | Profit Target (%) | Daily Loss (%) | Max Drawdown (%) | Min Trading Days | Profit Split (%) | Scaling Potential |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| One-Step | 5,000 | $59 | 1 | 10% | 4% | 6% | 5 | 80% (Starting) | Up to 90% |
| One-Step | 10,000 | $119 | 1 | 10% | 4% | 6% | 5 | 80% (Starting) | Up to 90% |
| One-Step | 25,000 | $249 | 1 | 10% | 4% | 6% | 5 | 80% (Starting) | Up to 90% |
| One-Step | 50,000 | $379 | 1 | 10% | 4% | 6% | 5 | 80% (Starting) | Up to 90% |
| One-Step | 100,000 | $579 | 1 | 10% | 4% | 6% | 5 | 80% (Starting) | Up to 90% |
| One-Step | 200,000 | $969 | 1 | 10% | 4% | 6% | 5 | 80% (Starting) | Up to 90% |
| Two-Step | (Same Tiers) | (Same Prices) | 2 | 10% / 5% | 4% | 6% | 5 | 80% (Starting) | Up to 90% |

**Technical Footnotes:**
*   **Refundable Deposit:** Contractual debt returned with the first successful payout.
*   **Trading Period:** Unlimited, provided the account remains active (login/trade within 90 days).

## 6. Trading Permissions and Strategic Restrictions
HyroTrader prohibits strategies that exploit simulation mechanics rather than market skill.

*   **Prohibited Strategies:** Martingale, cross-account hedging, latency arbitrage, and exploitation of data-feed inconsistencies.
*   **Asset Restrictions:** Trading of **EUR/USD** and **USDC pairs** is strictly prohibited per the Rulebook.
*   **Permissions:** News trading is permitted but restricted during specific windows (duration undefined in current documentation). Automation and API use are permitted on supported platforms.
*   **Prohibited Jurisdictions (Hard Blocks):** Services are strictly unavailable to residents of the **USA (subject to §23), Russia, Belarus, Afghanistan, Burma (Myanmar), Central African Republic, Cuba, Democratic Republic of the Congo, Eritrea, Ethiopia, Haiti, Iran, Iraq, Lebanon, Libya, Nicaragua, North Korea, Somalia, South Sudan, Sudan, Syria, Venezuela, Yemen, and Zimbabwe.** Additionally, the Ukrainian regions of **Crimea, Donetsk, Kherson, Luhansk, and Zaporizhzhia** are blocked.

## 7. Execution, Platforms, and Custody
The technical infrastructure is designed to emulate authentic market conditions via API integrations.

*   **Platform Specifics:**
    1.  **Bybit (Direct API):** Traders connect their own Bybit accounts via API to trade USDT perpetuals.
    2.  **Tealstreet Terminal:** A professional-grade interface utilizing Bybit order book data.
    3.  **Cleo Platform:** Unlike API-based options, accounts on Cleo are **created automatically**. This platform utilizes **Binance market data** for price discovery and execution simulation.
*   **Custody/Walletry:** HyroTrader is not a broker. No real capital deposits are accepted for trading. Payouts are handled via **USDT or USDC stablecoins** on-chain. Traders bear all risks associated with exchange rate fluctuations and blockchain transfer costs (§7.7).

## 8. Payout and Compensation Mechanics
*   **Profit Share:** Standard accounts begin at 80% and can scale to 90% based on consistent performance.
*   **Withdrawal Process:** Payout requests are eligible starting the same day as the first trade in the funded phase. Official processing timelines are **12–24 hours**, though marketing materials occasionally suggest "within a few hours."
*   **Refund Mechanic:** The Refundable Challenge Deposit is a **contractual debt** returned at the first payout milestone. It is not a bonus or promotional reward.
*   **Complementary Accounts:** These are strictly limited to **one payout**, after which the account is permanently deactivated and hidden from the dashboard.

## 9. Governance, KYC, and Jurisdictional Restrictions
*   **Legal Jurisdiction:** Governed by the laws of Ras Al Khaimah (UAE). 
*   **US-User Carve-out:** For residents of the United States, the seat of arbitration is **New York, NY**, administered by JAMS under Consumer Arbitration Minimum Standards (§23.5).
*   **KYC/AML:** Identity verification is managed via **Sumsub**. KYC triggers include initial registration, entry into the Funded Phase, and prior to any payout.
*   **VPN Policy:** Permitted for privacy, but use with "intent to conceal or misrepresent" jurisdiction to evade terms is a material breach.

## 10. Sources and Analytical Conflicts
**Source List:**
*   Official FAQ; General Terms and Conditions (v1.15)
*   Official Rulebook and Pricing Documentation; Official Payout Policy

**Conflict Disclosure:**
*   **Drawdown Discrepancy:** Marketing materials frequently reference a **"5% balance drawdown,"** whereas the formal GTC and Rulebook strictly enforce a **4% daily drawdown** and **6% absolute maximum loss**.
*   **News Trading:** The specific "news-event window" (e.g., +/- 5 minutes) remains numerically undefined in the core legal documents.
*   **Payout Speed:** A discrepancy exists between the **"within a few hours"** marketing claim and the **"12–24 hours"** official processing window in the Payout Policy.