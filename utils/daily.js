const { items } = require('./data');
const moods = {
  low: { label: '想慢一点', score: 48, color: '#eee7f3', accent: '#837195', quote: '今天先好好吃饭，\n剩下的事，慢慢来。', note: '湾月今天有一点低落，想和你一起把自己照顾好。', action: '吃一顿热乎的饭，也是今天的小小胜利。' },
  high: { label: '晴朗，想见你', score: 88, color: '#f4e9c9', accent: '#98733f', quote: '走呀，把今天\n过成喜欢的样子。', note: '湾月今天心情很好，想把这份雀跃也分你一点。', action: '约喜欢的人散散步，或者一起做一件开心的小事。' }
};
function dateKey() { return new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10); }
function getDaily(id, override) {
  const key = dateKey();
  const state = moods[override] ? override : (Array.from(id + key).reduce((n, c) => n + c.charCodeAt(0), 0) % 2 ? 'high' : 'low');
  return Object.assign({ id: id + ':' + key, ipId: id, date: key, mood: state, version: 'demo-v2', demo: true }, moods[state]);
}
function isAdopted(id) { return (wx.getStorageSync('tami_adoptions') || []).indexOf(id) !== -1; }
function adopt(id) { if (!items[id]) return false; const ids = wx.getStorageSync('tami_adoptions') || []; if (ids.indexOf(id) !== -1) return false; wx.setStorageSync('tami_adoptions', ids.concat(id)); return true; }
module.exports = { moods, dateKey, getDaily, isAdopted, adopt };
