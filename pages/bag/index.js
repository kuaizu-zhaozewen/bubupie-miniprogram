const commerce = require('../../utils/commerce');
const labels = { paid: '待收货', received: '售后期内', eligible: '可结算', settled: '佣金已结算', refunded: '已退款' };
Page({
  data: { items: [], totals: {}, coupon: null, useCoupon: true, orders: [], showOrders: false, notice: '' },
  onLoad() { this.refresh(); }, onShow() { this.refresh(); },
  refresh() {
    const cart = commerce.cart(), q = commerce.quote(cart, this.data.useCoupon), s = commerce.snapshot();
    this.setData({ items: q.lines.map(line => Object.assign({}, line, { image: commerce.products.find(p => p.id === line.productId).image, amount: commerce.money(line.unitPrice) })),
      totals: { original: commerce.money(q.original), discount: commerce.money(q.discount), payable: commerce.money(q.payable), count: q.lines.reduce((n, x) => n + x.quantity, 0) },
      coupon: s.coupon ? { amount: commerce.money(s.coupon.value) } : null,
      orders: s.orders.map(o => Object.assign({}, o, { statusText: labels[o.status], amount: commerce.money(o.original), paidText: commerce.money(o.payable), discountText: commerce.money(o.discount) })) });
  },
  quantity(e) { const id = e.currentTarget.dataset.id, current = commerce.cart()[id] || 0; commerce.setQuantity(id, Math.max(0, Math.min(99, current + Number(e.currentTarget.dataset.delta)))); this.refresh(); },
  remove(e) { commerce.setQuantity(e.currentTarget.dataset.id, 0); this.refresh(); },
  toggleCoupon() { this.setData({ useCoupon: !this.data.useCoupon }); this.refresh(); },
  coupons() { wx.navigateTo({ url: '/pages/coupons/index' }); },
  shop() { wx.switchTab({ url: '/pages/shop/index' }); },
  toggleOrders() { this.setData({ showOrders: !this.data.showOrders }); },
  checkout() {
    if (this.checking || !this.data.totals.count || !commerce.enabled()) return;
    this.checking = true;
    const cart = commerce.cart(), useCoupon = this.data.useCoupon, before = commerce.snapshot(), quoted = commerce.quote(cart, useCoupon), key = 'checkout-' + Date.now();
    wx.showModal({ title: '确认模拟订单', content: '商品 ¥' + commerce.money(quoted.original) + '，优惠 −¥' + commerce.money(quoted.discount) + '，合计 ¥' + commerce.money(quoted.payable) + '。本地演示，不会扣款或发货。', confirmText: '模拟付款', success: res => {
      if (!res.confirm) return;
      const after = commerce.snapshot(), current = commerce.quote(commerce.cart(), useCoupon);
      if (after.buyer !== before.buyer || JSON.stringify(commerce.cart()) !== JSON.stringify(cart) || (after.channel && after.channel.token) !== (before.channel && before.channel.token) || current.payable !== quoted.payable || current.couponId !== quoted.couponId) { wx.showToast({ title: '订单信息变化，请重新确认', icon: 'none' }); return; }
      const result = commerce.order(cart, key, useCoupon);
      if (result.ok) { commerce.clearCart(); this.setData({ notice: '模拟订单已完成', showOrders: true }); }
      else wx.showToast({ title: result.message, icon: 'none' });
    }, complete: () => { this.checking = false; this.refresh(); } });
  },
  progress(e) { commerce.transition(e.currentTarget.dataset.id, e.currentTarget.dataset.action); this.refresh(); },
  refund(e) { const id = e.currentTarget.dataset.id; wx.showModal({ title: '模拟整单退款', content: '退实际付款并冲回销售额和佣金。当日有效券返还，过期不延期。', success: res => { if (res.confirm) { commerce.refund(id); this.refresh(); } } }); }
});
