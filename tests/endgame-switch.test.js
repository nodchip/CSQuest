import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {switchCases,replaySwitch} from '../src/endgame-switch.js';
const run=(kind,actions)=>{const x=replaySwitch(kind,actions);assert.ok(x);return x;};
const next=n=>Array(n).fill('next');
test('生信号では一押しが二度に見え、異なる入力では一度',()=>{
 let h=next(9),p=run('raw',h);assert.equal(p.state.count,2);assert.equal(replaySwitch('raw',[...h,'answer:1']),null);
 h.push('answer:2',...next(9));p=run('raw',h);assert.equal(p.state.count,1);h.push('answer:1');assert.equal(run('raw',h).done,true);assert.equal(replaySwitch('raw',[...h,'next']),null);
});
test('３回連続で押下を確定し、短い押下は見逃す',()=>{
 let h=next(6),p=run('filter',h);assert.equal(p.state.count,1);assert.deepEqual(p.state.accepted,[6]);assert.equal(p.state.stable,1);
 h.push(...next(3));p=run('filter',h);assert.equal(p.state.stable,0);h.push('answer:1',...next(9));p=run('filter',h);assert.equal(p.state.count,0);h.push('answer:0');assert.equal(run('filter',h).done,true);
});
test('閾値比較は揺れと短い押下で異なる結果になり途中の記録を再生できる',()=>{
 let h=[],expected=[[1,1],[1,0],[2,1]];
 for(let i=0;i<3;i++){for(const n of [2,3]){h.push(`choose:${n}`,...next(switchCases.compare[i].samples.length));let p=run('compare',JSON.parse(JSON.stringify(h)));assert.equal(p.observed[n].count,expected[i][n-2]);}h.push('check');}
 assert.equal(replaySwitch('compare',[...h,'answer:2']),null);assert.equal(run('compare',[...h,'answer:depends']).done,true);
});
test('押し続けた値は重複せず、解放確定後に再び押下として数える',()=>{
 // 長い揺れの例は 1,1 の後に 0,0、再び 1,1 と続く。
 let h=['choose:2',...next(11),'choose:3',...next(11),'check'];
 // 上記は最初の場面を確定しているので、実際の３場面に進める。
 h=[];for(let i=0;i<2;i++)h.push('choose:2',...next(9),'choose:3',...next(9),'check');
 let p=run('compare',[...h,'choose:2',...next(7)]);assert.equal(p.state.count,2);assert.deepEqual(p.state.accepted,[3,7]);
 p=run('compare',[...h,'choose:3',...next(7)]);assert.equal(p.state.count,0);p=run('compare',[...h,'choose:3',...next(8)]);assert.equal(p.state.count,1);
});
test('早すぎる操作と壊れた履歴を拒否、やり直しは現在の場面を初期化',()=>{
 assert.equal(replaySwitch('raw',['check']),null);assert.equal(replaySwitch('compare',['next']),null);assert.equal(replaySwitch('filter',['next','bogus']),null);
 let p=run('filter',['next','next','reset']);assert.equal(p.state.index,0);assert.equal(p.state.stable,0);assert.equal(p.state.streak,0);
});

test('０回の場面でも check では通れず、対応する正答だけを受け付ける',()=>{
 const h=[...next(9),'answer:1',...next(9)];
 assert.equal(run('filter',h).state.count,0);
 for(const invalid of ['check','answer:','answer:1','answer:-0','answer:0x0','answer:00x','next'])assert.equal(replaySwitch('filter',[...h,invalid]),null,invalid);
 assert.equal(run('filter',[...h,'answer:0']).done,true);
 const raw=next(9);assert.equal(replaySwitch('raw',[...raw,'check']),null);assert.equal(replaySwitch('raw',[...raw,'answer:0']),null);
 const comparison=['choose:2',...next(9),'choose:3',...next(9)];assert.equal(replaySwitch('compare',[...comparison,'answer:1']),null);assert.equal(run('compare',[...comparison,'check']).scene,1);
});
