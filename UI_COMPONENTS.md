# CoBook — UI COMPONENT REGISTRY

## Назначение

Этот файл является постоянным реестром визуальных компонентов CoBook и картой их использования.
Он не заменяет `DESIGN_SYSTEM.md` и `PROJECT_STATE.md`.

`PROJECT_STATE.md` = архитектура и протокол работы.
`DESIGN_SYSTEM.md` = правила визуального слоя.
`UI_CONTEXT.md` = адресация экранов и контекстов.
`UI_COMPONENTS.md` = какие компоненты существуют, какие у них варианты и где они используются.

Следующий чат обязан продолжать работу с этого файла и не восстанавливать карту UI по памяти.

---

## 1. ГЛАВНЫЙ ПРИНЦИП

```text
MODULE
  ↓
данные + состояние + действие
  ↓
UI COMPONENT
  ↓
styles.css
```

MODULE не создаёт собственную визуальную систему.

Одинаковая функция/форма должна использовать один компонент или один зарегистрированный variant.

Новый визуальный компонент разрешён только после проверки, что существующий компонент не подходит.

---

## 2. БАЗОВЫЕ КОМПОНЕНТЫ

| Компонент | Варианты | Состояние реестра |
|---|---|---|
| BUTTON | primary / secondary / danger / back / action / home-tile | IN AUDIT |
| LIST | standard / button-list / card-list | IN AUDIT |
| LIST_ITEM | standard / actionable / static | IN AUDIT |
| FOLDER | management / profile / special | IN AUDIT |
| CARD | standard / entity / summary | IN AUDIT |
| FIELD | text / number / date / file | IN AUDIT |
| SELECT | native / custom popup | IN AUDIT |
| TEXTAREA | standard | IN AUDIT |
| MODAL | centered / confirmation / editor | IN AUDIT |
| BOTTOM_SHEET | standard | IN AUDIT |
| DROPDOWN | standard | IN AUDIT |
| DATE_PICKER | standard | IN AUDIT |
| TIME_PICKER | standard | IN AUDIT |
| CALENDAR | base / journal / timetable | IN AUDIT |
| EMPTY_STATE | standard | IN AUDIT |
| PAGE_HEADER | standard | IN AUDIT |
| NAVIGATION | bottom | IN AUDIT |
| TYPOGRAPHY | title / body / label / caption / value | IN AUDIT |

---

## 3. ПРЕДМЕТНЫЕ КОМПОНЕНТЫ

| Component | Owner / context | Status |
|---|---|---|
| JOURNAL | JOURNAL | IN AUDIT |
| SCHEDULE | TIMETABLE | IN AUDIT |
| PROFILE | SETTINGS → PROFILE | IN AUDIT |
| SERVICE | SETTINGS → SERVICE | IN AUDIT |
| WORK_MATERIALS | SETTINGS → WORK | IN AUDIT |
| DOCUMENTS | SETTINGS → DOCUMENTS | IN AUDIT |
| LOYALTY | SETTINGS → LOYALTY | IN AUDIT |
| TAGS | SETTINGS → TAGS | IN AUDIT |
| WALLETS | SETTINGS → WALLETS | IN AUDIT |
| CLIENTS | MAINE → CLIENTS | IN AUDIT |
| HOME | MAINE | SPECIAL SCREEN |

Предметный компонент не означает отдельную дизайн-систему. Его внутренние UI-элементы должны использовать базовые компоненты выше.

---

## 4. КАЛЕНДАРИ

Уже зафиксированы разные функциональные владельцы:

```text
SCHEDULE → CALENDAR
JOURNAL  → MONTH_CALENDAR
MODAL    → DATE_PICKER
```

Это разные функциональные контексты, но общий визуальный каркас должен быть централизован.

Изменение общего календарного каркаса требует проверки всех владельцев.

Изменение поведения одного календаря не должно менять другой.

Источник адресации: `UI_CONTEXT.md`.

---

## 5. TIME_PICKER

Текущий фактический владелец: `app/timetable/timetable.js`.

Текущая реализация использует wheel-style picker с часами и минутами.

Это пока считается фактической реализацией, а не окончательным утверждённым дизайном.

Если в будущем меняется механизм выбора времени, сначала определить всех владельцев TIME_PICKER по проекту, затем заменить общий компонент либо зарегистрировать отдельные variants.

Нельзя копировать новый picker в каждый MODULE.

---

## 6. ФАКТИЧЕСКИЕ РАСХОЖДЕНИЯ, НАЙДЕННЫЕ В НАЧАЛЬНОМ АУДИТЕ

База аудита:
`f55133513f1e514cc205f463312d7a8971998ea2`

### TAGS

`app/settings/tags/tags.js` самостоятельно формирует строку ярлыка:

```text
service-row + tags-row
```

и содержит inline CSS-переменную:

```text
style="--tag-color:..."
```

Это нарушение принципа единого визуального источника и должно быть устранено архитектурно, а не дополнительным override.

### WALLETS

`app/settings/wallets/wallets.js` самостоятельно формирует `wallet-row` и собственную внутреннюю структуру:

```text
wallet-icon
text block
wallet-delete
```

Необходимо определить, является ли это зарегистрированным variant `LIST_ITEM` или должен быть приведён к существующему общему компоненту.

### PROFILE

`app/settings/profile/profile.js` содержит формы, сохранение которых обрабатывается отдельным `document.addEventListener('submit', ...)`, а не центральным `data-action → core.js → owner` маршрутом.

Это функциональное архитектурное исключение и требует отдельной проверки.

### WORK

`app/settings/work/work.js` также использует отдельные `submit`-обработчики для material-form и recipe-form.

Это требует проверки против правила центральной маршрутизации действий.

### SERVICE

`app/settings/service/service.js` использует `data-action="save-service"`, то есть уже соответствует центральной модели действий лучше, чем PROFILE/WORK.

---

## 7. ПРАВИЛО ДЛЯ «СОХРАНИТЬ»

Любая кнопка сохранения должна иметь проверяемую цепочку:

```text
Сохранить
  ↓
action
  ↓
core.js
  ↓
owner MODULE
  ↓
handle
  ↓
validation
  ↓
state / localStorage
  ↓
render
  ↓
результат
```

`submit`-обработчик, существующий вне этой модели, считается архитектурным исключением и должен быть либо обоснован, либо переведён в центральную систему.

---

## 8. ПРАВИЛО ИЗМЕНЕНИЯ КОМПОНЕНТА

Перед изменением:

```text
1. Найти компонент.
2. Найти все его variants.
3. Найти всех владельцев.
4. Найти источник HTML/DOM.
5. Найти источник действия.
6. Найти источник CSS.
7. Определить область влияния.
8. Изменить первичный источник.
9. Проверить всех владельцев.
10. Проверить desktop + mobile.
11. Проверить функциональность затронутых действий.
```

---

## 9. НОВЫЙ КОМПОНЕНТ

Перед созданием нового UI:

```text
EXISTS?
  ↓ yes → использовать
  ↓ no
VARIANT EXISTS?
  ↓ yes → использовать variant
  ↓ no
действительно нужен новый компонент?
  ↓ yes
зарегистрировать здесь
  ↓
добавить визуальные правила в styles.css
```

Нельзя создавать новый компонент только для того, чтобы быстро исправить один экран.

---

## 10. HANDOFF / ПЕРЕДАЧА МЕЖДУ ЧАТАМИ

Текущая рабочая база:

```text
repository: 3001vaf-maker/CoBook
base commit: f55133513f1e514cc205f463312d7a8971998ea2
```

Текущий этап:

```text
1 / 6 — ФАКТИЧЕСКИЙ АУДИТ
```

Уже проверено:

```text
✓ PROJECT_STATE.md
✓ DESIGN_SYSTEM.md
✓ UI_CONTEXT.md
✓ дерево проекта
✓ index.html
✓ core.js
✓ journal.js
✓ timetable.js
✓ settings.js
✓ profile.js
✓ service.js
✓ work.js
✓ documents.js
✓ tags.js
✓ wallets.js
✓ maine.js (начальная проверка)
✓ отсутствие отдельных CSS-файлов по дереву текущей базы
```

Уже подтверждено:

```text
✓ один styles.css подключён из index.html
✓ core.js содержит единый render и центральный click/action dispatcher
✓ существующая документация уже запрещает локальные CSS и обходы Core
```

Не завершено:

```text
□ полный аудит всех JS-модулей и всех действий
□ полный реестр фактических CSS-компонентов
□ все владельцы каждого общего компонента
□ полный аудит Журнал / График
□ проверка всех Save/Create/Delete
□ проверка мобильных вариантов
□ устранение найденных исключений
□ финальный cross-module audit
```

### Следующий этап

```text
2 / 6 — ЕДИНАЯ UI-АРХИТЕКТУРА
```

Следующий чат НЕ должен начинать с объяснения проекта пользователю.
Он должен:

1. открыть `PROJECT_STATE.md`;
2. открыть `DESIGN_SYSTEM.md`;
3. открыть `UI_CONTEXT.md`;
4. открыть `UI_COMPONENTS.md`;
5. продолжить с текущего этапа;
6. не считать этот документ доказательством завершённости — статус `IN AUDIT` означает незавершённую проверку.

Если чат заканчивается до завершения этапа, следующий ответ должен содержать обновлённый блок HANDOFF с фактическим состоянием.

---

## 11. ЗАПРЕТ НА ЛОКАЛЬНЫЕ ИСТИНЫ

Нельзя создавать новую дизайн-систему внутри чата.

Нельзя считать визуально похожими элементы без проверки их технического владельца.

Нельзя считать наличие `ui-button`/`ui-list-item` доказательством архитектурного единства: эти классы могут быть добавлены Core поверх неоднородной разметки.

Цель аудита — сделать архитектуру такой, чтобы единообразие следовало из структуры проекта, а не из автоматического добавления классов.
