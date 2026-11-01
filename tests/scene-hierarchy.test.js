import test from 'node:test';
import assert from 'node:assert/strict';
import {hierarchyRequired,hierarchyPositions,createSceneHierarchy,sceneHierarchyComplete,restoreSceneHierarchy} from '../src/scene-hierarchy.js';
test('local transforms are rotated by the parent and inherited by the grandchild',()=>{
 assert.deepEqual(hierarchyPositions(0,0,1),{parent:[2,2],arm:[3,2],flag:[2,3],light:[3,3]});
 assert.deepEqual(hierarchyPositions(0,90,1),{parent:[2,2],arm:[2,3],flag:[1,2],light:[1,3]});
 assert.deepEqual(hierarchyPositions(2,90,2),{parent:[4,2],arm:[4,4],flag:[3,2],light:[3,4]});
 for(const angle of [0,90])for(const length of [1,2]){const a=hierarchyPositions(0,angle,length),b=hierarchyPositions(2,angle,length);for(const key of Object.keys(a))assert.deepEqual(b[key],[a[key][0]+2,a[key][1]]);}
 assert.throws(()=>hierarchyPositions(0,45,1));
});
test('required configurations and relational conclusions must be recorded',()=>{
 const s=createSceneHierarchy();s.observed=[...hierarchyRequired];s.answers={parent:'all',arm:'branch'};s.reflection='relative';s.checked=true;assert.ok(sceneHierarchyComplete(s));assert.deepEqual(restoreSceneHierarchy(s),s);s.observed.pop();assert.equal(sceneHierarchyComplete(s),false);assert.throws(()=>restoreSceneHierarchy({...s,observed:['0,0,1','0,0,1']}));
});
