import test from 'node:test';
import assert from 'node:assert/strict';
import {runScroll,createScroll,scrollCorrect,scrollComplete,restoreScroll} from '../src/scroll-pipeline.js';

test('pipes transmit transformed data, with order and types affecting results',()=>{
  assert.deepEqual(runScroll('normal',['red','sort']).value,['A 赤','C 赤','D 赤']);
  assert.equal(runScroll('normal',['red','count']).value,3);
  assert.equal(runScroll('normal',['count','red']).kind,'type-error');
  assert.deepEqual(runScroll('normal',['red','count']).trace.map(x=>x.value),[['C 赤','B 青','A 赤','D 赤'],['C 赤','A 赤','D 赤'],3]);
});
test('empty input is different from failed input and saved trials are validated',()=>{
  assert.deepEqual({kind:runScroll('empty',['count']).kind,value:runScroll('empty',['count']).value},{kind:'number',value:0});
  const failed=runScroll('missing',['count']);assert.equal(failed.kind,'read-error');assert.equal(failed.trace.length,1);
  const s=createScroll();for(const [id,tools] of Object.entries({ordered:['red','sort'],counted:['red','count'],empty:['count'],missing:['count']}))s.trials[id]={id,tools,checked:true};
  assert.equal(scrollComplete(s),true);assert.equal(scrollComplete(restoreScroll(s)),true);
  assert.equal(scrollCorrect({...s.trials.missing,tools:[]}),false);
  assert.throws(()=>restoreScroll({...s,trials:{...s.trials,empty:{tools:['unknown'],checked:true}}}));
});
