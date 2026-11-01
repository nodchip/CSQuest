import test from 'node:test';
import assert from 'node:assert/strict';
import {colorNeighborDistances,colorNeighborModes,colorNeighborCases,createColorNeighbors,colorNeighborsComplete,restoreColorNeighbors} from '../src/color-neighbors.js';
test('arbitrary numbering changes nearest choice for red but not an exact blue match',()=>{
 assert.deepEqual(colorNeighborDistances('first','red'),{east:1,west:4,choice:'east'});
 assert.deepEqual(colorNeighborDistances('second','red'),{east:4,west:1,choice:'west'});
 assert.deepEqual(colorNeighborDistances('onehot','red'),{east:2,west:2,choice:'hold'});
 for(const mode of Object.keys(colorNeighborModes)) assert.equal(colorNeighborDistances(mode,'blue').choice,'east');
 assert.throws(()=>colorNeighborDistances('bad','red'));
});
test('all cases and the qualified conclusion are required and restored safely',()=>{
 const s=createColorNeighbors();s.observed=Object.keys(colorNeighborModes).flatMap(m=>Object.keys(colorNeighborCases).map(q=>`${m}:${q}`));s.answer='limited';s.checked=true;assert.ok(colorNeighborsComplete(s));assert.deepEqual(restoreColorNeighbors(s),s);s.observed.pop();assert.equal(colorNeighborsComplete(s),false);assert.throws(()=>restoreColorNeighbors({...s,observed:['first:bad']}));
});
