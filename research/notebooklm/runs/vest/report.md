# Research Brief: Vest Markets and the Vest Capital Program

### 1. Project Overview and Operating Model
Vest Markets is an institutional-grade perpetual futures trading platform facilitating exposure to equities, cryptocurrencies, commodities, and foreign exchange (FX). The ecosystem operates via a bifurcated model:

*   **Community-Owned Liquidity Vault:** A decentralized liquidity provision system where participants provide capital to multiple market-making strategies. This vault functions as the primary liquidity backstop for the platform's perpetual contracts.
*   **Vest Capital Program:** A proprietary trading evaluation and capital allocation arm. This program is structured as a simulated environment designed to verify the risk-management proficiency and strategy discipline of high-conviction participants. Successful applicants transition from a simulated evaluation to a discretionary proprietary capital allocation.

The core value proposition of Vest Capital is a **90% profit retention** model, allowing funded traders to retain the vast majority of net gains generated through the firm's allocated capital.

### 2. The Trader Lifecycle
The progression from applicant to funded status is a structured three-step verification and allocation process:

1.  **Evaluation Phase:** Participants operate a simulated account in real market conditions. This stage is strictly an evaluation program to verify risk management skill. 
2.  **Funded Status:** Upon passing the evaluation, Vest Capital provides a "Funded Account." In this stage, all market-facing transactions are carried out exclusively by the firm for its own principal account at its sole discretion.
3.  **Capital Extraction:** Funded participants are eligible for 90% of profits. Payouts are available "On Demand," subject to the "Available Funds" mechanic—which defines the collateral balance available for withdrawal after accounting for active position requirements.

### 3. Detailed Funding Rules and Offers

#### Vest Capital Funding Program Details
| Account Tier | Trading Capital | Profit Goal | Max Drawdown | Evaluation Fee | Profit Split | Max Daily Loss | Leverage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Silver** | $5,000 | $500 | $300 | $60.00 | 90% | 4% | Up to 5x |
| **Gold** | $10,000 | $1,000 | $600 | $110.00 | 90% | 4% | Up to 5x |
| **Platinum** | $25,000 | $2,500 | $1,500 | $275.00 | 90% | 4% | Up to 5x |

#### Rule Clarification
*   **Max Daily Loss:** A hard 4% limit is applied across all tiers to enforce strict capital preservation.
*   **Leverage Constraints:** Capital programs are restricted to **5x leverage**, representing a significantly more conservative profile than the 50x–100x leverage available on the standard trading platform.
*   **Account Health:** This metric quantifies the proximity to liquidation. It is a technical function of **Account Value** and **Maintenance Margin** ($Health = f(Account Value, Maintenance Margin)$). A rating of 100% indicates full collateral coverage; a rating approaching 0% triggers liquidation.

### 4. Market Access and Trading Permissions
The platform provides execution capabilities across a diversified asset base:
*   **Equities & ETFs:** Includes major tech (NVDA, TSLA, INTC), index trackers (SMH, EWY), and new listings such as **SK Hynix Inc. (SKHY)**.
*   **Digital Assets:** Primary pairs including BTC, ETH, and SOL.
*   **Commodities:** Delivered via perpetual contracts.
*   **Forex (FX):** Major pairs including CAD-USD, EUR-USD, and AUD-USD.

#### Execution Constraints and Parameters
*   **Standardized Funding:** Perpetual contracts utilize an **8h Funding** window as the standard interval.
*   **Weekend Trading:** Non-crypto markets pause on Friday and reopen **Sunday at 8:00 PM ET**.
*   **Asset-Specific Leverage (Standard Platform):** 
    *   **Forex (CAD-USD, EUR-USD, AUD-USD):** 100x
    *   **Indices (NQ, ES) & Major Crypto (BTC, ETH):** 50x
    *   **Equities (NVDA, TSLA, MU):** 25x
    *   **New Listings (SKHY):** 10x
    *   **Specialty Assets (HYPE, NBIS):** 5x
*   **Automation:** Full programmatic access is provided via the **Vest API**.

### 5. Execution, Custody, and Price Mechanics
The architecture of Vest Markets utilizes three distinct pricing data points:

*   **Mid Price:** The current execution price reflected on the platform's visual interface.
*   **Index Price:** A reference price aggregated from external venues used exclusively for funding rate calculations; it is not the tradable price on the platform.
*   **Mark Price (Liquidation Trigger):** The price used to determine account solvency. Liquidations occur when the Mark Price reaches the liquidation price, which may differ from the Mid Price. This means liquidations can occur even if the chart price has not touched the liquidation threshold.

#### Discretionary Execution and Counterparty Risk
Per the "Important Disclosures," Vest Labs maintains "absolute discretion" over order execution. The firm may:
1.  **B-Book (Internalization):** Record a trade as an internal administrative book entry to calculate hypothetical results without routing to an external exchange.
2.  **External Routing:** Accept the trade for its proprietary book and route it to a market maker.

#### Liquidity Vault Mechanics
The community-owned liquidity vault is subject to a **24-hour lock-up period**. This liquidity constraint is distinct from the "on demand" payout availability offered to funded traders.

### 6. Trader Compensation and Payouts
*   **Profit Distribution:** 90% of gains are allocated to the trader. 
*   **Collateral Management:** Withdrawals are governed by "Available Funds," defined as the amount of collateral available to open new positions or to withdraw from the account balance.
*   **Sunk Costs:** Evaluation fees are non-refundable once trading commences, representing the cost of accessing the simulated verification environment.

### 7. Ecosystem and Incentives
*   **Points Multiplier:** Trading Equities and ETFs yields a **1.5x multiplier** on points.
*   **Referral Architecture:** Participants earn points based on the aggregate trading volume of referred users.
*   **Connectivity Barriers:** Linking Twitter or Discord accounts to the platform requires a **prior capital deposit**.

### 8. Legal Framework and Disclosures
*   **Legal Entity:** Vest Labs Inc. (Copyright 2026).
*   **Conflicts of Interest:**
    *   **Evaluation Revenue:** The firm generates revenue from failed evaluations and subsequent re-purchases, creating a potential conflict with evaluation traders.
    *   **Third-Party Incentives:** The firm may receive financial incentives (e.g., payment for order flow) from third parties based on trader ideas. These incentives are **retained 100% by the firm** and are excluded from the trader's profit/loss calculations.
*   **Governing Terms:** Prop Trading Terms of Service, General Terms of Service, and Privacy Policy.

### 9. Technical Contradictions and Unresolved Questions
*   **Leverage Discrepancy:** Standard platform documentation lists leverage up to 100x (FX) and 50x (Indices), while the Vest Capital program restricts all tiers to a 5x ceiling.
*   **Unresolved Parameters:**
    *   **Maintenance Margin:** The specific percentage or formula for maintenance margin requirements per asset class is currently omitted.
    *   **Evaluation Duration:** The minimum required trading days to pass an evaluation is not specified.
    *   **Restricted Strategies:** Explicit definitions of prohibited strategies (e.g., HFT, hedging, news-straddling) are absent.
    *   **Settlement Currency:** While balances are denominated in USD, the specific settlement asset for payouts (stablecoins vs. fiat) is not defined in the source context.