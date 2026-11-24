const config = require('./config');
const items = {
  star: { id: 'star', name: '湾月', edition: '海丝簪花漫游 · 首发', birthday: config.ipBirthday, image: '/assets/bayue-floral-cutout.png', caption: '海风轻轻，湾月陪你。', recordTitle: '穿着小拖鞋，慢慢逛泉州。', recordStory: '巷口做鞋的师傅给湾月做了一双海浪青小拖鞋，鞋面留着一弯海浪。湾月戴好簪花，把帆船和海风收进衣摆。\n\n“我才不是走得慢，是不想错过路边的小花。”\n\n想一起出门，就把湾月挂在包上。碰一碰，看看湾月今天想对你说什么。\n\n布布小伴原创角色故事；做鞋的师傅为虚构人物。' }
};
function getCollection() {
  const ids = wx.getStorageSync('mio_collection');
  return (Array.isArray(ids) ? ids : ['star']).map(id => items[id]).filter(Boolean);
}
function addItem(id) {
  if (!items[id]) return false;
  const ids = wx.getStorageSync('mio_collection') || [];
  if (ids.indexOf(id) !== -1) return false;
  wx.setStorageSync('mio_collection', ids.concat(id));
  return true;
}
function dateText() {
  const d = new Date();
  return `${d.getMonth() + 1}月${d.getDate()}日 · 星期${'日一二三四五六'[d.getDay()]}`;
}
module.exports = { items, getCollection, addItem, dateText };
