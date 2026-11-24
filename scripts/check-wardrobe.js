const assert=require('assert');const config=require('../utils/config');let store={},page,confirm=true;
global.wx={getStorageSync:k=>store[k],setStorageSync:(k,v)=>{store[k]=JSON.parse(JSON.stringify(v));},showToast:()=>{},showModal:o=>o.success&&o.success({confirm}),scanCode:o=>o.success({result:'BUBUPIE:WARDROBE:BUBU-DEMO-SILK-001'}),previewImage:()=>{}};
const w=require('../utils/wardrobe');const state=()=>w.snapshot();const claim=c=>w.redeem(c);
assert.deepStrictEqual(state().owned,[]);assert(!w.equip('silk-top').ok);assert(!claim('garbage').ok);assert(!claim('https://untrusted.test/?code=BUBU-DEMO-SILK-001').ok);
assert(!claim('BUBU-DEMO-BODY-001').ok);assert(!claim('TAMI-DEMO').ok);
assert(claim('BUBUPIE:WARDROBE:BUBU-DEMO-SILK-001').ok);assert.equal(state().owned.length,4);assert(claim('bubu-demo-silk-001').already);assert.equal(state().owned.length,4);
assert(w.wearOutfit('silk').ok);assert(claim('BUBU-DEMO-WORK-001').ok);assert(claim('BUBU-DEMO-ARCADE-001').ok);assert(claim('BUBU-DEMO-HAT-001').ok);
assert(w.equip('work-top').ok);assert(w.equip('arcade-bottom').ok);assert(w.equip('teal-shoes').ok);assert(w.equip('hat-head').ok);
assert.deepStrictEqual(state().look,{top:'work-top',bottom:'arcade-bottom',shoes:'teal-shoes',head:'hat-head'});
const look=state().look;delete require.cache[require.resolve('../utils/wardrobe')];assert.deepStrictEqual(require('../utils/wardrobe').snapshot().look,look);
assert(w.switchAccount('demo-b'));assert.equal(state().owned.length,0);assert(!claim('BUBU-DEMO-SILK-001').ok);assert(!w.equip('work-top').ok);assert(!w.wearOutfit('silk').ok);assert(claim('BUBU-DEMO-PIECE-01').ok);assert.equal(state().owned.length,1);assert(w.equip('silk-top').ok);assert(!w.equip('silk-bottom').ok);
assert(w.switchAccount('demo-a'));assert.deepStrictEqual(state().look,look);w.remove('head');assert.equal(state().look.head,'');assert.equal(state().look.top,'work-top');assert(!w.remove('__proto__'));
config.enableDemoTools=false;assert(!claim('BUBU-DEMO-PIECE-01').ok);assert(!w.equip('silk-top').ok);assert.equal(state().owned.length,0);assert(!w.reset());config.enableDemoTools=true;
// Page flow: canceled modal grants nothing; camera QR goes through explicit confirmation.
w.reset();global.Page=def=>{page=def;page.setData=function(update){Object.assign(this.data,update);};};require('../pages/character/index');page.onLoad({id:'star'});confirm=false;page.confirmCode('BUBU-DEMO-SILK-001');assert.equal(state().owned.length,0);confirm=true;page.scan();assert.equal(state().owned.length,4);assert.equal(page.data.layers.length,0);page.outfit({currentTarget:{dataset:{id:'silk'}}});assert.equal(page.data.layers.length,4);
page.choose({currentTarget:{dataset:{id:'flower-head'}}});assert.equal(page.data.layers.length,4);page.selectSlot({currentTarget:{dataset:{slot:'head'}}});page.remove();assert.equal(page.data.layers.length,3);
assert(!store.tami_adoptions);assert(!store.mio_collection);
for(const slot of w.slots){page.selectSlot({currentTarget:{dataset:{slot:slot.id}}});page.remove();}
assert.equal(page.data.layers.length,0);assert.equal(page.data.hasDress,true,'removing every piece keeps the bare avatar instead of restoring the launch outfit');assert.equal(page.data.quanzhouScene,false);
console.log('OK: QR confirmation/cancel, invalid/body-code isolation, idempotency, cross-account claim rejection, single-piece redemption, modular mixing, outfit atomicity, persistence, removal, production gating, no adoption grants.');
