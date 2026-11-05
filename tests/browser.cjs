const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.SITE_URL || 'http://127.0.0.1:8765/';
const out = process.env.TEST_OUTPUT || '/tmp/cas-iteration';
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({args:['--no-sandbox']});
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [], requests = [], results = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => requests.push({url:r.url(),method:r.method(),data:r.postData()}));
    page.on('response', r => { if (r.status() >= 400) errors.push(r.status()+' '+r.url()); });
    for (const filename of ['', 'accessibility.html', 'image-briefs.html']) {
      for (const width of [1440,768,390,320]) {
        await page.setViewportSize({width,height:1000});
        const response = await page.goto(base+filename);
        assert.equal(response.status(),200);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false,filename+' overflow at '+width);
        assert.equal(await page.locator('img').evaluateAll(es => es.some(e => !e.complete || !e.naturalWidth)),false,'broken image');
        const scan = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        const violations = scan.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));
        results.push({filename,width,violations});
        if (!filename && (width === 1440 || width === 390)) {
          await page.screenshot({path:path.join(out,width+'-full.png'),fullPage:true});
          await page.screenshot({path:path.join(out,width+'-hero.png')});
        }
        assert.equal(violations.length,0,JSON.stringify(results.at(-1)));
      }
    }
    await page.goto(base);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip').evaluate(e=>e === document.activeElement),true,'skip link first');
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash,'#main');
    assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1)))),[],'broken anchors');
    await page.locator('#notepad-tools > summary').click();
    await page.locator('#review-note > summary').click();
    await page.locator('button[type=submit]').click();
    assert.equal(await page.locator('#wish').getAttribute('aria-invalid'),'true','empty input validation');
    const before=requests.length;
    for (const [example, expected] of [['lighting','turn the light'],['doorway','doorway'],['reach','favourite mug']]) {
      await page.locator(`.example-controls [data-example="${example}"]`).click();
      assert.equal(await page.locator(`.example-controls [data-example="${example}"]`).getAttribute('aria-pressed'),'true');
      assert.ok((await page.locator('#example-question').textContent()).includes(expected));
      assert.equal(await page.locator('.example-controls [data-example][aria-pressed="true"]').count(),1);
      assert.equal(await page.locator('[data-scene]:not([hidden])').count(),1);
    }
    await page.locator('#use-example').click();
    assert.ok((await page.locator('#wish').inputValue()).includes('mugs'));
    await page.locator('#wish').fill('Reach my tea cupboard — browser test');
    await page.locator('.example-controls [data-example="lighting"]').click();
    const originalQuestion = await page.locator('#questions').inputValue();
    await page.locator('#use-example').click();
    assert.equal(await page.locator('#wish').inputValue(),'Reach my tea cupboard — browser test','import must not mutate existing writing before confirmation');
    assert.equal(await page.locator('#questions').inputValue(),originalQuestion,'import must not silently attach unrelated questions');
    await page.locator('#cancel-example').click();
    assert.equal(await page.locator('#questions').inputValue(),originalQuestion);
    await page.locator('#use-example').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#wish').inputValue(),'Reach my tea cupboard — browser test');
    await page.locator('#use-example').click();
    await page.locator('#replace-example').click();
    assert.notEqual(await page.locator('#questions').inputValue(),originalQuestion,'confirmed replacement must change example questions');
    assert.ok((await page.locator('#questions').inputValue()).trim().length>0,'example must include editable reflection questions');
    assert.ok((await page.locator('#people').inputValue()).trim().length>0,'example must include editable possible support');
    assert.ok((await page.locator('#wish').inputValue()).includes('light'));
    await page.locator('#wish').fill('Reach my tea cupboard — browser test');
    await page.locator('#questions').fill('Could a lower shelf work?');
    await page.locator('#people').fill('Cabinetmaker');
    assert.equal(await page.locator('#preview-question').innerText(),'Could a lower shelf work?');
    await context.grantPermissions(['clipboard-read','clipboard-write']);
    await page.locator('#copy-note').click();
    assert.ok((await page.evaluate(()=>navigator.clipboard.readText())).includes('Reach my tea cupboard — browser test'));
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:undefined,configurable:true}));
    await page.locator('#copy-note').click();
    assert.ok((await page.locator('#note-status').innerText()).includes('couldn’t copy'),'clipboard failure must explain download fallback');
    await page.locator('#important').fill('Keep my favourite cups. No app.');
    const [download] = await Promise.all([page.waitForEvent('download'),page.locator('button[type=submit]').click()]);
    const destination=path.join(out,'note.txt');
    await download.saveAs(destination);
    const note=fs.readFileSync(destination,'utf8');
    assert.ok(note.includes('Reach my tea cupboard — browser test'));
    assert.ok(note.includes('Keep my favourite cups. No app.'));
    assert.ok(note.includes('Could a lower shelf work?'));
    assert.ok(note.includes('Cabinetmaker'));
    await page.evaluate(()=>{ window.print=()=>{window.printInvoked=true;}; });
    await page.locator('#print-note').click();
    assert.equal(await page.evaluate(()=>window.printInvoked),true,'print control must open print flow');
    await page.emulateMedia({media:'print'});
    assert.equal(await page.locator('.header').isVisible(),false,'print must exclude website navigation');
    assert.equal(await page.locator('#preview-wish').isVisible(),true,'print must include the actual note');
    await page.pdf({path:path.join(out,'conversation-sheet.pdf'),format:'A4',printBackground:true});
    await page.emulateMedia({media:'screen'});
    assert.equal(requests.length,before,'typing and saving notes must not transmit requests');
    assert.equal(requests.filter(r=>!r.url.startsWith(base)).length,0,'no third party requests');
    assert.deepEqual(errors,[],'browser or HTTP errors');
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
    // Exercise the wider-needs example and optional note through visible controls
    // on desktop and narrow mobile, not only the default 320px pass above.
    for (const width of [1440,390,320]) {
      await page.setViewportSize({width,height:1000});
      await page.goto(base);
      assert.equal(await page.locator('#notepad-tools').getAttribute('open'),null,'note must remain optional on first visit');
      await page.locator('.example-controls [data-example="doorway"]').click();
      await page.locator('#connection').screenshot({path:path.join(out,width+'-door-overview.png')});
      if (!(await page.locator('#example-details').evaluate(e=>e.open))) await page.locator('#example-details > summary').click();
      const causes=await page.locator('#clarify').innerText();
      assert.match(causes,/grip/i); assert.match(causes,/force/i); assert.match(causes,/walker/i);
      const related=await page.locator('#product-copy').innerText();
      assert.match(related,/windows/i); assert.match(related,/fridge/i); assert.match(related,/cabinet/i);
      assert.match(await page.locator('#revisit').innerText(),/change|varies|different/i);
      await page.locator('#use-example').click();
      assert.ok(await page.locator('#wish').isVisible(),'import must open optional note');
      assert.match(await page.locator('#wish').inputValue(),/doorway/);
      const preserved=await page.locator('#wish').inputValue();
      await page.locator('.example-controls [data-example="lighting"]').click();
      assert.equal(await page.locator('#wish').inputValue(),preserved,'browsing must not edit the note');
      await page.locator('#use-example').click();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#use-example').evaluate(e=>e===document.activeElement),true,'cancel restores focus');
      assert.equal(await page.locator('#wish').inputValue(),preserved);
    }
    const nojs=await browser.newContext({javaScriptEnabled:false});
    const nojsPage=await nojs.newPage();
    await nojsPage.goto(base);
    await nojsPage.locator('#notepad-tools > summary').click();
    await nojsPage.locator('#review-note > summary').click();
    assert.equal(await nojsPage.locator('button[type=submit]').isDisabled(),true,'no-JS note must not submit');
    assert.equal(await nojsPage.locator('noscript').isVisible(),true);
    fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors,note,passed:true},null,2));
    console.log(JSON.stringify({base,checks:results,interactions:'skip link, anchors, validation, real download, no note transmission, no third parties, reduced motion, no-JS safe',passed:true},null,2));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
