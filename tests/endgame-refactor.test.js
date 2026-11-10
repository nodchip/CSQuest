import test from 'node:test';
import assert from 'node:assert/strict';
import {runRefactor,replayRefactor} from '../src/endgame-refactor.js';
test('internal restructuring preserves order, including empty and repeated input',()=>{
 for(const input of [[],['赤','青'],['青','赤','青']]){const copy=[...input];assert.deepEqual(runRefactor('structure','extract',{input}),{output:copy});assert.deepEqual(input,copy);}
 assert.deepEqual(runRefactor('structure','drop',{input:['赤','青']}),{output:['赤']});
 assert.deepEqual(runRefactor('structure','reverse',{input:['赤','青']}),{output:['青','赤']});
 assert.deepEqual(runRefactor('structure','reverse',{input:[]}),{output:[]});
});
test('published name and order are distinct from the internal change',()=>{
 const task={command:'仕分け',input:['青','赤']};assert.deepEqual(runRefactor('interface','preserve',task),{output:['青','赤']});
 assert.deepEqual(runRefactor('interface','rename',task),{error:'名前が見つかりません'});
 assert.deepEqual(runRefactor('interface','reverse',task),{output:['赤','青']});
});
test('migration keeps the old caller and adds the new name; tests cannot be skipped',()=>{
 for(const command of ['仕分け','整理'])assert.deepEqual(runRefactor('migration','alias',{command,input:['青','赤']}),{output:['青','赤']});
 assert.deepEqual(runRefactor('migration','rename',{command:'仕分け',input:[]}),{error:'名前が見つかりません'});
 assert.equal(replayRefactor('migration',['select:alias','try:0','check']),null);
 const partial=['select:rename','try:0','try:1','try:2'];assert.equal(replayRefactor('migration',[...partial,'check']),null);
 const changed=[...partial,'select:alias'];assert.deepEqual(replayRefactor('migration',JSON.parse(JSON.stringify(changed))).trials,[]);
 const done=[...changed,'try:0','try:1','try:2','check'];assert.equal(replayRefactor('migration',done).done,true);assert.equal(replayRefactor('migration',[...done,'try:0']),null);
});
