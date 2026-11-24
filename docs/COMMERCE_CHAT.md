# 商城、分销与IP情境聊天｜V3.5 技术增补

现行V3.6入口已变更：商城搜索推广关键词→领券→选商品→详情显示价格→购物袋用券；不再显示扫码和生成二维码。UI、优惠券中心、头像与最新接口见 [UI_V36.md](UI_V36.md)。本文件下方V3.5扫码部分保留为历史记录，订单/佣金/退款事务约束仍沿用。

日期：2026-11-23。业务规则以 [分销策略](DISTRIBUTION.md) 为准。本轮交付为本机可交互mock；以下正式接口均为待实现契约。原NFC公开今日卡、私密领养码、私密衣装码和完整运势权限继续沿用。

## 路由与状态

14个注册路由：首页发现卡→pages/shop/index；商城→pages/distributor/index；现有“和湾月聊聊”→pages/chat/index。商品选择与确认付款在现有商城页内完成。普通启动仍保留原首页→运势→点击形象换装路径。

商城及代理专属入口：pages/shop/index?scene={opaqueToken}。本机提供 DEMO-MALL-5、DEMO-AGENT-A-5、DEMO-AGENT-B-10 三种场景；二维码内容为 BUBUPIE:SHOP:{token}。生产scene必须由后端发行并解析为渠道/代理/活动；前端传来的agentId、券额、价格或佣金率不可信。

正式独立商城码和每位代理的专属小程序码由服务端对接微信生成，统一指向商城页，scene只装不含个人信息的短令牌；令牌有状态、版本和吊销记录。代理专属页面复用商城模板，展示代理名称、对应活动和商品。小程序冷启动与再次扫码进入均要处理当前入口参数；未登录时暂存入口，登录后由服务端校验并领取。发券失败仍允许浏览商品并重试，不显示“已领取”。

本轮普通二维码由 scripts/build-shop-qr.js 生成并打包，工作台点击“生成”展示对应演示码。它只能供本Demo的wx.scanCode/手输入口解析，不具备从微信扫一扫直接唤起小程序的能力。正式小程序码需有服务端及对应微信环境配置后再联调。微信文档参考：<https://developers.weixin.qq.com/miniprogram/dev/server/API/qrcode-link/qr-code/api_getunlimitedqrcode.html>；本轮无法抓取该页面，接入时核验当前平台参数与权限。

## 券与归因

扫码券族统一使用(accountId, scanCouponFamily, Asia/Shanghai-date)唯一约束，不能按每个代理活动分别发券，否则换码能绕过每日限制。已领取、已使用均占当日领取名额。新码不重复发券，但更新最近有效代理归因。官方商城码不清除最近有效代理。无效/停用/过期令牌不发券、不修改归因。只在消费者下次有效扫描代理时替换归因；归因窗口如需额外时限应由运营另行明确，不预设锁客天数。

券状态：available→reserved→used；超时取消可回available，但不能超过原expiresAt；跨日转expired。正式订单支付创建需在事务内预占券，支付成功回调确认核销，失败/超时释放。并发下单同一券只能成功一次；用户取消确认弹窗不占券。本机模拟不含未支付订单，确认模拟付款时直接核销。

全商城商品可用、minSpendFen=0；抵扣=min(券面额,商品金额)，余额不找零。Demo支持整单退款：退回实付、冲回原价与佣金，当日未过期券恢复可用，过期不延长；正式返券、叠加、拆单及部分退款券分摊需运营确认后配置。生日月券仍为独立未配置活动，不能拿扫码券替代生日规则。

## 金额、订单与账本

所有金额使用整数分，服务端计算。OrderLine保留skuId、quantity、unitOriginalFen、lineOriginalFen、实际优惠分摊和价格版本。Order保留originalMerchandiseFen、shippingFen、couponDiscountFen、payableFen、couponClaimId、couponSourceToken、attributionToken、agentId、commissionRateBps=2000、commissionFen、ruleVersion和状态。

创建订单时重验SKU、库存、券、归因和价格，锁定原价与20%规则快照；调价、停用代理或再次扫码均不得直接改写已成订单金额/归属。支付回调验签并幂等验证商户订单、币种及应付金额；不能把前端“支付成功”当作到账。重复请求通过(accountId,idempotencyKey)返回同一订单。库存、券预占及订单建立保持事务一致。

佣金账本事件建议：payment_confirmed产生pending；receipt_confirmed且after_sale_closed产生eligible；对账后settlement_paid产生settled；退款事件refunded/reversed冲回对应佣金。未收货或售后未结束不得结算，有退款争议冻结对应金额。批次结算以唯一批次号、订单账本去重，真实转账需平台结算服务确认，不接受代理客户端自行标记支付完成。

部分退款按退款商品对应原价冲回20%佣金，消费者只退其实际支付分摊额。优惠按行分摊时采用可复核的余数分配；按累计退款原价重算应冲佣金再减已冲金额，避免逐次四舍五入造成多冲/少冲；累计不可超过原单佣金。已结算退款单独产生待抵扣或追回应收，保留原始已结算记录。本机仅演示整单退款与待抵扣数，不实现实际追款或后续批次自动抵扣。

代理工作台汇总：订单数、原价销售额、退款原价、有效原价销售额、累计用券额（历史实际抵扣额，不冒充净券成本）、累计有效佣金、待结算、可结算、累计已结算及结算后退款待抵扣。只返回当前服务端代理身份的数据，不能靠query.agentId切换查看。平台管理接口另设权限与审计。

## 待实现接口

| 接口 | 权限与输入 | 返回/事务要求 |
| --- | --- | --- |
| GET /v1/mall/entry?scene= | 公开限流；令牌 | 渠道展示、活动状态；不直接发行券 |
| POST /v1/mall/entry-claims | 登录；scene；幂等键 | 原子记录有效扫码归因、每日领券/既有券，不重复发放 |
| GET /v1/mall/products | 公开 | 实际SKU、原价、库存、售卖状态 |
| POST /v1/mall/quotes | 登录；sku/数量/couponClaimId | 服务端报价、折扣与过期时点 |
| POST /v1/mall/orders | 登录；sku/数量/couponClaimId；幂等键 | 价格重验、库存/券预占、归因与佣金快照 |
| POST /v1/mall/orders/{id}/payment | 订单本人 | 微信支付服务参数；前端不得直接置paid |
| POST /v1/payment-notifications | 服务端验签 | 幂等确认支付、核销券、佣金计提 |
| GET /v1/me/orders | 登录 | 仅本人订单，收货及退款入口按状态开放 |
| POST /v1/me/orders/{id}/receipt | 订单本人 | 收货确认；售后期限由服务端计算 |
| POST /v1/me/orders/{id}/refunds | 订单本人；商品/数量/原因；幂等键 | 创建申请，审核/支付退款成功后再冲销售与佣金 |
| GET /v1/agent/me/dashboard | 已审核有效代理 | 本人汇总及脱敏订单，无消费者生日/私聊 |
| POST /v1/agent/me/promotion-codes | 已审核有效代理 | 服务端生成/复用专属scene和正式小程序码 |
| POST /v1/admin/settlement-batches | 平台结算角色 | 审核可结算额、退款抵扣、生成可对账批次 |

错误状态至少覆盖：TOKEN_INVALID、CAMPAIGN_INACTIVE、COUPON_ALREADY_CLAIMED（返回既有状态）、COUPON_EXPIRED、COUPON_USED、PRICE_CHANGED、OUT_OF_STOCK、ORDER_STATE_CONFLICT、AGENT_FORBIDDEN。重试不重复扣券、扣库存、记佣金或退款。

## “和IP聊一聊”：问好与三个预设问题

进入先问好：“海风把你带来啦，我是湾月。今天想和我聊点什么？先选一个小问题也可以。”问好下直接展示：

1. 让湾月看看，今天宜做什么、忌做什么？
2. 今天的幸运色是什么，适合怎么穿？
3. 湾月今天有什么小预感？

点击后写入一条用户消息，再给角色回复。复用运势页同一ipId、Asia/Shanghai日期、mood、contentVersion，不额外随机抽运势、不用用户生日计算用户命运。开心态提供主动尝试、散步/问候、海浪青穿搭；低落态提供放慢、热饭/小整理、浅丁香紫舒适穿搭；小预感有具体事情、原因与可尝试行动。保留“也许/我猜”的角色口吻。

getDaily是现有本地演示日状态生成器，不是真实命理计算。三个回答由utils/chat-prompts.js情境模板生成，未接AI。手输包含运势、幸运色、穿搭、预感等词可命中对应模板，其余仍为倾听示例；不可把它称为开放式AI能力。跨日重新取当天快照，历史消息保留原文日期。演示从运势页带入心情，仅mock且enableDemoTools时接受覆盖参数。

正式POST /v1/chat/messages建议扩充{ipId,conversationId,clientMessageId,promptId?,text?}；promptId由服务端白名单匹配。服务端鉴权后读取当日已发布快照、角色资料和固定问题模板，拼接可信上下文；模型返回reply、date、contentVersion、personaVersion、promptId。模型不可自行修改原始运势数值。没有当日内容时返回CONTENT_NOT_READY，不编造“今日”结果；可用审核模板降级。沿用原文档的文本服务限流、输入边界、私聊数据处理及长聊评审约束，长聊付费仍未实施。

## 湾月生日

角色固定生日已确定为2027-01-01，birthdayMMDD为01-01；同时保存完整年月日，不能只保留月日而丢失2027。utils/config.js、角色数据、介绍页/今日卡/运势页及ip-persona.example.json均使用该值。用户个人生日仍独立选填。真实运势源如还需要出生时刻、地点或历法，保持待配置，不据此补造。

## 实现文件与验证

utils/commerce.js为本机领券、归因、金额、订单和佣金状态；pages/shop为商城；pages/distributor为演示工作台；utils/chat-prompts.js与pages/chat为情境对话。bubupie_commerce_v1缓存两个演示买家及两位代理的本机订单，非微信身份；关闭mock或enableDemoTools即隐藏并拒绝模拟商业状态操作。无真实账号、跨设备、地址、运费、支付、物流、发券、AI或结算服务器。

验证命令：node scripts/check-commerce-chat.js；node scripts/build-preview.js；node scripts/check-commerce-browser.js；既有check-flows、check-wardrobe、check-tap-interaction、check-scenery、check-detail-dressing；python scripts/check_project.py。WXML/WXSS编译另用现有微信开发者工具编译器检查。网页实际模板预览不替代微信模拟器和真机。

上线验收还需：真实登录与代理隔离、正式码冷/热启动及停用、并发领券/占券、23:59:59与次日00:00、价格变化、支付重放/取消/超时、库存、部分退款分摊、重复结算、结算后抵扣、服务异常回退；iOS/Android真机扫码、支付与分享。运营仍需确定券正式面额、定价、售后天数、结算周期与返券/叠加细则。
