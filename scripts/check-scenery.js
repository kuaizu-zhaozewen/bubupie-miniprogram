const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const bundled = createRequire('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/_.js');
const { chromium } = bundled('playwright');
const out = path.resolve(__dirname, '../../工作成果/详情建议与衣装精修V3.8');
const scenery = require('../utils/scenery');
assert.equal(scenery.isQuanzhou([], true), true);
assert.equal(scenery.isQuanzhou([], false), false);
assert.equal(scenery.isQuanzhou([{ id: 'flower-head' }], false), false);

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 3 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('dialog', dialog => dialog.accept());
    await page.goto('file:///' + path.resolve(__dirname, '../docs/换装交互预览.html').replaceAll('\\', '/') + '?page=character');
    await page.evaluate(() => { localStorage.clear(); demo.page.refresh(); });
    assert.equal(await page.locator('.gucuo-lines').count(), 1, 'first visit previews the launch outfit');
    await page.getByRole('button', { name: '绑定新衣装 ＋', exact: true }).click();
    async function bind(code) {
      await page.getByPlaceholder('或输入衣装绑定码').fill(code);
      await page.getByRole('button', { name: '绑定', exact: true }).click();
    }
    await bind('BUBU-DEMO-SILK-001');
    await bind('BUBU-DEMO-WORK-001');
    await page.getByRole('button', { name: '海丝簪花漫游 首发 · 一键穿戴' }).click();
    assert.equal(await page.locator('.gucuo-lines').count(), 1);
    const styles = await page.locator('.gucuo-lines').evaluate(el => {
      const style = getComputedStyle(el);
      return { opacity: style.opacity, pointerEvents: style.pointerEvents, zIndex: style.zIndex };
    });
    assert.deepEqual(styles, { opacity: '0.15', pointerEvents: 'none', zIndex: '0' });
    await page.addStyleTag({ content: '.preview-banner,.preview-controls{display:none}.preview-toast{display:none}' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(out, 'Demo-泉州衣装与古厝.png') });
    await page.getByRole('button', { name: '头饰', exact: true }).click();
    await page.getByRole('button', { name: '取下当前头饰', exact: true }).click();
    assert.equal(await page.locator('.gucuo-lines').count(), 1, 'headwear does not decide the shirt scenery');
    await page.getByRole('button', { name: '上衣', exact: true }).click();
    await page.locator('.piece').filter({ hasText: '海湾工装短外套' }).click();
    assert.equal(await page.locator('.gucuo-lines').count(), 0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(out, 'Demo-其他衣装与素背景.png') });
    await page.reload();
    await page.waitForFunction(() => window.demo && demo.page.data.layers.length > 0);
    assert.equal(await page.locator('.gucuo-lines').count(), 0, 'selection survives reopening');
    await page.locator('.piece').filter({ hasText: '海丝斜襟短衫' }).click();
    assert.equal(await page.locator('.gucuo-lines').count(), 1);
    await page.getByRole('button', { name: '取下当前上衣', exact: true }).click();
    assert.equal(await page.locator('.gucuo-lines').count(), 0);
    const broken = await page.locator('img').evaluateAll(images => images.filter(im => !im.complete || !im.naturalWidth).map(im => im.src));
    assert.deepEqual(broken, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(out, '古厝背景交互核验.json'), JSON.stringify({ passed: true, styles, verified: ['穿上泉州短衫显示', '取下头饰仍显示', '换其他短衫收起', '重新打开保留选择', '换回恢复', '取下上衣收起', '没有图片或脚本错误及横向溢出'], limitation: '浏览器复用实际模板与 Page 逻辑；微信编译和真机待验证' }, null, 2));
    console.log('OK: scenery follows clothing, persists, stays behind the character; no broken images or overflow.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
