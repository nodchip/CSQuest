import test from 'node:test';
import assert from 'node:assert/strict';
import {createMvcLantern,stepMvcLantern,mvcLanternComplete,restoreMvcLantern} from '../src/mvc-lantern.js';
test('model changes before both views update, and two inputs are required',()=>{let s=createMvcLantern();assert.deepEqual(stepMvcLantern(s,'view').history,[]);s=stepMvcLantern(s,'controller');s=stepMvcLantern(s,'model');assert.deepEqual([s.value,s.numberView,s.markView],[1,0,0]);s=stepMvcLantern(s,'view');assert.deepEqual([s.value,s.numberView,s.markView],[1,1,1]);assert.equal(mvcLanternComplete(s),false);for(const action of ['controller','model','view'])s=stepMvcLantern(s,action);assert.equal(mvcLanternComplete(s),true);assert.deepEqual(restoreMvcLantern(s),s);});
test('legacy and invalid histories are handled',()=>{assert.deepEqual(restoreMvcLantern(undefined),createMvcLantern());assert.throws(()=>restoreMvcLantern({history:['view']}));assert.throws(()=>restoreMvcLantern({history:['controller','bad']}));});
