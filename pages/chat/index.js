const { items } = require('../../utils/data');
const { getDaily } = require('../../utils/daily');
const config = require('../../utils/config');
const { prompts, reply } = require('../../utils/chat-prompts');
Page({
  data: { characterImage: '/assets/avatars/wan-yue-portrait-v36.png', userAvatar: '/assets/avatars/user-default.png', userName: '我', item: items.star, input: '', prompts, daily: {}, scrollTarget: '', messages: [] },
  onLoad(options = {}) {
    const item = items[options.id] || items.star;
    this.override = config.mode === 'mock' && config.enableDemoTools && options.demo === '1' ? options.mood : '';
    const profile = wx.getStorageSync('mio_profile') || {};
    this.setData({ item, characterImage: '/assets/avatars/wan-yue-portrait-v36.png', userName: profile.nickname || '我', daily: getDaily(item.id, this.override), messages: [{ id: 1, role: 'friend', text: '海风把你带来啦，我是' + item.name + '。今天想和我聊点什么？先选一个小问题也可以。' }] });
  },
  onShow() { if (this.data.item) this.setData({ daily: getDaily(this.data.item.id, this.override) }); },
  input(e) { this.setData({ input: e.detail.value }); },
  choose(e) { const p = prompts.find(x => x.id === e.currentTarget.dataset.id); if (p) this.respond(p.text, p.id); },
  respond(value, promptId) {
    const daily = getDaily(this.data.item.id, this.override), now = this.data.messages.length + 1;
    this.setData({ daily, input: '', messages: this.data.messages.concat([{ id: now, role: 'user', text: value }, { id: now + 1, role: 'friend', text: reply(promptId, daily) }]), scrollTarget: 'message-' + (now + 1) });
  },
  send() {
    const value = this.data.input.trim();
    if (!value) return;
    const id = /幸运色|穿什么|怎么穿/.test(value) ? 'color' : /预感/.test(value) ? 'feeling' : /运势|宜|忌/.test(value) ? 'fortune' : '';
    this.respond(value, id);
  }
});
