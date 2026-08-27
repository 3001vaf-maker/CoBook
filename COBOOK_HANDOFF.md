# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Latest actual code checkpoint: `d5c7b2fcd5e59de747c7eb38e17a8b1f8553ea5b`
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

## Repository-state correction
Earlier chat messages referenced checkpoint SHAs that are not the current `main` history. The actual `main` is authoritative. Never assume a change exists unless it is present in the current tree.

## Verified current architecture baseline
- One visual CSS source is intended: `styles.css`.
- Core contains the central action dispatcher/ownership map.
- Core contains canonical `listItem`, `calendarGrid`, and `timePicker` definitions.
- Tags currently use `CoBook.ui.listItem()`.
- Journal currently uses `CoBook.ui.calendarGrid()`.
- The current static audit exists at `tools/cobook-audit.js` and is run by GitHub Actions.
- The static audit now enforces that this handoff records the exact commit being tested, preventing continuity drift between chats.

## Not yet proven 100%
- Every component/variant has been mapped to all owners.
- Every visual class is an authorized component/variant or intentional semantic screen class.
- Wallets and all subject screens are visually canonical across every state.
- Modal, Bottom Sheet, Dropdown and picker geometry is canonical everywhere.
- Every Save/Create/Delete path is end-to-end verified.
- Desktop/mobile geometry is verified.
- Cross-module regression is verified.
- Deployment is verified for the final clean state.

## Required component audit
BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, EMPTY_STATE, PAGE_HEADER, NAVIGATION, TYPOGRAPHY.
Subject screens: JOURNAL, TIMETABLE, PROFILE, SERVICE, WORK_MATERIALS, DOCUMENTS, LOYALTY, TAGS, WALLETS, CLIENTS, HOME.
Also inspect spacing, radii, colors, icons and states.

## Functional audit
Every important action must be traceable: `UI → data-action → dispatchAction → owner → handle → validation → state/storage → render`.
Priority: Save, Create, Delete, navigation, calendar changes, time selection, modal actions, form submission, file-input events.

## Calendar rule
One canonical calendar GRID and FORMATION algorithm. Journal and Timetable intentionally may have different data, day semantics, selected states and actions. They must not duplicate the grid-building algorithm. Each module supplies its own day-specific rendering/behavior.

## Time Picker rule
The trigger markup is canonical. The wheel modal is Timetable-owned until a second owner is proven. If another owner appears, extract the shared mechanism rather than copying it.

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
Stage 1/2 → Stage 3. The actual current `main` is the source of truth. Continue the component/variant audit and functional Save/Create/Delete verification. Do not report completion from static syntax alone.

## Exact next action
1. Wait for/inspect CI for `d5c7b2fcd5e59de747c7eb38e17a8b1f8553ea5b`.
2. If audit fails, fix every failure at its primary source and rerun.
3. If audit passes, continue the owner/variant map and end-to-end action audit.
4. Then verify Calendar/Time Picker/Modal/Bottom Sheet/Dropdown and Journal/Timetable.
5. Then perform desktop/mobile and cross-module regression.
6. Only after every final gate passes may the project be declared 100% clean.

## Chat interruption protocol
Before any forced stop, update this file to the exact latest `main` HEAD, record completed checks, remaining failures and the exact next action. The final assistant response must contain a copy-ready handoff matching this file. A progress response is never permission to abandon the remaining work.
