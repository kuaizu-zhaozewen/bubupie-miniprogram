const config = require('../../utils/config');
const { getCollection } = require('../../utils/data');
const navigation = require('../../utils/navigation');
Page({
  data: { enableDemoTools: config.enableDemoTools, collection: [], countText: '00', dressLayers: [], hasDress: false, quanzhouScene: true },
  onShow() {
    const collection = getCollection(), wardrobe = require('../../utils/wardrobe'), dressLayers = wardrobe.currentLayers(), started = wardrobe.snapshot().owned.length > 0;
    this.setData({ collection, countText: String(collection.length).padStart(2, '0'), dressLayers, hasDress: started, quanzhouScene: require('../../utils/scenery').isQuanzhou(dressLayers, !started) });
  },
  openCharacter(e) {
    const demo = config.mode === 'mock' && config.enableDemoTools ? '&demo=1&role=owner' : '';
    wx.navigateTo({ url: '/pages/fortune/index?id=' + e.currentTarget.dataset.id + demo });
  },
  testTap() { const url = '/pages/card/index?id=star&demo=1'; wx.navigateTo({ url, fail: () => wx.redirectTo({ url, fail: () => wx.showToast({ title: '暂时无法打开，请重试', icon: 'none' }) }) }); },
  openShop() { navigation.switchTo('shop'); },
  openProfile() { navigation.switchTo('profile'); },
  openBind() { wx.navigateTo({ url: '/pages/bind/index' }); },
  edit() { wx.showModal({ title: '我的伙伴', content: '这里收藏着与你相伴的小IP。购买新伙伴请进入底部“商城”；已有实物可在“我的”中绑定。', showCancel: false }); }
});
