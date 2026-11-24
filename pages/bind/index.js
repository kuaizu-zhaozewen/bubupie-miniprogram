const { addItem } = require('../../utils/data');
const { adopt } = require('../../utils/daily');
Page({
  data: { code: '' },
  input(e) { this.setData({ code: e.detail.value }); },
  bindCode(code) {
    if (!['BUBU-DEMO-BODY-001', 'TAMI-DEMO'].includes(String(code || '').trim().toUpperCase())) { wx.showModal({ title: '演示绑定码', content: '本地演示仅识别 BUBU-DEMO-BODY-001，不会验证或绑定真实商品。', showCancel: false }); return; }
    const added = adopt('star'); addItem('star');
    wx.showModal({ title: added ? '已加入橱窗' : '已经拥有啦', content: '演示状态只保存在本机，不代表真实商品归属。', showCancel: false, success() { wx.redirectTo({ url: '/pages/card/index?id=star' }); } });
  },
  scan() { wx.scanCode({ onlyFromCamera: false, success: res => this.bindCode(res.result), fail: () => wx.showToast({ title: '可手动输入演示码 BUBU-DEMO-BODY-001', icon: 'none' }) }); },
  submit() { this.bindCode(this.data.code); },
  help() { wx.showModal({ title: '演示说明', content: '输入 BUBU-DEMO-BODY-001 可体验加入橱窗。真实绑定、核销与找回需要后端支持。', showCancel: false }); }
});
