const config = require('../../utils/config');
const { items } = require('../../utils/data');
const { getDaily, isAdopted } = require('../../utils/daily');
const { renderShare } = require('../../utils/share');
Page({
  data: { item: items.star, daily: {}, owner: false, testing: false, testRole: '', testMood: '', shareImage: '', timelineImage: '', poster: '', busy: false, posterBusy: false },
  onLoad(options) {
    this.setData({ item: items[options.id] || items.star, testing: config.mode === 'mock' && config.enableDemoTools && options.demo === '1' });
    if (wx.showShareMenu) wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] });
    this.refresh();
  },
  onShow() { if (this.data.daily.id) { const previous = this.data.daily.id; this.refresh(); if (previous !== this.data.daily.id) this.renderImages(); } },
  onReady() { this.renderImages(); },
  onUnload() { this.unloaded = true; this.generation = (this.generation || 0) + 1; },
  refresh() {
    const owner = this.data.testing && this.data.testRole ? this.data.testRole === 'owner' : isAdopted(this.data.item.id);
    this.setData({ owner, daily: getDaily(this.data.item.id, this.data.testing ? this.data.testMood : '') });
  },
  setRole(e) { this.setData({ testRole: e.currentTarget.dataset.value }); this.refresh(); },
  setMood(e) { this.setData({ testMood: e.currentTarget.dataset.value }); this.refresh(); this.renderImages(); },
  fortune() {
    if (!this.data.owner) return this.bind();
    const demo = this.data.testing ? '&demo=1&role=owner&mood=' + this.data.daily.mood : '';
    wx.navigateTo({ url: '/pages/fortune/index?id=' + this.data.item.id + demo });
  },
  bind() { wx.navigateTo({ url: '/pages/bind/index' }); },
  async renderImages() {
    const generation = (this.generation || 0) + 1; this.generation = generation;
    this.setData({ shareImage: '', timelineImage: '', poster: '', busy: true });
    // Serialize work on the shared canvases; switching mood never locks the card.
    const task = (this.shareTask || Promise.resolve()).catch(() => {}).then(async () => {
      if (generation !== this.generation) return;
      try {
        const cover = await renderShare(this, 'cover');
        if (generation !== this.generation) return;
        this.setData({ shareImage: cover });
        const timeline = await renderShare(this, 'timeline');
        if (generation !== this.generation) return;
        this.setData({ timelineImage: timeline });
      } catch (e) { if (generation === this.generation) wx.showToast({ title: '分享封面暂未生成，卡片仍可使用', icon: 'none' }); }
      finally { if (generation === this.generation) this.setData({ busy: false }); }
    });
    this.shareTask = task;
    await task;
  },
  async poster() {
    if (this.data.posterBusy) return;
    const generation = this.generation;
    this.setData({ posterBusy: true });
    try { const poster = await renderShare(this, 'poster'); if (generation === this.generation) this.setData({ poster }); }
    catch (e) { wx.showToast({ title: '海报生成失败，请重试', icon: 'none' }); }
    finally { if (!this.unloaded) this.setData({ posterBusy: false }); }
  },
  closePoster() { this.setData({ poster: '' }); },
  imageMenu() {
    if (wx.showShareImageMenu) wx.showShareImageMenu({ path: this.data.poster, fail: () => this.previewPoster() });
    else this.previewPoster();
  },
  previewPoster() { wx.previewImage({ urls: [this.data.poster] }); },
  timelineHelp() { wx.showModal({ title: '分享到朋友圈', content: '请点击右上角“…”再选择“分享到朋友圈”。也可以生成海报，打开图片菜单保存或分享。具体选项以微信客户端为准。', showCancel: false }); },
  onShareAppMessage() { return { title: this.data.item.name + '给我的一句话：' + this.data.daily.quote.replace(/\n/g, ''), path: '/pages/card/index?id=' + this.data.item.id, imageUrl: this.data.shareImage || this.data.item.image }; },
  onShareTimeline() { return { title: this.data.item.name + '给我的一句话', query: 'id=' + this.data.item.id, imageUrl: this.data.timelineImage || this.data.item.image }; }
});
