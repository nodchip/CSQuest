import test from 'node:test';
import assert from 'node:assert/strict';
import {raAllowed} from '../src/release-acquire.js';
import {publicationModes,publicationFlags,publicationDataKinds,publicationResult,publicationCreate,publicationDone,publicationComplete,publicationRestore} from '../src/publication-race.js';

test('the eight cases separate synchronized publication, atomic access and a non-atomic data race',()=>{
 for(const mode of publicationModes)for(const flag of publicationFlags)for(const kind of publicationDataKinds){const result=publicationResult(mode,flag,kind),ordered=mode==='release-acquire'&&flag===1;assert.equal(result,ordered?'ordered':kind==='atomic'?'atomic-only':'race');if(kind==='atomic'){assert.equal(raAllowed(mode,flag,42),true);assert.equal(raAllowed(mode,flag,0),!ordered);}}
});
test('each checked classification and the limits reflection are required and drafts are independent',()=>{
 const s=publicationCreate();for(const mode of publicationModes)for(const flag of publicationFlags)for(const kind of publicationDataKinds){const key=`${mode}:${flag}:${kind}`,answer=publicationResult(mode,flag,kind);s.trials[key]={answer,checked:true};assert.equal(publicationDone(mode,flag,kind,s.trials[key]),true);}assert.equal(publicationComplete(s),false);s.reflection='race';assert.equal(publicationComplete(s),true);const copy=publicationRestore(s);copy.trials['relaxed:1:plain'].answer='ordered';assert.equal(publicationComplete(copy),false);assert.equal(publicationComplete(s),true);copy.trials['relaxed:1:plain'].checked=1;assert.throws(()=>publicationRestore(copy));
});
