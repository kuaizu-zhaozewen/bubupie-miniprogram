// Calendar inspiration, not a live weather claim or a promise that seasonal SKUs exist.
function recommendations(now = Date.now()) {
  const date = new Date(now + 8 * 3600000), month = date.getUTCMonth() + 1;
  const winter = month >= 10 || month <= 2;
  const list = [{ id: 'season', label: winter ? '秋冬衣橱' : '今日穿搭', title: winter ? '给湾月添件暖暖外套。' : '换身轻快衣装，一起出发。', note: winter ? '一点暖色，陪它迎接冬日。' : '让今天的搭配，跟着心情走。', category: 'wardrobe', productId: winter ? 'work-top' : 'silk-top', image: winter ? '/assets/shop-v38/work-top.png' : '/assets/shop-v38/silk-top.png' }];
  const year = date.getUTCFullYear(), today = Date.UTC(year, month - 1, date.getUTCDate());
  const christmas = Date.UTC(year, 11, 25), birthday = Date.UTC(month === 1 && date.getUTCDate() === 1 ? year : year + 1, 0, 1);
  if (birthday >= today && birthday - today <= 14 * 86400000) list.push({ id: 'birthday', label: '生日小心意', title: '为湾月的生日，挑件小礼物。', note: '1月1日，给喜欢多一点仪式感。', category: 'accessories', productId: 'flower-head', image: '/assets/shop-v38/flower-head.png' });
  else if (christmas >= today && christmas - today <= 21 * 86400000) list.push({ id: 'holiday', label: '节日搭配灵感', title: '节日将近，换个俏皮造型。', note: '用一顶小帽子，点亮节日心情。', category: 'accessories', productId: 'hat-head', image: '/assets/shop-v38/hat-head.png' });
  else list.push({ id: 'daily', label: '日常小心意', title: '把一点喜欢，装进每一天。', note: '选件生活好物，陪你一起慢慢来。', category: 'living', productId: 'tote', image: '/assets/shop/tote.png' });
  return list;
}
module.exports = { recommendations };
