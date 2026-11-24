const commerce = require('./commerce');
const navigation = require('./navigation');
function createShopPage() { return {
  data: { enabled: false, query: '', searched: '', category: 'all', recommendedProduct: '', categories: commerce.categories, products: [], sectionTitle: '为你精选', count: 0, availableCount: 0, bagCount: 0, notice: '', promotion: null, showTools: false, buyer: '' },
  onLoad(options = {}) {
    if (options.scene) this.setData({ notice: commerce.enter(options.scene).message });
    if (options.keyword) this.setData({ query: options.keyword });
    if (commerce.products.some(p => p.id === options.product)) this.setData({ recommendedProduct: options.product });
    if (commerce.categories.some(c => c.id === options.category)) this.setData({ category: options.category });
    this.refresh();
  },
  onShow() { this.refresh(); },
  refresh() {
    const snapshot = commerce.snapshot(), query = this.data.searched.toLowerCase();
    const products = snapshot.products.filter(p => (this.data.category === 'all' || p.category === this.data.category) && (!query || [p.name, p.subtitle, p.description].join(' ').toLowerCase().includes(query)));
    if (this.data.recommendedProduct) products.sort((a, b) => Number(b.id === this.data.recommendedProduct) - Number(a.id === this.data.recommendedProduct));
    const category = commerce.categories.find(c => c.id === this.data.category);
    this.setData({ enabled: snapshot.enabled, buyer: snapshot.buyer || '', products, count: products.length, sectionTitle: query ? '搜索结果' : category ? category.name : '为你精选', availableCount: commerce.coupons().filter(c => c.status === 'available').length, bagCount: Object.values(commerce.cart()).reduce((n, x) => n + x, 0) });
  },
  input(e) { this.setData({ query: e.detail.value }); },
  search() {
    const value = this.data.query.trim(), channel = commerce.parse(value);
    if (channel && commerce.enabled()) {
      const result = commerce.enter(value);
      this.setData({ searched: '', category: 'all', notice: result.message, promotion: { name: channel.name, fresh: result.fresh } });
    } else this.setData({ searched: value, promotion: null, notice: '' });
    this.refresh();
  },
  clearSearch() { this.setData({ query: '', searched: '', notice: '', promotion: null }); this.refresh(); },
  selectCategory(e) { this.setData({ category: e.currentTarget.dataset.id, searched: '', query: '', notice: '', promotion: null }); this.refresh(); },
  product(e) { wx.navigateTo({ url: '/pages/product/index?id=' + e.currentTarget.dataset.id }); },
  coupons() { wx.navigateTo({ url: '/pages/coupons/index' }); },
  bag() { navigation.switchTo('bag'); },
  distributor() { wx.navigateTo({ url: '/pages/distributor/index' }); },
  toggleTools() { this.setData({ showTools: !this.data.showTools }); },
  switchBuyer() { commerce.switchBuyer(); this.setData({ notice: '已切换演示买家', promotion: null }); this.refresh(); },
  onShareAppMessage() { return { title: '布布小伴 · 给喜欢留个位置', path: '/pages/shop-entry/index' }; }
}; }
module.exports = { createShopPage };
