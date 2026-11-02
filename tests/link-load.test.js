import {test} from 'node:test';
import assert from 'node:assert/strict';
import {linkCases,linkObjects,linkInitial,linkNext,linkExecute,linkReplay,linkCreate,linkCheck,linkStep,linkTrialComplete,linkComplete,linkRestore} from '../src/link-load.js';

test('all strong-definition combinations resolve or fail at both load bases',()=>{
 for(const base of [100,200])for(const helper of [false,true])for(const extra of [false,true]){const e=linkObjects(helper,extra,base);assert.equal(e.status,helper&&extra?'duplicate':!helper&&!extra?'missing':'ok');if(e.status==='ok'){assert.equal(e.target,base+2);const s=linkInitial(e),history=[];while(s.status==='running'){const next=linkNext(s,e);for(const wrong of [base,base+1,base+2,base+3,'stop'].filter(x=>x!==next))assert.throws(()=>linkExecute(structuredClone(s),e,wrong));linkExecute(s,e,next);history.push(next);}assert.deepEqual(history,[base+2,base+3,base+1,'stop']);assert.equal(s.value,helper?1:2);assert.throws(()=>linkExecute(s,e,'stop'));}}
});
test('each scenario needs the requested objects, correct link and successful execution where possible',()=>{
 const q=linkCreate();for(const [id,c] of Object.entries(linkCases)){q.selected=id;const t=q.trials[id];t.helper=c.helper;t.extra=c.extra;const expected=linkObjects(t.helper,t.extra,c.base).status;t.guess=expected==='ok'?'missing':'ok';assert.equal(linkCheck(q),false);t.guess=expected;assert.equal(linkCheck(q),true);if(expected==='ok'){while(true){const s=linkReplay(t,c.base);if(s.status==='done')break;linkStep(q,linkNext(s,linkObjects(t.helper,t.extra,c.base)));}}assert.equal(linkTrialComplete(id,t),true);assert.deepEqual(linkRestore(q),q);}assert.equal(linkComplete(q),false);q.answer='relocate';assert.equal(linkComplete(q),true);const bad=structuredClone(q);bad.trials.at100.history=[100];assert.throws(()=>linkRestore(bad));bad.trials.at100.history=[];bad.trials.at100.guess='missing';assert.throws(()=>linkRestore(bad));
});
