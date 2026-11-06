import {test} from 'node:test';
import assert from 'node:assert/strict';
import {textureCoords,textureMethods,textureSample,textureRequired,createTextureFilter,textureFilterComplete,restoreTextureFilter} from '../src/texture-filter.js';

test('２つの方法で３×３の標本を比較する',()=>{
 const expected={nearest:[[0,0,80],[0,0,80],[160,160,240]],linear:[[0,40,80],[80,120,160],[160,200,240]]};
 for(const m of textureMethods)for(const [j,v] of textureCoords.entries())for(const [i,u] of textureCoords.entries())assert.equal(textureSample(m,u,v),expected[m][j][i]);
 assert.equal(textureSample('linear',37.5,62.5),140);
 for(const p of [['bad',25,25],['linear',NaN,25],['nearest',24,25],['linear',25,76]])assert.throws(()=>textureSample(...p),RangeError);
});
test('指定観察と振り返りをすべて満たしてから完了する',()=>{
 const s=createTextureFilter();s.observed=[...textureRequired];s.answer='mix';s.reflection='coordinates';assert.equal(textureFilterComplete(s),false);s.checked=true;assert.equal(textureFilterComplete(s),true);s.observed.pop();assert.equal(textureFilterComplete(s),false);
});
test('途中記録は妥当な状態だけ復元し独立した配列を返す',()=>{
 const s=createTextureFilter();s.observed=[textureRequired[0]];const r=restoreTextureFilter(s);r.observed.push(textureRequired[1]);assert.equal(s.observed.length,1);
 for(const patch of [{u:26},{observed:['linear,1,1']},{observed:[textureRequired[0],textureRequired[0]]},{answer:'wrong'},{checked:1}])assert.throws(()=>restoreTextureFilter({...s,...patch}),RangeError);
});
test('ミップマップ追加前の途中記録を復元できる',()=>{
 const old=createTextureFilter();delete old.mip;old.observed=[textureRequired[0]];
 const restored=restoreTextureFilter(old);assert.equal(restored.mip.cell,0);assert.deepEqual(restored.observed,[textureRequired[0]]);
});
