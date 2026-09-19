# Research Brief: Solana Funded Operational and Rule Framework

### 1. Project Overview and Operating Model
Solana Funded is a specialized proprietary trading firm operating exclusively within the Solana blockchain ecosystem. The platform targets on-chain traders and memecoin specialists, providing them with virtual capital to trade high-velocity assets like those found on Pump.fun and Raydium. 

From a compliance perspective, the project maintains a bifurcated identity. Marketing materials emphasize "USDC-backed" accounts and "real on-chain execution." However, the legal framework established in the Terms of Service and Checkout Disclaimers explicitly defines all platform activity as "simulated trading" within "virtual accounts." The firm is operated by **SolaraX Markets FZCO**, a legal entity based in Dubai, UAE. This corporate structure is characteristic of the current "crypto-prop" sector, leveraging the Dubai Business Park jurisdiction to offer simulated digital asset trading without immediate KYC requirements.

### 2. The Trader Lifecycle: Life of a Trade
The progression from entry to payout is designed as an integrated technological loop:

1.  **Entry and Acquisition:** Traders select a 1-Step or 2-Step path. List fees range from $76 to $1,438, with frequent market positioning via promotional codes such as "SF30" (30% discount). Payments are processed on-chain (SOL, USDC, BTC) via gateways like Confirmo or via credit card through MoonPay.
2.  **The Technological Bridge:** Trading is facilitated by the **Solana Tap** browser extension. This acts as a bridge, allowing traders to execute trades on their preferred third-party terminals (Photon, Axiom, or Padre) while simultaneously piping the data back to the Solana Funded risk engine.
3.  **Risk Monitoring and Evaluation:** During the evaluation phase, every trade captured by Solana Tap is assessed against real-time risk limits. If a trade impacts the End-of-Day (EOD) or Daily Drawdown limits, the data is reflected in the trader’s dashboard.
4.  **Capital Allocation:** Upon hitting profit targets (ranging from 30% to 50% depending on the path), traders transition to "Funded" status. While marketed as receiving company capital, the legal reality is the provision of a virtual environment that mirrors live market conditions.
5.  **Settlement:** Profits are settled on-chain. Though the trading is simulated, the payouts are verifiable via Solana transaction hashes (e.g., tx: Rg9...kl23), effectively decoupling internal simulation from external value transfer.

### 3. Program Paths and Tiered Offers
The firm provides four primary challenge architectures across account sizes ranging from $2,500 to $100,000.

*   **1-Step Standard:** Rapid funding via a single phase with a 5-position cap.
*   **1-Step Elite:** Single-phase evaluation with no limit on open positions (unlimited flexibility).
*   **2-Step Standard:** A two-phase model (30% and 20% targets) with a 5-position cap, intended to verify consistency.
*   **2-Step Elite:** Two-phase model with unlimited positions and lower individual phase targets (35% and 25%).

### 4. Funding Rules and Offers Table

| Path Type | Account Size | List Fee | Phases | Profit Target (Ph1/Ph2) | Max. Drawdown | Daily Drawdown | Max. Positions | Min. Trading Days | Funded Reset Fee |
| :--- | :--- | :--- | :---: | :--- | :---: | :---: | :--- | :---: | :--- |
| **1-Step Standard** | $2,500 | $88 | 1 | 45% / - | 25% | 10% | 5 | 5 | $59 |
| **1-Step Standard** | $5,000 | $148 | 1 | 45% / - | 25% | 10% | 5 | 5 | $99 |
| **1-Step Standard** | $10,000 | $268 | 1 | 45% / - | 25% | 10% | 5 | 5 | $179 |
| **1-Step Standard** | $25,000 | $568 | 1 | 45% / - | 25% | 10% | 5 | 5 | $379 |
| **1-Step Standard** | $50,000 | $838 | 1 | 45% / - | 25% | 10% | 5 | 5 | $559 |
| **1-Step Standard** | $100,000 | $1,138 | 1 | 45% / - | 25% | 10% | 5 | 5 | $759 |
| **1-Step Elite** | $2,500 | $118 | 1 | 50% / - | 20% | 10% | Unlimited | 5 | $99 |
| **1-Step Elite** | $5,000 | $190 | 1 | 50% / - | 20% | 10% | Unlimited | 5 | $159 |
| **1-Step Elite** | $10,000 | $328 | 1 | 50% / - | 20% | 10% | Unlimited | 5 | $274 |
| **1-Step Elite** | $25,000 | $688 | 1 | 50% / - | 20% | 10% | Unlimited | 5 | $574 |
| **1-Step Elite** | $50,000 | $1,078 | 1 | 50% / - | 20% | 10% | Unlimited | 5 | $899 |
| **1-Step Elite** | $100,000 | $1,438 | 1 | 50% / - | 20% | 10% | Unlimited | 5 | $1,199 |
| **2-Step Standard** | $2,500 | $76 | 2 | 30% / 20% | 25% | 10% | 5 | 5 | $51 |
| **2-Step Standard** | $5,000 | $130 | 2 | 30% / 20% | 25% | 10% | 5 | 5 | $87 |
| **2-Step Standard** | $10,000 | $238 | 2 | 30% / 20% | 25% | 10% | 5 | 5 | $159 |
| **2-Step Standard** | $25,000 | $508 | 2 | 30% / 20% | 25% | 10% | 5 | 5 | $339 |
| **2-Step Standard** | $50,000 | $748 | 2 | 30% / 20% | 25% | 10% | 5 | 5 | $499 |
| **2-Step Standard** | $100,000 | $1,018 | 2 | 30% / 20% | 25% | 10% | 5 | 5 | $679 |
| **2-Step Elite** | $2,500 | $106 | 2 | 35% / 25% | 20% | 10% | Unlimited | 5 | $89 |
| **2-Step Elite** | $5,000 | $172 | 2 | 35% / 25% | 20% | 10% | Unlimited | 5 | $144 |
| **2-Step Elite** | $10,000 | $298 | 2 | 35% / 25% | 20% | 10% | Unlimited | 5 | $249 |
| **2-Step Elite** | $25,000 | $628 | 2 | 35% / 25% | 20% | 10% | Unlimited | 5 | $524 |
| **2-Step Elite** | $50,000 | $998 | 2 | 35% / 25% | 20% | 10% | Unlimited | 5 | $824 |
| **2-Step Elite** | $100,000 | $1,318 | 2 | 35% / 25% | 20% | 10% | Unlimited | 5 | $1,099 |

#### Technical Rule Glossary
*   **EOD Drawdown Mode:** Unlike "Intraday" drawdown, EOD calculations are finalized at the daily close (00:00 UTC). This allows for intraday fluctuations that exceed the limit, provided the account recovers before the daily snapshot.
*   **Daily Drawdown Calculation:** This is a relative limit based on the "high-water mark" of the previous day’s highest balance or equity—whichever is higher.
*   **Reset Fee:** A performance-contingent fee that allows a trader who has breached risk rules to reactivate their funded status without repeating the evaluation phases.

### 5. Trading Permissions and Restrictions
Solana Funded provides extensive ecosystem access through the Solana Tap bridge:

*   **Asset Universe:** 500,000+ tradable tokens, including assets on Pump.fun, Raydium, and Jupiter.
*   **Terminal Compatibility:** Direct execution via Solana Tap on Axiom, Photon, and Padre.
*   **Strategy Constraints:** Standard paths are limited to 5 open positions; Elite paths are unlimited.
*   **Documentation Silence:** Official sources do not explicitly define restrictions for news trading, weekend holding, or High-Frequency Trading (HFT). However, "consistency requirements" are mentioned as a payout prerequisite without mathematical definition.

### 6. Execution, Custody, and Technology
The technical architecture relies on a "Simulated Execution Environment." While marketing materials present a narrative of "real on-chain execution," the **Terms of Service (ToS)** explicitly clarify that evaluations and platform trading are entirely simulated. The "Solana Tap" extension serves as the telemetry layer, capturing trader intent from live DEX terminals and replicating it within the firm’s internal virtual environment. 

Custody of registration fees and payout pools remains with SolaraX Markets FZCO. Final profit distributions are executed as genuine on-chain transfers in SOL or USDC, providing the "verifiable" element highlighted in community testimonials.

### 7. Payout and Compensation Mechanics
Traders must navigate a time-gated payout structure unless they purchase performance add-ons.

| Feature | Standard Payout Cycle | Weekly Payout Add-on |
| :--- | :--- | :--- |
| **First Payout Timing** | 21 Days after start | 7 Days after start |
| **Subsequent Payouts** | Every 14 Days | Every 7 Days |
| **Profit Split** | 80% Default | 90% (Paid Upgrade) |

**Upgrade Cost Structure:**
*   **90% Profit Split Add-on:** +20% of the base list fee.
*   **Weekly Payout Add-on:** +20% of the base list fee.
*   **Ultimate Bundle (Both):** +35% of the base list fee (5% discount vs. individual purchase).

**Eligibility Requirements:** The account must be in a state of net profit, remain within all risk/drawdown limits, and satisfy the specific time-gate of the chosen cycle.

### 8. Ecosystem, Loyalty, and Legal Entity
*   **SF Points:** A non-transferable internal currency with no monetary value. Points are earned via performance and social engagement and are used to "purchase" discounts, retries, or free challenges in the internal store.
*   **Creator Rewards:** A tiered content program for X (Twitter) creators. Bounties (USDC/SOL) and prizes are distributed based on an "auto-scoring" mechanism that checks for anti-bot compliance.
    *   **Bronze:** Entry tier.
    *   **Silver:** Unlocks at $250 earned.
    *   **Gold:** Unlocks at $1,000 earned; includes revenue share bumps.
*   **Corporate Identity:** SolaraX Markets FZCO, Building A1, Dubai Business Park, Dubai, UAE.
*   **KYC Threshold:** Participation is KYC-free until a trader reaches a total cumulative withdrawal of **$100,000 USDC**. At this threshold, identity verification via **Veriff** is mandatory for compliance.

### 9. Sources, Conflicts, and Unresolved Questions

**Source Context:**
*   Official Solana Funded Documentation (docs.solanafunded.com)
*   SolaraX Markets ToS (solanafunded.com/terms-of-service)
*   Pricing & Checkout Interface (checkout.solanafunded.com)
*   Creator Rewards Portal (creators.solanafunded.com)

**Conflict Ledger:**
*   **Execution Conflict:** Marketing material claims "real on-chain execution" and "USDC-backed accounts," whereas the legal ToS and checkout disclaimers define all trading as "simulated" and "hypothetical."
*   **Profit Split Conflict:** Homepage marketing promotes a 90% split as the primary offer, while the Rulebook and Payout Policy define the default split as 80%, with 90% requiring a +20% fee increase.
*   **Payout Timing Conflict:** The Homepage FAQ advertises "on-demand" withdrawals, while the formal Payout Policy mandates a 21-day (Standard) or 7-day (Add-on) waiting period.

**Material Gaps:**
*   **Leverage Ratios:** Sources mention "trading with leverage" but fail to document specific multiplier ratios (e.g., 1:10, 1:30) for individual Solana assets.
*   **Prohibited Strategies:** There is no specific language defining the status of arbitrage, hedging across accounts, or HFT.
*   **Consistency Rule Formula:** The payout policy requires "consistency requirements" to be satisfied but does not provide the mathematical parameters (e.g., maximum profit on a single trade) used for this audit.