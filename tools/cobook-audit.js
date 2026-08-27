const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SKIP = new Set(['.git', '.github', 'node_modules']);
const sourceFiles = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (/\.(html|js|css)$/i.test(name)) sourceFiles.push(full);
  }
}
walk(ROOT);

const rel = f => path.relative(ROOT, f).replaceAll(path.sep, '/');
const read = f => fs.readFileSync(f, 'utf8');
const failures = [];
const warnings = [];
const report = [];
const addFail = (rule, file, detail) => failures.push(`${rule} | ${rel(file)} | ${detail}`);
const addWarn = (rule, file, detail) => warnings.push(`${rule} | ${rel(file)} | ${detail}`);

const cssFiles = sourceFiles.filter(f => f.endsWith('.css')).map(rel);
if (cssFiles.length !== 1 || cssFiles[0] !== 'styles.css') {
  addFail('CSS_SOURCE', path.join(ROOT, cssFiles[0] || 'styles.css'), `expected exactly styles.css, found: ${cssFiles.join(', ') || 'none'}`);
}

for (const file of sourceFiles) {
  const text = read(file);
  const r = rel(file);
  if (r !== 'tools/cobook-audit.js' && (file.endsWith('.html') || file.endsWith('.js'))) {
    if (/\bstyle\s*=\s*["']/i.test(text)) addFail('INLINE_STYLE', file, 'inline style attribute found');
    if (/<style\b/i.test(text)) addFail('STYLE_BLOCK', file, '<style> block found');
  }
  if (file.endsWith('.js') && r !== 'tools/cobook-audit.js') {
    if (/addEventListener\s*\(\s*["']submit["']/i.test(text)) addFail('STANDALONE_SUBMIT', file, 'module owns a submit listener; migrate to central action routing unless explicitly exempted');
    if (/document\.addEventListener\s*\(\s*["']click["']/i.test(text) && !r.endsWith('app/shared/core.js')) {
      addFail('LOCAL_CLICK_ROUTER', file, 'module installs its own document click router');
    }
    const hasDirectRenderWrite = /\b(?:app|window\.app)\.innerHTML\s*=/.test(text);
    const usesAlternateRegisteredRender = /Object\.defineProperty\(CoBook\.modules\.[^,]+,\s*['"]render['"]/.test(text);
    if (hasDirectRenderWrite && !usesAlternateRegisteredRender && !r.endsWith('app/shared/core.js')) {
      addFail('DIRECT_RENDER_BYPASS', file, 'runtime module path writes app.innerHTML directly instead of using Core render pipeline');
    } else if (hasDirectRenderWrite && usesAlternateRegisteredRender) {
      addWarn('LEGACY_RENDER_CODE', file, 'contains an unused direct-render helper; exported render is registered separately and does not use it');
    }
    if (/insertAdjacentHTML\s*\(\s*["']beforeend["']/i.test(text) && !r.endsWith('app/shared/core.js')) {
      addFail('LOCAL_OVERLAY_INSERT', file, 'module inserts markup directly with insertAdjacentHTML; use the shared UI insertion API');
    }
  }
}

const core = sourceFiles.find(f => rel(f) === 'app/shared/core.js');
let registeredActions = new Set(['navigate', 'modal-close']);
if (!core) addFail('CORE_MISSING', path.join(ROOT, 'app/shared/core.js'), 'central core.js not found');
else {
  const t = read(core);
  if (!/window\.dispatchAction\s*=/.test(t)) addFail('ACTION_CORE', core, 'dispatchAction is not exposed by Core');
  if (!/actionOwners/.test(t)) addFail('ACTION_OWNERS', core, 'actionOwners registry is missing');
  if (!/CoBook\.ui\.listItem/.test(t)) addFail('UI_COMPONENT', core, 'canonical listItem component is missing');
  if (!/CoBook\.ui\.calendarGrid/.test(t)) addFail('UI_COMPONENT', core, 'canonical calendarGrid component is missing');
  if (!/CoBook\.ui\.timePicker/.test(t)) addFail('UI_COMPONENT', core, 'canonical timePicker component is missing');
  const ownerBlock = t.match(/const actionOwners=new Map\(\[(.*?)\]\);/s)?.[1] || '';
  for (const m of ownerBlock.matchAll(/\[['"]([^'"]+)['"],['"]([^'"]+)['"]\]/g)) registeredActions.add(m[1]);
}

const actionFiles = sourceFiles.filter(f => f.endsWith('.js') && rel(f) !== 'app/shared/core.js' && rel(f) !== 'tools/cobook-audit.js');
for (const file of actionFiles) {
  const text = read(file);
  for (const m of text.matchAll(/data-action=["']([^"']+)["']/g)) {
    const action = m[1];
    if (action.includes('${')) continue;
    if (!registeredActions.has(action)) addFail('UNREGISTERED_ACTION', file, `data-action="${action}" has no central action owner`);
  }
}

const styles = path.join(ROOT, 'styles.css');
if (fs.existsSync(styles)) {
  const css = read(styles);
  const required = ['ui-button', 'ui-list', 'ui-list-item', 'ui-control', 'ui-entity-row'];
  for (const token of required) if (!css.includes(`.${token}`)) addFail('UI_TOKEN', styles, `missing canonical token .${token}`);
}

const journal = sourceFiles.find(f => rel(f) === 'app/journal/journal.js');
const timetable = sourceFiles.find(f => rel(f) === 'app/timetable/timetable.js');
if (!journal) addFail('MODULE_MISSING', path.join(ROOT, 'app/journal/journal.js'), 'Journal module missing');
else if (!/CoBook\.ui\.calendarGrid\s*\(/.test(read(journal))) addFail('CALENDAR_OWNER', journal, 'Journal must use canonical calendarGrid()');
if (!timetable) addFail('MODULE_MISSING', path.join(ROOT, 'app/timetable/timetable.js'), 'Timetable module missing');
else {
  const t = read(timetable);
  if (!/CoBook\.ui\.calendarGrid\s*\(/.test(t)) addFail('CALENDAR_OWNER', timetable, 'Timetable must use canonical calendarGrid()');
  if (!/CoBook\.ui\.timePicker\s*\(/.test(t)) addFail('TIME_PICKER_OWNER', timetable, 'Timetable must use canonical timePicker() trigger');
}

const calendarBuilderPattern = /(?:function\s+(?:calendar|monthCalendar|buildCalendar)|(?:const|let)\s+(?:calendar|monthCalendar|buildCalendar)\s*=)/i;
for (const file of actionFiles) {
  const r = rel(file);
  if (r === 'app/journal/journal.js' || r === 'app/timetable/timetable.js') continue;
  if (calendarBuilderPattern.test(read(file))) addFail('LOCAL_CALENDAR_BUILDER', file, 'possible duplicate calendar builder; use CoBook.ui.calendarGrid()');
}

const moduleCssTokens = [];
for (const file of actionFiles) {
  const text = read(file);
  const classes = [...text.matchAll(/class=["']([^"']+)["']/g)].flatMap(m => m[1].split(/\s+/));
  const suspicious = classes.filter(c => /^(button|btn|row|card|list|field|modal|sheet|select|textarea|folder|calendar|picker|dropdown)/i.test(c));
  if (suspicious.length) moduleCssTokens.push({file: rel(file), tokens: [...new Set(suspicious)]});
}

// The handoff is part of the project's continuity contract. It must point at
// the exact commit that is being tested, otherwise a new chat can resume from
// a state that does not match the repository. In CI GITHUB_SHA is authoritative;
// locally we use the checked-out git HEAD when available.
const handoffPath = path.join(ROOT, 'COBOOK_HANDOFF.md');
if (fs.existsSync(handoffPath)) {
  const handoff = read(handoffPath);
  let actualSha = process.env.GITHUB_SHA || '';
  if (!actualSha) {
    try { actualSha = require('child_process').execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim(); } catch (_) {}
  }
  const recordedSha = handoff.match(/Latest actual code checkpoint:\s*`([0-9a-f]{40})`/i)?.[1] || '';
  if (actualSha && recordedSha && actualSha !== recordedSha) {
    addFail('HANDOFF_SYNC', handoffPath, `recorded ${recordedSha}, actual HEAD ${actualSha}`);
  } else if (!recordedSha) {
    addFail('HANDOFF_SYNC', handoffPath, 'Latest actual code checkpoint is missing');
  }
  if (!/## Exact next action\b[\s\S]*\S/i.test(handoff)) addFail('HANDOFF_NEXT_ACTION', handoffPath, 'exact next action section is missing or empty');
}

report.push(`Files scanned: ${sourceFiles.length}`);
report.push(`CSS files: ${cssFiles.join(', ') || 'none'}`);
report.push(`Registered actions: ${registeredActions.size}`);
report.push(`Suspicious module UI tokens: ${moduleCssTokens.length}`);
report.push(`Calendar owners verified: ${journal && timetable ? 'Journal + Timetable' : 'incomplete'}`);
report.push(`Canonical Time Picker trigger verified: ${timetable && /CoBook\.ui\.timePicker\s*\(/.test(read(timetable)) ? 'Timetable' : 'incomplete'}`);

console.log('CoBook UI / FUNCTIONAL ARCHITECTURE AUDIT');
console.log('==========================================');
for (const line of report) console.log(`INFO  ${line}`);
if (warnings.length) {
  console.log('\nWARNINGS');
  for (const x of warnings) console.log(`WARN  ${x}`);
}
if (moduleCssTokens.length) {
  console.log('\nMODULE UI TOKENS (review against UI_COMPONENTS.md)');
  for (const x of moduleCssTokens) console.log(`INFO  ${x.file}: ${x.tokens.join(', ')}`);
}
if (failures.length) {
  console.log('\nFAILURES');
  for (const x of failures) console.log(`FAIL  ${x}`);
  process.exitCode = 1;
} else {
  console.log('\nPASS — no violations covered by this static audit.');
}
