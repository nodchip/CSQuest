import test from 'node:test';import assert from 'node:assert/strict';import {replayLinkedLetters} from '../src/endgame-linked-letters.js';
const safe=['link:X:B','link:A:X','check'];
test('insertion and removal produce independently expected reachability and preserve B link',()=>{
 const insert=replayLinkedLetters('insert',safe);assert.deepEqual(insert.reach,{order:['A','X','B','C'],cycle:false});assert.equal(insert.done,true);
 const remove=replayLinkedLetters('remove',['link:A:C','check']);assert.deepEqual(remove.reach,{order:['A','C'],cycle:false});assert.equal(remove.state.links.B,'C');assert.equal(remove.done,true);
});
test('early replacement makes B unreachable; invalid operations do not restore it',()=>{
 const lost=replayLinkedLetters('compare',['link:A:X']);assert.deepEqual(lost.reach.order,['A','X']);assert.equal(lost.state.links.B,'C');
 assert.equal(replayLinkedLetters('insert',['link:A:X','link:X:B']),null);
 const h=['link:A:X','inspect','reset',...safe];assert.equal(replayLinkedLetters('compare',h).done,false);assert.equal(replayLinkedLetters('compare',[...h,'answer:keep']).done,true);assert.equal(replayLinkedLetters('compare',[...h,'answer:delete']),null);
 for(const h of [['check'],['link:A:X','check'],[...safe,'reset'],['link:Z:A']])assert.equal(replayLinkedLetters('insert',h),null);
 assert.deepEqual(replayLinkedLetters('insert',['link:A:X','reset']).reach.order,['A','B','C']);
 assert.deepEqual(replayLinkedLetters('compare',['link:A:X','inspect','reset','link:A:X','reset']).reach.order,['A','B','C']);
});
