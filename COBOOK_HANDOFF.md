# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Actual code checkpoint before this documentation commit: `335558ffb9b3df46620a017fcc8c881ebf3da94c`
- This file is part of the controlled state and must always describe the actual code checkpoint immediately before the handoff documentation commit.

## Mission
Reach 100% clean CoBook: one predictable UI system, stable functionality, no cross-module regressions, and a workflow where future changes have known owners and impact.

## Sources of truth
Read before changing code: `PROJECT_STATE.md`, `DESIGN_SYSTEM.md`, `UI_CONTEXT.md`, `UI_COMPONENTS.md`, `COBOOK_HANDOFF.md`.
Never create a competing design system or duplicate CSS source.

## Process rule
Before every user-facing progress report, synchronize this file with the actual `main` state. If work remains, continue working rather than treating the report as completion.
If chat ends, next chat reads this file and continues from the exact checkpoint; no history reconstruction or project restart.

## Architecture rules
- One canonical implementation per shared UI component.
- Legitimate differences are explicit variants or module-supplied data/state/actions.
- Journal and Timetable share one calendar grid/formation component but keep independent data, day semantics and actions.
- Functional routing should be `UI → data-action → Core → owner → handle → state/storage → render`.
- Fix primary sources; no CSS overrides, duplicate components, local routers or workaround layers.

## Verified changes in latest code checkpoint
- Tags, Wallets and Work refresh paths use the central Core render pipeline.
- Work material and Service overlays use the shared overlay API.
- Service price-variant DOM insertion uses a template.
- Loyalty internal navigation uses `window.render()` and no longer directly invokes its module render.
- UI component registry now includes `MOBILE_GEOMETRY`.

## Automated audit state
Latest architecture audit observed before the registry repair: one missing registry component (`MOBILE_GEOMETRY`) plus a handoff checkpoint mismatch caused by the intervening code commit. The registry repair is now committed. The handoff is synchronized to the registry-repair code checkpoint below.

## Required component audit
BUTTONS; LISTS; FOLDERS; CARDS; FIELDS; SELECT; TEXTAREA; MODALS; BOTTOM SHEETS; DROPDOWNS; DATE PICKER; TIME PICKER; CALENDAR; JOURNAL; TIMETABLE; PROFILE; SERVICE; WORK MATERIALS; DOCUMENTS; LOYALTY; TAGS; WALLETS; CLIENTS; NAVIGATION; MOBILE GEOMETRY; TYPOGRAPHY.
Also inspect headers, icons, empty states, spacing, radii, colors and interaction states.

## Functional audit
Trace and verify every important Save/Create/Delete/navigation/calendar/time/modal/form path end-to-end. A green syntax check is insufficient.

## Stages
1. Factual audit
2. Unified UI architecture
3. Functional stabilization
4. UI repair
5. Journal + Timetable full verification
6. Final cross-module regression and clean launch

## Current next action
1. Run the architecture audit and JavaScript checks against code checkpoint `335558ffb9b3df46620a017fcc8c881ebf3da94c`.
2. Fix every remaining audit failure before moving on.
3. Complete owner/variant audit for all required components.
4. Complete Save/Create/Delete end-to-end verification.
5. Verify Calendar/Time Picker/Modal/Bottom Sheet/Dropdown behavior and geometry.
6. Finish desktop/mobile and cross-module regression.
7. Only then declare 100% clean.

## Final definition of done
Only declare 100% when architecture, syntax, deployment, component ownership, action routing, UI consistency, Calendar/Time Picker/Modal/Bottom Sheet/Dropdown, Journal/Timetable independence, desktop/mobile geometry and cross-module regression all pass.

## Chat interruption protocol
Before any forced stop, update this file to the exact latest main code checkpoint, record completed checks, remaining failures and exact next action. The final assistant response must contain a copy-ready handoff matching this file. A progress response is never permission to abandon remaining work.
