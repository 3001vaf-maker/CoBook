# CoBook — COBOOK HANDOFF

## Current control point
- Repository: `3001vaf-maker/CoBook`
- Branch: `main`
- Actual code checkpoint before this documentation commit: `09eb8510748ec37934480be3e2b83196300bbbad`
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
- Architecture audit exists and checks CSS source, inline styles, style blocks, local routers, standalone submit, direct render bypass, local overlay insertion, action registration, canonical Calendar/Time Picker ownership and handoff continuity.
- The audit now also verifies that every required component exists in `UI_COMPONENTS.md` and has a structured registry row for core components.
- Do not treat static-audit PASS as proof of visual or functional 100%; those require owner/variant and end-to-end regression checks.

## Completed stabilization
- single `styles.css` remains the intended CSS source;
- central Core action ownership/dispatch;
- Tags and Wallets use canonical list-item pattern;
- Profile/Work/Recipe save paths moved toward Core;
- Loyalty local routing moved toward Core;
- Loyalty legacy render bypass removed;
- shared overlay mount;
- Journal uses central render pipeline;
- Journal and Timetable use shared calendar grid while retaining independent behavior;
- architecture audit and continuity handoff exist;
- audit workflow handles handoff-only documentation commits without creating a false circular failure;
- component registry completeness is now an enforced audit rule.

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
1. Verify CI for commit `09eb8510748ec37934480be3e2b83196300bbbad`.
2. Review Timetable calendar-specific tokens against the canonical Calendar registry.
3. Continue owner/variant audit for every required component.
4. Continue end-to-end Save/Create/Delete verification.
5. Verify Calendar/Time Picker/Modal/Bottom Sheet/Dropdown behavior and geometry.
6. Finish desktop/mobile and cross-module regression.
7. Only then declare 100% clean.

## Final definition of done
Only declare 100% when architecture, syntax, deployment, component ownership, action routing, UI consistency, Calendar/Time Picker/Modal/Bottom Sheet/Dropdown, Journal/Timetable independence, desktop/mobile geometry and cross-module regression all pass.

## Chat interruption protocol
Before any forced stop, update this file to the exact latest main code checkpoint, record completed checks, remaining failures and exact next action. The final assistant response must contain a copy-ready handoff matching this file. A progress response is never permission to abandon remaining work.
