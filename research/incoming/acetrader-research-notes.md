# AceTrader research notes

Status: normalized from an agent-assisted NotebookLM pass and checked against official AceTrader pages on 2026-09-03. This file is the editorial handoff; unsupported or promotional conclusions from the raw synthesis were removed.

## Official source set

- Website and pricing: https://acetrader.com/ and https://acetrader.com/pricing
- Documentation export: https://docs.acetrader.com/llms-full.txt
- Transparency: https://acetrader.com/transparency
- Community Reward: https://acetrader.com/community-reward
- Terms: https://acetrader.com/terms
- Raw NotebookLM report: `research/notebooklm/runs/acetrader/report.md`
- NotebookLM document: https://docs.google.com/document/d/1hPMazgdY69cr0YutTLZYsvjSyO17glH1Gz2iqojt59I

## Operating model

AceTrader offers a recurring Evaluation subscription and one-time Instant Fund plans. Evaluation is simulated. A Trade Fund can be simulated or real at AceTrader's discretion; any real capital remains owned and controlled by AceTrader under a revocable mandate. Arena is a separate simulated weekly competition.

Evaluation plans are Starter $1K / $9 per 30 days, Standard $10K / $99 per 30 days and Pro $20K / $169 per 30 days. Instant Fund plans are Lite $200 / $9, Starter $1K / $49, Standard $10K / $499 and Pro $20K / $999. Paying with $MEME or $HYPE raises Standard to $12K and Pro to $24K and changes the split from 80% to 90%.

## Risk rules

Maximum Loss Limit is a trailing high-water-mark floor. It advances only after a new end-of-day wallet-balance high, never moves down and stops at the starting balance. Intraday enforcement uses account value including realized and unrealized PnL. MLL is 10% for Lite/Starter and 6% for Standard/Pro. Evaluation also applies a 50% best-day consistency rule. Current plan-specific evaluation profit targets and minimum trading-day counts are not fully published in the captured official docs; a Standard example uses a $3,000 target but must not be generalized.

## Payouts

Current pricing advertises 0 winning days and a $0 minimum safety net. It lists a $50 minimum for Lite and $20 for Starter; remaining per-tier minimums are not clearly mapped in the captured text. The older GitBook FAQ still says 5 winning days for USDC/USDT purchases, 3 for $MEME, a safety net equal to MLL plus $200 or MLL, and a $100 minimum. Preserve this conflict in publication.

Payouts are Arbitrum USDC to an EVM wallet. The documented formula is `min(min(Total PnL, Realized PnL) - safetyNet, Withdrawable)`. A breach of MLL or the Unlisted Coin Rule deactivates access and may suspend outstanding payouts.

## Trading

AceTrader uses Hyperliquid and proprietary infrastructure. Paper Trading and Arena are simulations; Trade Fund execution can be simulated or real. Accounts use isolated margin and one-way mode. The official allowlist contains 33 crypto markets and 25 HIP-3 synthetic markets. Trading an unlisted asset is a breach. Exact leverage bands, public trading-fee tables, news-trading rules, weekend rules, copy-trading rules and supported automation are not sufficiently documented in the captured official material.

## Legal and access

Terms were updated 13 July 2026. Users must be at least 18 or the local age of majority. Fees are generally non-refundable. The Terms do not clearly identify a legal entity or registration jurisdiction in the captured text. The prohibited list includes the United States, China, Ontario, Afghanistan, Belarus, Crimea, Cuba, Iran, Russia-related sanctions coverage through general sanctions clauses, and other named jurisdictions. KYC can be required before Trade Fund access and payouts.

## Transparency and rewards

AceTrader's transparency page, updated 2 September 2026, reports $94,524.50 across 73 payouts, a $10,260 largest payout and 2.3-day average processing. It includes transaction rows and hashes; the aggregates remain company-published and are not a proof-of-reserves audit.

Community Reward gives one monthly draw ticket per dollar spent and advertises up to $330K in nominal Instant Fund allocations, not cash. Referral rebates are documented at $4/$40/$68 for Evaluation and $20/$200/$400 for Instant Fund, paid monthly in Arbitrum USDC once the balance reaches $50.
