# ChainFunded Project Research Brief

**1. Project Type and Operating Model**
ChainFunded represents a paradigm shift in the proprietary trading space, transitioning from centralized "Trust-Me" models to a decentralized, "Verify-Me" protocol built on the Ethereum blockchain. It operates as a decentralized prop firm where the traditional corporate balance sheet is replaced by a decentralized Liquidity Provider (LP) pool.

This architecture offers significant **Counterparty Risk Mitigation**. Unlike legacy prop firms where trader capital and payouts are subject to the firm's solvency and discretionary approval, ChainFunded utilizes smart contracts to lock liquidity and automate settlement. The ecosystem consists of three primary actors:
*   **MZF Protocol Inc. (DBA ChainFunded Labs):** The Panama-based developmental and governing entity.
*   **Performance-Based Participants (Traders):** Capital allocators who undergo a trustless evaluation process.
*   **Liquidity Providers:** Participants who supply USDC to the LP pool to back successful traders in exchange for potential protocol yields.

All protocol parameters—including entry fees, risk thresholds, and profit-sharing—are hardcoded as "smart-contract-fixed" rules, ensuring immunity from mid-challenge adjustments.

**2. The Protocol Interaction Loop**
The trader’s engagement with the protocol follows a trustless lifecycle governed by smart contract state changes:

*   **Registration & Entry:** Participants engage via wallet-based authentication. A one-time USDC evaluation fee is paid directly to the protocol, initiating the evaluation state.
*   **Verification (Two-Phase Evaluation):** The trader must meet specific performance benchmarks while adhering to hardcoded risk constraints.
*   **Liquidity Allocation:** Upon successful verification, the protocol grants "funded" status. This does not involve a manual account setup but rather provides the trader's authorized wallet with access to smart-contract-backed liquidity from the LP pool.
*   **Execution & Risk Monitoring:** Trading is conducted via a dedicated terminal. Risk enforcement (e.g., drawdown triggers) is handled on-chain, removing human bias from risk management.
*   **Trustless Settlement:** Post-performance, the trader submits a signed performance proof. The smart contract autonomously verifies compliance and triggers an immediate USDC transfer from the LP pool to the trader's wallet.

**3. Evaluation Mechanics and Risk Enforcement**
The protocol enforces a standardized Two-Phase Evaluation to filter for consistent performance:

*   **Phase 1 Target:** **10%** profit.
*   **Phase 2 Target:** **5%** profit.
*   **Daily Loss Limit:** **5%** (Hardcoded).
*   **Maximum Drawdown:** **10%** (Hardcoded).
*   **Minimum Trading Days:** **4 days** per phase.

**Execution Risk Note:** The source context is silent regarding the specific calculation basis (Relative vs. Absolute or Balance vs. Equity) for drawdown. Furthermore, the protocol does not disclose the specific time-zone boundary (e.g., UTC vs. Local) for the **5% Daily Loss** reset. These represent critical execution risks for high-frequency or swing-trading strategies.

**4. Funding Rules and Tiers**
Challenge parameters are immutable once the smart contract is initialized upon registration. The following tiers are defined by the protocol, with higher-value allocations subject to the protocol's Total Value Locked (TVL) scaling.

| Tier/Account Size (USDC) | Entry Cost (USDC) | Stages | Profit Target (P1/P2) | Daily Loss | Max Drawdown | Min Days | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $1,000 | 20 USDC | 2 | 10% / 5% | 5% | 10% | 4 / 4 | Available |
| $5,000 | Undisclosed | 2 | 10% / 5% | 5% | 10% | 4 / 4 | Available |
| $10,000 | Undisclosed | 2 | 10% / 5% | 5% | 10% | 4 / 4 | Available |
| $25,000 | Undisclosed | 2 | 10% / 5% | 5% | 10% | 4 / 4 | Available |
| $50,000 | Undisclosed | 2 | 10% / 5% | 5% | 10% | 4 / 4 | Available |
| $100,000 | Undisclosed | 2 | 10% / 5% | 5% | 10% | 4 / 4 | Available |
| $200,000 | Undisclosed | 2 | 10% / 5% | 5% | 10% | 4 / 4 | Available |
| High-Value Tiers | Undisclosed | 2 | 10% / 5% | 5% | 10% | 4 / 4 | Locked/TVL Dependent |

*Note: Specific entry costs for tiers above $1,000 are not disclosed in available documentation but are governed by the protocol's scaling mechanics and TVL growth.*

**5. Trading Permissions and Execution**
Participants utilize a proprietary terminal that facilitates "Ethereum smart-contract access." While the terminal provides the interface, the execution is functionally tied to the LP pool through smart contract transfers.

**Structural Information Gaps (Transparency Risks):**
The protocol documentation is currently silent on the following execution parameters:
*   **Prohibited Strategies:** No explicit mention of News Trading, HFT, or Copy Trading restrictions.
*   **Temporal Limits:** No stated restrictions on weekend holding.
*   **Automation:** Availability of API access or bot compatibility is not disclosed.
*   **Technical Overhead:** Impact of Ethereum gas fees and slippage on net performance is not detailed.

**6. Payout and Trader Compensation**
The settlement layer is where ChainFunded deviates most significantly from traditional prop firms.

*   **Profit Share:** **80%** allocated to the trader.
*   **Settlement Path:** Performance Proof -> Smart Contract Verification -> USDC Transfer.
*   **Velocity:** Settlement is documented as taking "seconds," bypassing the "discretionary approval queues" common in centralized finance.
*   **Currency:** Settlements are issued exclusively in **USDC** on the Ethereum network.

**7. Governance, Legal, and Incentives**
*   **Legal Structure:** MZF Protocol Inc. (DBA ChainFunded Labs), organized under Panamanian jurisdiction. Current Terms of Service are dated **April 6, 2026**.
*   **Dual-Token Ecosystem:**
    *   **CFG Token:** The primary governance token. Fixed supply of **100,000,000** with no future minting capabilities.
    *   **CFND Tokens:** Represent staked liquidity within the LP pool.
*   **Rewards Program:** A seasonal budget incentivizes the ecosystem. Eligibility requires traders to register their challenge accounts for "CFG Rewards," while CFND holders receive rewards for providing liquidity.

**8. Sources and Due Diligence Gaps**

**Sources Consulted:**
*   Official ChainFunded Website & Pricing Data
*   Protocol Rulebook (Version 1.0)
*   Official FAQ & Payout Policy
*   Terms and Conditions (Updated April 6, 2026)
*   CFG Token Rewards Documentation

**Conflicts:**
*   No direct contradictions found. The **80%** profit share and **10%/5%** evaluation targets are consistent across all official protocol documentation.

**Due Diligence Gaps (Unresolved Questions):**
*   **Drawdown Calculation:** Lack of clarity on whether drawdown is Relative or Absolute, and if it is calculated against Balance or Equity.
*   **Venue & Liquidity:** Information regarding the underlying broker, execution venue, or data providers remains undisclosed.
*   **Execution Costs:** Information regarding how Ethereum gas fees are handled during the trading process or upon settlement.
*   **Leverage Ratios:** Specific leverage limits per tier and asset class are not identified in the research ledger.