Page({
  data: { nickname: '', birthday: '', birthdayMonth: false },
  onShow() { const p = wx.getStorageSync('mio_profile') || {}; this.setData({ nickname: p.nickname || '', birthday: p.birthday || '', birthdayMonth: !!p.birthday && Number(p.birthday.slice(5, 7)) === new Date().getMonth() + 1 }); },
  coupons() { wx.navigateTo({ url: '/pages/coupons/index' }); },
  edit() { wx.navigateTo({ url: '/pages/edit-profile/index' }); },
  birthdayGift() { wx.showModal({ title: '生日月礼遇', content: '示例权益待配置，尚未发放真实优惠券。正式版由服务端按活动、账号和月份幂等发券。', showCancel: false }); },
  binding() { wx.navigateTo({ url: '/pages/bind/index' }); },
  privacy() { wx.showModal({ title: '隐私与数据', content: '此演示没有服务器。收藏、昵称及选填资料只保存在当前设备的小程序本地缓存中，可通过开发者工具或微信清理缓存删除。', showCancel: false }); },
  help() { wx.showModal({ title: '帮助与反馈', content: '这是前端演示，尚未接入真实购买、账号绑定或客服。', showCancel: false }); }
});
