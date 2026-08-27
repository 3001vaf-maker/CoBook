# CoBook — UI COMPONENT REGISTRY

## Purpose
Permanent map of canonical UI components, variants, owners and shared factories. This file is part of the project's continuity contract.

## Sources of truth
- `PROJECT_STATE.md` — architecture/protocol
- `DESIGN_SYSTEM.md` — visual rules
- `UI_CONTEXT.md` — screens/contexts
- `UI_COMPONENTS.md` — component ownership/variants
- `COBOOK_HANDOFF.md` — current continuation state

## Core rule
```text
MODULE
  ↓
data + state + action
  ↓
CANONICAL UI COMPONENT
  ↓
styles.css
```

No module may create a competing visual system. A legitimate difference is an explicit variant or module-supplied data/state/action, not a duplicate component.

## Canonical shared factories
Implemented in `app/shared/core.js`:

| Component | Factory | Purpose |
|---|---|---|
| BUTTON | `CoBook.ui.button()` | canonical button markup/variant entry point |
| LIST_ITEM | `CoBook.ui.listItem()` | canonical entity/list item geometry |
| FIELD | `CoBook.ui.field()` | canonical labelled input |
| SELECT | `CoBook.ui.select()` | canonical labelled native select |
| TEXTAREA | `CoBook.ui.textarea()` | canonical labelled textarea |
| MODAL | `CoBook.ui.modal()` | canonical overlay/modal shell |
| BOTTOM_SHEET | `CoBook.ui.bottomSheet()` | canonical bottom-sheet shell |
| DROPDOWN | `CoBook.ui.dropdown()` | canonical dropdown shell |
| DATE_PICKER | `CoBook.ui.datePicker()` | canonical date trigger |
| TIME_PICKER | `CoBook.ui.timePicker()` | canonical time trigger |
| CALENDAR | `CoBook.ui.calendarGrid()` | canonical calendar grid/formation |
| OVERLAY MOUNT | `CoBook.ui.mountOverlay()` | canonical overlay insertion point |

These factories are the architectural target. Existing module markup is migrated to them during the UI-architecture stage; existence of a factory alone does not mean every owner has already migrated.

## Required components

| Component | Canonical source | Current state |
|---|---|---|
| BUTTON | Core factory + `styles.css` | IMPLEMENTED / MIGRATION AUDIT |
| LIST | Core/list CSS contract | IMPLEMENTED / MIGRATION AUDIT |
| LIST_ITEM | `CoBook.ui.listItem()` | IMPLEMENTED / MIGRATION AUDIT |
| FOLDER | shared CSS contract | REGISTERED / MIGRATION AUDIT |
| CARD | shared CSS contract | REGISTERED / MIGRATION AUDIT |
| FIELD | `CoBook.ui.field()` | IMPLEMENTED / MIGRATION AUDIT |
| SELECT | `CoBook.ui.select()` | IMPLEMENTED / MIGRATION AUDIT |
| TEXTAREA | `CoBook.ui.textarea()` | IMPLEMENTED / MIGRATION AUDIT |
| MODAL | `CoBook.ui.modal()` | IMPLEMENTED / MIGRATION AUDIT |
| BOTTOM_SHEET | `CoBook.ui.bottomSheet()` | IMPLEMENTED / MIGRATION AUDIT |
| DROPDOWN | `CoBook.ui.dropdown()` | IMPLEMENTED / MIGRATION AUDIT |
| DATE_PICKER | `CoBook.ui.datePicker()` | IMPLEMENTED / MIGRATION AUDIT |
| TIME_PICKER | `CoBook.ui.timePicker()` | IMPLEMENTED / MIGRATION AUDIT |
| CALENDAR | `CoBook.ui.calendarGrid()` | IMPLEMENTED / OWNER AUDIT |
| JOURNAL | Journal module | OWNER AUDIT |
| TIMETABLE | Timetable module | OWNER AUDIT |
| PROFILE | Settings/Profile | OWNER AUDIT |
| SERVICE | Settings/Service | OWNER AUDIT |
| WORK_MATERIALS | Settings/Work | OWNER AUDIT |
| DOCUMENTS | Settings/Documents | OWNER AUDIT |
| LOYALTY | Settings/Loyalty | OWNER AUDIT |
| TAGS | Settings/Tags | OWNER AUDIT |
| WALLETS | Settings/Wallets | OWNER AUDIT |
| CLIENTS | Main/Clients | OWNER AUDIT |
| NAVIGATION | Core bottom navigation | OWNER AUDIT |
| MOBILE_GEOMETRY | Core + `styles.css` | REGISTERED / AUDIT |
| TYPOGRAPHY | `styles.css` | REGISTERED / AUDIT |

Additional cross-cutting components: EMPTY_STATE, PAGE_HEADER, ICON, SPACING, RADIUS, COLOR, INTERACTION_STATE.

## Calendar rule
There is exactly one canonical calendar grid/formation algorithm:

```text
                 CALENDAR GRID
                /             \
           JOURNAL          TIMETABLE
           own data         own data
           own state        own state
           own actions      own actions
```

Journal and Timetable MUST NOT be merged functionally. They share only the calendar grid/formation layer. A module supplies its own day renderer/state/action semantics.

## Time Picker rule
`CoBook.ui.timePicker()` is the canonical trigger. The current functional owner is Timetable. If another owner appears, it must use the canonical component or an explicitly registered variant; no copied picker implementation.

## Overlay rule
Modal and Bottom Sheet are separate registered variants. Their positioning and geometry belong to the shared UI layer. Modules provide content and behavior. Overlay insertion belongs to `CoBook.ui.mountOverlay()`.

## Action rule
All important actions follow:

```text
UI
 ↓
data-action
 ↓
Core dispatchAction
 ↓
registered owner
 ↓
handle / handleChange
 ↓
validation
 ↓
state/storage
 ↓
window.render()
```

No module-level document click/change/submit router. No direct application mount from a module.

## Change-impact rule
Before changing a shared component:
1. identify canonical factory/source;
2. identify variants;
3. identify all owners/usages;
4. identify action ownership;
5. identify CSS source;
6. change the primary source;
7. run architecture/syntax checks;
8. verify affected owners on desktop/mobile;
9. verify affected functional actions.

The goal is that a future request such as “replace the time wheel everywhere” has a known component owner and impact list rather than requiring manual discovery screen by screen.

## Migration status
The registry is intentionally not marked 100% complete yet. A component is `IMPLEMENTED` when its canonical source exists; it becomes `VERIFIED` only after all relevant owners have been audited and migrated and its desktop/mobile behavior has passed regression checks.
