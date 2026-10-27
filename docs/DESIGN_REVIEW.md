# Copy and interface review

2026-10-27. Scope: README, main page, labels, input states and recorded demo. This revision follows the author's rejection of the original slogan and layout.

Applied the unslop writing skill and relevant Hallmark design guidance. The first version led with “Retry the run. Not the side effects.” and a large marketing header. The revision opens with “Review a trace” and puts a call table beside the input. Counts are a small summary row; colour indicates review or completion. The replay rules and input contract are unchanged.

The reviewer inspected desktop, phone, empty and dark renders. The dark render exposed an input-component contrast issue; shared colour variables now match the page. The format guide collapses on phones. Actual Chrome checks at 320, 375, 414, 768 and 1280 px found no page overflow and rendered all seven sample calls. A fresh image-capable reviewer found that the original mobile table hid decision text beyond a horizontal scroll area. The corrected mobile layout presents each call as a labeled row group, with the full reason visible. Empty-state evidence was refreshed after a stale capture was identified. Tests also cover invalid input, local data, export and clearing.

The demo was recorded again and its interaction sequence was inspected. It shows loading the sample and opening the summary, with the actual decisions visible. Local file processing generates no network requests; loading the bundled sample makes a same-origin request. Unit and browser checks validate behavior. They do not decide whether the design meets a user's taste.

Remaining limit: the revised presentation awaits the user's response. This review is an author review, not a claim of user acceptance. The useful outcome is an explained review of supplied trace data; uncertain writes still require checking the destination.


The `project-journey-proof` 1.2.6 check included a fresh image-capable reviewer who opened the desktop, phone and empty captures. It found mobile reasons outside the visible area and stale empty-state evidence. After the phone row-group fix, the reviewer opened the refreshed images and then a dark-context capture. Upload/paste controls are readable and the full reasons are visible. Background transitions on those controls were disabled to avoid faint intermediate theme-switch captures. These are local visual findings and rechecks; live proof is recorded after deployment.
