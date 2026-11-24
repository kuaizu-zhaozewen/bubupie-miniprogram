const fs=require('fs'),path=require('path'),{createRequire}=require('module');
const root=path.resolve(__dirname,'..'), delivery=path.resolve(root,'../工作成果/布布小伴品牌与换装Demo20261120');
const bundled=createRequire('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/_.js');
const sharp=bundled('sharp'),QR=require('../../tmp/wardrobe-tools/node_modules/qrcode');
const read=f=>fs.readFileSync(path.join(root,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(root,f),s);
async function main(){
  await sharp(path.join(delivery,'品牌字标-红字-无底透明.png')).resize(480).png().toFile(path.join(root,'assets/bubupie-wordmark.png'));
  await sharp(path.join(delivery,'品牌头像-无底透明.png')).resize(512).png().toFile(path.join(root,'assets/bubupie-avatar.png'));
  const old=path.join(delivery,'历史Demo角色图-V2.5.png');
  if(!fs.existsSync(old)) fs.copyFileSync(path.join(root,'assets/bayue-floral-cutout.png'),old);
  await sharp(path.join(delivery,'首发角色透明图.png')).resize(600).png({palette:true}).toFile(path.join(root,'assets/bayue-floral-cutout.png'));
  const wardrobe=require('../utils/wardrobe');
  const qrdir=path.join(root,'assets/wardrobe/qr');fs.mkdirSync(qrdir,{recursive:true});
  for(const fixture of wardrobe.fixtures)await QR.toFile(path.join(qrdir,fixture.code+'.png'),'BUBUPIE:WARDROBE:'+fixture.code,{width:300,margin:4,errorCorrectionLevel:'M',color:{dark:'#181818',light:'#ffffff'}});
  const fixtures=wardrobe.fixtures.map(item=>Object.assign({},item,{payload:'BUBUPIE:WARDROBE:'+item.code,qr:'assets/wardrobe/qr/'+item.code+'.png'}));
  write('docs/wardrobe-demo-codes.json',JSON.stringify(fixtures,null,2));
  write('pages/wardrobe/index.wxss',read('pages/wardrobe/index.wxss').replace('transform:scale(1.75);transform-origin:50% 72%;','padding:12rpx;'));
  let data=read('utils/data.js').replace("edition: '泉州簪花首发款'","edition: '海丝簪花漫游 · 首发'").replace('砖红小拖鞋','海浪青小拖鞋').replace('她戴好簪花','湾月戴好簪花').replace('看看她今天','看看湾月今天').replace('塔米原创角色故事','布布小伴原创角色故事'); write('utils/data.js',data);
  write('utils/share.js',read('utils/share.js').replace('approved TAMI asset','approved BUBU PIE asset').replaceAll('/assets/tami-share-logo.png','/assets/bubupie-wordmark.png'));
  write('pages/bind/index.js',read('pages/bind/index.js').replace("String(code || '').trim().toUpperCase() !== 'TAMI-DEMO'","!['BUBU-DEMO-BODY-001', 'TAMI-DEMO'].includes(String(code || '').trim().toUpperCase())").replaceAll('识别 TAMI-DEMO','识别 BUBU-DEMO-BODY-001').replaceAll('演示码 TAMI-DEMO','演示码 BUBU-DEMO-BODY-001').replaceAll('输入 TAMI-DEMO','输入 BUBU-DEMO-BODY-001'));
  write('pages/bind/index.wxml',read('pages/bind/index.wxml').replaceAll('TAMI-DEMO','BUBU-DEMO-BODY-001').replace('扫描包装内的专属卡片。','扫描包装内的本体领养卡。衣装码请到衣橱绑定。'));
  const project=JSON.parse(read('project.config.json'));project.description='布布小伴 BUBU PIE · 湾月换装与陪伴 Demo V3';project.projectname='bubupie-wardrobe-demo';
  if(!project.packOptions.ignore.some(item=>item.value==='assets/wardrobe/sources'))project.packOptions.ignore.push({type:'folder',value:'assets/wardrobe/sources'});
  write('project.config.json',JSON.stringify(project,null,2)+'\n');
  console.log('V3 project assets + 14 QR fixtures ready; preserved AppID.');
  for(const f of ['bayue-floral-cutout.png','bubupie-wordmark.png']){const info=await sharp(path.join(root,'assets',f)).metadata();console.log(f,info.width,info.height,'alpha',info.hasAlpha);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
