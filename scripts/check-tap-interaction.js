const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const flush = () => new Promise(resolve => setImmediate(resolve));

function environment(initialStage = 'ok') {
  let time = 0, next = 0, definition, stage = initialStage, exports = 0;
  const timers = new Map(), calls = [], toasts = [];
  const wx = {
    showShareMenu() {}, showToast: o => toasts.push(o.title),
    navigateTo: o => calls.push(o), redirectTo: o => calls.push(o),
    getImageInfo(o) {
      calls.push({ image: o.src });
      if (stage === 'image-hang') return;
      if (stage === 'image-fail') return o.fail(new Error('image unavailable'));
      o.success({ width: 720, height: 1011, path: o.src });
    },
    createCanvasContext() {
      if (stage === 'canvas-throw') throw new Error('canvas unavailable');
      return new Proxy({}, { get: (_, key) => {
        if (key === 'measureText') return () => ({ width: 100 });
        if (key === 'draw') return (_, callback) => { if (stage !== 'draw-hang') callback(); };
        return () => {};
      } });
    },
    canvasToTempFilePath(o) { if (stage !== 'export-hang') o.success({ tempFilePath: '/tmp/share-' + (++exports) + '.png' }); }
  };
  const config = { mode: 'mock', enableDemoTools: true };
  const item = { id: 'star', name: '湾月', image: '/assets/bayue-floral-cutout.png' };
  const sandbox = {
    wx, module: { exports: {} },
    setTimeout: (callback, delay) => { const id = ++next; timers.set(id, { at: time + delay, callback }); return id; },
    clearTimeout: id => timers.delete(id),
    Page: p => { definition = p; },
    require: name => {
      if (name.endsWith('/config')) return config;
      if (name.endsWith('/data')) return { items: { star: item }, getCollection: () => [item] };
      if (name.endsWith('/daily')) return {
        isAdopted: () => false,
        getDaily: (id, mood) => ({ id: 'today', date: 'today', mood: mood || 'low', color: '#eee', quote: mood === 'high' ? '走呀' : '好好吃饭', action: '慢慢来' })
      };
      if (name.endsWith('/share')) return share;
      if (name.endsWith('/navigation')) return require('../utils/navigation');
      if (name.endsWith('/recommendations')) return require('../utils/recommendations');
      throw new Error(name);
    }
  };
  vm.createContext(sandbox);
  vm.runInContext('(function () {\n' + fs.readFileSync(path.join(root, 'utils/share.js'), 'utf8') + '\n})()', sandbox);
  const share = sandbox.module.exports;
  function load(file) {
    vm.runInContext('(function () {\n' + fs.readFileSync(path.join(root, file), 'utf8') + '\n})()', sandbox);
    const page = Object.assign({}, definition, { data: JSON.parse(JSON.stringify(definition.data)), writes: 0 });
    page.setData = function (value) { this.writes++; Object.assign(this.data, value); };
    return page;
  }
  return {
    load, share, calls, toasts, config, timers,
    setStage: value => { stage = value; },
    tick(ms) {
      time += ms;
      for (const [id, job] of [...timers]) if (job.at <= time && timers.has(id)) { timers.delete(id); job.callback(); }
    }
  };
}

const event = value => ({ currentTarget: { dataset: { value } } });
async function main() {
  // Check event bindings as well as handlers: previous tests stubbed all image work.
  const template = fs.readFileSync(path.join(root, 'pages/card/index.wxml'), 'utf8');
  for (const tag of template.matchAll(/<button\b[^>]*>/g)) {
    if (/bindtap="(?:setRole|setMood|timelineHelp)"|open-type="share"/.test(tag[0])) assert(!/\bdisabled=/.test(tag[0]), tag[0]);
  }
  const nav = environment(), home = nav.load('pages/home/index.js');
  home.testTap(); assert.equal(nav.calls[0].url, '/pages/card/index?id=star&demo=1');
  nav.calls[0].fail(); assert.equal(nav.calls[1].url, nav.calls[0].url);
  nav.calls[1].fail(); assert(nav.toasts.length);

  for (const stage of ['image-hang', 'draw-hang', 'export-hang', 'canvas-throw', 'image-fail']) {
    const env = environment(stage), card = env.load('pages/card/index.js');
    card.onLoad({ id: 'star', demo: '1' });
    const job = card.renderImages(); await flush();
    card.setRole(event('owner')); assert.equal(card.data.owner, true);
    card.fortune(); assert(env.calls.at(-1).url.includes('/pages/fortune/index'));
    assert.equal(card.onShareAppMessage().imageUrl, card.data.item.image);
    env.tick(8000); await job;
    assert.equal(card.data.busy, false, stage);
    assert.equal(env.timers.size, 0, stage);
    env.setStage('ok'); await card.renderImages();
    assert(card.data.shareImage && card.data.timelineImage, stage + ': retry');
    assert.equal(env.timers.size, 0);
  }

  const switching = environment('image-hang'), card = switching.load('pages/card/index.js');
  card.onLoad({ id: 'star', demo: '1' });
  const first = card.renderImages(); await flush();
  card.setMood(event('high')); card.setMood(event('low')); card.setMood(event('high'));
  assert.equal(card.data.daily.mood, 'high');
  switching.setStage('ok'); switching.tick(8000); await first; await card.shareTask;
  assert.equal(card.data.busy, false);
  assert(card.data.shareImage && card.data.timelineImage);
  assert.equal(switching.calls.filter(c => c.image).length, 3, 'only latest queued mood should render');

  const independent = environment('image-hang'), posterPage = independent.load('pages/card/index.js');
  posterPage.onLoad({ demo: '1' });
  const coverJob = posterPage.renderImages(); await flush();
  independent.setStage('ok'); await posterPage.poster();
  assert(posterPage.data.poster); assert.equal(posterPage.data.posterBusy, false); assert.equal(posterPage.data.busy, true);
  independent.tick(8000); await coverJob;

  const unload = environment('image-hang'), removed = unload.load('pages/card/index.js');
  removed.onLoad({ demo: '1' }); const pending = removed.renderImages(); await flush();
  removed.onUnload(); const writes = removed.writes; unload.tick(8000); await pending;
  assert.equal(removed.writes, writes, 'no writes after leaving the card');
  console.log('OK: tap binding/navigation fallback; controls stay usable during 3 stalled callback stages; failures/retry; rapid mood changes; independent poster; unload cleanup.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
