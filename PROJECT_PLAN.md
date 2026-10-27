# Project plan: TraceFence

## Concept

- Problem: After a tool timeout, replaying an agent trace can repeat writes whose outcome is uncertain. Engineers need an inspectable replay decision without uploading private traces.
- User: Engineers debugging agent tools and retry behavior
- Standout: Replay fence — Turn a tool-call trace into an explained replay plan: replay declared reads, skip completed writes, and hold uncertain writes and key conflicts for review.
- Demo steps: ["Load the trace sample","See the completed and uncertain writes","Reveal an explained replay plan that schedules no writes"]
- Kind: web
- AI: not required

## Prior-art review

Review relevant existing projects and packages before building. Choose one approach and record the concrete references and reason. The scaffold does not perform or claim this research.

- Decision (choose one): new
- References: https://github.com/Shibukedang27/agentlens-trace-analyzer; https://github.com/kbipul/agent-scratchpad; https://github.com/langchain-ai/langgraph/issues/9001; https://github.com/langchain-ai/langgraph/issues/7138
- Rationale: Existing analyzers cover loops, cost and trace replay. This narrow deterministic inspector focuses on write uncertainty, completed-write skip decisions and idempotency-key conflicts, entirely browser-local. It is not a full observability replacement.

## Build and proof

- Implement the standout behavior in `public/src/standout.js`.
- Preserve local sample and bring-your-own-data use. AI is optional.
- Run `npm test`, then create a short recording with the existing recorder. Keep capture at or below 9 seconds; show the actual behavior.
- Review the README, generic handoff manifest, and privacy before release.

## Target schedule (not a guarantee)

Targets are 3 min for concept and research, 10 min for build, 4 min for proof/package, and 3 min for publish, application inclusion, and handoff. A pre-researched opportunity may start at concept selection. If fresh ideation or research happens during the run, count its time in the measured total. Record a verified application submission separately; never represent targets as measurements.
