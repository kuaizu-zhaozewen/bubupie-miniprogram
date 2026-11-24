# V3.6 图像素材与提示词

生成方式：内置image_gen工具；未调用API或CLI。角色身份参考：assets/bayue-floral-cutout.png。所有选用的生成结果均已复制到当前工程，保留原始分辨率，不依赖生成目录加载。

| 素材 | 工程位置 | 来源 |
| --- | --- | --- |
| 湾月聊天大头照 | assets/avatars/wan-yue-portrait-v36.png | 本轮图像生成 |
| 帆布袋 | assets/shop/tote.png | 本轮图像生成，概念商品 |
| 手账本 | assets/shop/notebook.png | 本轮图像生成，概念商品 |
| 陶瓷杯 | assets/shop/cup.png | 本轮图像生成，概念商品 |
| 贴纸组 | assets/shop/stickers.png | 本轮图像生成，概念商品 |
| 衣装/配件高清图与套组 | assets/shop/*.png中其余10张 | 现有assets/wardrobe/sources中的可编辑SVG重新渲染，不是新实物摄影 |
| 默认用户圆形头像 | assets/avatars/user-default.svg及.png | 本轮代码绘制的通用用户图标，无个人照片 |

## 大头照最终提示词

Use case: identity-preserve. Asset type: square chat avatar portrait, for a 44px circular crop in the BUBU PIE mini program. Use the reference as identity reference. Create a tightly framed front-facing head-and-shoulders studio portrait of this exact Wan Yue plush character. The face and both floppy ears fill 80% of a square canvas, floral crown visible. Preserve warm grey fluffy fur, peach cream face, large amber eyes, the asymmetrical mischievous small smile, and gold wavy moonlight stitched line on viewer-right cheek. Preserve the colorful Quanzhou floral crown and a hint of cream and teal collar only. No full body, no feet, no keyring, no hanging strap, no letters or logos or text. Smooth pale warm ivory background, soft realistic plush texture, gentle even light, clear face at tiny sizes. The entire face and ears safely inside a centered circle; attractive, friendly, premium toy portrait. 1024x1024 square.

## 四款好物的共用提示词

每件分别调用一次，以下“主体段”插在前后共用段之间：

Use case: product-mockup. Asset: square catalog product photo for BUBU PIE original-character lifestyle merchandise concept.

Use the reference as mascot identity reference, retaining warm grey floppy ears, cream-peach face, amber eyes and gold cheek stitch. Minimal premium studio catalog photography on seamless very pale warm grey #f5f5f7 background, soft diffuse daylight, gentle grounded shadow, refined realistic material detail, ample margin for a 2-column mobile store tile. No prices, no UI, no Apple logos, no watermarks, no text. Single coherent product shot, square 1024x1024.

帆布袋主体段：a premium unbleached ivory canvas tote bag, upright front three-quarter product shot, deep teal handles, a small tasteful centered embroidery-style illustration of the reference plush character's head and colorful flower crown, no letters. A folded silk scarf in teal tied onto one handle. Entire bag including handles visible.

手账主体段：a premium cloth-bound A5 journal notebook in warm ivory, closed, lying at a gentle three-quarter angle, deep teal spine and ribbon bookmark, a small embossed gold crescent moon and a tasteful full-color printed illustration of the reference plush character's head and colorful flower crown on the front cover. Entire notebook visible. No lettering.

陶瓷杯主体段：a premium cream-white ceramic mug, smooth rounded body and a single broad handle, front three-quarter product shot, a tasteful small printed illustration of the reference plush character's head and colorful flower crown on the front and a small teal wave motif below. Whole mug visible. No lettering.

贴纸主体段：a premium stationery set of six individual die-cut vinyl stickers neatly arranged in an airy composition: the reference plush character's head with colorful floral crown, its tiny teal slippers, a gold crescent moon, a teal ocean wave, a colorful floral wreath, a small Quanzhou sailboat. Consistent cute elegant illustration style, clear edges, generous spacing, all objects visible. No lettering.

生成结果用于设计与交互演示；图中的材质、尺寸、配件和印花效果不是量产或售价承诺。
