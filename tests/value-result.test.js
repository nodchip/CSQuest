import test from 'node:test';
import assert from 'node:assert/strict';
import {copyExperiment,copyCreate,copyRestore} from '../src/value-result.js';
import {createParameter,restoreParameter} from '../src/parameter-passing.js';
test('value, reference, and copy-restore differ while running and when aliases are copied back',()=>{
 const expected={value:{separate:[2,2,4,3,8],alias:[2,2,null,3,4]},reference:{separate:[3,3,8,3,8],alias:[6,6,null,6,6]},restore:{separate:[2,3,8,3,8],alias:[2,4,null,3,4]}};
 for(const [mode,targets] of Object.entries(expected))for(const [target,values] of Object.entries(targets))for(const order of ['ab','ba']){const r=copyExperiment(mode,target,order),v=[...values];if(mode==='restore'&&target==='alias'&&order==='ba')v[1]=3;assert.deepEqual([r.during,r.after,r.other,r.a,r.b],v);}
 assert.throws(()=>copyExperiment('bad','alias','ab'));
});
test('old records migrate and saved comparisons are validated and copied',()=>{const old=createParameter();delete old.copyLab;assert.deepEqual(restoreParameter(old).copyLab,copyCreate());const q=copyCreate();q.seen.push('restore:alias:ab');const restored=copyRestore(q);restored.seen.pop();assert.equal(q.seen.length,1);assert.throws(()=>copyRestore({...q,seen:['bad']}));});

test('the timeline shows alias visibility and each copy-back in order',()=>{
 const project=steps=>steps.map(({x,a,b})=>[x,a,b]);
 assert.deepEqual(project(copyExperiment('value','alias','ab').steps),[[2,2,2],[2,3,2],[2,3,4]]);
 assert.deepEqual(project(copyExperiment('reference','alias','ab').steps),[[2,2,2],[3,3,3],[6,6,6]]);
 assert.deepEqual(project(copyExperiment('restore','alias','ab').steps),[[2,2,2],[2,3,2],[2,3,4],[3,3,4],[4,3,4]]);
 assert.deepEqual(project(copyExperiment('restore','alias','ba').steps),[[2,2,2],[2,3,2],[2,3,4],[4,3,4],[3,3,4]]);
 const distinct=copyExperiment('restore','separate','ba').steps;assert.deepEqual(distinct.map(({x,y})=>[x,y]),[[2,4],[2,4],[2,4],[2,8],[3,8]]);
});
