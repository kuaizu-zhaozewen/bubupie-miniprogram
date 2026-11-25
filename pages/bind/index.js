const { addItem } = require('../../utils/data');
const { adopt } = require('../../utils/daily');
const instances = require('../../utils/instances');
Page({
  data: { code: '', target: null },
  onLoad(options = {}) { this.setData({ target: options.tag ? instances.findTag(options.tag) : null, invalidTag: !!options.tag && !instances.findTag(options.tag) }); },
  input(e) { this.setData({ code: e.detail.value }); },
  bindCode(code) {
    const item = instances.findCode(code);
    if (!item || this.data.invalidTag) { wx.showModal({ title: '无法领养', content: '仅支持本地演示码 BUBU-DEMO-BODY-001 或 002；无效入口不会授予权益。', showCancel: false }); return; }
    if (this.data.target && this.data.target.id !== item.id) { wx.showModal({ title: '编号不匹配', content: '这张领养卡与当前碰到的伙伴不是同一只，请核对后重试。', showCancel: false }); return; }
    wx.showModal({ title: '确认领养 ' + item.number, content: '湾月 · ' + item.number + '。演示仅保存在本机，不会读取或写入真实NFC芯片。', success: res => {
      if (!res.confirm) return;
      instances.claim(item); if (item.serial === 1) adopt('star'); addItem('star');
      wx.redirectTo({ url: '/pages/card/index?id=star&tag=' + item.tag });
    } });
  },
  scan() { wx.scanCode({ onlyFromCamera: false, success: res => this.bindCode(res.result), fail: () => wx.showToast({ title: '可手动输入演示码 BUBU-DEMO-BODY-001', icon: 'none' }) }); },
  submit() { this.bindCode(this.data.code); },
  help() { wx.showModal({ title: '演示说明', content: '输入 BUBU-DEMO-BODY-001 可体验加入橱窗。真实绑定、核销与找回需要后端支持。', showCancel: false }); }
});
