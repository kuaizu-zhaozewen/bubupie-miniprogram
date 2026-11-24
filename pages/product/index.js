const commerce = require('../../utils/commerce');
Page({
  data: { item: null, amount: '', quantity: 1, added: false },
  onLoad(options = {}) {
    const item = commerce.products.find(p => p.id === options.id);
    this.setData({ item: item || null, amount: item ? commerce.money(item.price) : '' });
    if (item && wx.setNavigationBarTitle) wx.setNavigationBarTitle({ title: item.name });
  },
  quantity(e) { this.setData({ quantity: Math.max(1, Math.min(99, this.data.quantity + Number(e.currentTarget.dataset.delta))), added: false }); },
  add() {
    if (!this.data.item) return;
    const id = this.data.item.id, current = commerce.cart()[id] || 0;
    if (current + this.data.quantity > 99) { wx.showToast({ title: '每件好物最多选择99件', icon: 'none' }); return; }
    if (!commerce.setQuantity(id, current + this.data.quantity)) { wx.showToast({ title: '商品服务暂不可用', icon: 'none' }); return; }
    this.setData({ added: true }); wx.showToast({ title: '已加入购物袋', icon: 'success' });
  },
  bag() { wx.switchTab({ url: '/pages/bag/index' }); },
  onShareAppMessage() { return { title: this.data.item ? this.data.item.name : '布布小伴好物', path: '/pages/product/index?id=' + (this.data.item ? this.data.item.id : 'body') }; }
});
