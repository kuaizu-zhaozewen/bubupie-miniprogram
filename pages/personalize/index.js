Page({
  data: { nickname: '', birthday: '' },
  onLoad() { const p = wx.getStorageSync('mio_profile') || {}; this.setData({ nickname: p.nickname || '', birthday: p.birthday || '' }); },
  nickname(e) { this.setData({ nickname: e.detail.value }); },
  birthday(e) { this.setData({ birthday: e.detail.value }); },
  save() { wx.setStorageSync('mio_profile', Object.assign({}, wx.getStorageSync('mio_profile') || {}, { nickname: this.data.nickname.trim(), birthday: this.data.birthday })); wx.showToast({ title: '已保存在本机', icon: 'success' }); setTimeout(() => wx.navigateBack(), 500); },
  skip() { if (getCurrentPages().length > 1) wx.navigateBack(); else wx.reLaunch({ url: '/pages/fortune/index?source=guest' }); }
});
