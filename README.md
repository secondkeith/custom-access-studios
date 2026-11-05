# Custom Access Studios

Static concept website for Custom Access Studios: customer advocacy, understanding broader accessibility needs, and ongoing partnership as situations change. **Public design preview; services and service inquiries are not open.** The email draft uses info@customaccessstudios.com as a preview contact. Delivery and replies at this address have not yet been confirmed. Business scope, service area and credentials remain unconfirmed. Accessibility can be elegant and beautiful; product choices should reflect personal taste and a home people enjoy sharing, without disparaging medical aids.

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

`SITE_URL` overrides the local URL (include trailing slash). `TEST_OUTPUT` overrides `/tmp/cas-iteration`. Tests exercise the two public pages at 1440, 768, 390 and 320 pixels; check horizontal reflow and axe rules; verify skip navigation, anchors, example selection, preservation of user writing, clipboard success/failure, real downloads, no third-party requests, no note transmission, reduced motion and safe no-JavaScript behavior. Automated checks are not accessibility certification or a substitute for screen-reader/real-device/user testing.

## Files

- `index.html`: customer-facing concept and illustrative everyday situations; optional four-field reflection sheet with local editing, explicit replacement confirmation, preview/copy/download/print and optional email-draft handoff.
- `styles.css`, `script.js`: responsive presentation and progressive enhancement.
- `accessibility.html`: accessibility, privacy and preview limitations.
- `_internal/image-briefs.html`: internal production brief with optional Gemini prompts and honest image-use guidance; excluded from GitHub Pages.
- `_config.yml`: Jekyll exclusions for internal briefs, development files and documentation.
- `BRIEF.md`: positioning and constraints.
- `REVIEW.md`: independent design review record; judgments separate from launch readiness.
- `tests/browser.cjs`: repeatable browser checks, screenshots and JSON results.

## Publication

GitHub Pages, main branch root. No custom domain configured. `noindex,nofollow` remains until launch approval; this does not make the site private. Previous iterations are retained in Git history.

The public site has two pages: `index.html` and `accessibility.html`. Jekyll must remain enabled (do not restore `.nojekyll`): `_config.yml` explicitly excludes `_internal` and production/development documentation. The former `/image-briefs.html` endpoint is removed. A plain local HTTP server does not apply these exclusions and can serve internal files; it is not a publication build. Internal here means excluded from the website, not secret in the source repository. After publication, verify both the old brief URL and `/_internal/image-briefs.html` return 404.

## Before launch

Confirm business scope and Emily's preferred bio; add verified service area/contact; choose an inquiry delivery method and privacy handling; obtain consent for authentic portraits or case studies; verify screen-reader and real-device usability; remove preview labels/noindex only after approval. No engineering, clinical, licensing or accessibility compliance claims are made.

## Assets and privacy

The current homepage uses original schematic illustrations, not client photographs or technical installation diagrams. These examples illustrate questions to explore, not assessed solutions.

Earlier iteration atmosphere reference, retained in assets but not displayed on the homepage: https://images.unsplash.com/photo-1600210492486-724fe5c67fb0 . License: https://unsplash.com/license . It is not an accessibility specification, client project, or endorsement.

Self-hosted typography: Instrument Serif and DM Sans. No analytics, cookies or form backend. Typing does not upload notes; the site does not retain them in localStorage. Clipboard writes, downloads and email-draft handoff happen only when the visitor chooses them; browser form restoration remains outside the site's control.

### Email draft, not delivery

Open email draft validates the first field and uses the same complete `noteText()` as copy/download for all four fields. Subject and body are encoded separately with `encodeURIComponent`. It requests a `mailto:info@customaccessstudios.com` draft with subject “My starting note — Custom Access Studios”; it never automatically sends. A configured mail app is required. Opening the draft shares the note with that app, whose storage/sync/privacy policies apply. The visitor must check the complete draft and decide whether to send; neither draft opening nor delivery is verified.

Mail clients have varying URI limits. The conservative guard blocks an encoded URI longer than **1,800 characters**, opens no draft and focuses Copy text with an explanation. No text is truncated. Copy and paste the full note into a manually addressed email instead (or download if clipboard access fails). Even shorter links are not guaranteed to work in every app. JavaScript-disabled controls remain disabled.

Browser tests click the actual email control and intercept only its final mailto anchor navigation, without opening an app or sending email. They assert empty validation/focus, exact recipient/subject/all-four-field multiline Unicode and special-character body, no injected parameters, honest draft-request status, long-note blocking and complete clipboard fallback, and no-JavaScript safety. Existing download/print checks and eight public page/viewport axe checks remain. Screenshots and the print PDF are written to `TEST_OUTPUT`.
