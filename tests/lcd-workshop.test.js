import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {lcdTargets,lcdOutput,lcdCreate,lcdInspect,lcdComplete,lcdRestore} from '../src/lcd-workshop.js';

test('all binary channel settings and backlight states give the expected output',()=>{
  for(const light of [false,true])for(let mask=0;mask<8;mask++){
    const voltage=Array.from({length:3},(_,i)=>Boolean(mask&(1<<i)));
    assert.deepEqual(lcdOutput(light,voltage),voltage.map(v=>light&&!v?1:0));
  }
  assert.throws(()=>lcdOutput(true,[true]));assert.throws(()=>lcdOutput(1,[false,false,false]));
});
test('black with the lamp off does not fulfill the black task; all cases and reflection are needed',()=>{
  const q=lcdCreate();q.target='black';q.backlight=false;lcdInspect(q);assert.deepEqual(q.completed,[]);
  q.backlight=true;for(const [target,c] of Object.entries(lcdTargets)){q.target=target;q.voltage=c.values.map(v=>!v);lcdInspect(q);}
  assert.equal(lcdComplete(q),false);q.reflection='valve';assert.equal(lcdComplete(q),true);
  const copy=lcdRestore(q);copy.voltage[0]=false;assert.equal(q.voltage[0],true);
  assert.throws(()=>lcdRestore({...q,last:{...q.last,output:[1,0,0]}}));
});
