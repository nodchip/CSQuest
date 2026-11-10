import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayDependencyFlow} from '../src/endgame-dependency-flow.js';
test('一列の依存を先から終える',()=>{assert.equal(replayDependencyFlow('line',['task:B']),null);assert.equal(replayDependencyFlow('line',['task:A','task:B','task:C','check']).done,true);});
test('両方の前提がそろえば複数の順番を受け付ける',()=>{for(const h of [['task:A','task:B','task:C','task:D','check'],['task:B','task:A','task:C','task:D','check']])assert.equal(replayDependencyFlow('branch',h).done,true);assert.equal(replayDependencyFlow('branch',['task:A','task:C']),null);assert.equal(replayDependencyFlow('branch',['task:B','check']),null);});
test('循環とその先で待つ仕事を区別する',()=>{assert.equal(replayDependencyFlow('cycle',['stop']),null);let h=['task:A'];let p=replayDependencyFlow('cycle',JSON.parse(JSON.stringify(h)));assert.deepEqual(p.order,['A']);h.push('stop');assert.equal(replayDependencyFlow('cycle',[...h,'cycle:B,C,D']),null);p=replayDependencyFlow('cycle',[...h,'cycle:B,C']);assert.equal(p.done,true);assert.equal(replayDependencyFlow('cycle',[...h,'cycle:B,C','reset']),null);});
test('途中のリセットと重複・不正履歴',()=>{assert.deepEqual(replayDependencyFlow('branch',['task:B','reset']).order,[]);assert.equal(replayDependencyFlow('branch',['task:A','task:A']),null);assert.equal(replayDependencyFlow('line',{}),null);});
