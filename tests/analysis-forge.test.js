import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnalysisForge,analysisAct,analysisResult,restoreAnalysisForge,analysisForgeComplete} from '../src/analysis-forge.js';
const act=(s,a)=>{const r=analysisAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('同じ警告でも実際のゼロの処理は異なり、境界の欠陥は通常入力では見えない',()=>{
 assert.equal(analysisResult('unsafe',false,'zero').pass,false);
 assert.equal(analysisResult('helper',false,'zero').pass,true);
 assert.equal(analysisResult('boundary',false,'normal').pass,true);
 assert.equal(analysisResult('boundary',false,'edge').pass,false);
 assert.equal(analysisResult('boundary',true,'edge').pass,true);
 assert.throws(()=>analysisResult('helper',false,'edge'));
});
test('調査・修復・再試験と振り返りがすべて必要で、記録を再生できる',()=>{
 let s=createAnalysisForge();
 for(const a of ['static','test:normal','test:zero','fix','static','test:zero','gate:helper','static','test:zero','gate:boundary','static','test:normal','test:edge','fix','test:edge','warning:review','clean:limited'])s=act(s,a);
 assert.equal(analysisForgeComplete(s),false);s=act(s,'check');assert.equal(analysisForgeComplete(s),true);assert.deepEqual(restoreAnalysisForge(JSON.parse(JSON.stringify(s))),s);
});
test('警告の過信や途中記録の捏造は達成にならない',()=>{
 let s=act(createAnalysisForge(),'warning:always');s=act(s,'clean:perfect');s=act(s,'check');assert.equal(analysisForgeComplete(s),false);
 assert.throws(()=>restoreAnalysisForge({history:['gate:unknown']}));assert.throws(()=>restoreAnalysisForge({history:[null]}));assert.throws(()=>restoreAnalysisForge({history:Array(129).fill('static')}));
});
