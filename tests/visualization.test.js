import test from 'node:test';
import assert from 'node:assert/strict';
import {chartData,chartHeight,createVisualization,restoreVisualization,visualizationComplete} from '../src/visualization.js';

test('scales map the same data while zero and truncated bar ratios differ',()=>{
 assert.deepEqual(chartData,{east:80,west:90});assert.equal(chartHeight(80,'zero'),0.8);assert.equal(chartHeight(90,'zero'),0.9);assert.ok(Math.abs(chartHeight(90,'zoom')/chartHeight(80,'zoom')-2)<1e-12);assert.ok(Math.abs(chartHeight(90,'zero')/chartHeight(80,'zero')-90/80)<1e-12);assert.throws(()=>chartHeight(50,'zoom'),RangeError);
});
test('four displays and both correct conclusions are required; draft is validated and copied',()=>{
 const s=createVisualization();s.answers={values:'same',bars:'zero'};s.checked=true;assert.equal(visualizationComplete(s),false);s.visited=['bar:zero','bar:zoom','dot:zero','dot:zoom'];assert.equal(visualizationComplete(s),true);const restored=restoreVisualization(s);s.visited.pop();assert.equal(restored.visited.length,4);restored.answers.bars='zoom';assert.equal(visualizationComplete(restored),false);assert.throws(()=>restoreVisualization({...restored,visited:['bar:zero','bar:zero']}),RangeError);
});
