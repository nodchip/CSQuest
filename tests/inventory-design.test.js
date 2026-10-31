import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDesign,stepDesign,designComplete,restoreDesign} from '../src/inventory-design.js';
test('the fixed slots reject 15 while records support the complete API exercise',()=>{
 let fixed=createDesign('slots');fixed=stepDesign(fixed,'add',15);assert.equal(Object.hasOwn(fixed.records,15),false);assert.match(fixed.message,/棚はありません/);
 let s=createDesign('records');for(const command of [['add',2],['read',7],['add',15],['withdraw',15],['read',15]])s=stepDesign(s,...command);assert.equal(designComplete(s),true);assert.deepEqual(s.records,{2:3,15:1});const again=stepDesign(s,'withdraw',15);assert.equal(designComplete(again),false);assert.equal(stepDesign(again,'withdraw',15).records[15],0);
});
test('history restores state by replay and rejects invalid actions without trusting saved records',()=>{
 let s=createDesign('records');s=stepDesign(s,'add',15);const copy=restoreDesign({...s,records:{15:999}});assert.equal(copy.records[15],2);s.history[0][1]=2;assert.equal(copy.history[0][1],15);assert.throws(()=>restoreDesign({mode:'records',history:[['add',999]]}),RangeError);assert.throws(()=>restoreDesign({mode:'bad',history:[]}),RangeError);
});
