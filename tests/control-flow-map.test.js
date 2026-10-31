import {test} from 'node:test';
import assert from 'node:assert/strict';
import {flowEdges,flowMapCorrect,createFlow,restoreFlow,flowComplete} from '../src/control-flow-map.js';

test('the map requires all five real edges and rejects all other subsets',()=>{
 const keys=Object.keys(flowEdges),expected=['startTest','testPositive','testOther','positiveEnd','otherEnd'];
 for(let mask=0;mask<2**keys.length;mask++){const chosen=keys.filter((_,i)=>mask&(1<<i));assert.equal(flowMapCorrect(chosen),chosen.length===5&&expected.every(x=>chosen.includes(x)));}
 assert.equal(flowMapCorrect([...expected,'startTest']),false);
});
test('a complete draft requires a checked map and the correct path for each input',()=>{
 const s=createFlow();s.edges=['startTest','testPositive','testOther','positiveEnd','otherEnd'];s.mapChecked=true;s.trials={positive:'gold',zero:'blue'};
 const copy=restoreFlow(s);assert.equal(flowComplete(copy),true);s.edges.pop();assert.equal(flowComplete(copy),true);assert.throws(()=>restoreFlow(s),RangeError);
 copy.mapChecked=false;assert.throws(()=>restoreFlow(copy),RangeError);
});
