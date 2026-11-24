// Local mock only. Production redemption and ownership must be enforced by a server.
const config = require('./config');
const KEY = 'bubupie_wardrobe_v1';
const slots = [
  { id: 'top', name: '上衣' }, { id: 'bottom', name: '下装' },
  { id: 'shoes', name: '鞋履' }, { id: 'head', name: '头饰' }
];
const items = [
  { id: 'silk-top', slot: 'top', name: '海丝斜襟短衫', collection: '海丝簪花漫游', status: '首发', color: '#efe3cc' },
  { id: 'work-top', slot: 'top', name: '海湾工装短外套', collection: '海湾工装', status: '后续', color: '#c96852' },
  { id: 'arcade-top', slot: 'top', name: '骑楼拼色棒球服', collection: '骑楼漫游', status: '后续', color: '#548082' },
  { id: 'silk-bottom', slot: 'bottom', name: '靛蓝宽松短裤', collection: '海丝簪花漫游', status: '首发', color: '#324359' },
  { id: 'work-bottom', slot: 'bottom', name: '深靛宽腿裤', collection: '海湾工装', status: '后续', color: '#323a47' },
  { id: 'arcade-bottom', slot: 'bottom', name: '沙色工装短裤', collection: '骑楼漫游', status: '后续', color: '#d7bd93' },
  { id: 'teal-shoes', slot: 'shoes', name: '海浪青拖鞋', collection: '海丝簪花漫游', status: '首发', color: '#295f63' },
  { id: 'brick-shoes', slot: 'shoes', name: '砖红海浪拖鞋', collection: '海湾工装 / 骑楼漫游', status: '后续', color: '#b9513a' },
  { id: 'flower-head', slot: 'head', name: '整圈磁吸簪花', collection: '共用配件', status: '首发', color: '#d95f48' },
  { id: 'hat-head', slot: 'head', name: '海风软檐帽', collection: '帽子接口演示', status: '探索', color: '#456c70' }
].map(item => Object.assign({}, item, { image: '/assets/wardrobe-v38/layers/' + item.id + '.png', thumb: '/assets/shop-v38/' + item.id + '.png' }));
const byId = Object.create(null); items.forEach(item => { byId[item.id] = item; });
const outfits = [
  { id: 'silk', name: '海丝簪花漫游', status: '首发', pieces: ['silk-top', 'silk-bottom', 'teal-shoes', 'flower-head'] },
  { id: 'work', name: '海湾工装', status: '后续', pieces: ['work-top', 'work-bottom', 'brick-shoes', 'flower-head'] },
  { id: 'arcade', name: '骑楼漫游', status: '后续', pieces: ['arcade-top', 'arcade-bottom', 'brick-shoes', 'flower-head'] }
];
// These public fixture codes are ONLY for local demonstrations, never printable production codes.
const fixtures = [
  { code: 'BUBU-DEMO-SILK-001', name: '首发衣装套组', pieces: outfits[0].pieces },
  { code: 'BUBU-DEMO-WORK-001', name: '海湾工装套组', pieces: outfits[1].pieces },
  { code: 'BUBU-DEMO-ARCADE-001', name: '骑楼漫游套组', pieces: outfits[2].pieces },
  { code: 'BUBU-DEMO-HAT-001', name: '软檐帽接口示例', pieces: ['hat-head'] }
].concat(items.map((item, index) => ({ code: 'BUBU-DEMO-PIECE-' + String(index + 1).padStart(2, '0'), name: item.name, pieces: [item.id] })));
const empty = () => ({ version: 1, account: 'demo-a', claims: {}, accounts: {} });
const blankLook = () => ({ top: '', bottom: '', shoes: '', head: '' });
function read() {
  const saved = wx.getStorageSync(KEY);
  const state = saved && saved.version === 1 && saved.accounts && saved.claims ? saved : empty();
  if (!['demo-a', 'demo-b'].includes(state.account)) state.account = 'demo-a';
  if (!state.accounts[state.account]) state.accounts[state.account] = { owned: [], look: blankLook() };
  const user = state.accounts[state.account];
  if (!Array.isArray(user.owned)) user.owned = [];
  user.look = Object.assign(blankLook(), user.look || {});
  slots.forEach(slot => {
    const item = byId[user.look[slot.id]];
    if (!item || item.slot !== slot.id || !user.owned.includes(item.id)) user.look[slot.id] = '';
  });
  return state;
}
function save(state) { wx.setStorageSync(KEY, state); }
function enabled() { return config.mode === 'mock' && config.enableDemoTools; }
function normalizeCode(input) {
  const text = String(input || '').trim();
  if (text.length > 512) return '';
  // Accept an exact demo fixture or our namespaced QR payload; never extract a code from an arbitrary URL.
  if (/^BUBUPIE:WARDROBE:/i.test(text)) return text.slice('BUBUPIE:WARDROBE:'.length).toUpperCase();
  return text.toUpperCase();
}
function inspectCode(input) {
  if (!enabled()) return { ok: false, error: '尚未接入衣装绑定服务' };
  const code = normalizeCode(input), fixture = fixtures.find(item => item.code === code);
  if (!fixture) return { ok: false, error: '衣装码无效，请检查后重试' };
  const state = read(), owner = state.claims[code];
  if (owner && owner !== state.account) return { ok: false, error: '这个衣装码已被其他演示账号绑定' };
  return { ok: true, code, name: fixture.name, pieces: fixture.pieces.slice(), already: owner === state.account };
}
function redeem(input) {
  const result = inspectCode(input);
  if (!result.ok) return result;
  const state = read(), user = state.accounts[state.account];
  const owned = user.owned.slice();
  result.pieces.forEach(id => { if (!owned.includes(id)) owned.push(id); });
  // A single persisted state contains claim + entitlement. A production DB transaction replaces this mock.
  user.owned = owned; state.claims[result.code] = state.account;
  save(state); return result;
}
function equip(id) {
  if (!enabled()) return { ok: false, error: '尚未接入衣橱服务' };
  const state = read(), user = state.accounts[state.account], item = byId[id];
  if (!item || !user.owned.includes(id)) return { ok: false, error: '先绑定这件衣装，再来搭配' };
  user.look[item.slot] = item.id; save(state); return { ok: true };
}
function remove(slot) {
  if (!enabled() || !slots.some(item => item.id === slot)) return false;
  const state = read(); state.accounts[state.account].look[slot] = ''; save(state); return true;
}
function wearOutfit(id) {
  if (!enabled()) return { ok: false, error: '尚未接入衣橱服务' };
  const outfit = outfits.find(item => item.id === id), state = read(), user = state.accounts[state.account];
  if (!outfit || !outfit.pieces.every(piece => user.owned.includes(piece))) return { ok: false, error: '请先绑定这一套的全部部件' };
  const look = blankLook(); outfit.pieces.forEach(piece => { look[byId[piece].slot] = piece; });
  user.look = look; save(state); return { ok: true };
}
function switchAccount(account) {
  if (!enabled() || !['demo-a', 'demo-b'].includes(account)) return false;
  const state = read(); state.account = account; save(state); return true;
}
function reset() { if (!enabled()) return false; save(empty()); return true; }
function snapshot() {
  if (!enabled()) return { account: '', owned: [], look: blankLook() };
  const state = read(), user = state.accounts[state.account];
  return { account: state.account, owned: user.owned.slice(), look: Object.assign({}, user.look) };
}
function currentLayers() { const look = snapshot().look; return ['bottom', 'top', 'shoes', 'head'].map(slot => byId[look[slot]]).filter(Boolean); }
module.exports = { slots, items, outfits, fixtures, byId, enabled, normalizeCode, inspectCode, redeem, equip, remove, wearOutfit, switchAccount, reset, snapshot, currentLayers };
