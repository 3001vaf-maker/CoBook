# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Actual code checkpoint: `c6ebdaaffe0d5028615e67c86f01faf3e111b603`
- Documentation-only commits may follow this checkpoint; this file must always identify the latest code checkpoint, not merely its own commit.

## Mission
Reach 100% clean CoBook: one predictable UI system, stable functionality, no cross-module regressions, and a workflow where future changes have known owners and impact.

## Sources of truth
Read before changing code: `PROJECT_STATE.md`, `DESIGN_SYSTEM.md`, `UI_CONTEXT.md`, `UI_COMPONENTS.md`, `COBOOK_HANDOFF.md`.
Never create a competing design system or duplicate CSS source.

## Process rule
Do not stop work merely to issue a progress report. Continue through the defined stages until all final gates pass. If chat interruption is unavoidable, update this file to the exact latest code checkpoint and leave a copy-ready continuation block.

## Architecture rules
- One canonical implementation per shared UI component.
- Legitimate differences are explicit variants or module-supplied data/state/actions.
- Journal and Timetable share one calendar grid/formation component but keep independent data, day semantics and actions.
- Functional routing: `UI → data-action → Core → owner → handle/handleChange → validation → state/storage → render`.
- Fix primary sources; no CSS overrides, duplicate components, local routers or workaround layers.
- Click/change routing is centralized through Core.
- Application mount (`app.innerHTML`) belongs only to Core.
- Overlay insertion belongs to `CoBook.ui.mountOverlay()`.

## Current code work completed
- Canonical shared UI factories added to Core: button, listItem, field, select, textarea, modal, bottomSheet, dropdown, datePicker, timePicker, calendarGrid and mountOverlay.
- Canonical calendar grid is shared by Journal and Timetable while their data/actions remain independent.
- Central action ownership/dispatch exists.
- Work, Service and Documents change events are routed through Core.
- Tags, Wallets, Work, Loyalty and Journal use the central render pipeline.
- Shared overlay infrastructure is in use by migrated modules.
- Automated architecture audit exists and now checks canonical factory coverage, action ownership, central event routing, CSS source, calendar ownership and handoff continuity.

## UI registry state
`UI_COMPONENTS.md` has been rewritten as the current component registry. A factory being present does NOT equal full migration. Components become `VERIFIED` only after all owners/usages and desktop/mobile behavior pass.

Required component set:
BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, JOURNAL, TIMETABLE, PROFILE, SERVICE, WORK_MATERIALS, DOCUMENTS, LOYALTY, TAGS, WALLETS, CLIENTS, NAVIGATION, MOBILE_GEOMETRY, TYPOGRAPHY.

Also audit EMPTY_STATE, PAGE_HEADER, ICON, SPACING, RADIUS, COLOR and interaction states.

## Known remaining work
1. Migrate all existing module-specific markup to canonical factories where the component is truly shared; retain explicit variants where semantics differ.
2. Complete owner/variant map for every component.
3. Eliminate every remaining local component implementation that duplicates a canonical component.
4. Complete Save/Create/Delete/navigation/form/file end-to-end audit.
5. Verify Calendar + Time Picker + Modal + Bottom Sheet + Dropdown behavior and geometry.
6. Verify Journal and Timetable independently after shared-calendar changes.
7. Verify desktop/mobile geometry and touch targets.
8. Run full cross-module regression and deployment verification.

## Calendar rule
Exactly one canonical calendar grid/formation algorithm. Journal and Timetable supply different data, day semantics, state and actions. Never merge their functional behavior.

## Time Picker rule
`CoBook.ui.timePicker()` is the canonical trigger. Current functional owner: Timetable. A future second owner must reuse the canonical component or a registered variant; never copy the picker.

## Final definition of done
Declare 100% ONLY when all of these pass:
- one CSS source;
- one canonical implementation per shared UI component;
- every variant explicitly registered;
- every owner mapped;
- all actions centrally owned/routed;
- all Save/Create/Delete paths verified end-to-end;
- Calendar/Time Picker/Modal/Bottom Sheet/Dropdown verified;
- Journal/Timetable shared grid + independent semantics verified;
- desktop/mobile geometry verified;
- no architecture audit failures;
- JavaScript syntax passes;
- deployment passes;
- full cross-module regression passes.

## Continuation block
If this chat is interrupted, continue from this exact repository state. Do not reconstruct history and do not restart the project. Read the five source-of-truth documents, verify actual `main`, run the audit, fix failures at primary sources, and continue the remaining stages above. The user does not need an explanation of the architecture; the work itself is the priority.
