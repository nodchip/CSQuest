import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLanternExpedition,expeditionAct,restoreLanternExpedition} from '../src/lantern-expedition.js';

const apply=(s,a)=>{const r=expeditionAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('橋の論理と再送を通って灯台へ到着する',()=>{
 let s=createLanternExpedition();s=apply(s,'move:bridge');assert.equal(expeditionAct(s,'move:tower').ok,false);s=apply(s,'lamp:0');s=apply(s,'move:tower');assert.equal(expeditionAct(s,'move:beacon').ok,false);assert.equal(expeditionAct(s,'send:1').ok,false);
 s=apply(s,'send:0');assert.equal(s.delivered,1);assert.equal(expeditionAct(s,'send:1').ok,false);s=apply(s,'send:0');assert.equal(s.delivered,1);s=apply(s,'send:1');assert.equal(s.delivered,2);s=apply(s,'move:beacon');assert.equal(s.done,true);assert.equal(s.energy,0);
 assert.deepEqual(restoreLanternExpedition({history:s.history}),s);
});
test('木立経由は灯りが足りず、誤った記録は復元できない',()=>{
 let s=createLanternExpedition();s=apply(s,'move:grove');s=apply(s,'move:tower');for(const a of ['send:0','send:0','send:1'])s=apply(s,a);assert.equal(expeditionAct(s,'move:beacon').ok,false);assert.equal(s.energy,0);
 for(const history of [['move:tower'],['move:bridge','move:tower'],['send:0'],Array(65).fill('lamp:0')])assert.throws(()=>restoreLanternExpedition({history}),RangeError);
});
test('到達可能な全状態で灯りと受取件数を保ち、到着経路を検査する',()=>{
 const actions=['move:guild','move:bridge','move:grove','move:tower','move:beacon','lamp:0','lamp:1','send:0','send:1'],key=s=>JSON.stringify([s.place,s.energy,s.lamps,s.phase,s.delivered,s.done]),queue=[createLanternExpedition()],seen=new Set(),ends=[];
 while(queue.length){const s=queue.shift(),k=key(s);if(seen.has(k))continue;seen.add(k);assert.ok(s.energy>=0&&s.energy<=5);assert.equal(s.delivered,s.phase===0?0:s.phase===3?2:1);if(s.done){ends.push(s);continue;}for(const a of actions){const r=expeditionAct(s,a);if(r.ok&&!seen.has(key(r.state)))queue.push(r.state);}}
 assert.ok(ends.length>0);for(const s of ends){assert.equal(s.place,'beacon');assert.equal(s.energy,0);assert.equal(s.delivered,2);assert.deepEqual(s.history.filter(a=>a.startsWith('move:')),['move:bridge','move:tower','move:beacon']);}
});
