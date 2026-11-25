const assert=require('assert/strict'),path=require('path');
const store={},nav=[];let page,confirm=true;
global.wx={getStorageSync:k=>store[k],setStorageSync:(k,v)=>store[k]=v,showModal:o=>o.success&&o.success({confirm}),showToast:()=>{},redirectTo:o=>nav.push(o.url),navigateTo:o=>nav.push(o.url),showShareMenu:()=>{}};
global.Page=p=>{page=p;p.data=JSON.parse(JSON.stringify(p.data));p.setData=function(v){Object.assign(this.data,v);};};
function load(name){const p=path.resolve(__dirname,'../pages/'+name+'/index.js');delete require.cache[p];require(p);return page;}
const instances=require('../utils/instances'),config=require('../utils/config');const[a,b]=instances.fixtures;
let bind=load('bind');bind.onLoad({tag:b.tag});bind.bindCode(a.code);assert(!instances.owned(a));assert(!instances.owned(b));
confirm=false;bind.bindCode(b.code);assert(!instances.owned(b));confirm=true;bind.bindCode(b.code);assert(instances.owned(b));assert(!instances.owned(a));bind.bindCode(b.code);assert.equal(store.bubupie_instances_v1.length,1);
let card=load('card');card.onLoad({tag:a.tag});assert(!card.data.owner);assert.equal(card.data.instance.number,'No.0001');card.onLoad({tag:b.tag});assert(card.data.owner);assert.equal(card.data.instance.number,'No.0002');assert(card.onShareAppMessage().path.includes(b.tag));assert(!JSON.stringify(card.onShareAppMessage()).includes(b.code));
let fortune=load('fortune');fortune.onLoad({tag:b.tag});assert.equal(fortune.data.instanceNumber,'No.0002');
card=load('card');card.onLoad({tag:'invalid'});assert(card.data.identityError);assert.equal(card.data.instance,null);
config.enableDemoTools=false;assert.equal(instances.findCode(a.code),null);bind=load('bind');bind.onLoad();bind.bindCode(a.code);assert(!instances.owned(a));config.enableDemoTools=true;
console.log('OK: fixed two-instance identity, mismatched card rejected, cancel, idempotency, instance ownership isolation, shared public tag without secret, invalid tag, production gate.');
