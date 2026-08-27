# CoBook — Cross-Chat Handoff

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Current code checkpoint: `5def6a371f2243290adea750d89ae0a9342daadd`
- Previous UI registry checkpoint: `23dcd8f3a121848cb06fc0cfe070451d15b95c92`
- Asset cache version: `ui-system-10`

## Goal
Bring CoBook to 100% clean, stable architecture and smooth operation. Shared UI must have canonical implementations and registered owners. Functional actions must remain predictable and independent from visual styling. A change to one screen/component must not silently break another.

## Existing sources of truth
1. `PROJECT_STATE.md` — architecture/work protocol.
2. `DESIGN_SYSTEM.md` — visual rules.
3. `UI_CONTEXT.md` — screen/context map.
4. `UI_COMPONENTS.md` — component registry and owners.
5. `COBOOK_HANDOFF.md` — current cross-chat state.
Do not create a competing design system.

## Work protocol
1. Inspect actual code before changing it.
2. Fix primary sources; no cosmetic overrides/callback patches.
3. Identify all owners before changing a shared component.
4. Preserve `UI → data-action → Core dispatcher → owner → handle → state/storage → render`.
5. Run available audits/checks after structural changes.
6. Never declare 100% from syntax/deployment alone.
7. If chat ends, next chat continues from this file and actual latest `main`.

## Completed
- Canonical `CoBook.ui.listItem()`; Tags and Wallets migrated.
- Tags inline visual implementation removed.
- Wallet custom row geometry removed.
- Canonical entity-list geometry added to `styles.css`.
- Profile/Work/Recipe Save paths migrated toward Core action routing.
- Loyalty local document click router migrated toward Core.
- Central action ownership map expanded.
- Permanent `tools/cobook-audit.js` + GitHub Actions audit added.
- Audit expanded for data-action ownership, direct render bypasses and module overlay insertion.
- Shared `CoBook.ui.mountOverlay()` introduced; Profile/Documents/Work/Service overlays migrated.
- Service price-variant insertion migrated away from direct module `insertAdjacentHTML()`.
- Tags/Wallets/Work direct rerenders migrated to Core render pipeline.
- Journal calendar actions corrected to use central `window.render()`.

## Current verified state
- Architecture audit previously reached zero failures at its last completed checkpoint.
- The latest code checkpoint is `5def6a...`; its CI status must be verified before calling it validated.
- `COBOOK_HANDOFF.md` was stale; this update synchronizes it with the actual latest code checkpoint.

## Remaining work — do not skip
### Stage 1/2: audit + UI architecture
- Remove remaining Loyalty legacy/dead render helper if unused.
- Complete owner/variant map for BUTTON, LIST, LIST_ITEM, FOLDER, CARD, FIELD, SELECT, TEXTAREA, MODAL, BOTTOM_SHEET, DROPDOWN, DATE_PICKER, TIME_PICKER, CALENDAR, EMPTY_STATE, PAGE_HEADER, NAVIGATION, TYPOGRAPHY.
- Audit all module-specific visual classes against registry.
- Audit Journal and Timetable calendars.
- Consolidate duplicated Calendar structures where appropriate; use explicit functional variants only when justified.
- Determine canonical Time Picker ownership/variant.
- Complete desktop/mobile geometry audit.

### Stage 3: functional stabilization
- Audit every `data-action` owner/handler pair.
- Audit every Save/Create/Delete path end-to-end.
- Verify `Save → action → owner → handle → validation → storage/state → render`.
- Verify navigation and modal actions after refactors.
- Verify non-click event listeners are intentional.
- Verify file-input and other form events.

### Stage 4/5: UI + Journal/Timetable
- Repair remaining UI through canonical components only.
- Fully verify Journal calendar, dates, modes and actions.
- Fully verify Timetable calendar, time selection, working-day flow and actions.
- Verify Modal/Bottom Sheet/Dropdown positioning and behavior.

### Stage 6: final regression
- Syntax checks.
- Architecture audit: zero failures AND zero warnings.
- Deployment check.
- Full cross-module visual audit.
- Full cross-module functional audit.
- Only then create final clean control point and declare 100%.

## Required next action
Continue from latest `main`.
1. Verify CI for `5def6a...`.
2. Inspect Loyalty for dead legacy render helper and remove it if truly unused.
3. Run architecture/syntax checks again.
4. Continue component owner/variant audit.
5. Continue Journal/Timetable audit.
6. Continue functional Save/Create/Delete audit.
7. Do not stop until the current stage is actually completed.

## Chat interruption protocol
Before any forced stop, update this file to the exact latest `main` HEAD and record completed/remaining checks plus the exact next action. The final assistant message must reproduce a copy-ready handoff matching this file. The next chat must not reconstruct history.
