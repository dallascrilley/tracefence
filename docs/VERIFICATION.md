# Verification

2026-10-27. Initial release. The example is synthetic, not a customer incident.

Ten Node tests check actual rules and the CLI, including uncertain writes, key conflicts, argument normalization, unknown effects, malformed input and the invariant that the planner never schedules a write. `smoke.mjs` uses real Chrome/Playwright: sample, local data with zero network requests, invalid input, inert HTML text, export, clear, mobile viewport.

The README GIF is 8.08 seconds, recorded from that functioning UI. The last frame was visually inspected. The useful core needs no model or external account. The browser proof does not verify the producer's claims about actual external effects.

`npm run verify` binds a local source digest to tests, browser proof and GIF. Depot's `script/cibuild` runs the portable unit/CLI tests on the published commit. These are separate proof layers. A live Cloudflare browser run is recorded privately with release receipts when performed.
