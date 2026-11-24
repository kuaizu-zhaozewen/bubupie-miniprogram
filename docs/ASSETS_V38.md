# V3.8 衣装素材记录

生成方式：内置 imagegen，按现有衣装设计与湾月实物风格参考逐项生成；未使用 CLI/API 后备方式。全量提示词和输入路径保存在 [ASSETS_V38.json](ASSETS_V38.json)。

- assets/shop-v38：10件单品/配件图与1张海丝整套商品图，透明 PNG。
- assets/wardrobe-v38：裸本体、海湾工装、骑楼漫游上身图；work-v2.png 为现用工装，work.png 保留作迭代记录。
- assets/wardrobe-v38/layers：原生 SVG 分层插画的材质增强版本，共11层；由 scripts/build-layer-refinements.js 重建，不是生成图的拆层。
- assets/navigation：用已有 SVG 图标系统绘制选中实心与未选中描边状态，由 scripts/build-navigation-icons.js 重建。

首发完整海丝造型继续使用 assets/bayue-floral-cutout.png。新素材是概念效果，不改变实际首发与后续衣装范围。
