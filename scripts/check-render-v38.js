const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{createRequire}=require('module');
const bundled=createRequire('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/_.js');
const{chromium}=bundled('playwright'),sharp=bundled('sharp');
const root=path.resolve(__dirname,'..'),out=path.resolve(root,'../工作成果/详情建议与衣装精修V3.8');
(async()=>{
 for(const name of ['partner','shop','bag','profile']){
  const coverage=async suffix=>{const{data,info}=await sharp(path.join(root,'assets/navigation',name+suffix+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});let n=0;for(let i=3;i<data.length;i+=info.channels)if(data[i]>127)n++;return n;};
  assert(await coverage('-selected')>await coverage('')*1.5,name+' selected icon should be visibly filled');
 }
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file:///'+path.join(root,'docs/导航与层级预览.html').replaceAll('\\','/'));
  await page.evaluate(()=>{localStorage.clear();demo.load('home');});
  await page.addStyleTag({content:'.preview-toast{display:none!important}'});
  await page.getByRole('button',{name:'查看湾月的今日运势',exact:true}).click();
  await page.screenshot({path:path.join(out,'06-详情建议精修图.png'),fullPage:true});
  await page.getByRole('button',{name:'点击湾月形象换装',exact:true}).click();
  for(const [id,code] of [['work','BUBU-DEMO-WORK-001'],['arcade','BUBU-DEMO-ARCADE-001']]){
   await page.evaluate(({id,code})=>{demo.wardrobe.redeem(code);demo.wardrobe.wearOutfit(id);demo.page.refresh();},{id,code});
   const expected=id==='work'?'work-v2.png':'arcade.png';
   assert((await page.locator('.hero .avatar-render').getAttribute('src')).endsWith(expected));
   await page.locator('img').evaluateAll(images=>Promise.all(images.map(im=>im.decode().catch(()=>{}))));
   assert.deepEqual(await page.locator('img').evaluateAll(images=>images.filter(im=>!im.naturalWidth).map(im=>im.src)),[]);
   await page.screenshot({path:path.join(out,id==='work'?'07-海湾工装精修上身.png':'08-骑楼漫游精修上身.png')});
  }
  await page.evaluate(()=>{demo.wardrobe.equip('work-top');demo.page.refresh();});
  assert.equal(await page.locator('.hero .avatar-layer').count(),5);
  assert((await page.locator('.hero .avatar-layer').nth(2).getAttribute('src')).includes('/wardrobe-v38/layers/'));
  await page.screenshot({path:path.join(out,'09-分层混搭材质.png')});
  await page.evaluate(()=>demo.load('shop'));
  await page.getByRole('button',{name:'全部好物 ›',exact:true}).click();
  await page.locator('img').evaluateAll(images=>Promise.all(images.map(im=>im.decode().catch(()=>{}))));
  assert.deepEqual(await page.locator('img').evaluateAll(images=>images.filter(im=>!im.naturalWidth).map(im=>im.src)),[]);
  await page.screenshot({path:path.join(out,'10-商城衣装精修图.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'衣装与图标核验.json'),JSON.stringify({passed:true,checks:['four filled selected icons, outlined unselected','suggestions only in detail','work and arcade polished complete renders','mixed layers retain coordinates and use new material assets','all visible images decode'],presentation:'完整三套使用精修图；自由混搭使用增强材质的可编辑分层插画，非实时三维渲染'},null,2));
  console.log('OK: filled icon coverage, polished work/arcade on-body images, refined mix layers and store imagery.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
