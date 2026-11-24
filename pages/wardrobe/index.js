// Compatibility for older saved links. Dressing now lives on the IP detail page.
Page({
  data: {},
  onLoad() { wx.redirectTo({ url: '/pages/character/index?id=star&bind=1' }); }
});
