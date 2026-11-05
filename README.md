# Custom Access Studios

Static concept website for Emily's accessibility guidance and coordination studio. **Public design preview, not accepting inquiries.** Business scope, service area, credentials and public contact details remain unconfirmed.

## Preview and test

No build step or runtime dependencies. Serve locally:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Development-only browser checks:

```sh
npm ci
npx playwright install chromium
npm test
```

`SITE_URL` overrides the local URL (include trailing slash). `TEST_OUTPUT` overrides `/tmp/cas-iteration`. Tests exercise three pages at 1440, 768, 390 and 320 pixels; check horizontal reflow and axe rules; verify skip navigation, anchors, example selection, preservation of user writing, clipboard success/failure, real downloads, no third-party requests, no note transmission, reduced motion and safe no-JavaScript behavior. Automated checks are not accessibility certification or a substitute for screen-reader/real-device/user testing.

## Files

- `index.html`: interactive everyday connection examples, Emily's role, local-only four-field conversation sheet with explicit replacement confirmation, preview/copy/download/print.
- `styles.css`, `script.js`: responsive presentation and progressive enhancement.
- `accessibility.html`: accessibility, privacy and preview limitations.
- `image-briefs.html`: optional Gemini prompts and honest image-use guidance.
- `BRIEF.md`: positioning and constraints.
- `REVIEW.md`: independent design review record; judgments separate from launch readiness.
- `tests/browser.cjs`: repeatable browser checks, screenshots and JSON results.

## Publication

GitHub Pages, main branch root. No custom domain configured. `noindex,nofollow` remains until launch approval; this does not make the site private. Previous iterations are retained in Git history.

## Before launch

Confirm business scope and Emily's preferred bio; add verified service area/contact; choose an inquiry delivery method and privacy handling; obtain consent for authentic portraits or case studies; verify screen-reader and real-device usability; remove preview labels/noindex only after approval. No engineering, clinical, licensing or accessibility compliance claims are made.

## Assets and privacy

The current homepage uses original schematic illustrations, not client photographs or technical installation diagrams. These examples illustrate questions to explore, not assessed solutions.

Earlier iteration atmosphere reference, retained in assets but not displayed on the homepage: https://images.unsplash.com/photo-1600210492486-724fe5c67fb0 . License: https://unsplash.com/license . It is not an accessibility specification, client project, or endorsement.

Self-hosted typography: Instrument Serif and DM Sans. No analytics, cookies or form backend. Note contents are not transmitted or retained in localStorage. Clipboard writes and downloads happen only when the visitor chooses them; browser form restoration remains outside the site's control.
