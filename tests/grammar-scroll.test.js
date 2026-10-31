import test from 'node:test';
import assert from 'node:assert/strict';
import {grammarCases,grammarHoles,grammarReplace,grammarText,createGrammar,grammarCorrect,grammarComplete,restoreGrammar} from '../src/grammar-scroll.js';
test('recursive production replaces only the chosen hole and preserves other branches',()=>{
 let tree='hole';tree=grammarReplace(tree,'','pair');assert.deepEqual(grammarHoles(tree),['L','R']);const previous=tree;tree=grammarReplace(tree,'L','pair');assert.deepEqual(previous,['hole','hole']);assert.deepEqual(grammarHoles(tree),['LL','LR','R']);for(const path of ['LL','LR','R'])tree=grammarReplace(tree,path,'fire');assert.equal(grammarText(tree),'((火＋火)＋火)');assert.deepEqual(tree,grammarCases.nested.target);assert.throws(()=>grammarReplace(tree,'L','fire'));assert.throws(()=>grammarReplace('hole','X','fire'));
});
test('history is validated and both completed target structures are required',()=>{
 const s=createGrammar();for(const [id,history] of Object.entries({pair:[['','pair'],['L','fire'],['R','fire']],nested:[['','pair'],['L','pair'],['LL','fire'],['LR','fire'],['R','fire']]})){const t=s.trials[id];for(const [path,rule] of history)t.tree=grammarReplace(t.tree,path,rule);t.history=history;t.selected=null;t.checked=true;assert.equal(grammarCorrect(id,t),true);}assert.equal(grammarComplete(s),true);assert.deepEqual(restoreGrammar(s),s);const copy=restoreGrammar(s);copy.trials.pair.history[0][1]='fire';assert.notEqual(copy.trials.pair.history[0][1],s.trials.pair.history[0][1]);assert.throws(()=>restoreGrammar(copy));
});
