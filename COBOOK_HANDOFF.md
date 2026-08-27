# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Actual code checkpoint: `ee100afcda0d155c82ea777737a1b0de8632ee44`
- Latest code changes: canonical bare field/select variants and canonical fileField were added; Work/Materials inline controls were migrated; Documents and Service file controls were migrated without changing their data paths.
- Current work remains in UI owner migration and functional verification; do not declare 100%.

## Mission
Reach 100% clean CoBook: one predictable UI system, stable functionality, no cross-module regressions, and safe future changes with explicit component ownership.

## Non-negotiable architecture
- One canonical implementation per shared UI component.
- Legitimate module differences are explicit variants or module-supplied data/state/actions.
- Journal and Timetable share ONE calendar grid/formation algorithm, but keep independent data, day semantics and actions.
- Functional routing: `UI → data-action → Core → owner → handle/handleChange → validation → state/storage → render`.
- One CSS source: `styles.css`.
- Fix primary sources. No CSS overrides, duplicate components, local routers or workaround layers.
- `app.innerHTML` belongs only to Core.
- Overlay insertion belongs to `CoBook.ui.mountOverlay()`.

## Canonical UI components
Core exposes canonical factories for button, folder, listItem, field, select, textarea, fileField, modal, bottomSheet, dropdown, datePicker, timePicker, calendarGrid and mountOverlay. Field/select/textarea support an explicit `bare` variant for compact controls. Buttons emit the canonical `ui-button` token. A factory existing is NOT proof of full migration: every owner/usage must be verified.

## Current architectural cleanup
`normalizeUI()` post-render class injection was removed from Core. Core now renders module markup without a MutationObserver or post-render normalization pass. Shared components must be produced through canonical factories or explicit registered variants rather than inferred after rendering.

## Recent migration
- Main/Clients migrated to canonical controls/list rows/buttons.
- Settings navigation folders migrated to canonical `CoBook.ui.folder()` with explicit icon/chevron variant.
- Settings/Tags migrated to canonical controls/list rows/buttons.
- Settings/Wallets migrated to canonical controls/list rows/buttons and canonical modal shell.
- Profile personal form, Profile folders/forms/choice sheets migrated to canonical UI.
- Service form fields and overlays migrated to canonical UI; service tabs and price-mode controls use canonical buttons; product image file control now uses canonical fileField and preserves preview behavior.
- Work/Materials controls, list rows, material sheet and inline recipe controls migrated to canonical UI; bare control variants are explicit.
- Documents actions, overlays and PDF file control migrated to canonical UI.
- Loyalty navigation folders, entity cards and primary/danger/secondary actions migrated to canonical UI. Loyalty functional delete action still requires verification.
- Browser smoke infrastructure exists for real rendered user flows in Chromium.

## Required audit set
BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, FILE_FIELD, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, JOURNAL, TIMETABLE, PROFILE, SERVICE, WORK_MATERIALS, DOCUMENTS, LOYALTY, TAGS, WALLETS, CLIENTS, NAVIGATION, MOBILE_GEOMETRY, TYPOGRAPHY, plus EMPTY_STATE, PAGE_HEADER, ICON, SPACING, RADIUS, COLOR and interaction states.

## Functional audit set
Save, Create, Delete, navigation, form changes, calendar changes, time selection, modal actions, bottom-sheet actions, dropdown actions, file actions and state/storage persistence. Every path must remain traceable through Core.

## Stages
1. Inventory actual component owners/usages.
2. Migrate duplicate/shared markup to canonical factories or explicit variants.
3. Complete action-owner and change-owner mapping.
4. Verify Save/Create/Delete end-to-end.
5. Verify Calendar, Time Picker, Modal, Bottom Sheet and Dropdown.
6. Verify Journal and Timetable independently with shared calendar grid.
7. Verify desktop/mobile geometry and typography.
8. Run browser cross-module regression.
9. Verify JavaScript, architecture audit and deployment.
10. Declare 100% only when every final gate passes.

## Current next action
Continue from `ee100afcda0d155c82ea777737a1b0de8632ee44`. Audit every remaining module for direct/local shared-component markup now that post-render normalization is gone. Prioritize Loyalty, Profile, Service submodules, Documents, Work/Materials, Journal and Timetable. Migrate each genuine shared component to a canonical factory or explicit registered variant while preserving data and behavior. Then close all action-owner/change-owner gaps, verify Save/Create/Delete and all overlay/time/calendar paths, and run browser regression plus architecture audit, JavaScript and deployment. Fix every failure found and repeat until all final gates PASS.

## Continuation rule
Never restart the project or reconstruct history. Before any future response/work interruption, inspect actual `main`, update this handoff to the exact latest code checkpoint, and leave the exact next action. Do not substitute a progress report for remaining work.

## Definition of 100% done
- one CSS source;
- one canonical implementation per shared component;
- all variants explicit and registered;
- all owners mapped;
- no local UI routers;
- all actions centrally routed;
- Save/Create/Delete verified;
- Calendar/Time Picker/Modal/Bottom Sheet/Dropdown verified;
- Journal/Timetable shared grid + independent semantics verified;
- desktop/mobile geometry verified;
- browser regression PASS;
- architecture audit PASS;
- JavaScript PASS;
- deployment PASS;
- cross-module regression PASS.