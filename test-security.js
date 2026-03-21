const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const checks = [
  {
    name: 'ReDoS fix: escapeRegex function defined',
    pass: /function escapeRegex\(/.test(content)
  },
  {
    name: 'ReDoS fix: escapeRegex used in grep command',
    pass: /escapeRegex\(escapeHtml\(pat\)\)/.test(content)
  },
  {
    name: 'XSS fix: highlightSyntax uses function replacement for URLs',
    pass: /https\?:\/\/\[\\s<>"]\+.*function\(match\)/.test(content) || /function\(match\).*syn-link/.test(content)
  },
  {
    name: 'Accessibility: aria-live on output div',
    pass: /id="output"[^>]*aria-live/.test(content) || /aria-live[^>]*id="output"/.test(content)
  },
  {
    name: 'Accessibility: role="log" on output div',
    pass: /id="output"[^>]*role="log"/.test(content) || /role="log"[^>]*id="output"/.test(content)
  },
  {
    name: 'Accessibility: aria-label on cmd-input',
    pass: /id="cmd-input"[^>]*aria-label/.test(content) || /aria-label[^>]*id="cmd-input"/.test(content)
  },
  {
    name: 'Accessibility: role="dialog" on cookie-overlay',
    pass: /id="cookie-overlay"[^>]*role="dialog"/.test(content) || /role="dialog"[^>]*id="cookie-overlay"/.test(content)
  },
  {
    name: 'Accessibility: aria-modal on cookie-overlay',
    pass: /id="cookie-overlay"[^>]*aria-modal/.test(content) || /aria-modal[^>]*id="cookie-overlay"/.test(content)
  },
  {
    name: 'Security: rel="noopener noreferrer" present on target="_blank" links',
    pass: /rel="noopener noreferrer"/.test(content)
  },
  {
    name: 'Security: no bare target="_blank" without rel (in static HTML)',
    pass: !/<a [^>]*target="_blank"(?![^>]*rel=)[^>]*>/.test(content)
  },
  {
    name: 'Accessibility: skip link present',
    pass: /href="#main-content"[^>]*skip-link/.test(content) || /class="skip-link"/.test(content)
  },
  {
    name: 'Accessibility: lang="en" on terminal section',
    pass: /class="terminal"[^>]*lang="en"/.test(content) || /lang="en"[^>]*class="terminal"/.test(content)
  },
];

let passed = 0;
let failed = 0;

console.log('\n=== Security & Accessibility Test Results ===\n');
for (const check of checks) {
  const status = check.pass ? 'PASS' : 'FAIL';
  if (check.pass) passed++; else failed++;
  console.log(`[${status}] ${check.name}`);
}

console.log(`\nTotal: ${passed} passed, ${failed} failed out of ${checks.length} checks`);
process.exit(failed > 0 ? 1 : 0);
