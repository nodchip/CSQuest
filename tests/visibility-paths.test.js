import {test} from 'node:test';
import assert from 'node:assert/strict';
import {visibilityScene,visibilityRaster,visibilityRay,visibilityRequired,createVisibilityPaths,visibilityPathsComplete,restoreVisibilityPaths} from '../src/visibility-paths.js';

test('４配置で投影と視線の交差が同じ可視結果を返す',()=>{
 const expected={'0,0':['空','朱','朱','青'],'1,0':['空','青','朱','朱'],'0,1':['朱','青','青','空'],'1,1':['空','朱','朱','空']};
 for(const shift of [0,1])for(const camera of [0,1]){const labels=expected[`${shift},${camera}`];assert.deepEqual(visibilityRaster(shift,camera,2).map(x=>x?.label??'空'),labels);assert.deepEqual(visibilityRay(shift,camera,4).map(x=>x.label),labels);}
 assert.deepEqual(visibilityScene(0,0).map(o=>o.projected),[[-0.5,0.25],[-0.25,0.75]]);
});
test('処理途中の窓と深度の上書きが正しい',()=>{
 assert.deepEqual(visibilityRaster(0,0,0),[null,null,null,null]);assert.deepEqual(visibilityRaster(0,0,1).map(x=>x?.label??'空'),['空','朱','朱','空']);assert.deepEqual(visibilityRaster(0,0,2).map(x=>x?.label??'空'),['空','朱','朱','青']);
 const partial=visibilityRay(0,0,2);assert.equal(partial[0].id,'empty');assert.equal(partial[1].id,'A');assert.equal(partial[2],null);
 for(const args of [[0,0,-1],[0,0,3]])assert.throws(()=>visibilityRaster(...args),RangeError);assert.throws(()=>visibilityRay(0,0,5),RangeError);assert.throws(()=>visibilityScene(2,0),RangeError);
});
test('指定した６通りの記録と比較が必要で、途中記録を検証する',()=>{
 const s=createVisibilityPaths();s.observed=[...visibilityRequired];s.answer='same';assert.equal(visibilityPathsComplete(s),false);s.checked=true;assert.equal(visibilityPathsComplete(s),true);
 const r=restoreVisibilityPaths(s);r.observed.pop();assert.equal(s.observed.length,6);
 for(const p of [{step:3},{method:'ray',step:5},{shift:2},{observed:['bad']},{observed:['ray,0,0','ray,0,0']},{answer:'bad'},{checked:1}])assert.throws(()=>restoreVisibilityPaths({...s,...p}),RangeError);
});
