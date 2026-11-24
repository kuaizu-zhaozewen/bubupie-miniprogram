// Only the four primary destinations are tabs. Content links push secondary pages.
const tabs = { home: '/pages/home/index', shop: '/pages/shop/index', bag: '/pages/bag/index', profile: '/pages/profile/index' };
function switchTo(name) { if (tabs[name]) wx.switchTab({ url: tabs[name] }); }
function openShop(options = {}) {
  const params = Object.keys(options).filter(k => options[k] !== undefined && options[k] !== '').map(k => encodeURIComponent(k) + '=' + encodeURIComponent(options[k])).join('&');
  wx.navigateTo({ url: '/pages/shop-entry/index' + (params ? '?' + params : '') });
}
module.exports = { tabs, switchTo, openShop };
