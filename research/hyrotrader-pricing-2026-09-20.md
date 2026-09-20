# HyroTrader pricing update — 20 September 2026

Sources: [official calculator](https://www.hyrotrader.com/), [free trial](https://www.hyrotrader.com/free-trial/), [daily drawdown rules](https://www.hyrotrader.com/faq/rules/how-is-the-5-daily-drawdown-calculated/).

Company-reported prices, checked by selecting both challenge types and all six capital sizes in the official homepage calculator (browser localized to `/uk/`). The user's screenshots agree with the corresponding observed prices. Capital is USDT-denominated; checkout fees are quoted in USD.

| Capital | One-Step base | Swing add-on | Total | Two-Step base | Swing add-on | Total |
| --- | --- | --- | --- | --- | --- | --- |
| 5,000 | $69 | $39 | $108 | $59 | $29 | $88 |
| 10,000 | $129 | $59 | $188 | $119 | $49 | $168 |
| 25,000 | $299 | $119 | $418 | $249 | $89 | $338 |
| 50,000 | $499 | $169 | $668 | $379 | $119 | $498 |
| 100,000 | $749 | $229 | $978 | $579 | $179 | $758 |
| 200,000 | $1,299 | $419 | $1,718 | $969 | $299 | $1,268 |

Percentage increase = add-on / base × 100, rounded to one decimal. No constant percentage is inferred. The UI and stored V2 tables are generated from the same source arrays as the structured challenge tiers.

Swing changes the daily drawdown reference to start-of-day equity. The marketing claim about a 53% lower failure rate is not reproduced as an independently established result.

Hero and trial wording are supplied by the user and confirmed on the official homepage and free-trial page. Both are explicitly attributed to HyroTrader. Trial practice has no payouts and does not automatically qualify the trader for funding. Rules were also rechecked against the FAQ and Terms as documented below; unrelated profile sections retain their earlier review dates.

Scoped database update: `node node_modules/tsx/dist/cli.mjs scripts/syncHyroTraderPricing.ts` previews the single-document patch. Add `--write` to save a temporary backup, update only `firmRegistry/firm-hyrotrader`, and verify the complete result against the expected patch.


## Rules follow-up

Primary sources checked 20 Sep 2026: [rules hub](https://www.hyrotrader.com/faq/rules/), [formal trading table](https://www.hyrotrader.com/trading-rules/), [daily calculation](https://www.hyrotrader.com/faq/rules/how-is-the-5-daily-drawdown-calculated/), [funded controls](https://www.hyrotrader.com/faq/rules/are-there-any-other-rules-for-a-funded-account/), [minimum days](https://www.hyrotrader.com/faq/evaluation-process/minimum-trading-days/), [Terms](https://www.hyrotrader.com/terms-and-conditions/).

- Formal One-Step: 10% target / 4% daily / 6% max / 5 qualifying days. Two-Step: 10%, then 5% targets / 5% daily / 10% max / 5 days each phase. Both tabs checked in the official calculator/rules UI.
- Daily allowance is fixed against initial capital; Standard tracks peak equity, Swing uses start-of-day equity. Floating P&L and fees count. Overall reference mechanics remain ND; daily trailing must not be misclassified as overall trailing.
- Evaluation-only 40% best-day cap; funded-only 25% margin / 2x total position notional. Realized per-trade loss above 3% is manually reviewed. SL orders are not mandatory.
- No evaluation deadline, but the FAQ has a 30-day no-closed-trade inactivity rule. Terms describe a separate 90-day inactive platform-account provision with notice; these should not be conflated.
- Terms updated 7 Aug 2026 describe every phase as simulated. The marketing hero is explicitly attributed and carries this qualification. Current provider/funded entities are updated from Terms; this is company-reported, not independent corporate verification.
- Source discrepancies: detailed daily FAQ says equity while the short comparison says balance; formal Two-Step table says 10% overall vs 6% in a blog. Prefer detailed calculation and formal table; preserve uncertainty where no formal anchor is established.
- All rendered rule blocks carry dated source evidence in V2. Pricing and rules updates are restricted to HyroTrader; draft and published representations are updated without replacing unrelated CMS copy.
