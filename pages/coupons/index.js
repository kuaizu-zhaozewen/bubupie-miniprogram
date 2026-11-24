const commerce = require('../../utils/commerce');
Page({
  data: { tab: 'available', tabs: [{ id: 'available', name: '可使用' }, { id: 'used', name: '已使用' }, { id: 'expired', name: '已过期' }], coupons: [], counts: {}, emptyTitle: '', emptyNote: '' },
  onLoad() { this.refresh(); }, onShow() { this.refresh(); },
  refresh() {
    const list = commerce.coupons(), counts = {};
    this.data.tabs.forEach(t => counts[t.id] = list.filter(c => c.status === t.id).length);
    const copy = { available: ['还没有可用的优惠券。', '在商城搜索推广关键词，今日好礼就会到账。'], used: ['还没有使用记录。', '用券完成购买后，可以在这里查看。'], expired: ['还没有过期的优惠券。', '当天领取的好礼，记得当天使用。'] }[this.data.tab];
    this.setData({ counts, coupons: list.filter(c => c.status === this.data.tab).map(c => Object.assign({}, c, { dateText: c.claimDate.replace(/-/g, '.'), stateText: ({ available: '今日可用', used: '已使用', expired: '已过期' })[c.status] })), emptyTitle: copy[0], emptyNote: copy[1] });
  },
  selectTab(e) { this.setData({ tab: e.currentTarget.dataset.id }); this.refresh(); },
  shop() { wx.switchTab({ url: '/pages/shop/index' }); }
});
