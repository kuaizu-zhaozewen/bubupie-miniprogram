// Local simulation. Prices, QR tokens, accounts and orders are demo data.
const config = require('./config');
const KEY = 'bubupie_commerce_v1';
const { products, categories } = require('./catalog');
const channels = [
  { token: 'DEMO-MALL-5', keyword: '湾月好礼', agentId: '', name: '布布小伴商城', value: 500 },
  { token: 'DEMO-AGENT-A-5', keyword: '海风小店', agentId: 'A', name: '海风小店 · 代理A', value: 500 },
  { token: 'DEMO-AGENT-B-10', keyword: '巷口伙伴', agentId: 'B', name: '巷口伙伴 · 个人代理B', value: 1000 }
];
function enabled() { return config.mode === 'mock' && config.enableDemoTools; }
function money(value) { return (value / 100).toFixed(2); }
function day(now = Date.now()) { return new Date(now + 8 * 3600000).toISOString().slice(0, 10); }
function expiry(date) { return Date.parse(date + 'T00:00:00+08:00') + 86400000; }
function state() { return wx.getStorageSync(KEY) || { buyer: 'buyerA', buyers: {}, orders: [], seq: 0 }; }
function buyer(s) { return s.buyers[s.buyer] || (s.buyers[s.buyer] = { claims: {}, channel: null }); }
function save(s) { wx.setStorageSync(KEY, s); }
function parse(raw) {
  let token = String(raw || '').trim();
  if (token.indexOf('BUBUPIE:SHOP:') === 0) token = token.slice(13);
  try { token = decodeURIComponent(token); } catch (e) { return null; }
  return channels.find(c => c.token.toUpperCase() === token.toUpperCase() || c.keyword === token) || null;
}
function enter(raw, now = Date.now()) {
  if (!enabled()) return { ok: false, message: '商城服务尚未接入' };
  const channel = parse(raw);
  if (!channel) return { ok: false, message: '推广码无效，请检查后重试' };
  const s = state(), b = buyer(s), date = day(now);
  b.channel = channel.token;
  if (channel.agentId) b.agentToken = channel.token;
  let coupon = b.claims[date], fresh = false;
  if (!coupon) { coupon = b.claims[date] = { id: s.buyer + ':' + date, value: channel.value, source: channel.name, sourceToken: channel.token, claimedAt: now, expiresAt: expiry(date), usedBy: null }; fresh = true; }
  save(s);
  return { ok: true, fresh, message: fresh ? '已领取 ¥' + money(coupon.value) + ' 当日券' : '今天已领过券，不重复发放；推广来源已更新' };
}
function snapshot(now = Date.now()) {
  if (!enabled()) return { enabled: false, products: [], orders: [], coupon: null, channel: null };
  const s = state(), b = buyer(s), c = b.claims[day(now)];
  return { enabled: true, buyer: s.buyer, products, channel: channels.find(x => x.token === b.channel) || null,
    coupon: c && !c.usedBy && now < c.expiresAt ? c : null, orders: s.orders.filter(o => o.buyer === s.buyer).slice().reverse() };
}
function quote(cart, useCoupon = true, now = Date.now()) {
  const lines = Object.keys(cart).map(id => {
    const p = products.find(x => x.id === id), quantity = cart[id];
    if (!p || !Number.isInteger(quantity) || quantity < 0 || quantity > 99) throw Error('商品数量无效');
    return { productId: id, name: p.name, quantity, unitPrice: p.price, original: p.price * quantity };
  }).filter(x => x.quantity);
  const original = lines.reduce((n, x) => n + x.original, 0), c = snapshot(now).coupon;
  const discount = useCoupon && c ? Math.min(original, c.value) : 0;
  return { lines, original, discount, payable: original - discount, couponId: discount ? c.id : null };
}
function order(cart, key, useCoupon = true, now = Date.now()) {
  if (!enabled()) return { ok: false, message: '商城服务尚未接入' };
  const s = state(), existing = s.orders.find(o => o.buyer === s.buyer && o.key === key);
  if (existing) return { ok: true, order: existing };
  const q = quote(cart, useCoupon, now);
  if (!q.original) return { ok: false, message: '请先选购商品' };
  const b = buyer(s), channel = channels.find(c => c.token === b.agentToken), id = 'DEMO-' + (++s.seq);
  const o = Object.assign({ id, key, buyer: s.buyer, agentId: channel ? channel.agentId : '', channelToken: channel ? channel.token : '', createdAt: now,
    status: 'paid', refundedOriginal: 0, refundedPaid: 0, commissionRate: 2000, settledGross: 0, reversedSettled: 0 }, q);
  o.commission = o.agentId ? Math.round(q.original * 0.2) : 0;
  if (q.couponId) b.claims[day(now)].usedBy = id;
  s.orders.push(o); save(s); return { ok: true, order: o };
}
function transition(id, action) {
  if (!enabled()) return false;
  const s = state(), o = s.orders.find(x => x.id === id && x.buyer === s.buyer);
  if (!o) return false;
  if (action === 'receive' && o.status === 'paid') o.status = 'received';
  else if (action === 'afterSale' && o.status === 'received') o.status = 'eligible';
  else return false;
  save(s); return true;
}
function refund(id, now = Date.now()) {
  if (!enabled()) return false;
  const s = state(), o = s.orders.find(x => x.id === id && x.buyer === s.buyer);
  if (!o || o.status === 'refunded') return false;
  o.refundedOriginal = o.original; o.refundedPaid = o.payable;
  o.reversedSettled = o.settledGross; o.status = 'refunded'; o.refundedAt = now;
  const c = buyer(s).claims[day(now)];
  if (c && c.id === o.couponId && now < c.expiresAt) c.usedBy = null;
  save(s); return true;
}
function dashboard(agentId) {
  if (!enabled() || !['A', 'B'].includes(agentId)) return null;
  const orders = state().orders.filter(o => o.agentId === agentId);
  const sum = fn => orders.reduce((n, o) => n + fn(o), 0);
  return { orders: orders.slice().reverse(), count: orders.length, original: sum(o => o.original), refund: sum(o => o.refundedOriginal),
    net: sum(o => o.original - o.refundedOriginal), couponExpense: sum(o => o.discount),
    commission: sum(o => o.status === 'refunded' ? 0 : o.commission),
    pending: sum(o => ['paid', 'received'].includes(o.status) ? o.commission : 0),
    eligible: sum(o => o.status === 'eligible' ? o.commission : 0),
    settled: sum(o => o.settledGross), reversed: sum(o => o.reversedSettled) };
}
function settle(agentId) {
  if (!enabled() || !['A', 'B'].includes(agentId)) return false;
  const s = state();
  s.orders.filter(o => o.agentId === agentId && o.status === 'eligible').forEach(o => { o.status = 'settled'; o.settledGross = o.commission; });
  save(s); return true;
}
function switchBuyer() { if (!enabled()) return; const s = state(); s.buyer = s.buyer === 'buyerA' ? 'buyerB' : 'buyerA'; save(s); }
function coupons(now = Date.now()) {
  if (!enabled()) return [];
  const s = state(), b = buyer(s);
  return Object.keys(b.claims).sort().reverse().map(date => {
    const c = b.claims[date];
    return Object.assign({}, c, { claimDate: date, amount: money(c.value), source: c.source || '商城好礼', status: c.usedBy ? 'used' : now >= c.expiresAt ? 'expired' : 'available' });
  });
}
function cart() { if (!enabled()) return {}; const s = state(); return Object.assign({}, buyer(s).cart || {}); }
function setQuantity(id, quantity) {
  if (!enabled() || !products.find(p => p.id === id) || !Number.isInteger(quantity) || quantity < 0 || quantity > 99) return false;
  const s = state(), b = buyer(s); b.cart = b.cart || {};
  if (quantity) b.cart[id] = quantity; else delete b.cart[id]; save(s); return true;
}
function clearCart() { if (!enabled()) return; const s = state(); buyer(s).cart = {}; save(s); }
module.exports = { products, categories, channels, enabled, money, day, expiry, parse, enter, snapshot, quote, order, transition, refund, dashboard, settle, switchBuyer, coupons, cart, setQuantity, clearCart };
