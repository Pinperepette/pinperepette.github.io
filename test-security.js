const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const checks = [
  // --- Original checks ---
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

  // --- New security checks ---
  {
    name: 'Security: Content-Security-Policy meta tag present',
    pass: /http-equiv="Content-Security-Policy"/.test(content)
  },
  {
    name: 'Security: CSP includes frame-ancestors to prevent clickjacking',
    pass: /frame-ancestors\s+'none'/.test(content)
  },
  {
    name: 'Security: CSP restricts connect-src to trusted origins',
    pass: /connect-src\s+https:\/\/api\.ipify\.org/.test(content)
  },
  {
    name: 'Security: Referrer-Policy meta tag present',
    pass: /name="referrer"[^>]*content="strict-origin-when-cross-origin"/.test(content) ||
          /content="strict-origin-when-cross-origin"[^>]*name="referrer"/.test(content)
  },
  {
    name: 'Security: maxlength on cmd-input (prevents oversized input)',
    pass: /id="cmd-input"[^>]*maxlength=/.test(content) || /maxlength=[^>]*id="cmd-input"/.test(content)
  },
  {
    name: 'Security: maxlength on cookie-input (prevents oversized input)',
    pass: /id="cookie-input"[^>]*maxlength=/.test(content) || /maxlength=[^>]*id="cookie-input"/.test(content)
  },
  {
    name: 'Security: server-side input length guard in runCommand',
    pass: /raw\.length\s*>\s*500/.test(content)
  },
  {
    name: 'Security: command history capped to prevent memory exhaustion',
    pass: /commandHistory\.length\s*>\s*100/.test(content) && /commandHistory\.shift\(\)/.test(content)
  },

  // --- Additional robustness checks ---
  {
    name: 'Security: no eval() calls (dangerous code execution)',
    pass: !/\beval\s*\(/.test(content)
  },
  {
    name: 'Security: no document.write() calls (XSS vector)',
    pass: !/document\.write\s*\(/.test(content)
  },
  {
    name: 'Security: CSP has default-src self directive',
    pass: /default-src\s+'self'/.test(content)
  },
  {
    name: 'Security: addLine uses textContent (not innerHTML) — safe text output',
    // addLine function body uses textContent, not innerHTML
    pass: /function addLine\([^)]*\)\s*\{[^}]*\.textContent\s*=/.test(content)
  },
  {
    name: 'Security: addAsciiLine uses textContent (not innerHTML) — safe ASCII output',
    pass: /function addAsciiLine\([^)]*\)\s*\{[^}]*\.textContent\s*=/.test(content)
  },
  {
    name: 'Security: highlightSyntax escapes input before processing (XSS prevention)',
    // First thing highlightSyntax does is call escapeHtml on the line
    pass: /function highlightSyntax\([^)]*\)\s*\{\s*let \w+\s*=\s*escapeHtml\(/.test(content)
  },
  {
    name: 'Security: linkify escapes HTML before building anchor tags',
    pass: /function linkify\([^)]*\)\s*\{\s*return escapeHtml\(/.test(content)
  },
  {
    name: 'Security: escapeHtml defined and uses DOM-based encoding (safe implementation)',
    // Must use the DOM to encode (textContent + innerHTML pattern), not a naive string replace
    pass: /function escapeHtml\([^)]*\)\s*\{[^}]*\.textContent\s*=[^}]*\.innerHTML/.test(content)
  },
  {
    name: 'Security: cookie handler uses textContent in addCookieLine (no innerHTML injection)',
    pass: /function addCookieLine\([^)]*\)\s*\{[^}]*\.textContent\s*=/.test(content)
  },
  {
    name: 'Security: CSP img-src allows data URIs but restricts remote image origins',
    // img-src 'self' data: is acceptable; ensures no arbitrary remote image exfil
    pass: /img-src\s+'self'\s+data:/.test(content)
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
