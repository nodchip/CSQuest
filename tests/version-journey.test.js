import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createVersionRun,versionAct,restoreVersionRun,versionRelease,createVersionJourney,versionJourneyComplete,restoreVersionJourney} from '../src/version-journey.js';

const act=(s,a)=>{const r=versionAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
function run(mode,resolution){let s=createVersionRun(mode);for(const a of ['offline','edit','remote','commit'])s=act(s,a);assert.equal(s.offlineAttempt,true);assert.equal(s.localCommit,mode==='distributed');s=act(s,'online');s=act(s,mode==='central'?'commit':'publish');assert.equal(s.rejected,true);s=act(s,'fetch');if(mode==='distributed'){assert.equal(s.conflict,false);s=act(s,'merge');}assert.equal(s.conflict,true);s=act(s,`resolve:${resolution}`);s=act(s,'commit');if(mode==='distributed'){assert.equal(s.done,false);assert.equal(s.mergeCommit,true);s=act(s,'publish');}return s;}
test('両方式と２種類の競合解決を最後まで追跡する',()=>{
 for(const mode of ['central','distributed'])for(const choice of ['north','south']){const s=run(mode,choice);assert.equal(s.done,true);assert.equal(s.resolution,choice);assert.deepEqual(restoreVersionRun(mode,{history:s.history}),s);}
});
test('手順を飛ばせず、壊れた操作記録を拒否する',()=>{
 const s=createVersionRun('distributed');for(const action of ['commit','publish','fetch','merge','resolve:north','online'])assert.equal(versionAct(s,action).ok,false);
 for(const history of [['edit'],['offline','remote'],['offline','edit','remote','online'],Array(65).fill('offline')])assert.throws(()=>restoreVersionRun('central',{history}),RangeError);
});
test('固定版と最新の区別、両方式と振り返りを検証する',()=>{
 assert.deepEqual(versionRelease('tag'),{revision:'R1',tested:true});assert.deepEqual(versionRelease('tip'),{revision:'R2',tested:false});
 const s=createVersionJourney();s.runs.central=run('central','north');s.runs.distributed=run('distributed','south');s.built=['tag','tip'];s.answer='tag';s.tagMeaning='reference';assert.equal(versionJourneyComplete(s),false);s.checked=true;assert.equal(versionJourneyComplete(s),true);
 const r=restoreVersionJourney(s);r.runs.central.history.pop();r.built.pop();assert.equal(s.runs.central.done,true);assert.equal(s.built.length,2);
 for(const p of [{selected:'bad'},{built:['tag','tag']},{release:'bad'},{answer:'bad'},{checked:1}])assert.throws(()=>restoreVersionJourney({...s,...p}),RangeError);
});
