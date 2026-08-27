# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Actual code checkpoint before this documentation commit: `3ffb8eae91e43d172e3d8ba68e4fff1b78adb42e`
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

## Automated audit state
On code checkpoint `3ffb...`, GitHub Actions reported:
- deploy: SUCCESS
- syntax: SUCCESS
- audit: FAILED only on HANDOFF_SYNC because the handoff recorded `d5c7...` while actual HEAD was `3ffb...`.
The audit log also reported one warning: unused legacy render helper in `app/settings/loyalty/loyalty.js`, and one review target in Timetable for `calendar-day`, `calendar-hours`, `calendar-panel`, `calendar-grid`.

The handoff synchronization failure is being corrected first. Do not call the code 100% clean until a new audit on the corrected state passes and the remaining warning/review target have been resolved or explicitly verified as intentional.

## Completed stabilization
- single `styles.css` remains the intended CSS source;
- central Core action ownership/dispatch;
- Tags and Wallets use canonical list-item pattern;
- Profile/Work/Recipe save paths moved toward Core;
- Loyalty local routing moved toward Core;
- shared overlay mount;
- Journal uses central render pipeline;
- Journal and Timetable use shared calendar grid while retaining independent behavior;
- architecture audit and continuity handoff exist.

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
1. Re-run the architecture audit against the corrected handoff state.
2. Remove/resolve the confirmed unused Loyalty legacy render helper if it is still present.
3. Review Timetable calendar-specific tokens against the canonical Calendar registry.
4. Continue owner/variant and Save/Create/Delete audit.
5. Continue Calendar/Time Picker/Modal/Bottom Sheet/Dropdown verification.
6. Finish desktop/mobile and cross-module regression.
7. Only then declare 100% clean.

## Final definition of done
Only declare 100% when architecture, syntax, deployment, component ownership, action routing, UI consistency, Calendar/Time Picker/Modal/Bottom Sheet/Dropdown, Journal/Timetable independence, desktop/mobile geometry and cross-module regression all pass.

## Chat interruption protocol
Before any forced stop, update this file to the exact latest main checkpoint, record completed checks, remaining failures and exact next action. The final assistant response must contain a copy-ready handoff matching this file. A progress response is never permission to abandon remaining work.
