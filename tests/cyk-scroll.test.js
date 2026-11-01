import test from 'node:test';
import assert from 'node:assert/strict';
import {cykCases,cykParse,cykReady,cykToggle,cykVerify,cykTrialPass,createCyk,cykComplete,restoreCyk} from '../src/cyk-scroll.js';

test('all 27 three-word inputs match direct grammar recognition for every span',()=>{
 const words=['精霊','薬草','運ぶ'],noun=w=>w!=='運ぶ';for(const a of words)for(const b of words)for(const c of words){const expected=[noun(a)?1:2,noun(b)?1:2,noun(c)?1:2,noun(a)&&b==='運ぶ'?4:0,noun(b)&&c==='運ぶ'?4:0,noun(a)&&noun(b)&&c==='運ぶ'?8:0];assert.deepEqual(cykParse([a,b,c]),expected);}
});
test('shorter spans must be checked, changes invalidate dependent spans, and drafts restore',()=>{
 const s=createCyk();assert.equal(cykReady(0,5),false);assert.match(cykVerify(s.trials.valid,'valid',5).message,/先に/);
 for(const id of Object.keys(cykCases)){let t=s.trials[id];for(const [i,mask] of cykParse(cykCases[id].tokens).entries()){for(const bit of [1,2,4,8])if(mask&bit)t=cykToggle(t,i,bit);t=cykVerify(t,id,i).trial;}assert.equal(t.verified,63);t.decision=id==='valid';t.checked=true;s.trials[id]=t;assert.equal(cykTrialPass(t,id),true);}
 s.answer='grammar';s.checked=true;assert.equal(cykComplete(s),true);const r=restoreCyk(s);r.trials.valid.masks[0]=0;assert.equal(s.trials.valid.masks[0],1);const changed=cykToggle(s.trials.valid,0,1);assert.equal(changed.verified,22);assert.equal(changed.checked,false);assert.throws(()=>restoreCyk({...s,trials:{...s.trials,valid:{...s.trials.valid,masks:[0,1,2,0,4,8]}}}));
 const early=createCyk();early.trials.valid.checked=true;assert.doesNotThrow(()=>restoreCyk(early));
});
