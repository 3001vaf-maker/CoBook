# CoBook — Cross-Chat Handoff

## Current control point

- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Code checkpoint: `a79d8e104759372ba5100d18f8ca74c846de130c`
- This handoff update is the next commit on `main`; always use current `main` HEAD as the working base.
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
- Converted WORK material and recipe Save buttons from standalone submit listeners to central `data-action` routing.
- Registered the corresponding action owners in `core.js`.
- Bumped UI asset cache to `ui-system-10`.
- Added this persistent handoff so a new chat can continue from repository state without user re-explaining the project.

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
- Search for any remaining unjustified standalone `submit` handlers.
- Verify Save → action → owner → handle → validation → storage/state → render.
- Verify navigation and modal actions after UI refactors.

### Regression control

- Do not declare UI 100% unified because the page merely looks similar.
- Do not declare a component shared because Core adds a common CSS class after rendering.
- Do not add local CSS overrides to repair one screen.
- Do not change functionality while repairing visual geometry unless the functional path is explicitly checked.
- Before changing a shared component, identify all owners and variants.

## Important known exceptions from the audit

- `app/settings/loyalty/loyalty.js` still requires full action/component audit.
- `app/timetable/timetable.js` owns the current wheel-style TIME_PICKER; all future TIME_PICKER changes must be checked against all owners.
- Journal and timetable calendars must be treated as separate functional contexts sharing a controlled visual base.
- Other remaining standalone form/action listeners must be found by the audit rather than assumed absent.

## Required next action

Continue from current `main` HEAD. Do not ask the user to re-explain the project.

1. Read `PROJECT_STATE.md`, `DESIGN_SYSTEM.md`, `UI_CONTEXT.md`, `UI_COMPONENTS.md`, and this file.
2. Finish the factual audit of all modules/actions.
3. Repair the remaining shared component architecture at the primary source.
4. Audit all affected functional actions.
5. Run the full cross-module audit before calling the result complete.

## Chat interruption protocol

If the chat may end before the current stage is complete, update this file first with:

- current main HEAD;
- exact completed checks;
- exact remaining checks;
- exact next action.

The next chat must continue from this file and the repository, not from reconstructed conversation history.
