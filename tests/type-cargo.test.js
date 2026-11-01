import test from 'node:test';
import assert from 'node:assert/strict';
import {cargoKinds,cargoValues,cargoLabel,createTypeCargo,sendTypeCargo,typeCargoComplete,restoreTypeCargo} from '../src/type-cargo.js';
test('product and tagged sum enumerate all distinct values including same spelling with different tags',()=>{
 assert.equal(cargoValues('pair').length,6);assert.equal(cargoValues('sum').length,5);assert.notEqual(cargoLabel('sum:light:moon'),cargoLabel('sum:stone:moon'));
 assert.throws(()=>cargoLabel('sum:light:rain'));let s=createTypeCargo();assert.equal(sendTypeCargo(s).pair.delivered.length,0);
 for(const light of cargoKinds.light.values)for(const stone of cargoKinds.stone.values){s.pair.light=light;s.pair.stone=stone;s=sendTypeCargo(s);}
 assert.deepEqual(new Set(s.pair.delivered),new Set(cargoValues('pair')));assert.equal(sendTypeCargo(s).pair.delivered.length,6);
 s.mode='sum';for(const [kind,info] of Object.entries(cargoKinds))for(const value of info.values){s.sum.kind=kind;s.sum.value=value;s=sendTypeCargo(s);}
 assert.deepEqual(new Set(s.sum.delivered),new Set(cargoValues('sum')));assert.equal(typeCargoComplete(s),false);s.answer='tag';s.checked=true;assert.ok(typeCargoComplete(restoreTypeCargo(s)));
});
test('restore rejects duplicates and mismatched kinds',()=>{
 const s=createTypeCargo();s.sum.delivered=['sum:light:moon','sum:light:moon'];assert.throws(()=>restoreTypeCargo(s));
 s.sum.delivered=[];s.sum.kind='light';s.sum.value='rain';assert.throws(()=>restoreTypeCargo(s));
});
