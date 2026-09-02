# SizeProp — Working Research Notes

Status: incremental manual research; not yet normalized for Firestore  
Last updated: 2026-09-02

## Sources supplied

- Official website: https://www.sizeprop.com/
- Official rules: https://www.sizeprop.com/our-rules
- X: https://x.com/SizeProp

## Rules shared across all programs

### Time and activity requirements

- **Time limit:** None.
- **Minimum trading days:** None.
- **Consistency rule:** None.
- **Inactivity requirement:** At least one trade must be placed within every 90-day period.

### Profit-target calculation

- The profit target is calculated using **account balance**.
- Unrealized profit from open positions does not count toward completing the profit target.

### Risk-limit calculation

- Risk limits are enforced using **account equity**.
- The daily loss limit resets at **20:00 UTC** under the current rulebook.

### Maximum drawdown

- Maximum drawdown is **static** and is calculated from the starting balance.
- The maximum-drawdown threshold does not trail upward when the account generates profit.
- The May 2026 rules describe the maximum drawdown as **not affected by payouts**.

## Normalization notes for the future database entry

- Keep `profit target basis = balance` separate from `risk limit basis = equity`; these are different mechanisms.
- Store the daily reset time explicitly as `20:00 UTC`, not merely as “daily”.
- Apply these rules at firm level unless later program-specific research documents an exception.
- Preserve the May 2026 qualifier for the payout interaction until the current rulebook version is mapped to an exact review date.

