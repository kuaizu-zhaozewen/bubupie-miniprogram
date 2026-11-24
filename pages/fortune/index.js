const config = require('../../utils/config');
const { items, dateText } = require('../../utils/data');
const { getDaily, isAdopted } = require('../../utils/daily');
const navigation = require('../../utils/navigation');
const { recommendations } = require('../../utils/recommendations');
Page({
  data: { item: items.star, date: '', daily: {}, demoQuery: '', suggestions: [], dressLayers: [], hasDress: false, quanzhouScene: true, stats: [{ name: '情感', value: 76 }, { name: '财富', value: 68 }, { name: '事业', value: 82 }, { name: '健康', value: 74 }] },
  onLoad(options = {}) {
    const item = items[options.id] || items.star;
    const testing = config.mode === 'mock' && config.enableDemoTools && options.demo === '1' && options.role === 'owner';
    if (!testing && !isAdopted(item.id)) { wx.redirectTo({ url: '/pages/card/index?id=' + item.id }); return; }
    const daily = getDaily(item.id, testing ? options.mood : '');
    this.setData({ item, daily, date: dateText(), demoQuery: testing ? '&demo=1&role=owner&mood=' + daily.mood : '', stats: ['情感','财富','事业','健康'].map((name,i) => ({name,value:daily.score - 6 + i * 2})) });
    if (wx.setNavigationBarTitle) wx.setNavigationBarTitle({ title: item.name + '的今日运势' });
    this.refreshAppearance();
  },
  onShow() { this.refreshAppearance(); this.setData({ suggestions: recommendations() }); },
  refreshAppearance() {
    const wardrobe = require('../../utils/wardrobe'), dressLayers = wardrobe.currentLayers(), hasDress = wardrobe.snapshot().owned.length > 0;
    this.setData({ dressLayers, hasDress, quanzhouScene: require('../../utils/scenery').isQuanzhou(dressLayers, !hasDress) });
  },
  dress() { wx.navigateTo({ url: '/pages/character/index?id=' + this.data.item.id + this.data.demoQuery }); },
  recommendation(e) { const idea = this.data.suggestions.find(x => x.id === e.currentTarget.dataset.id); if (idea) navigation.openShop({ category: idea.category, product: idea.productId }); },
  records() { wx.showModal({ title: this.data.item.recordTitle, content: this.data.item.recordStory, showCancel: false }); },
  chat() { wx.navigateTo({ url: '/pages/chat/index?id=' + this.data.item.id + this.data.demoQuery }); },
  details() { wx.navigateTo({ url: '/pages/fortune-detail/index?id=' + this.data.item.id + this.data.demoQuery }); },
  personalize() { wx.navigateTo({ url: '/pages/personalize/index' }); },
  onShareAppMessage() { return { title: '看看' + this.data.item.name + '的今日运势', path: '/pages/card/index?id=' + this.data.item.id + '&source=guest' }; }
});
