# CoBook Handoff

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Actual code checkpoint: `0fbd2cff53a7237faecf2952c98a5af05ab39e47`
- Mission: reach a genuinely clean, fully working CoBook: one predictable UI system, stable functionality, no cross-module regressions, and safe future changes with explicit component ownership.

## Non-negotiable working rules
- Do not declare 100% from a commit, syntax check, or deployment alone.
- A canonical factory existing is not proof of migration; every real owner/usage must be verified.
- Shared UI has one primary source. Variants are explicit and registered; no hidden per-module CSS/markup overrides.
- Do not recreate post-render `normalizeUI()`.
- Preserve existing data paths and behavior while migrating UI ownership.
- Save/Create/Delete and all interactive paths must remain functional.
- If a chat/work cycle ends before 100%, continue from the exact actual checkpoint below; do not restart or re-audit history unnecessarily.

## Current verified facts
- `app/maine/maine.js` contains the client Save path and persists `state.clients` to `localStorage`.
- Client Save now explicitly returns to the client list after persistence so a successful save is immediately visible instead of requiring navigation away and back.
- `index.html` cache version is `ui-system-12` so the updated client module is requested instead of a stale browser copy.
- Browser smoke workflow exists and covers client creation/save plus wallets, tags, service, work materials and profile flows.
- Latest browser smoke run from the previous checkpoint was still in progress when inspected; it was not treated as PASS.

## Canonical UI surface
Core is intended to own: button, featureButton, folder, listItem, field, select, textarea, fileField, modal, bottomSheet, dropdown, datePicker, timePicker, calendarGrid, mountOverlay. Field/select/textarea have explicit `bare` variants where compact controls are required.

## Required audit surface
BUTTON, FEATURE_BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, FILE_FIELD, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, JOURNAL, TIMETABLE, PROFILE, SERVICE, WORK_MATERIALS, DOCUMENTS, LOYALTY, TAGS, WALLETS, CLIENTS, NAVIGATION, MOBILE_GEOMETRY, TYPOGRAPHY, EMPTY_STATE, PAGE_HEADER, ICON, SPACING, RADIUS, COLOR and interaction states.

## Functional audit surface
Save, Create, Delete, navigation, form changes, calendar changes, time selection, modal actions, bottom-sheet actions, dropdown actions, file actions, and state/storage persistence. Every path must have an explicit owner and must not depend on post-render inference.

## Current work state
Full owner migration and functional verification are NOT complete. Continue from the actual `main` checkpoint above. Do not restart the project and do not substitute a progress report for code changes.

## Required completion sequence
1. Continue concrete fixes from the current repository state.
2. Close action-owner/change-owner gaps.
3. Verify Save/Create/Delete and all overlay, dropdown, time, calendar and file paths.
4. Finish canonical UI ownership across the remaining modules.
5. Run browser regression.
6. Run architecture audit.
7. Run JavaScript checks.
8. Verify GitHub Pages deployment.
9. Fix every failure found and repeat the relevant checks.
10. Declare 100% only when all final gates pass.

## Exact continuation point
The last concrete change is the client Save behavior in `app/maine/maine.js`, followed by cache-busting in `index.html`. Next work must continue with verification and the next real defect; do not reopen already-closed planning/audit discussion unless the code itself requires it.

## Final acceptance
The project is ready only when the same component decision is consistently applied throughout the application, exceptions are explicit, functional behavior is preserved, regression is clean, JavaScript/architecture checks pass, and the deployed application is usable. Until then, do not call it finished.
