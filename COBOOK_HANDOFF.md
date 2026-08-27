# CoBook — Cross-Chat Handoff

## Current control point

- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Current main HEAD before this handoff commit: `3fe5a5da14701aec9e10ffc6b8d2f8b67aeb77b8`
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
- Registered corresponding action owners in `core.js`.
- Added permanent `tools/cobook-audit.js` static architecture audit.
- Added `.github/workflows/cobook-architecture-audit.yml` so the audit runs on pushes and pull requests.
- Audit explicitly checks for extra CSS files, inline styles, `<style>` blocks, standalone submit listeners, local document click routers, required Core UI/action infrastructure, and canonical UI tokens.
- Updated this handoff so the next chat can continue from repository state without user re-explaining the project.

## Current verified findings

- Core action routing exists and is used by repaired Profile/Work Save paths.
- TAGS/WALLETS have been moved onto the canonical entity-list structure.
- LOYALTY remains a large independent action/UI implementation and requires migration/audit.
- TIMETABLE owns the current wheel-style TIME_PICKER and requires owner mapping before any shared change.
- Journal and timetable calendars remain separate functional contexts sharing a controlled visual base.
- The static audit is now part of the repository, but it has not yet been proven green against the entire current tree; run it in GitHub Actions and repair every failure before claiming architectural completion.

## Remaining work

### UI

- Complete owner/variant map for BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, EMPTY_STATE, PAGE_HEADER, NAVIGATION, TYPOGRAPHY.
- Complete audit of JOURNAL and TIMETABLE calendars.
- Complete audit of all modal/sheet/dropdown positioning.
- Complete desktop/mobile geometry audit.
- Remove remaining module-specific visual structures where an existing component is sufficient.

### Functional

- Audit every action in every module.
- Audit every Save/Create/Delete path.
- Migrate unjustified standalone event routing into the central action model.
- Verify Save → action → owner → handle → validation → storage/state → render.
- Verify navigation and modal actions after UI refactors.

### Regression control

- Do not declare UI 100% unified because the page merely looks similar.
- Do not declare a component shared because Core adds a common CSS class after rendering.
- Do not add local CSS overrides to repair one screen.
- Do not change functionality while repairing visual geometry unless the functional path is explicitly checked.
- Before changing a shared component, identify all owners and variants.
- Every completed control point must update this file with current HEAD and exact remaining work.

## Required next action

Continue from current `main` HEAD. Do not ask the user to re-explain the project.

1. Read `PROJECT_STATE.md`, `DESIGN_SYSTEM.md`, `UI_CONTEXT.md`, `UI_COMPONENTS.md`, and this file.
2. Run/inspect the new architecture audit and fix its failures.
3. Finish the factual owner/action audit.
4. Repair remaining shared component architecture at the primary source.
5. Audit all affected functional actions.
6. Run the full cross-module audit before calling the result complete.

## Chat interruption protocol

If the chat may end before the current stage is complete, update this file before stopping with:

- current main HEAD;
- exact completed checks;
- exact remaining checks;
- exact next action.

The next chat must continue from this file and the repository, not from reconstructed conversation history.
