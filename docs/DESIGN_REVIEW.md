# Copy and interface review

2026-10-27. Scope: README, main page, labels, input states and recorded demo. This revision follows the author's rejection of the original slogan and layout.

Applied the unslop writing skill and relevant Hallmark design guidance. The first version led with “Retry the run. Not the side effects.” and a large marketing header. The revision opens with “Review a trace” and puts a call table beside the input. Counts are a small summary row; colour indicates review or completion. The replay rules and input contract are unchanged.

The reviewer inspected desktop, phone, empty and dark renders. The dark render exposed an input-component contrast issue; shared colour variables now match the page. The format guide collapses on phones. Actual Chrome checks at 320, 375, 414, 768 and 1280 px found no page overflow and rendered all seven sample calls. The table has its own horizontal scroll area at narrow sizes. Tests also cover invalid input, local data, export and clearing.

The demo was recorded again and its interaction sequence was inspected. It shows loading the sample and opening the summary, with the actual decisions visible. Local file processing generates no network requests; loading the bundled sample makes a same-origin request. Unit and browser checks validate behavior. They do not decide whether the design meets a user's taste.

Remaining limit: the revised presentation awaits the user's response. This review is an author review, not a claim of user acceptance. The useful outcome is an explained review of supplied trace data; uncertain writes still require checking the destination.
