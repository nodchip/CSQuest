import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayGateTests as replay} from '../src/endgame-gate-tests.js';
const run=(kind,ns)=>replay(kind,[...ns.map(n=>`toggle:${n}`),'run']);
test('outcomes alone miss both boundary mutants; boundary examples distinguish them',()=>{
 let s=run('outcomes',[0,2]);assert.equal(s.results.accepted,true);assert.equal(s.results.rejected,true);assert.equal(s.results.lowerCaught,false);assert.equal(s.results.upperCaught,false);
 s=run('lower',[1]);assert.deepEqual(s.results.rows,[{n:1,original:true,lower:false,upper:true}]);assert.equal(s.results.lowerCaught,true);assert.equal(s.results.upperCaught,false);
 s=run('both',[1,6]);assert.deepEqual(s.results.rows,[{n:1,original:true,lower:false,upper:true},{n:6,original:false,lower:false,upper:true}]);assert.equal(s.results.lowerCaught,true);assert.equal(s.results.upperCaught,true);assert.ok(replay('both',['toggle:1','toggle:6','run','check']).done);
});
test('wrong, stale, too many and post-completion actions are rejected; replay and reset',()=>{
 assert.equal(replay('outcomes',['toggle:1','toggle:6','run','check']),null);assert.ok(replay('outcomes',['toggle:1','toggle:6','run','reset','toggle:0','toggle:2','run','check']).done);assert.equal(replay('both',['run']),null);assert.equal(replay('both',['toggle:0','toggle:2','run','check']),null);assert.equal(replay('lower',['toggle:1','run','toggle:2','check']),null);assert.equal(replay('both',['toggle:0','toggle:1','toggle:2','toggle:5']),null);assert.equal(replay('lower',['toggle:1','run','check','reset']),null);assert.deepEqual(replay('lower',['toggle:1','reset']).selected,[]);
});
