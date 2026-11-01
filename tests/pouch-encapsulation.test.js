import test from 'node:test';
import assert from 'node:assert/strict';
import {pouchDesigns,pouchActions,pouchRun,createPouch,runPouch,pouchComplete,restorePouch} from '../src/pouch-encapsulation.js';

test('the four designs differ on method validation and direct mutation',()=>{
 const expected={openLoose:[5,6,-1,8],openChecked:[5,3,3,8],hiddenLoose:[5,6,-1,3],hiddenChecked:[5,3,3,3]};
 for(const [design,values] of Object.entries(expected))for(const [i,action] of Object.keys(pouchActions).entries()){const r=pouchRun(design,action);assert.equal(r.a,values[i]);assert.equal(r.b,1);assert.equal(r.valid,r.a>=0&&r.a<=5);}
 assert.equal(pouchRun('hiddenChecked','add').blocked,false);assert.equal(pouchRun('openChecked','direct').blocked,false);assert.equal(pouchRun('hiddenChecked','direct').blocked,true);
});
test('every comparison, guarded design and reflection are needed; saved records are copied',()=>{
 let s=createPouch();for(const design of Object.keys(pouchDesigns)){s={...s,design};for(const action of Object.keys(pouchActions))s=runPouch(s,action);}assert.equal(pouchComplete({...s,answer:'both',checked:true}),true);assert.equal(pouchComplete({...s,design:'hiddenLoose',answer:'both',checked:true}),false);const r=restorePouch({...s,answer:'both',checked:true});r.tried.openLoose=0;assert.equal(s.tried.openLoose,15);assert.equal(pouchComplete(r),false);assert.throws(()=>restorePouch({...s,last:{design:'openLoose',action:'unknown'}}));assert.throws(()=>restorePouch({...s,tried:{...s.tried,hiddenLoose:16}}));
});
