# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Latest code checkpoint: `e002117bb59d9532e9761aed58398df8d7cc61f9`
- This file must always describe the actual current `main`.

## Mission
Bring CoBook to 100% clean, stable architecture and smooth operation. Shared UI has one canonical implementation/source per component or an explicitly registered variant. Changing a shared component must predictably affect its owners and must not break unrelated functionality. Functional actions must remain independent from visual styling.

## Sources of truth
Read before changing code:
- `PROJECT_STATE.md`
- `DESIGN_SYSTEM.md`
- `UI_CONTEXT.md`
- `UI_COMPONENTS.md`
- `COBOOK_HANDOFF.md`

Do not create a competing design system or duplicate project rules.

## Work protocol
1. Inspect actual code before changing it.
2. Fix the primary source; never add cosmetic overrides/callback patches.
3. Identify all owners before changing a shared component.
4. Preserve `UI → data-action → Core dispatcher → owner → handle → state/storage → render`.
5. Run available audits/checks after structural changes.
6. Never declare 100% from syntax/deployment alone.
7. If chat ends, continue from this file and actual latest `main`; do not reconstruct history.

## Completed stabilization work
- Single canonical `styles.css` remains the visual CSS source.
- Core central action dispatcher and ownership map are active.
- Tags and Wallets use canonical entity/list geometry.
- Profile/Work/Recipe Save paths were moved toward Core routing.
- Loyalty local click routing was moved toward Core routing.
- Shared overlay mounting is available.
- Direct overlay insertion was removed from audited modules.
- Journal date/month/mode changes use the central render pipeline.
- Automated architecture audit exists in `tools/cobook-audit.js` and GitHub Actions.
- Calendar grid rendering is now centralized as `CoBook.ui.calendarGrid()` and both Journal and Timetable use it.

## Verified checks
- Previous architecture audit reached PASS at its completed checkpoint.
- JavaScript syntax checks have passed at the previous verified checkpoint.
- Current commit after calendar centralization still requires a fresh CI verification before being called validated.

## Current work
Stage 1/2 — factual audit + unified UI architecture.

### Current target
Finish the component owner/variant audit and remove remaining duplicate/local implementations where a shared component is appropriate.

Required components:
1. BUTTON
2. LIST
3. LIST_ITEM
4. FOLDER
5. CARD
6. FIELD
7. SELECT
8. TEXTAREA
9. MODAL
10. BOTTOM_SHEET
11. DROPDOWN
12. DATE_PICKER
13. TIME_PICKER
14. CALENDAR
15. EMPTY_STATE
16. PAGE_HEADER
17. NAVIGATION
18. TYPOGRAPHY

Subject screens:
JOURNAL, TIMETABLE, PROFILE, SERVICE, WORK_MATERIALS, DOCUMENTS, LOYALTY, TAGS, WALLETS, CLIENTS, HOME.

Also inspect mobile geometry, spacing, radii, colors, icons and states.

## Functional audit
Every important action must be traceable:
`UI → data-action → dispatchAction → owner → handle → validation → state/storage → render`.

Priority:
- Save
- Create
- Delete
- navigation
- calendar changes
- time selection
- modal actions
- form submission
- file-input events

## Calendar status
A canonical `CoBook.ui.calendarGrid()` now owns the common calendar grid structure. Journal and Timetable supply only functional/semantic day rendering. Do not create another calendar grid implementation. Calendar variants may differ in behavior but must share the canonical visual geometry unless a documented variant is required.

## Time Picker status
Current owner remains `app/timetable/timetable.js`, using wheel-style hours/minutes. It is not yet a finalized reusable component. Before changing it, find all owners/usages and then centralize the component or register explicit variants.

## Stages
### 1 — factual audit
Actual code, UI components, CSS, actions, events and functional paths.
### 2 — unified UI architecture
Canonical components, variants and owners; remove duplicate/local implementations.
### 3 — functional stabilization
Complete action routing and end-to-end Save/Create/Delete.
### 4 — UI repair
Bring all owners to canonical UI without changing behavior.
### 5 — Journal + Timetable
Full calendar/time picker/modal/function verification.
### 6 — final regression
Architecture + UI + functionality + desktop/mobile + cross-module regression.

## Final 100% gate
Do not declare complete until all are true:
- architecture audit: PASS;
- no unexpected warnings;
- JS syntax: PASS;
- deployment: PASS;
- every required component has an owner/variant map;
- no unauthorized local CSS/style blocks/inline styles;
- every data-action has an owner;
- every Save/Create/Delete path is verified;
- Calendar/Time Picker/Modal/Bottom Sheet/Dropdown are verified;
- Journal and Timetable are verified independently;
- desktop and mobile geometry are verified;
- cross-module regression passes;
- final clean commit recorded here.

## Chat interruption protocol
If the chat is forced to stop, first update this file to the exact latest `main` HEAD and record completed checks, remaining failures and the exact next action. The final assistant message must contain a copy-ready handoff matching this file. The next chat must continue from that state without asking the user to reconstruct history.

## Exact next action
Verify CI for `e002117bb59d9532e9761aed58398df8d7cc61f9`, then continue the component/variant audit and functional Save/Create/Delete audit. Fix every failure at its primary source, rerun checks, and proceed to the next stage only after the current one is actually clean.
