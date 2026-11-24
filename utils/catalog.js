// Demo merchandise: all prices and unlaunched concepts are for interaction review.
const categories = [
  { id: 'friends', name: 'IP伙伴', subtitle: '把陪伴带回家', image: '/assets/bayue-floral-cutout.png' },
  { id: 'wardrobe', name: '换装衣橱', subtitle: '今天换个心情', image: '/assets/shop-v38/silk-top.png' },
  { id: 'accessories', name: '小小配件', subtitle: '细节也很可爱', image: '/assets/shop-v38/flower-head.png' },
  { id: 'living', name: '生活好物', subtitle: '日常多一点喜欢', image: '/assets/shop/cup.png' }
];
const products = [
  { id: 'body', category: 'friends', name: '湾月 · 首发伙伴', subtitle: '水墨雾灰，海丝簪花漫游。', price: 12900, image: '/assets/bayue-floral-cutout.png', badge: '首发形象', description: '一只戴着簪花、穿着小拖鞋的湾月。把喜欢挂在包上，也给每天的小心情留个位置。', highlights: ['水墨雾灰本体与首套衣装', '整圈簪花与海浪青小拖鞋', '角色生日：2027年1月1日'] },
  { id: 'outfit', category: 'wardrobe', name: '海丝簪花漫游套组', subtitle: '把泉州的风，穿在身上。', price: 3900, image: '/assets/shop-v38/silk-outfit.png', badge: '衣装示意', description: '奶油白斜襟短衫、靛蓝短裤，配上整圈簪花与海浪青拖鞋。用一套衣装装下泉州街巷的灵感。', highlights: ['上衣、短裤、拖鞋与簪花四件示意', '适配湾月角色', '购买演示不自动发放数字衣装'] },
  { id: 'shoes', category: 'accessories', name: '海浪青小拖鞋', subtitle: '踩着小海浪，慢慢走。', price: 1900, image: '/assets/shop-v38/teal-shoes.png', badge: '配件示意', description: '海浪青与奶油白的轻巧配色，让湾月的每一步都有一点海风。', highlights: ['一双配套拖鞋', '海浪纹样灵感', '搭配效果以打样为准'] },
  { id: 'silk-top', category: 'wardrobe', name: '海丝斜襟短衫', subtitle: '奶油白，遇见一抹海浪青。', price: 1900, image: '/assets/shop-v38/silk-top.png', badge: '衣装示意' },
  { id: 'work-top', category: 'wardrobe', name: '海湾工装外套', subtitle: '把冒险，装进口袋。', price: 2400, image: '/assets/shop-v38/work-top.png', badge: '后续款示意' },
  { id: 'arcade-top', category: 'wardrobe', name: '骑楼拼色棒球服', subtitle: '随心漫游，轻快出发。', price: 2400, image: '/assets/shop-v38/arcade-top.png', badge: '后续款示意' },
  { id: 'silk-bottom', category: 'wardrobe', name: '靛蓝宽松短裤', subtitle: '怎么搭，都自在。', price: 1500, image: '/assets/shop-v38/silk-bottom.png', badge: '衣装示意' },
  { id: 'arcade-bottom', category: 'wardrobe', name: '沙色工装短裤', subtitle: '收集每一段小小旅程。', price: 1500, image: '/assets/shop-v38/arcade-bottom.png', badge: '后续款示意' },
  { id: 'flower-head', category: 'accessories', name: '整圈簪花花冠', subtitle: '把街巷的颜色，戴在头上。', price: 2200, image: '/assets/shop-v38/flower-head.png', badge: '配件示意' },
  { id: 'hat-head', category: 'accessories', name: '海风软檐帽', subtitle: '晴天，适合去吹吹风。', price: 1800, image: '/assets/shop-v38/hat-head.png', badge: '探索款示意' },
  { id: 'brick-shoes', category: 'accessories', name: '砖红海浪拖鞋', subtitle: '一点暖色，一点俏皮。', price: 1900, image: '/assets/shop-v38/brick-shoes.png', badge: '后续款示意' },
  { id: 'tote', category: 'living', name: '海风随行帆布袋', subtitle: '装下今天，也装下喜欢。', price: 5900, image: '/assets/shop/tote.png', badge: '概念好物', description: '奶油色帆布、海浪青提手，和一张熟悉的湾月笑脸。无论上课、散步还是逛街，都带一点轻轻的陪伴。', highlights: ['帆布与印花设计概念', '海浪青提手与小丝巾', '未量产；材质与尺寸待确认'] },
  { id: 'notebook', category: 'living', name: '月光慢记手账', subtitle: '好好记下，每一件小事。', price: 3900, image: '/assets/shop/notebook.png', badge: '概念好物', description: '给灵感、待办与小小心事留一页空白。奶油色与海浪青，是湾月最熟悉的日常。', highlights: ['布纹封面设计概念', '月光与湾月主题', '内页、尺寸及工艺待确认'] },
  { id: 'cup', category: 'living', name: '湾月暖暖陶瓷杯', subtitle: '热乎乎的一口，也是小确幸。', price: 4900, image: '/assets/shop/cup.png', badge: '概念好物', description: '圆润的奶油白杯身，配上一张湾月笑脸。今天先喝口水，让心情慢慢变暖。', highlights: ['奶油白与海浪纹样设计概念', '舒展的圆形握柄', '容量、材质与工艺待打样确认'] },
  { id: 'stickers', category: 'living', name: '湾月心情贴纸组', subtitle: '哪里都可以，留下一点可爱。', price: 1200, image: '/assets/shop/stickers.png', badge: '概念好物', description: '湾月、簪花、月牙、小拖鞋、海浪与帆船。把喜欢贴在手账和日常里。', highlights: ['六枚主题图案设计概念', '角色与泉州灵感', '材质、尺寸及成品效果待确认'] }
].map(p => Object.assign({ description: '为湾月准备的一件小小好物。自由搭配，给喜欢留个位置。图片为款式与交互示意，实物以上市确认信息为准。', highlights: ['湾月角色专属搭配灵感', '图片为款式示意', '上市与工艺以正式发布为准'] }, p, { note: '演示定价 · 未开放真实购买', gallery: [p.image] }));
module.exports = { categories, products };
