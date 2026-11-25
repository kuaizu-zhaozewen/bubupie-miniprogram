const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{createRequire}=require('module');
const bundled=createRequire('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1123-915-0_26.1123.915.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/_.js');
const{chromium}=bundled('playwright');const out=path.resolve(__dirname,'../../工作成果/NFC固定编号V3.9');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});p.on('dialog',d=>d.accept());const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file:///'+path.resolve(__dirname,'../docs/导航与层级预览.html').replaceAll('\\','/'));await p.evaluate(()=>{localStorage.clear();demo.load('profile');});await p.addStyleTag({content:'.preview-toast{display:none!important}'});
 await p.getByRole('button',{name:/碰一碰测试/}).click();assert.equal(await p.evaluate(()=>demo.route),'card');assert(await p.locator('.quote').isVisible());assert.equal(await p.locator('.instance-badge text').count(),0);assert((await p.locator('.instance-badge').innerText()).includes('No.0001'));await p.screenshot({path:path.join(out,'01-碰一碰一句话与编号.png'),fullPage:true});
 await p.getByRole('button',{name:'No.0002',exact:true}).click();assert((await p.locator('.instance-badge').innerText()).includes('No.0002'));
 await p.getByRole('button',{name:/领养湾月/}).click();assert.equal(await p.evaluate(()=>demo.route),'bind');assert((await p.locator('.identity-card').innerText()).includes('No.0002'));await p.screenshot({path:path.join(out,'02-核对待领养编号.png')});
 await p.getByPlaceholder('BUBU-DEMO-BODY-001').fill('BUBU-DEMO-BODY-002');await p.getByRole('button',{name:'绑定',exact:true}).click();assert.equal(await p.evaluate(()=>demo.route),'card');assert((await p.locator('.instance-badge').innerText()).includes('No.0002'));await p.getByRole('button',{name:/查看湾月今天的完整运势/}).click();assert((await p.locator('.serial-label').innerText()).includes('No.0002'));await p.screenshot({path:path.join(out,'03-领养后的固定编号.png')});
 for(const width of [320,390,430]){await p.setViewportSize({width,height:844});assert(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));}
 assert.deepEqual(errors,[]);console.log('OK: visible profile test entry, 0001/0002 public cards, matching claim/confirm, owned detail, 3 viewport widths.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
