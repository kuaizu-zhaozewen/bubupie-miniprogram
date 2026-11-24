App({
  onLaunch() {
    if (!wx.getStorageSync('mio_initialized')) {
      wx.setStorageSync('mio_collection', ['star']);
      wx.setStorageSync('mio_initialized', true);
    }
  }
});
