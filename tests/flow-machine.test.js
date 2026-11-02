import {test} from 'node:test';
import assert from 'node:assert/strict';
import {flowMachineInitial,flowMachineNext,flowMachineExecute,flowMachineReplay,flowMachineCreate,flowMachineConfigure,flowMachineStep,flowMachineComplete,flowMachineRestore} from '../src/flow-machine.js';

function oracle(input,config){let pc=0,reg=null,count=input,steps=0,history=[];while(steps<30){let next;if(pc===0){reg=count;next=1;}else if(pc===1)next=reg===0?config.zero:2;else if(pc===2){reg--;next=3;}else if(pc===3){count=reg;next=4;}else if(pc===4)next=config.back;else next='stop';history.push(next);steps++;if(next==='stop')return {status:'done',count,history};pc=next;}return {status:'limit',count,history};}
test('all four branch settings and both inputs agree with independent interpreter',()=>{
 for(const zero of [2,5])for(const back of [0,5])for(const [id,input] of [['zero',0],['two',2]]){const config={zero,back},want=oracle(input,config),s=flowMachineInitial(id),history=[];while(s.status==='running'){const next=flowMachineNext(s,config);for(const wrong of [0,1,2,3,4,5,'stop'].filter(x=>x!==next))assert.throws(()=>flowMachineExecute(structuredClone(s),config,wrong));history.push(next);flowMachineExecute(s,config,next);}assert.deepEqual(history,want.history);assert.equal(s.status,want.status);assert.equal(s.count,want.count);assert.deepEqual(flowMachineReplay(id,config,history),s);assert.throws(()=>flowMachineExecute(s,config,0));}
});
test('changing a branch clears trials; completion and restoration require valid runs',()=>{
 const q=flowMachineCreate();flowMachineStep(q,1);flowMachineConfigure(q,'zero',5);assert.deepEqual(q.trials.zero,[]);flowMachineConfigure(q,'back',0);for(const id of ['zero','two']){q.selected=id;while(true){const s=flowMachineReplay(id,q.config,q.trials[id]);if(s.status!=='running')break;flowMachineStep(q,flowMachineNext(s,q.config));}assert.deepEqual(flowMachineRestore(q),q);}assert.equal(flowMachineComplete(q),false);q.answer='recheck';assert.equal(flowMachineComplete(q),true);const bad=structuredClone(q);bad.trials.two=[5];assert.throws(()=>flowMachineRestore(bad));assert.throws(()=>flowMachineConfigure(q,'back',3));
});
