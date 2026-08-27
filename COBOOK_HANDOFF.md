# CoBook — Cross-Chat Handoff

## Current control point

- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Current code checkpoint: `e07d755c5661658ad003231946297f321fdfecdc`
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
- Converted PROFILE/WORK Save paths from standalone submit routing to central action routing.
- Removed the LOYALTY local document click router and routed Loyalty through Core.
- Registered the declared module action ownership map centrally in `core.js` for Journal, Documents, Profile, Service, Tags, Wallets, Work, Timetable, Loyalty and related service submodules.
- Added permanent `tools/cobook-audit.js` architecture audit.
- Added GitHub Actions workflow for the audit.
- Expanded the audit to check declared `data-action` ownership and direct render bypasses.
- Expanded the audit to detect module-owned overlay insertion.
- Added shared `CoBook.ui.mountOverlay()` as the single overlay mounting primitive.
- Converted Profile overlay mounting to the shared primitive.
- Converted Documents overlay mounting to the shared primitive.
- Profile refresh now uses the Core render pipeline so UI normalization is not bypassed.

## Verified results

- The architecture audit run immediately before action-ownership enforcement was green after the Loyalty migration.
- JavaScript syntax checks have remained successful on the repair line.
- The newly expanded audit must be observed on the current checkpoint before any PASS claim.

## Current remaining work

### UI architecture

- Complete owner/variant map for BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, EMPTY_STATE, PAGE_HEADER, NAVIGATION, TYPOGRAPHY.
- Complete audit of all module-specific visual classes against the registry.
- Complete audit of Journal calendar and Timetable calendar.
- Determine whether Calendar has one shared visual component with functional variants or duplicated structures that must be consolidated.
- Determine whether Time Picker is a shared component or a single Timetable owner; future changes must not require duplication.
- Complete desktop/mobile geometry audit.

### Functional architecture

- Audit every `data-action` owner/handler pair, not merely registration.
- Audit every Save/Create/Delete path end-to-end.
- Verify Save → action → owner → handle → validation → storage/state → render.
- Verify navigation and modal actions after UI refactors.
- Verify all direct event listeners that are not central action routing.
- Verify file input change handling and other non-click events are intentional and do not duplicate action routing.

### Final regression

- Run syntax checks.
- Run architecture audit and require zero failures.
- Verify deployment.
- Run full cross-module visual audit.
- Run full cross-module functional audit.
- Only then create the final clean control point.

## Required next action

Continue from current `main` HEAD.

1. Observe the expanded architecture audit on the current checkpoint.
2. Fix every failure at its primary source; do not add overrides.
3. Re-run until the audit is green.
4. Continue UI component consolidation and owner mapping.
5. Audit Journal and Timetable.
6. Verify functional regression.
7. Finish only after the complete cross-module audit is clean.

## Chat interruption protocol

If the chat may end before the current stage is complete, update this file before stopping with:

- current main HEAD;
- exact completed checks;
- exact remaining checks;
- exact next action.

The next chat must continue from this file and the repository, not from reconstructed conversation history.
