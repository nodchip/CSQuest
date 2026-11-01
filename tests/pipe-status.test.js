import test from 'node:test';
import assert from 'node:assert/strict';
import {createRedirect} from '../src/redirection.js';
import {pipeStatusResult,createPipeStatus,pipeStatusCorrect,pipeStatusComplete,restorePipeStatus} from '../src/pipe-status.js';

test('a successful consumer can mask a failed reader unless pipefail is enabled',()=>{
  assert.deepEqual(pipeStatusResult('normal'),{lines:3,stderr:false,readerStatus:0,counterStatus:0,pipelineStatus:0});
  assert.deepEqual(pipeStatusResult('empty'),{lines:0,stderr:false,readerStatus:0,counterStatus:0,pipelineStatus:0});
  assert.deepEqual(pipeStatusResult('missing'),{lines:0,stderr:true,readerStatus:1,counterStatus:0,pipelineStatus:0});
  assert.deepEqual(pipeStatusResult('guarded'),{lines:0,stderr:true,readerStatus:1,counterStatus:0,pipelineStatus:1});
});
test('all three observations and completed run are required, and saved states are validated',()=>{
  const s=createPipeStatus();for(const [id,trial] of Object.entries(s.trials)){const r=pipeStatusResult(id);trial.phase=2;trial.prediction={lines:String(r.lines),stderr:r.stderr?'yes':'no',status:String(r.pipelineStatus)};trial.checked=true;assert.ok(pipeStatusCorrect(trial));}
  assert.equal(pipeStatusComplete(s),false); s.redirect=createRedirect(); s.redirect.both={order:['file','copy'],checked:true}; s.redirect.split={order:['copy','file'],checked:true};
  assert.ok(pipeStatusComplete(s));assert.ok(pipeStatusComplete(restorePipeStatus(s)));
  const {redirect,...old}=s; assert.equal(pipeStatusComplete(restorePipeStatus(old)),false);
  assert.equal(pipeStatusCorrect({...s.trials.missing,prediction:{...s.trials.missing.prediction,status:'1'}}),false);
  assert.throws(()=>restorePipeStatus({...s,trials:{...s.trials,missing:{...s.trials.missing,phase:1}}}));
});
