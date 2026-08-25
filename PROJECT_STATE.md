# PROJECT STATE

## Current branch
main

## UI rule — Settings / Service / Documents / Loyalty
These modules share one visual system based on the global CoBook tokens in `styles.css`:
- `--mocha-dark`
- `--mocha-medium`
- `--mocha-border`
- `--cashmere`

Cards use the same border language, radius family, spacing and typography. Section-level `Назад` controls use the same dark primary treatment: full width, 48px height, 14px radius, consistent border and font weight.

Service, Documents and Loyalty keep their own functional modules, but must not invent a separate visual language for equivalent controls.

## Loyalty architecture
Loyalty has one owner: `loyalty-ui.js`. Do not create separate loyalty navigation/fix modules and do not render Loyalty screens from `app.js`.

Sections:
- Программы
- Сертификаты
- Абонементы
- Реферальная программа
- Личный счёт
- Депозиты

## Deposits
Deposit functionality is owned by `loyalty-ui.js`.
A deposit program contains:
- name
- fixed prepaid amount
- discount percentage
- start date
- end date

A deposit is not a personal account and is not a recurring top-up mechanism. Unused balance expires according to the program's end date.

## Preservation rule
A visual/style change must not remove or replace existing module functionality. After UI changes, JavaScript syntax validation and the published GitHub Pages deployment must both pass before reporting the task as complete.
