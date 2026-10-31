import test from 'node:test';
import assert from 'node:assert/strict';
import {parserCases,createParserTrial,parserStep,createParser,parserComplete,restoreParser} from '../src/predictive-parser.js';
test('one-token lookahead parses matching pairs and rejects the missing closing bracket',()=>{
 const s=createParser();for(const [id,item] of Object.entries(parserCases)){let t=s.trials[id];while(t.status==='running'){const top=t.stack[0],look=(item.text+'$')[t.position],action=top==='S'?(look==='('?'expand':'empty'):top===look?(top==='$'?'accept':'match'):'reject';const next=parserStep(id,t,action);assert.equal(next.history.length,t.history.length+1);t=next;assert.ok(t.history.length<=32);}assert.equal(t.status,item.expected);s.trials[id]=t;}assert.equal(parserComplete(s),true);assert.deepEqual(restoreParser(s),s);
});
test('incorrect actions do not advance and restored histories are validated',()=>{
 const s=createParser();let t=createParserTrial();assert.equal(parserStep('nested',t,'empty').history.length,0);assert.equal(parserStep('nested',t,'accept').history.length,0);t=parserStep('nested',t,'expand');s.trials.nested=t;const copy=restoreParser(s);copy.trials.nested.history.push('accept');assert.throws(()=>restoreParser(copy));assert.deepEqual(s.trials.nested.history,['expand']);
});
