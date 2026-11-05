# Verification

## Local browser checks
Executed in Chromium through Playwright 1.64.1 with @axe-core/playwright 4.14.0.

- Homepage at 1440, 768, 390, and 320 CSS pixels: no horizontal overflow, no failed images, zero automated WCAG-tagged axe violations.
- Accessibility/privacy and image-brief pages: zero automated axe violations at the tested desktop viewport; responsive overflow checks passed on all three pages at all four widths.
- Browser JavaScript errors and HTTP asset failures: none observed.
- Skip link is the first keyboard target and moves to #main.
- Native details/summary examples open with click and keyboard Enter.
- Empty starting-note validation is announced and focuses the field.
- Note download produced a real text file containing the entered test values and an explicit notice that nothing was sent to the studio.
- Download control is disabled when JavaScript is unavailable; a noscript explanation is visible.
- Internal anchors resolve; local page links return HTTP 200.
- No third-party requests observed; fonts and imagery are self-hosted.
- Reduced-motion emulation sets scrolling to auto rather than smooth.
- Desktop and mobile screenshots were visually inspected.

## Limitations
These checks do not certify accessibility compliance. Manual screen-reader and real-device testing, full browser zoom/text-resize testing, and user testing remain before launch. A supplementary CSS `zoom: 2` experiment caused overflow at a 720px viewport; it was not treated as a passing test or as equivalent to browser zoom (CSS zoom does not change media-query breakpoints). Standard responsive reflow tests passed.

## Source check
`node --check script.js` passes. `git diff --cached --check` passes for authored source; downloaded font license originals have upstream trailing whitespace/CRLF and were retained unchanged.

## Live-site checks

The same two browser harnesses passed against https://secondkeith.github.io/custom-access-studios/ after the initial successful GitHub Pages deployment. The live version served the correct pages, local font/image assets, working note download, and no external runtime requests.

## Test tooling
Temporary harnesses used: `/tmp/cas-browser-check/check.cjs` and `/tmp/cas-browser-check/extra.cjs`. `SITE_URL` selects the target, defaulting to the local preview. The tools are development-only and not runtime dependencies.
