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
  // The audit source itself contains the literal patterns it searches for; do not audit the scanner as application code.
  if (r !== 'tools/cobook-audit.js' && (file.endsWith('.html') || file.endsWith('.js'))) {
    if (/\bstyle\s*=\s*["']/i.test(text)) addFail('INLINE_STYLE', file, 'inline style attribute found');
    if (/<style\b/i.test(text)) addFail('STYLE_BLOCK', file, '<style> block found');
  }
  if (file.endsWith('.js') && r !== 'tools/cobook-audit.js') {
    if (/addEventListener\s*\(\s*["']submit["']/i.test(text)) addFail('STANDALONE_SUBMIT', file, 'module owns a submit listener; migrate to central action routing unless explicitly exempted');
    if (/document\.addEventListener\s*\(\s*["']click["']/i.test(text) && !r.endsWith('app/shared/core.js')) {
      addFail('LOCAL_CLICK_ROUTER', file, 'module installs its own document click router');
    }
  }
}

const core = sourceFiles.find(f => rel(f) === 'app/shared/core.js');
if (!core) addFail('CORE_MISSING', path.join(ROOT, 'app/shared/core.js'), 'central core.js not found');
else {
  const t = read(core);
  if (!/window\.dispatchAction\s*=/.test(t)) addFail('ACTION_CORE', core, 'dispatchAction is not exposed by Core');
  if (!/actionOwners/.test(t)) addFail('ACTION_OWNERS', core, 'actionOwners registry is missing');
  if (!/CoBook\.ui\.listItem/.test(t)) addFail('UI_COMPONENT', core, 'canonical listItem component is missing');
}

const styles = path.join(ROOT, 'styles.css');
if (fs.existsSync(styles)) {
  const css = read(styles);
  const required = ['ui-button', 'ui-list', 'ui-list-item', 'ui-control', 'ui-entity-row'];
  for (const token of required) if (!css.includes(`.${token}`)) addFail('UI_TOKEN', styles, `missing canonical token .${token}`);
}

const moduleCssTokens = [];
for (const file of sourceFiles.filter(f => f.endsWith('.js') && rel(f) !== 'tools/cobook-audit.js')) {
  const text = read(file);
  const classes = [...text.matchAll(/class=["']([^"']+)["']/g)].flatMap(m => m[1].split(/\s+/));
  const suspicious = classes.filter(c => /^(button|btn|row|card|list|field|modal|sheet|select|textarea|folder|calendar|picker|dropdown)/i.test(c));
  if (suspicious.length) moduleCssTokens.push({file: rel(file), tokens: [...new Set(suspicious)]});
}

report.push(`Files scanned: ${sourceFiles.length}`);
report.push(`CSS files: ${cssFiles.join(', ') || 'none'}`);
report.push(`Suspicious module UI tokens: ${moduleCssTokens.length}`);

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
