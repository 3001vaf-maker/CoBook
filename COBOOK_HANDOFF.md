# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Actual code checkpoint: `a7af6f266adcd2ec683e6104dce7868aab02c7fd`
- Latest code change: Settings navigation folders now render through `CoBook.ui.folder()` instead of module-owned folder markup.
- This file is updated after each code/infrastructure checkpoint; documentation-only commits after that checkpoint must not be rewound.

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
Core exposes canonical factories for button, folder, listItem, field, select, textarea, modal, bottomSheet, dropdown, datePicker, timePicker, calendarGrid and mountOverlay. Buttons emit the canonical `ui-button` token. List items support explicit root actions/elements. Modal/sheet factories support explicit outer variants and metadata. A factory existing is NOT proof of full migration: every owner/usage must be verified.

## Current architectural cleanup
`normalizeUI()` post-render class injection was removed from Core. Core now renders module markup without a MutationObserver or post-render normalization pass. Shared components must be produced through canonical factories or explicit registered variants rather than inferred after rendering.

## Recent migration
- Main/Clients migrated to canonical controls/list rows/buttons.
- Settings navigation folders migrated to canonical `CoBook.ui.folder()`.
- Settings/Tags migrated to canonical controls/list rows/buttons.
- Settings/Wallets migrated to canonical controls/list rows/buttons and canonical modal shell.
- Profile personal form, Profile folders/forms/choice sheets migrated to canonical UI.
- Service form fields and overlays migrated to canonical UI; service modal metadata preserved.
- Work/Materials controls, list rows and material sheet migrated to canonical UI; specialized recipe-row controls remain explicit module content and require final owner audit.
- Documents actions and overlays migrated to canonical UI.
- Canonical Core factories were extended for folders, root-action list rows and explicit overlay metadata.
- Architecture audit requires the canonical folder factory.
- Browser smoke infrastructure was added to test real rendered user flows in Chromium.

## Required audit set
BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, JOURNAL, TIMETABLE, PROFILE, SERVICE, WORK_MATERIALS, DOCUMENTS, LOYALTY, TAGS, WALLETS, CLIENTS, NAVIGATION, MOBILE_GEOMETRY, TYPOGRAPHY, plus EMPTY_STATE, PAGE_HEADER, ICON, SPACING, RADIUS, COLOR and interaction states.

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
Continue from `a7af6f266adcd2ec683e6104dce7868aab02c7fd`. Audit remaining direct/local shared-component markup, prioritizing specialized recipe/card markup and Loyalty. Then complete action-owner/change-owner coverage and functional Save/Create/Delete paths. Continue through Calendar/Time Picker, Modal/Bottom Sheet/Dropdown, Journal/Timetable, mobile geometry, typography, browser regression, architecture audit, JavaScript and deployment. Fix every failure found; do not declare an intermediate result as 100%.

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