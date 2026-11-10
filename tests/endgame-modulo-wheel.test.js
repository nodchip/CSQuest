import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {wheelPosition,replayModuloWheel} from '../src/endgame-modulo-wheel.js';
test('８歩進むと３、２歩戻っても３',()=>{assert.equal(wheelPosition(8),3);assert.equal(wheelPosition(-2),3);assert.equal(replayModuloWheel('positive',['step:8','position:3']).done,true);assert.equal(replayModuloWheel('negative',['step:-2','position:3']).done,true);});
test('負の値も０〜４に正規化する',()=>{for(const [x,r] of [[-11,4],[-10,0],[-8,2],[-5,0],[-2,3],[-1,4],[0,0],[4,4],[5,0],[8,3]])assert.equal(wheelPosition(x),r);});
test('−２＋４と８＋４はどちらも位置２',()=>{const h=['step:-2','step:4','position:2','step:8','step:4','position:2'],p=replayModuloWheel('compare',JSON.parse(JSON.stringify(h)));assert.deepEqual(p.results.map(x=>[x.total,x.position]),[[2,2],[12,2]]);assert.equal(replayModuloWheel('compare',[...h,'answer:different']),null);assert.equal(replayModuloWheel('compare',[...h,'reset']),null);assert.equal(replayModuloWheel('compare',[...h,'answer:same']).done,true);});
test('誤った歩数・位置・早い確定とリセットを検査',()=>{assert.equal(replayModuloWheel('negative',['step:8']),null);assert.equal(replayModuloWheel('negative',['position:3']),null);assert.equal(replayModuloWheel('negative',['step:-2','position:-2']),null);assert.equal(replayModuloWheel('negative',['step:-2','reset']).position,0);assert.equal(replayModuloWheel('positive',{}),null);});
