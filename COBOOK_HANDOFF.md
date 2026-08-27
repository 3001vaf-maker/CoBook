# CoBook — Cross-Chat Handoff

## Current control point

- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Current commit: `1c31df6fe6b110384de075b6b932caa3a242c5a4`
- Previous UI registry checkpoint: `23dcd8f3a121848cb06fc0cfe070451d15b95c92`
- Asset cache version: `ui-system-9`

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
- Removed the TAGS inline `style="--tag-color:..."` implementation.
- Removed the WALLETS custom row geometry from its rendered markup.
- Added canonical `.ui-entity-row`, `.ui-entity-icon`, `.ui-entity-content`, `.ui-entity-title`, `.ui-entity-subtitle` styles to `styles.css`.
- Preserved existing storage/default product data in `core.js` after repair.
- Bumped UI asset cache from `ui-system-8` to `ui-system-9`.

## Known architectural work still required

### UI

- Complete owner/variant map for BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, EMPTY_STATE, PAGE_HEADER, NAVIGATION, TYPOGRAPHY.
- Complete audit of JOURNAL and TIMETABLE calendars.
- Complete audit of all modal/sheet/dropdown positioning.
- Complete desktop/mobile geometry audit.
- Remove remaining module-specific visual structures where an existing component is sufficient.

### Functional

- Audit every `data-action` and `dispatchAction` owner.
- Audit every Save/Create/Delete path.
- Migrate unjustified standalone `submit` handlers into the central action model.
- Verify Save → action → owner → handle → validation → storage/state → render.
- Verify navigation and modal actions after UI refactors.

### Regression control

- Do not declare UI 100% unified because the page merely looks similar.
- Do not declare a component shared because Core adds a common CSS class after rendering.
- Do not add local CSS overrides to repair one screen.
- Do not change functionality while repairing visual geometry unless the functional path is explicitly checked.
- Before changing a shared component, identify all owners and variants.

## Important known exceptions from the audit

- `app/settings/profile/profile.js` has standalone form-submit handling.
- `app/settings/work/work.js` has standalone form-submit handling.
- `app/settings/loyalty/loyalty.js` still requires full action/component audit.
- `app/timetable/timetable.js` owns the current wheel-style TIME_PICKER; all future TIME_PICKER changes must be checked against all owners.
- Journal and timetable calendars must be treated as separate functional contexts sharing a controlled visual base.

## Required next action

Continue from the current commit. Do not ask the user to re-explain the project.

1. Read `PROJECT_STATE.md`, `DESIGN_SYSTEM.md`, `UI_CONTEXT.md`, `UI_COMPONENTS.md`, and this file.
2. Finish the factual audit.
3. Repair the component architecture at the primary source.
4. Audit all affected functional actions.
5. Run the full cross-module audit before calling the result complete.

## Chat interruption protocol

If the chat may end before the current stage is complete, update this file first with:

- current commit;
- exact completed checks;
- exact remaining checks;
- exact next action.

The next chat must continue from this file and the repository, not from a reconstructed conversation history.
