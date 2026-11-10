import test from 'node:test';import assert from 'node:assert/strict';import {contrastOnWhite,replayTextContrast} from '../src/endgame-text-contrast.js';
test('sRGB contrast matches independently calculated values and thresholds',()=>{
 assert.ok(Math.abs(contrastOnWhite('#000000')-21)<1e-12);
 assert.ok(Math.abs(contrastOnWhite('#ffffff')-1)<1e-12);
 assert.ok(Math.abs(contrastOnWhite('#777777')-4.4780894536)<1e-8);
 assert.ok(Math.abs(contrastOnWhite('#767676')-4.5422249596)<1e-8);
 assert.ok(Math.abs(contrastOnWhite('#aaaaaa')-2.3231230535)<1e-8);
 assert.throws(()=>contrastOnWhite('bad'));
});
test('normal and large examples have independent expected outcomes',()=>{
 assert.deepEqual(replayTextContrast('normal',['answer:fail','answer:pass']).results.map(x=>x.pass),[false,true]);
 assert.deepEqual(replayTextContrast('large',['answer:pass','answer:fail']).results.map(x=>x.pass),[true,false]);
 const h=['answer:fail','answer:pass'];assert.equal(replayTextContrast('compare',h).done,false);assert.equal(replayTextContrast('compare',[...h,'answer:unrounded']).done,true);
 for(const [k,a] of [['normal',['answer:pass']],['large',['answer:fail']],['compare',[...h,'answer:rounded']],['normal',['answer:fail','answer:pass','answer:pass']]])assert.equal(replayTextContrast(k,a),null);
});
