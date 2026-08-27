# CoBook Handoff

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Actual code checkpoint: `d5c5c722ac93c8fe0dae44125144518b0252b50c`
- Latest verified documentation checkpoint: `7fd2c6cbcefb6a25ad7f8d2c3497c3701ff83a04`
- Mission: reach a genuinely clean, fully working CoBook: one predictable UI system, stable functionality, no cross-module regressions, and safe future changes with explicit component ownership.

## Non-negotiable working rules
- Do not declare 100% from a commit, syntax check, or deployment alone.
- A canonical factory existing is not proof of migration; every real owner/usage must be verified.
- Shared UI has one primary source. Variants are explicit and registered; no hidden per-module CSS/markup overrides.
- `normalizeUI()` post-render mutation is removed; do not recreate it.
- Preserve existing data paths and behavior while migrating UI ownership.
- Save/Create/Delete and all interactive paths must remain functional.
- If a chat/work cycle ends before 100%, continue from the exact actual checkpoint below; do not restart or re-audit history unnecessarily.

## Canonical UI surface
Core is intended to own: button, featureButton, folder, listItem, field, select, textarea, fileField, modal, bottomSheet, dropdown, datePicker, timePicker, calendarGrid, mountOverlay. Field/select/textarea have explicit `bare` variants where compact controls are required.

## Required audit surface
BUTTON, FEATURE_BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, FILE_FIELD, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, JOURNAL, TIMETABLE, PROFILE, SERVICE, WORK_MATERIALS, DOCUMENTS, LOYALTY, TAGS, WALLETS, CLIENTS, NAVIGATION, MOBILE_GEOMETRY, TYPOGRAPHY, EMPTY_STATE, PAGE_HEADER, ICON, SPACING, RADIUS, COLOR and interaction states.

## Functional audit surface
Save, Create, Delete, navigation, form changes, calendar changes, time selection, modal actions, bottom-sheet actions, dropdown actions, file actions, and state/storage persistence. Every path must have an explicit owner and must not depend on post-render inference.

## Current work state
Full owner migration and functional verification are NOT complete. The known remaining area includes Loyalty remaining raw form controls/actions, followed by verification/migration across Profile, Service submodules, Journal and Timetable, then complete action-owner verification and functional regression.

## Required completion sequence
1. Audit remaining module markup against canonical UI.
2. Migrate every genuine shared component to a canonical factory or explicit registered variant, preserving behavior.
3. Close action-owner/change-owner gaps.
4. Verify Save/Create/Delete and all overlay, dropdown, time, calendar and file paths.
5. Run browser regression.
6. Run architecture audit.
7. Run JavaScript checks.
8. Verify GitHub Pages deployment.
9. Fix every failure found and repeat the relevant checks.
10. Declare 100% only when all final gates pass.

## Exact continuation point
Start from actual `main` at or after `d5c5c722ac93c8fe0dae44125144518b0252b50c`. First inspect the remaining module owners and audit implementation rather than assuming the previous migration is complete. Prioritize Loyalty raw controls/actions, then Profile, Service submodules, Journal and Timetable. Do not substitute a progress report for work.

## Final acceptance
The project is ready only when the same component decision is consistently applied throughout the application, exceptions are explicit, functional behavior is preserved, regression is clean, JavaScript/architecture checks pass, and the deployed application is usable. Until then, do not call it finished.
