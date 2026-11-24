const wardrobe = require('./wardrobe');
const scenery = require('./scenery');

function initialData() {
  return { slots: wardrobe.slots, activeSlot: 'top', rows: [], layers: [], outfitRows: [], code: '', codes: [], account: 'demo-a', ownedCount: 0, enabled: wardrobe.enabled(), selectionText: '绑定衣装后，在这里直接搭配。', showCodes: false, showBindPanel: false, showDemoTools: false, hasDress: false, quanzhouScene: true };
}

const methods = {
  refresh() {
    const state = wardrobe.snapshot(), owned = state.owned, look = state.look;
    const layers = ['bottom', 'top', 'shoes', 'head'].map(slot => wardrobe.byId[look[slot]]).filter(Boolean);
    this.setData({
      account: state.account, ownedCount: owned.length, enabled: wardrobe.enabled(),
      // A new visitor sees the launch look; a bound wardrobe can intentionally be bare.
      hasDress: owned.length > 0, layers, quanzhouScene: scenery.isQuanzhou(layers, owned.length === 0),
      rows: wardrobe.items.filter(item => item.slot === this.data.activeSlot).map(item => Object.assign({}, item, { owned: owned.includes(item.id), selected: look[item.slot] === item.id })),
      outfitRows: wardrobe.outfits.map(item => Object.assign({}, item, { ready: item.pieces.every(id => owned.includes(id)) })),
      selectionText: owned.length ? wardrobe.slots.map(slot => wardrobe.byId[look[slot.id]] ? wardrobe.byId[look[slot.id]].name : slot.name + '未穿戴').join(' · ') : '绑定衣装后，在这里直接搭配。',
      codes: wardrobe.fixtures.map(item => Object.assign({}, item, { qr: '/assets/wardrobe/qr/' + item.code + '.png' }))
    });
  },
  selectSlot(e) { this.setData({ activeSlot: e.currentTarget.dataset.slot }); this.refresh(); },
  choose(e) { const result = wardrobe.equip(e.currentTarget.dataset.id); if (!result.ok) this.toast(result.error); this.refresh(); },
  remove() { wardrobe.remove(this.data.activeSlot); this.refresh(); },
  outfit(e) { const result = wardrobe.wearOutfit(e.currentTarget.dataset.id); if (!result.ok) this.toast(result.error); this.refresh(); },
  toggleBind() { this.setData({ showBindPanel: !this.data.showBindPanel }); },
  toggleDemoTools() { this.setData({ showDemoTools: !this.data.showDemoTools }); },
  input(e) { this.setData({ code: e.detail.value }); },
  bind() { this.confirmCode(this.data.code); },
  confirmCode(code) {
    const result = wardrobe.inspectCode(code);
    if (!result.ok) { this.toast(result.error); return; }
    const account = this.data.account;
    wx.showModal({ title: result.already ? '你已经拥有这件衣装' : '绑定到我的衣橱', content: result.name + '，共 ' + result.pieces.length + ' 个部件。仅本机演示，不会绑定真实商品。', success: res => {
      if (!res.confirm) return;
      if (wardrobe.snapshot().account !== account) { this.toast('账号已变化，请重新绑定'); return; }
      const redeemed = wardrobe.redeem(code);
      if (redeemed.ok) { this.setData({ code: '' }); this.toast(redeemed.already ? '已绑定，可自由搭配' : '已加入衣橱，点选试穿'); }
      else this.toast(redeemed.error);
      this.refresh();
    } });
  },
  scan() { if (!wardrobe.enabled()) { this.toast('衣装绑定服务尚未接入'); return; } wx.scanCode({ onlyFromCamera: false, scanType: ['qrCode'], success: res => this.confirmCode(res.result), fail: res => { if (!/cancel/i.test(res.errMsg || '')) this.toast('扫描失败，也可以手动输入'); } }); },
  toggleCodes() { this.setData({ showCodes: !this.data.showCodes }); },
  useCode(e) { this.setData({ code: e.currentTarget.dataset.code }); },
  previewCode(e) { const url = e.currentTarget.dataset.url; wx.previewImage({ current: url, urls: [url] }); },
  account(e) { wardrobe.switchAccount(e.currentTarget.dataset.account); this.refresh(); },
  reset() { wx.showModal({ title: '重置衣橱演示', content: '清空本机两个演示账号的衣装权益、搭配和核销记录。不会清除 IP 领养、昵称或生日。', success: res => { if (res.confirm) { wardrobe.reset(); this.refresh(); } } }); },
  toast(title) { wx.showToast({ title, icon: 'none' }); }
};

module.exports = { initialData, methods };
