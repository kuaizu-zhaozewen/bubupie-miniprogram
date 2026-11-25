// Public fixtures only. Production identity/ownership must come from the server.
const config = require('./config');
const fixtures = [1, 2].map(n => ({ id: 'demo-bayue-' + n, ipId: 'star', serial: n, number: 'No.' + String(n).padStart(4, '0'), tag: 'DEMO-TAG-' + String(n).padStart(4, '0'), code: 'BUBU-DEMO-BODY-' + String(n).padStart(3, '0') }));
const enabled = () => config.mode === 'mock' && config.enableDemoTools;
function findTag(tag) { return enabled() ? fixtures.find(x => x.tag === tag) || null : null; }
function findCode(value) { const code = String(value || '').trim().toUpperCase(); return enabled() ? fixtures.find(x => x.code === (code === 'TAMI-DEMO' ? fixtures[0].code : code)) || null : null; }
function owned(item) { if (!enabled() || !item) return false; return (wx.getStorageSync('bubupie_instances_v1') || []).includes(item.id) || (item.serial === 1 && (wx.getStorageSync('tami_adoptions') || []).includes('star')); }
function claim(item) { if (!enabled() || !item) return false; const ids = wx.getStorageSync('bubupie_instances_v1') || []; if (!ids.includes(item.id)) wx.setStorageSync('bubupie_instances_v1', ids.concat(item.id)); return true; }
function firstOwned() { return enabled() ? fixtures.find(owned) || null : null; }
module.exports = { fixtures, enabled, findTag, findCode, owned, claim, firstOwned };
