# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Latest code checkpoint: `5c832fa43d1a610ab80c9feca29e85ca3ab6cd76`
- This file must always describe the actual current `main`.

## Mission
Bring CoBook to 100% clean, stable architecture and smooth operation. Shared UI has one canonical implementation/source per component or an explicitly registered variant. Changing a shared component must predictably affect its owners and must not break unrelated functionality. Functional actions must remain independent from visual styling.

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

## Completed stabilization
- Single canonical `styles.css` remains the visual CSS source.
- Core central action dispatcher and ownership map are active.
- Tags and Wallets use canonical entity/list geometry.
- Profile/Work/Recipe Save paths were moved toward Core routing.
- Loyalty local click routing was moved toward Core routing.
- Shared overlay mounting is available.
- Direct overlay insertion was removed from audited modules.
- Journal date/month/mode changes use the central render pipeline.
- Automated architecture audit exists in `tools/cobook-audit.js` and GitHub Actions.
- Calendar grid rendering is centralized as `CoBook.ui.calendarGrid()` and both Journal and Timetable use it.
- Time Picker trigger markup is centralized as `CoBook.ui.timePicker()` and Timetable uses it; wheel modal remains Timetable-owned until another owner requires extraction.
- Audit explicitly verifies calendarGrid/timePicker ownership and rejects duplicate calendar builders.
- Document save refresh now uses `window.render()` rather than an ambiguous module-level `render()` call.

## Calendar rule
The calendar GRID and calendar FORMATION are shared. Journal and Timetable may have different data, day semantics, selected states and actions. They must not duplicate the grid-building algorithm. Each module supplies its own day-specific rendering/behavior through `renderDay`.

## Required component audit
BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, EMPTY_STATE, PAGE_HEADER, NAVIGATION, TYPOGRAPHY.
Subject screens: JOURNAL, TIMETABLE, PROFILE, SERVICE, WORK_MATERIALS, DOCUMENTS, LOYALTY, TAGS, WALLETS, CLIENTS, HOME.
Also inspect mobile geometry, spacing, radii, colors, icons and states.

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
Continue Stage 2 → Stage 3. The current static audit has no reported local click routers/submit listeners/inline styles in its scanned source set, but component ownership and end-to-end behavior are not yet proven 100%.

## Exact next action
Run/verify CI for `5c832fa43d1a610ab80c9feca29e85ca3ab6cd76`. Then continue the component/variant audit and complete Save/Create/Delete verification. Fix primary sources, rerun checks, and proceed to Journal/Timetable and final regression only after the current target is clean.

## Chat interruption protocol
Before any forced stop, update this file to the exact latest `main` HEAD, record completed checks, remaining failures and the exact next action. The final assistant response must contain a copy-ready handoff matching this file.
