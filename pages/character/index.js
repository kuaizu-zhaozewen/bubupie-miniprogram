const { items } = require('../../utils/data');
const wardrobeView = require('../../utils/wardrobe-view');
Page(Object.assign({}, wardrobeView.methods, {
  data: Object.assign({ item: items.star }, wardrobeView.initialData()),
  onLoad(options = {}) {
    const item = items[options.id] || items.star;
    this.setData({ item, showBindPanel: options.bind === '1' });
    if (wx.setNavigationBarTitle) wx.setNavigationBarTitle({ title: item.name + '的衣橱' });
    this.refresh();
  },
  onShow() { this.refresh(); }
}));
