import test from 'node:test';
import assert from 'node:assert/strict';
import {schedulePaths,runSchedule,createScheduleLab,scheduleLabAct,restoreScheduleLab,scheduleLabComplete} from '../src/schedule-lab.js';
const act=(s,a)=>{const r=scheduleLabAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('６つの指示順序で、鍵なしは４件で更新が失われ、鍵ありは２個になる',()=>{
 const results=Object.fromEntries(schedulePaths.map(p=>[p,runSchedule(p,false).value]));
 assert.deepEqual(results,{AABB:2,ABAB:1,ABBA:1,BAAB:1,BABA:1,BBAA:2});
 for(const p of schedulePaths){const result=runSchedule(p,true);assert.equal(result.value,2,p);assert.equal(result.pass,true);assert.equal(result.trace.filter(x=>x.includes('鍵を取る')).length,2);assert.equal(result.trace.filter(x=>x.includes('鍵を返す')).length,2);}
 assert.ok(runSchedule('ABAB',true).trace.some(x=>x.includes('待つ')));
 assert.deepEqual(runSchedule('ABAB',false),runSchedule('ABAB',false));
 assert.throws(()=>runSchedule('AAAA',false));assert.throws(()=>runSchedule('ABAB','yes'));
});
test('両方式の全順序と不具合の再現、振り返りが必要',()=>{
 let s=createScheduleLab();for(const p of schedulePaths){s=act(s,`path:${p}`);s=act(s,'run');}
 s=act(s,'mode:locked');for(const p of schedulePaths){s=act(s,`path:${p}`);s=act(s,'run');}
 s=act(s,'answer:controlled');s=act(s,'check');assert.equal(scheduleLabComplete(s),false);
 s=act(s,'mode:open');s=act(s,'path:ABAB');s=act(s,'run');s=act(s,'check');assert.equal(scheduleLabComplete(s),true);
 assert.deepEqual(restoreScheduleLab(JSON.parse(JSON.stringify(s))),s);
});
test('不正な途中記録は再生しない',()=>{assert.throws(()=>restoreScheduleLab({history:['path:AAAA']}));assert.throws(()=>restoreScheduleLab({history:[null]}));assert.throws(()=>restoreScheduleLab({history:Array(129).fill('run')}));});
