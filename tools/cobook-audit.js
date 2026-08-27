const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');

const ROOT = process.cwd();
const SKIP = new Set(['.git', '.github', 'node_modules']);
const sourceFiles = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (/\.(html|js|css|md)$/i.test(name)) sourceFiles.push(full);
  }
}
walk(ROOT);
const rel = f => path.relative(ROOT, f).replaceAll(path.sep, '/');
const read = f => fs.readFileSync(f, 'utf8');
const failures = [], warnings = [], report = [];
const addFail = (rule, file, detail) => failures.push(`${rule} | ${rel(file)} | ${detail}`);
const addWarn = (rule, file, detail) => warnings.push(`${rule} | ${rel(file)} | ${detail}`);

const cssFiles = sourceFiles.filter(f => f.endsWith('.css')).map(rel);
if (cssFiles.length !== 1 || cssFiles[0] !== 'styles.css') addFail('CSS_SOURCE', path.join(ROOT, cssFiles[0] || 'styles.css'), `expected exactly styles.css, found: ${cssFiles.join(', ') || 'none'}`);

const core = sourceFiles.find(f => rel(f) === 'app/shared/core.js');
if (!core) addFail('CORE_MISSING', path.join(ROOT, 'app/shared/core.js'), 'central core.js not found');

for (const file of sourceFiles) {
  const text = read(file), r = rel(file);
  if (r !== 'tools/cobook-audit.js' && (file.endsWith('.html') || file.endsWith('.js'))) {
    if (/\bstyle\s*=\s*["']/i.test(text)) addFail('INLINE_STYLE', file, 'inline style attribute found');
    if (/<style\b/i.test(text)) addFail('STYLE_BLOCK', file, '<style> block found');
  }
  if (file.endsWith('.js') && r !== 'tools/cobook-audit.js') {
    if (/addEventListener\s*\(\s*["']submit["']/i.test(text)) addFail('STANDALONE_SUBMIT', file, 'module owns a submit listener; use central action routing');
    if (/document\.addEventListener\s*\(\s*["']click["']/i.test(text) && !r.endsWith('app/shared/core.js')) addFail('LOCAL_CLICK_ROUTER', file, 'module installs its own document click router');
    if (/document\.addEventListener\s*\(\s*["']change["']/i.test(text) && !r.endsWith('app/shared/core.js')) addFail('LOCAL_CHANGE_ROUTER', file, 'module installs its own document change router');
    // Direct app.innerHTML assignment is allowed only in Core. Module render()
    // functions return markup to Core; helpers must never own the app mount.
    if (/\b(?:app|window\.app)\.innerHTML\s*=/.test(text) && !r.endsWith('app/shared/core.js')) addFail('DIRECT_RENDER_BYPASS', file, 'module writes app.innerHTML directly');
    if (/insertAdjacentHTML\s*\(\s*["']beforeend["']/i.test(text) && !r.endsWith('app/shared/core.js')) addFail('LOCAL_OVERLAY_INSERT', file, 'module inserts overlay markup directly; use CoBook.ui.mountOverlay()');
  }
}

let registeredActions = new Set(['navigate', 'modal-close']);
if (core) {
  const t = read(core);
  if (!/window\.dispatchAction\s*=/.test(t)) addFail('ACTION_CORE', core, 'dispatchAction is not exposed by Core');
  if (!/actionOwners/.test(t)) addFail('ACTION_OWNERS', core, 'actionOwners registry is missing');
  const requiredFactories = ['button','listItem','field','select','textarea','modal','bottomSheet','dropdown','datePicker','timePicker','calendarGrid','mountOverlay'];
  for (const name of requiredFactories) if (!new RegExp(`CoBook\\.ui\\.${name}\\s*=`).test(t)) addFail('UI_FACTORY', core, `canonical CoBook.ui.${name}() is missing`);
  const ownerBlock = t.match(/const actionOwners=new Map\(\[(.*?)\]\);/s)?.[1] || '';
  for (const m of ownerBlock.matchAll(/\[['"]([^'"]+)['"],['"]([^'"]+)['"\]/g)) registeredActions.add(m[1]);
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
  for (const token of ['ui-button','ui-list','ui-list-item','ui-control','ui-entity-row']) if (!css.includes(`.${token}`)) addFail('UI_TOKEN', styles, `missing canonical token .${token}`);
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

const registryPath = path.join(ROOT, 'UI_COMPONENTS.md');
const requiredRegistryComponents = ['BUTTON','LIST','LIST_ITEM','FOLDER','CARD','FIELD','SELECT','TEXTAREA','MODAL','BOTTOM_SHEET','DROPDOWN','DATE_PICKER','TIME_PICKER','CALENDAR','JOURNAL','TIMETABLE','PROFILE','SERVICE','WORK_MATERIALS','DOCUMENTS','LOYALTY','TAGS','WALLETS','CLIENTS','NAVIGATION','MOBILE_GEOMETRY','TYPOGRAPHY'];
if (!fs.existsSync(registryPath)) addFail('REGISTRY_MISSING', registryPath, 'UI_COMPONENTS.md not found');
else {
  const registry = read(registryPath);
  for (const component of requiredRegistryComponents) if (!new RegExp(`\\b${component}\\b`, 'i').test(registry)) addFail('REGISTRY_COMPONENT', registryPath, `required component ${component} is missing from UI_COMPONENTS.md`);
}

// Handoff continuity check. A documentation-only commit may point to its parent;
// a code commit must point to itself.
const handoffPath = path.join(ROOT, 'COBOOK_HANDOFF.md');
if (fs.existsSync(handoffPath)) {
  const handoff = read(handoffPath);
  let actualSha = process.env.GITHUB_SHA || '';
  if (!actualSha) { try { actualSha = execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(); } catch (_) {} }
  const recordedSha = handoff.match(/(?:Latest actual code checkpoint|Actual code checkpoint before this documentation commit):\s*`([0-9a-f]{40})`/i)?.[1] || '';
  if (actualSha && recordedSha && actualSha !== recordedSha) {
    let parentSha=''; try { parentSha=execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim(); } catch (_) {}
    if (actualSha !== parentSha) addFail('HANDOFF_SYNC', handoffPath, `recorded ${recordedSha}, actual HEAD ${actualSha}`);
  } else if (!recordedSha) addFail('HANDOFF_SYNC', handoffPath, 'code checkpoint is missing');
  if (!/## (?:Exact next action|Current next action)\b[\s\S]*\S/i.test(handoff)) addFail('HANDOFF_NEXT_ACTION', handoffPath, 'next action section is missing or empty');
}

report.push(`Files scanned: ${sourceFiles.length}`);
report.push(`CSS files: ${cssFiles.join(', ') || 'none'}`);
report.push(`Registered actions: ${registeredActions.size}`);
report.push(`Canonical factories: ${core ? 'checked' : 'missing core'}`);
report.push(`Calendar owners: ${journal && timetable ? 'Journal + Timetable' : 'incomplete'}`);
report.push(`UI registry: ${fs.existsSync(registryPath) ? 'present' : 'missing'}`);

console.log('CoBook UI / FUNCTIONAL ARCHITECTURE AUDIT');
console.log('==========================================');
for (const line of report) console.log(`INFO  ${line}`);
if (warnings.length) { console.log('\nWARNINGS'); for (const x of warnings) console.log(`WARN  ${x}`); }
if (failures.length) { console.log('\nFAILURES'); for (const x of failures) console.log(`FAIL  ${x}`); process.exitCode=1; }
else console.log('\nPASS — no violations covered by this static audit.');
