# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Latest actual code checkpoint: `a9f0042dc149e81c54a46078a8edd0d62fae162c`
- This file must always describe the actual current `main`.

## Mission
Bring CoBook to 100% clean, stable architecture and smooth operation. Shared UI has one canonical implementation/source per component or an explicitly registered variant. Changing a shared component must predictably affect all owners and must not break unrelated functionality. Functional actions must remain independent from visual styling.

## Sources of truth
Read before changing code: `PROJECT_STATE.md`, `DESIGN_SYSTEM.md`, `UI_CONTEXT.md`, `UI_COMPONENTS.md`, `COBOOK_HANDOFF.md`.

## Work protocol
1. Inspect actual code before changing it.
2. Fix the primary source; never add cosmetic overrides/callback patches.
3. Identify all owners before changing a shared component.
4. Preserve `UI → data-action → Core dispatcher → owner → handle → state/storage → render`.
5. Run available audits/checks after structural changes.
6. Never declare 100% from syntax/deployment alone.
7. If chat ends, continue from this file and actual latest `main`; do not reconstruct history.
8. Before every user-facing progress report, synchronize this file with the actual `main` HEAD.

## Important repository-state correction
Previous chat messages referenced several later checkpoint SHAs, but the actual public `main` currently resolves to `a9f0042dc149e81c54a46078a8edd0d62fae162c`, whose parent is `5c832fa43d1a610ab80c9feca29e85ca3ab6cd76`. Do not assume changes mentioned in earlier chat messages exist on `main` unless they are present in the actual current tree. This correction is intentional and prevents false progress reporting.

## Verified at current checkpoint
- `COBOOK_HANDOFF.md` is synchronized to actual `main`.
- The latest functional change present in the current `main` history routes document-save refresh through `window.render()` rather than an ambiguous local `render()` call.
- Core contains the central action dispatcher/ownership map, canonical list item, calendar grid and time picker definitions in the current code history.

## Not yet proven 100%
Do not treat the following as complete merely because they were described in prior messages. Verify them against the actual current tree before relying on them:
- Tags/Wallets canonical implementation;
- Profile/Work/Recipe/Loyalty action migration;
- shared overlay mounting;
- Journal central render behavior;
- calendarGrid adoption by both Journal and Timetable;
- Time Picker ownership;
- automated architecture audit and its CI result;
- complete component ownership map;
- end-to-end Save/Create/Delete behavior;
- visual consistency across every screen;
- mobile geometry;
- cross-module regression.

## Required component audit
BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, EMPTY_STATE, PAGE_HEADER, NAVIGATION, TYPOGRAPHY.
Subject screens: JOURNAL, TIMETABLE, PROFILE, SERVICE, WORK_MATERIALS, DOCUMENTS, LOYALTY, TAGS, WALLETS, CLIENTS, HOME.
Also inspect spacing, radii, colors, icons and states.

## Functional audit
Every important action must be traceable: `UI → data-action → dispatchAction → owner → handle → validation → state/storage → render`.
Priority: Save, Create, Delete, navigation, calendar changes, time selection, modal actions, form submission, file-input events.

## Stages
1. factual audit
2. unified UI architecture
3. functional stabilization
4. UI repair
5. Journal + Timetable verification
6. final cross-module regression

## Final 100% gate
- architecture audit PASS;
- no unexpected warnings;
- JS syntax PASS;
- deployment PASS;
- every required component has an owner/variant map;
- no unauthorized local CSS/style blocks/inline styles;
- every data-action has an owner;
- every Save/Create/Delete path is verified;
- Calendar/Time Picker/Modal/Bottom Sheet/Dropdown are verified;
- Journal and Timetable are independently verified;
- desktop/mobile geometry verified;
- cross-module regression passes;
- final clean commit recorded here.

## Current work
Stage 1/2 must be continued from the actual `a9f0042...` tree. The first task is to verify the actual current tree against the claims above, establish the real audit baseline, then fix primary sources. Do not report a component as unified until the source and all owners are verified.

## Exact next action
Run the repository's available static/CI audit against actual `main`, inspect every reported failure and warning, then build/verify the component-owner map and Save/Create/Delete map from actual code. Fix primary sources and rerun checks. Only after these are clean proceed to visual repair and final regression.

## Chat interruption protocol
Before any forced stop, update this file to the exact latest `main` HEAD, record completed checks, remaining failures and the exact next action. The final assistant response must contain a copy-ready handoff matching this file. A progress response is never permission to abandon the remaining work.
