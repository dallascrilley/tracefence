# TraceFence concept and decisions

2026-10-27. Build decision: a focused new inspection tool using byo-kit. The user is an engineer recovering an agent run after a timeout. The useful question is: which external effects could already have happened?

Fresh problem research found LangGraph issue [9240](https://github.com/langchain-ai/langgraph/issues/9240), which distinguishes checkpoint durability from exactly-once external effects, and [8464](https://github.com/langchain-ai/langgraph/issues/8464), which describes duplicate side effects on restart/timeouts. These are user reports, not measured market demand or guarantees.

Alternatives considered:
1. Generic loop/cost analyzer. Existing [agentlens-trace-analyzer](https://github.com/Shibukedang27/agentlens-trace-analyzer) and [agent-scratchpad](https://github.com/kbipul/agent-scratchpad) already cover much of this; skip.
2. Live idempotency middleware. Valuable but requires a durable store, integration-specific guarantees and more operational proof; defer.
3. Local replay inspector. Choose the narrow, useful slice: explicit effects, completed writes, uncertain outcomes and conflicting key reuse, with explained machine output. It complements existing tracing systems.

No AI call is needed for exact status/key comparisons. This avoids making a model decide whether a money-moving retry is safe. No inferred effect labels, execution, account setup or upload. Inputs are supplied declarations, not verified destination facts. Read-only declarations must be trustworthy before a real replay.

Design: neutral application shell, blue primary action, input pane and decision table; sample-first journey; browser memory only. Source fallback: byo-kit because this dedicated Cloudflare deployment uses a different adapter from App Foundry's accepted Netlify route. Domain logic is pure and separate from presentation.

Acceptance: successful writes skipped; all uncertain writes held regardless of key; argument-order equality; same tool/key with changed arguments holds every member; unknown effects held; own-data journey makes zero requests; source text is inert; JSON export, clear, invalid input, mobile and CLI proven. Stop at inspection, not execution or a full observability platform.
