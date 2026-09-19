# Research Brief: Ferm Trading Evaluation Platform

## 1. Project Overview and Operating Model
Ferm Trading operates as a specialized evaluation platform designed to identify and compensate trading talent through a sophisticated simulation environment. The platform utilizes a **synthetic execution model**, meaning all orders at the Evaluation, Funded, and Live stages are synthetic and are not routed to external liquidity providers or markets. 

Traders do not make capital deposits; instead, they pay a one-time evaluation fee. Consequently, any "profits" generated in Funded or Live accounts do not represent traditional brokerage balances but serve as the metric for **contractual payment obligations** from FermTrading, Inc. to the trader. This model ensures that the trader’s liability is strictly limited to the initial evaluation fee while providing a path to performance-based compensation.

## 2. The Trader Lifecycle
The Ferm ecosystem follows a linear progression governed by rigorous risk management and performance benchmarks.

*   **Entry:** Users may engage with a Free Demo to familiarize themselves with the terminal (which closes upon reaching a 10% target) or purchase a paid, one-step Evaluation.
*   **Evaluation:** Traders must achieve a specific profit target while adhering to daily loss and maximum drawdown limits. There are no time constraints or minimum trading day requirements; a pass is recorded once the target is met and the account is "flat" (all positions closed and pending orders cancelled).
*   **Transition:** Upon passing, a review period of up to 12 hours commences. Traders must then satisfy Know Your Customer (KYC) requirements—including government ID and a live selfie—and sign the Funded Trader Agreement.
*   **Funded Trading:** Traders receive a simulation account of the same size as their evaluation. While no profit target exists, they must maintain compliance with risk parameters and payout eligibility rules.
*   **Live Account Promotion:** Following four approved payouts across a trader's profile, the account is flagged for a risk-team review. Successful promotion results in a **Live Account**, featuring a 100% profit split and a transition to a fixed-dollar drawdown framework. Live account sizes and their respective fixed max-loss limits include:
    *   **$25,000 Account:** $1,250 fixed max loss.
    *   **$50,000 Account:** $2,500 fixed max loss.
    *   **$75,000 Account:** $3,750 fixed max loss.

## 3. Funding Rules and Offers

### Funding Rules and Offers
| Account Size | Track Name | One-time Fee | Profit Target | Daily Loss Limit | Max Drawdown | Default Profit Split |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $5,000 | Beginner | $65 | 10% | 4% | 8% | 80% |
| $5,000 | Pro | $54 | 11% | 3% | 6% | 80% |
| $5,000 | Degen | $43 | 8% | 2% | 4% | 80% |
| $10,000 | Beginner | $120 | 10% | 4% | 8% | 80% |
| $10,000 | Pro | $98 | 11% | 3% | 6% | 80% |
| $10,000 | Degen | $76 | 8% | 2% | 4% | 80% |
| $25,000 | Beginner | $252 | 10% | 4% | 8% | 80% |
| $25,000 | Pro | $208 | 11% | 3% | 6% | 80% |
| $25,000 | Degen | $164 | 8% | 2% | 4% | 80% |
| $50,000 | Beginner | $395 | 10% | 4% | 8% | 80% |
| $50,000 | Pro | $318 | 11% | 3% | 6% | 80% |
| $50,000 | Degen | $252 | 8% | 2% | 4% | 80% |
| $100,000 | Beginner | $637 | 10% | 4% | 8% | 80% |
| $100,000 | Pro | $527 | 11% | 3% | 6% | 80% |
| $100,000 | Degen | $417 | 8% | 2% | 4% | 80% |

### Mechanics Clarification
*   **Daily Loss Floor:** Resets at 00:30 UTC. The floor is established as the higher of the start-of-day balance or equity, minus the daily loss allowance. This ensures that unrealized losses carried into a new day do not lower the floor below the level supported by the closed balance.
*   **Static Max Drawdown:** Unlike trailing drawdowns, this floor is calculated once based on the starting account size and remains fixed for the life of the account, providing more room for error as the account grows.
*   **Custom Challenges:** Traders may configure evaluations via an "Allowlist" (Account: $5K–$100K; Target: 6%–12%; Daily Loss: 2%–4%; Drawdown: 4%–8%). Valid configurations receive a server quote with a premium that remains locked for 15 minutes.

## 4. Trading Permissions and Restrictions

*   **1.2% Trade-Idea Cap:** Funded accounts are subject to a 1.2% live-loss cap per trade idea (defined as the same symbol and direction). If an open position's floating loss exceeds this threshold, a warning is issued. A maximum of 3 warnings are allowed; upon violation, the trade's profit is forfeited at close (though losses count in full) and the idea is locked for 10 minutes. The violation following the final warning results in a permanent account breach.
*   **News Trading:** A symmetric 10-minute exclusion window (±5 minutes) applies to Tier-1 economic events. Profit from correlated non-crypto trades realized during this window is excluded from targets and payouts. Notably, **losses in the news window still count in full.** Funded accounts are blocked from opening or increasing non-crypto exposure during this period. Crypto and Live accounts are exempt.
*   **Weekend/Overnight Holding:** The blackout window runs from Friday 21:00 to Sunday 22:00 UTC. While crypto and perpetuals may be held, sessioned CFDs (Forex, indices, commodities) are auto-closed unless the "Weekend Hold" add-on was purchased.
*   **Margin and Leverage Limits:** Leverage is capped per asset class (e.g., 30x for major Forex; 2x for "Alt Crypto"). Margin concentration limits tighten as a trader progresses:
    *   **Evaluation/Live:** Non-crypto is capped at 80% per symbol; BTC, ETH, and SOL have a 100% per-symbol margin cap.
    *   **Funded:** BTC, ETH, SOL, and all non-crypto instruments tighten to a **50% per-symbol margin cap.**
*   **Prohibited Conduct:** Strictly forbidden behaviors include latency arbitrage, tick sniping, news straddle abuse, cross-account hedging, and exploiting platform bugs.

## 5. Execution, Fees, and Custody

*   **Execution Mechanics:** User-initiated market orders and manual closes involve a 0.25–0.28 second delay. Crypto orders fill against real-time order-book depth. Conversely, **CFD orders are never priced from synthetic book depth**; they utilize a size-based slippage adjustment for orders exceeding $250,000 notional, with total slippage **capped at 0.10% of the mid price.**
*   **Fee Structure:** Cryptocurrency trading incurs a 2.5 bps (0.025%) commission for both makers and takers. All instruments are subject to a daily funding/swap charge of 0.033% (applied in six 4-hour intervals).
*   **Platform:** Ferm is accessible via a web terminal, native iOS/Android mobile apps, and scoped API keys for automated agents.

## 6. Payout and Compensation Mechanics

*   **Eligibility:** New standard agreements require **3 qualifying trading days** per period. A qualifying day requires a realized closed profit of at least 0.4% of the starting balance.
*   **Minimum Withdrawal Request:** Payout requests are subject to a tiered minimum based on account size:
    *   **$5K & $10K Accounts:** $57 minimum.
    *   **$25K Accounts:** $100 minimum.
    *   **$50K Accounts:** $200 minimum.
    *   **$100K Accounts:** $400 minimum.
*   **Release Ceilings:** Approved requests are capped as a percentage of the starting funded size: 4% for the first payout, 5% for the second, and 6% for the third and subsequent payouts.
*   **Meme-Coin Add-on:** Degen accounts with the "Robinhood Chain" add-on face unique payout conditions: 4 green days (any positive closed P&L) and a **30% best-day cap** on net cycle profit.
*   **Settlement:** Profits are settled via Bridge as USD bank transfers (ACH/wire) or USDC on the Ethereum, Base, or Solana networks.
*   **Profit Splits:** The default split is 80%. A 90% split is available via a checkout upgrade. Live accounts receive a 100% split.

## 7. Ecosystem and Rewards
*   **Family Referral Program:** Members earn a 10% perpetual cash commission on evaluation fees paid by referred traders. 
*   **Archetype XP:** A five-tier loyalty system where XP is earned through purchases and referrals, unlocking merch bundles and other perks.
*   **Family Ticks:** A 12-milestone reward path where "ticks" earned from referral activity and purchase volume lead to free evaluation accounts.
*   **Ferm Cup:** Monthly competitions (Eval Cup, Demo Cup). Eval Cup scores use multipliers: Evaluation (1x), Funded (2x), and Live (3x).

## 8. Legal, Compliance, and Restrictions
*   **Corporate Entity:** FermTrading, Inc. (Copyright 2026).
*   **Inactivity Rule:** Accounts with no trading activity (opening or closing a position) for 30 consecutive days are closed. Exceptions apply for accounts with open positions or active company holds (e.g., KYC reviews).
*   **Geographic Restrictions:** Access is restricted in jurisdictions subject to OFAC sanctions and other regions based on internal commercial and regulatory decisions.

## 9. Sources, Conflicts, and Unresolved Questions

**Source Documents:**
*   Ferm Official Rulebook (Version 2.23, September 18, 2026)
*   Ferm Help Center Articles
*   Ferm Official Website & Market Specifications

**Contradictions Identified in Source:**
*   **Qualifying Days:** New agreements require 3 qualifying days, while "Legacy" or existing agreements may retain a 2-day requirement.
*   **News Window:** Described both as a "5-minute block" and a "symmetric 10-minute" window (both referring to ±5 minutes).

**Unresolved Questions:**
*   The specific list of all OFAC-sanctioned and commercially restricted countries is not provided in the primary documentation (refers to Terms of Service).
*   The exact "premium" percentage applied to Custom Challenges is not defined as it is quoted dynamically. [END OF DOCUMENT]