const commerce = require('../../utils/commerce');
Page({
  data: { enabled: false, agentId: 'A', channel: {}, report: {}, qr: '', showTools: false, orders: [] },
  onLoad() { this.refresh(); },
  onShow() { this.refresh(); },
  refresh() {
    const report = commerce.dashboard(this.data.agentId), channel = commerce.channels.find(c => c.agentId === this.data.agentId);
    if (!report) { this.setData({ enabled: false }); return; }
    const display = {}; Object.keys(report).filter(k => k !== 'orders').forEach(k => display[k] = k === 'count' ? report[k] : commerce.money(report[k]));
    this.setData({ enabled: true, report: display, channel, orders: report.orders.map(o => ({ id: o.id, original: commerce.money(o.original), discount: commerce.money(o.discount), commission: commerce.money(o.status === 'refunded' ? 0 : o.commission), status: ({ paid: '待收货', received: '售后期内', eligible: '可结算', settled: '已结算', refunded: '已冲回' })[o.status] })) });
  },
  copyKeyword() { wx.setClipboardData({ data: this.data.channel.keyword }); },


  openPage() { wx.navigateTo({ url: '/pages/shop-entry/index?keyword=' + encodeURIComponent(this.data.channel.keyword) }); },
  toggleTools() { this.setData({ showTools: !this.data.showTools }); },
  switchAgent() { this.setData({ agentId: this.data.agentId === 'A' ? 'B' : 'A', qr: '' }); this.refresh(); },
  settle() { wx.showModal({ title: '模拟结算可结算佣金', content: '仅将已确认收货且售后期结束的演示订单记为已结算，不转账。', success: res => { if (res.confirm) { commerce.settle(this.data.agentId); this.refresh(); } } }); },
  onShareAppMessage() { return { title: this.data.channel.name + ' · 搜索关键词领取今日好礼', path: '/pages/shop-entry/index?keyword=' + encodeURIComponent(this.data.channel.keyword) }; }
});
