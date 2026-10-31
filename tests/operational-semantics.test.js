import test from 'node:test';
import assert from 'node:assert/strict';
import {semanticsInitial,semanticsNext,semanticsState,createSemantics,semanticsTry,semanticsComplete,restoreSemantics} from '../src/operational-semantics.js';
test('small steps evaluate assignment and expand each conditional branch before executing it',()=>{
 for(const [id,expected] of Object.entries({low:[[0,0,'inc'],[1,0,'copy'],[1,1,'branch'],[1,1,'zero'],[0,1,undefined]],high:[[1,0,'inc'],[2,0,'copy'],[2,2,'branch'],[2,2,'plus'],[3,2,undefined]]})){
  let state=semanticsInitial(id);for(const [x,y,command] of expected){assert.deepEqual([state.x,state.y,state.commands[0]],[x,y,command]);state=semanticsNext(state);}assert.equal(state,null);
 }
});
test('wrong stores do not advance, both traces are needed, and restore validates bounded progress',()=>{
 let set=createSemantics();set.choice={x:3,y:3};assert.equal(semanticsTry(set).steps.low,0);
 for(const id of ['low','high']){set.selected=id;for(let i=0;i<4;i++){const state=semanticsState(id,i),next=semanticsNext(state);set.choice={x:next.x,y:next.y,command:state.commands[0]==='branch'?(next.commands[0]==='plus'?'zero':'plus'):null};if(state.commands[0]==='branch'){assert.equal(semanticsTry(set).steps[id],i);set.choice.command=next.commands[0];}set=semanticsTry(set);}if(id==='low')assert.equal(semanticsComplete(set),false);}
 assert.equal(semanticsComplete(set),true);assert.deepEqual(restoreSemantics(set).steps,{low:4,high:4});assert.throws(()=>restoreSemantics({...set,steps:{low:5,high:4}}));
 const oldDraft={...set,choice:{x:1,y:1}};assert.equal(restoreSemantics(oldDraft).choice.command,null);
});
