Component({
  properties: { title: String, back: { type: Boolean, value: true } },
  data: { statusHeight: 20, barHeight: 44 },
  lifetimes: {
    attached() {
      try {
        const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
        const statusHeight = info.statusBarHeight || 20;
        const menu = wx.getMenuButtonBoundingClientRect();
        this.setData({ statusHeight, barHeight: Math.max(44, (menu.top - statusHeight) * 2 + menu.height) });
      } catch (e) { /* 使用默认安全高度 */ }
    }
  },
  methods: {
    goBack() {
      if (getCurrentPages().length > 1) wx.navigateBack();
      else wx.reLaunch({ url: '/pages/home/index' });
    }
  }
});
