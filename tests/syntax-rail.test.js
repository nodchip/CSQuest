import {test} from 'node:test';
import assert from 'node:assert/strict';
import {railChoices,railOrders,railCases,railDiagram,railAccept,railCreate,railConfigure,railCheck,railComplete,railRestore} from '../src/syntax-rail.js';

function sequences(n){if(n===0)return [[]];return sequences(n-1).flatMap(s=>[s,[...s,'L'],[...s,'S']]);}
test('diagram and correct rule agree with an independent regular expression through length five',()=>{
 const correct={light:'optional',star:'many',order:'lightFirst'};for(const tokens of sequences(5)){const expected=/^L?S*$/.test(tokens.join(''));assert.equal(railDiagram(tokens),expected);assert.equal(railAccept(correct,tokens),expected);}assert.throws(()=>railDiagram(['X']));
});
test('six examples distinguish every other offered configuration',()=>{
 for(const light of Object.keys(railChoices))for(const star of Object.keys(railChoices))for(const order of Object.keys(railOrders)){const config={light,star,order},correct=light==='optional'&&star==='many'&&order==='lightFirst';assert.equal(Object.values(railCases).every(c=>railAccept(config,c.tokens)===railDiagram(c.tokens)),correct,JSON.stringify(config));}
});
test('rule changes clear trials; correct predictions, diagram agreement and reflection are required',()=>{
 const q=railCreate();q.trials.bare.guess=true;railConfigure(q,'light','optional');assert.equal(q.trials.bare.guess,null);railConfigure(q,'star','many');for(const [id,c] of Object.entries(railCases)){q.selected=id;q.trials[id].guess=!railDiagram(c.tokens);assert.equal(railCheck(q),false);q.trials[id].guess=railDiagram(c.tokens);assert.equal(railCheck(q),true);assert.deepEqual(railRestore(q),q);}assert.equal(railComplete(q),false);q.answer='optionalRepeat';assert.equal(railComplete(q),true);const bad=structuredClone(q);bad.config.star='one';assert.throws(()=>railRestore(bad));assert.throws(()=>railConfigure(q,'order','bad'));
});
