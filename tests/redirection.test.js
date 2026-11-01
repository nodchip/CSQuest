import test from 'node:test';
import assert from 'node:assert/strict';
import {createRedirect,redirectResult,redirectCorrect,redirectComplete,restoreRedirect} from '../src/redirection.js';

test('copy captures the current destination, so the two orders deliver different messages',()=>{
  assert.deepEqual(redirectResult(['file','copy']).trace,[{out:'広場',err:'広場'},{out:'巻物',err:'広場'},{out:'巻物',err:'巻物'}]);
  assert.deepEqual(redirectResult(['copy','file']).trace,[{out:'広場',err:'広場'},{out:'広場',err:'広場'},{out:'巻物',err:'広場'}]);
  for(const first of ['file','copy'])for(const second of ['file','copy']){
    const trial={order:[first,second],checked:true};
    assert.equal(redirectCorrect('both',trial),first==='file'&&second==='copy');
    assert.equal(redirectCorrect('split',trial),second==='file');
  }
});
test('both tasks require checked results and old saves gain empty tasks',()=>{
  const s=createRedirect();s.both={order:['file','copy'],checked:true};s.split={order:['copy','file'],checked:true};
  assert.equal(redirectComplete(s),true);assert.deepEqual(restoreRedirect(s),s);assert.equal(redirectComplete(restoreRedirect(undefined)),false);
  assert.equal(redirectCorrect('both',{order:['file','copy'],checked:false}),false);
  assert.throws(()=>restoreRedirect({...s,both:{order:['unknown'],checked:true}}));
});
