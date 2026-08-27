# CoBook — Cross-Chat Handoff

## Current control point

- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Current code checkpoint: `dee14564b94b7b124cf14688a94460bfa3db4301`
- Previous UI registry checkpoint: `23dcd8f3a121848cb06fc0cfe070451d15b95c92`
- Asset cache version: `ui-system-10`

## Goal

Do not optimize individual screens independently. CoBook must have one controlled UI system and predictable functional ownership so that changing one shared component does not silently break another screen or action.

## Existing sources of truth

1. `PROJECT_STATE.md` — architecture and work protocol.
2. `DESIGN_SYSTEM.md` — visual rules.
3. `UI_CONTEXT.md` — screen/context map.
4. `UI_COMPONENTS.md` — component registry and owners.
5. `COBOOK_HANDOFF.md` — current cross-chat state; update this file at every control point.

## Current stage

**Stage 1 — factual audit + Stage 2 repair are in progress.**

Do not restart the project and do not create a second design system.

## Completed in current repair

- Added canonical `CoBook.ui.listItem()` in `app/shared/core.js`.
- Converted TAGS list rows to the canonical entity-list component.
- Converted WALLETS list rows to the canonical entity-list component.
- Removed the TAGS inline visual style implementation.
- Removed the WALLETS custom row geometry from rendered markup.
- Added canonical entity-list geometry to `styles.css`.
- Preserved existing storage/default product data in `core.js` after repair.
- Converted PROFILE personal/profession/workplace Save buttons from standalone submit listeners to central `data-action` routing.
- Converted WORK material and recipe Save buttons to central `data-action` routing.
- Added permanent `tools/cobook-audit.js` static architecture audit.
- Added `.github/workflows/cobook-architecture-audit.yml` so the audit runs on pushes and pull requests.
- Fixed the audit so it does not falsely scan its own literal `<style>` pattern.
- Migrated LOYALTY from its local document click router to Core `data-action → dispatchAction → action owner → module.handle`.
- Registered all current Loyalty actions centrally in `core.js`.
- Preserved the existing Loyalty storage and action logic while changing only its event-routing boundary.

## Current verified audit result

The last completed architecture audit against the pre-Loyalty checkpoint found exactly one failure: the local Loyalty document click router.

That router has now been removed and replaced with Core routing.

The new code checkpoint is:

`dee14564b94b7b124cf14688a94460bfa3db4301`

A fresh GitHub Actions audit for this checkpoint must be observed before claiming PASS. No architectural completion claim is allowed until the actual run is green.

## Known remaining architectural work

### UI

- Complete owner/variant map for BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, EMPTY_STATE, PAGE_HEADER, NAVIGATION, TYPOGRAPHY.
- Complete audit of JOURNAL and TIMETABLE calendars.
- Complete audit of all modal/sheet/dropdown positioning.
- Complete desktop/mobile geometry audit.
- Remove remaining module-specific visual structures where an existing component is sufficient.

### Functional

- Run architecture audit and require zero failures.
- Audit every action in every module.
- Audit every Save/Create/Delete path.
- Verify Save → action → owner → handle → validation → storage/state → render.
- Verify navigation and modal actions after UI refactors.

### Regression control

- Do not add local CSS overrides.
- Do not create another event-routing system.
- Do not declare a component shared because Core only adds a CSS class after rendering.
- Before changing a shared component, identify all owners and variants.
- Every completed control point must update this file with current HEAD and exact remaining work.

## Required next action

Continue from current `main` HEAD.

1. Observe the fresh architecture audit for `dee14564...`.
2. If it fails, fix every reported failure at the primary source and rerun.
3. Once green, continue the owner/action audit across all remaining modules.
4. Continue UI component consolidation.
5. Audit Journal and Timetable.
6. Finish with full cross-module functional + visual audit.

## Chat interruption protocol

If the chat may end before the current stage is complete, update this file before stopping with:

- current main HEAD;
- exact completed checks;
- exact remaining checks;
- exact next action.

The next chat must continue from this file and the repository, not from reconstructed conversation history.
