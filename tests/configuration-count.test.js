import {test} from 'node:test';
import assert from 'node:assert/strict';
import {configSizes,configModes,configCountReplay,configCountCreate,configCountAdvance,configCountComplete,configCountRestore} from '../src/configuration-count.js';

test('each counter visits all configurations and either halts or first repeats the initial one',()=>{
 for(const bits of configSizes)for(const mode of Object.keys(configModes)){const size=2**bits,last=mode==='halt'?size-1:size,states=[];for(let t=0;t<=last;t++){const s=configCountReplay(bits,mode,t);assert.equal(s.value,t%size);assert.equal(s.visited,new Set([...states,s.value]).size);states.push(s.value);assert.equal(s.status,t===last?(mode==='halt'?'halt':'repeat'):'running');}assert.equal(new Set(states.slice(0,size)).size,size);if(mode==='cycle')assert.equal(states.at(-1),states[0]);assert.throws(()=>configCountReplay(bits,mode,last+1));}
});
test('all six trials and both claims are required; restored trials are independent',()=>{
 let q=configCountCreate();for(const bits of configSizes)for(const mode of Object.keys(configModes)){q.bits=bits;q.mode=mode;while(configCountReplay(bits,mode,q.ticks[bits][mode]).status==='running'){configCountAdvance(q,4);q=configCountRestore(q);}}q.countAnswer='power';q.relationAnswer='equal';assert.equal(configCountComplete(q),false);q.relationAnswer='subset';assert.equal(configCountComplete(q),true);const copy=configCountRestore(q);copy.ticks[2].cycle--;assert.equal(configCountComplete(copy),false);assert.equal(configCountComplete(q),true);assert.throws(()=>configCountRestore({...q,ticks:{...q.ticks,2:{halt:4,cycle:0}}}));
});
