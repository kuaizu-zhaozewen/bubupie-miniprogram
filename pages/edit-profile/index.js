Page({
  data: { nickname: '', bio: '', birthday: '', today: new Date().toISOString().slice(0, 10) },
  onLoad() { const p = wx.getStorageSync('mio_profile') || {}; this.setData({ nickname: p.nickname || '', bio: p.bio || '', birthday: p.birthday || '' }); },
  nickname(e) { this.setData({ nickname: e.detail.value }); },
  bio(e) { this.setData({ bio: e.detail.value }); },
  birthday(e) { this.setData({ birthday: e.detail.value }); },
  clearBirthday() { this.setData({ birthday: '' }); },
  avatar() { wx.showToast({ title: '头像功能暂未接入', icon: 'none' }); },
  save() { wx.setStorageSync('mio_profile', { nickname: this.data.nickname.trim(), bio: this.data.bio.trim(), birthday: this.data.birthday }); wx.showToast({ title: '已保存在本机', icon: 'success' }); setTimeout(() => wx.navigateBack(), 500); }
});
