const fs=require('fs'),path=require('path'),assert=require('assert'),{createRequire}=require('module');
const bundled=createRequire('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/_.js');
const {chromium}=bundled('playwright');
const out=path.resolve(__dirname,'../../工作成果/详情建议与衣装精修V3.8');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});page.setDefaultTimeout(8000);const errors=[];page.on('pageerror',e=>errors.push(e.message));let accept=true;page.on('dialog',d=>accept?d.accept():d.dismiss());
  const url='file:///'+path.resolve(__dirname,'../docs/商城分销与聊天预览.html').replace(/\\/g,'/');
  const go=(route,query='')=>page.goto(url+'?page='+route+query);
  const search=async value=>{await page.getByPlaceholder('搜索好物，或输入推广关键词领券').fill(value);await page.getByRole('button',{name:'搜索',exact:true}).click();};
  await go('shop');await page.evaluate(()=>{localStorage.clear();demo.load('shop');});
  assert.equal(await page.locator('.category-card').count(),4);assert.equal(await page.locator('.product-card').count(),15);
  const cards=await page.locator('.product-card').evaluateAll(nodes=>nodes.map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,text:n.textContent})));
  assert.equal(cards[0].y,cards[1].y);assert(cards[1].x>cards[0].x);assert(cards.every(x=>!/[¥￥]/.test(x.text)));
  assert(!(await page.locator('#app').innerText()).includes('扫码'));
  await page.locator('.category-card[data-id="living"]').click();assert.equal(await page.locator('.product-card').count(),4);
  await page.evaluate(()=>document.getElementById('toast').hidden=true);await page.screenshot({path:path.join(out,'01-双列分类商城.png'),fullPage:true});
  await page.locator('.product-card[data-id="cup"]').click();assert.equal(await page.locator('.detail-price').textContent(),'¥49.00');
  await page.evaluate(()=>document.getElementById('toast').hidden=true);await page.screenshot({path:path.join(out,'02-商品详情与价格.png'),fullPage:true});
  await page.getByRole('button',{name:'加入购物袋',exact:true}).click();assert.equal(await page.evaluate(()=>demo.commerce.cart().cup),1);
  await page.evaluate(()=>demo.back());await search('不存在的好物');assert.equal(await page.locator('.product-card').count(),0);assert.equal(await page.evaluate(()=>demo.commerce.coupons().length),0);
  await search('海风小店');assert.equal(await page.evaluate(()=>demo.commerce.snapshot().coupon.value),500);assert.equal(await page.evaluate(()=>demo.page.data.availableCount),1);
  await page.evaluate(()=>document.getElementById('toast').hidden=true);await page.screenshot({path:path.join(out,'03-搜索关键词领券.png')});
  await search('巷口伙伴');assert.equal(await page.evaluate(()=>demo.commerce.coupons().length),1);assert.equal(await page.evaluate(()=>demo.commerce.snapshot().coupon.value),500);
  await page.getByRole('button',{name:'查看优惠券 ›',exact:true}).click();assert.equal(await page.locator('.wallet-coupon').count(),1);
  await page.evaluate(()=>document.getElementById('toast').hidden=true);await page.screenshot({path:path.join(out,'04-我的优惠券.png')});
  await page.getByRole('button',{name:'去使用 ›',exact:true}).click();await page.locator('.product-card[data-id="body"]').click();await page.getByRole('button',{name:'加入购物袋',exact:true}).click();await page.getByRole('button',{name:'查看购物袋',exact:true}).click();
  assert.equal(await page.evaluate(()=>demo.page.data.totals.original),'178.00');assert.equal(await page.evaluate(()=>demo.page.data.totals.payable),'173.00');
  accept=false;await page.getByRole('button',{name:'确认模拟订单',exact:true}).click();assert.equal(await page.evaluate(()=>demo.commerce.snapshot().orders.length),0);assert.equal(await page.evaluate(()=>demo.commerce.snapshot().coupon.value),500);accept=true;
  await page.evaluate(()=>document.getElementById('toast').hidden=true);await page.screenshot({path:path.join(out,'05-购物袋与优惠抵扣.png'),fullPage:true});
  await page.getByRole('button',{name:'确认模拟订单',exact:true}).click();assert.equal(await page.evaluate(()=>demo.commerce.snapshot().orders[0].commission),3560);assert.equal(await page.evaluate(()=>demo.commerce.snapshot().orders[0].agentId),'B');
  await go('coupons');await page.getByRole('button',{name:/已使用/}).click();assert.equal(await page.locator('.wallet-coupon').count(),1);
  await page.evaluate(()=>{demo.commerce.enter('湾月好礼',Date.now()-86400000);demo.page.refresh();});await page.getByRole('button',{name:/已过期/}).click();assert.equal(await page.locator('.wallet-coupon').count(),1);assert.equal(await page.getByRole('button',{name:'去使用 ›',exact:true}).count(),0);
  await go('distributor');assert.equal(await page.locator('.agent-keyword').textContent(),'海风小店');assert.equal(await page.locator('.qr-card').count(),0);
  await go('chat','&demo=1&mood=low');await page.evaluate(()=>document.getElementById('toast').hidden=true);await page.screenshot({path:path.join(out,'06-圆形头像与预设问题.png')});
  await page.getByRole('button',{name:/今天的幸运色/}).click();assert.equal(await page.locator('.message-row.user .user-avatar').count(),1);assert.equal(await page.locator('.message-row.friend .friend-avatar').count(),2);assert((await page.locator('.bubble').last().textContent()).includes('浅丁香紫'));
  await page.evaluate(()=>document.getElementById('toast').hidden=true);await page.screenshot({path:path.join(out,'07-左右头像与完整回复.png')});
  for(const width of [320,390,430]){
   await page.setViewportSize({width,height:760});
   for(const route of ['shop','product','bag','coupons','distributor','chat']){
    await go(route,route==='product'?'&id=notebook':'');
    assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),route+' overflow at '+width);
    await page.locator('img').evaluateAll(images=>Promise.all(images.map(im=>im.decode().catch(()=>{}))));const broken=await page.locator('img').evaluateAll(images=>images.filter(im=>im.naturalWidth===0).map(im=>im.src));assert.deepEqual(broken,[],route);
    if(route==='chat'){
     await page.getByRole('button',{name:/今天有什么小预感/}).click();await page.getByPlaceholder('和湾月说点什么…').fill('今天我想去散步，你有什么建议？');await page.getByRole('button',{name:'发送',exact:true}).click();
     const box=await page.locator('.composer-area').boundingBox();assert(box.y+box.height<=761,'composer clipped');
     const round=await page.locator('.friend-avatar').first().evaluate(el=>getComputedStyle(el).borderRadius);assert.equal(round,'50%');
     assert.equal(await page.locator('.user-avatar').count(),2);
     await page.locator('.messages').evaluate(el=>el.scrollTop=el.scrollHeight);
     const bounds=await page.locator('.bubble').last().boundingBox();const area=await page.locator('.messages').boundingBox();assert(bounds.y+bounds.height<=area.y+area.height+1,'last response clipped');
     const avatars=await page.locator('.chat-avatar').evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect();return{x:b.x,right:b.right,w:b.width,h:b.height}}));assert(avatars.every(b=>b.x>=0&&b.right<=width&&b.w===b.h));
    }
   }
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'交互与布局核验.json'),JSON.stringify({passed:true,products:15,categories:4,widths:[320,390,430],verified:['2-column categories/products','no price on list','price in product detail','keyword auto-claim','one coupon across agents','wallet available/used/expired','cancel does not consume coupon','bag persistence','20% commission and last-agent attribution','round headshot','both participant avatars','full scrollable replies','composer inside viewport','no scanner UI','no overflow or broken images'],scope:'Local browser harness with actual WXML/WXSS and Page methods; no device test requested'},null,2));
  console.log('OK: V3.8 full shopping/keyword/coupon/chat flow; 15 products, 4 categories, 3 mobile widths, 7 screenshots.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
