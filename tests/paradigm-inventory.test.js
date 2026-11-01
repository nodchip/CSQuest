import test from 'node:test';
import assert from 'node:assert/strict';
import {inventoryDesigns,inventoryActions,inventorySequence,runParadigmInventory,createParadigmInventory,stepParadigmInventory,paradigmInventoryComplete,restoreParadigmInventory} from '../src/paradigm-inventory.js';

test('all operation sequences through length five match an independent model of old and current versions',()=>{
 for(const mode of Object.keys(inventoryDesigns)){
  function visit(actions,n){let current=2,prior=2;const outputs=[];for(const a of actions){if(a==='add'){if(current>=3)outputs.push('full');else{current++;if(mode!=='functional')prior=current;outputs.push(''+current);}}else if(a==='direct'){if(mode==='procedural'){current=prior=5;outputs.push('5');}else outputs.push('blocked');}else outputs.push(''+prior);}assert.deepEqual(runParadigmInventory(mode,actions),{current,old:prior,results:outputs});if(n)for(const a of Object.keys(inventoryActions))visit([...actions,a],n-1);}visit([],5);
 }
});
test('retries do not change state, all designs and reflection are required, and records validate',()=>{
 let s=createParadigmInventory();s.trials.procedural.prediction='2';assert.deepEqual(stepParadigmInventory(s).trials.procedural.history,[]);
 for(const mode of Object.keys(inventoryDesigns)){s.mode=mode;for(const action of inventorySequence){const t=s.trials[mode];t.prediction=runParadigmInventory(mode,[...t.history,action]).results.at(-1);s=stepParadigmInventory(s);}}
 assert.deepEqual(runParadigmInventory('procedural',inventorySequence).results,['3','full','5','5']);
 assert.deepEqual(runParadigmInventory('object',inventorySequence).results,['3','full','blocked','3']);
 assert.deepEqual(runParadigmInventory('functional',inventorySequence).results,['3','full','blocked','2']);
 s.answer='designs';s.checked=true;assert.ok(paradigmInventoryComplete(restoreParadigmInventory(s)));
 assert.throws(()=>restoreParadigmInventory({...s,trials:{...s.trials,object:{history:['old'],prediction:null}}}));
});
