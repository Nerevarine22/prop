# Prop firm research brief

Conduct a source-grounded research study of the project described by the sources in this notebook.

Begin by understanding what the project actually is. Identify its operating model, the parties involved, how capital is provided or simulated, how a trader enters the system, how trading is executed, how risk is enforced, and how a trader ultimately receives compensation. Do not force the project into the structure of a conventional prop firm if its model is different.

Write the result as a coherent English research document for a human reader. It must not look like a database export, a JSON schema, or an implementation specification. Use logical sections, explanatory prose, concise fact groups, and tables only where structured comparison materially improves clarity.

## Research requirements

1. Explain the project's type and operating model in plain language.
2. Describe the complete trader lifecycle from entry to evaluation, funding or capital allocation, trading, risk enforcement, and payout or compensation.
3. Identify every currently documented offer, challenge, track, funding route, account type, or program. Preserve the project's own terminology.
4. Explain rules whose mechanics are easy to misunderstand. Do not stop at a headline percentage. Describe the calculation basis, reset conditions, timing boundaries, examples, exceptions, and consequences of a breach when the sources provide them.
5. Include a dedicated **Funding rules and offers** table. Use one row for every documented offer, track, level, tier, or other meaningful variant; never summarize a multi-level progression by showing only its first and last rows. Include only fields supported by the sources, such as availability status, entry cost, account or capital size, stages, profit targets, daily loss, maximum drawdown, drawdown type, minimum days, time limit, profit split, payout conditions, refund conditions, leverage, and supported markets. Add a short explanation below the table for any field whose mechanics cannot be understood from the number alone.
6. Cover trading permissions and restrictions: news trading, weekend or overnight holding, automation, bots, API access, copy trading, multi-account behavior, prohibited strategies, consistency rules, position limits, and market-session constraints when documented.
7. Explain execution and custody: platform, venue, simulated versus live execution, wallet or account permissions, settlement path, and any smart-contract components when relevant.
8. Explain payout or trader-compensation mechanics in detail: eligibility, request cadence, minimums, currencies, profit share, approval or verification process, processing time, balance effects, and reserve or treasury mechanics when documented.
9. Cover legal entity, jurisdiction, KYC, geographic restrictions, token, points, rewards, referrals, and promotional programs only when they are actually documented and relevant.
10. End with a **Sources, conflicts, and unresolved questions** section. List the sources used, clearly preserve contradictory values, and identify material questions the available sources do not answer.

## Evidence and accuracy rules

- Use only information supported by the notebook sources.
- Prefer specific rulebooks, policy pages, terms, and current pricing pages over broad marketing copy.
- Never silently resolve a contradiction. Present both values, identify their sources, and explain what remains uncertain.
- Treat product pages explicitly labeled legacy, waitlist, beta, coming soon, or historical as separate from currently available offers. Never use them to fill gaps in current rules.
- Never convert missing information into zero, false, "none", or a guessed industry-standard value.
- Do not infer an undisclosed formula, technical requirement, legal guarantee, or causal explanation from marketing language. If the source does not provide the exact mechanism, say that it is not disclosed.
- Do not add generic database fields merely to make the report appear complete.
- Clearly distinguish a direct source statement from your own explanatory synthesis.
- Keep citations attached to the claims they support.
- Do not recommend a database schema and do not mention how the website database should be structured.
- Do not include investment advice, promotional language, or an overall endorsement.

The final document should give a reader enough understanding to later design an appropriate database representation for this specific project without losing the project's unique mechanics.
