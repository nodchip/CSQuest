import test from 'node:test';
import assert from 'node:assert/strict';
import {createTouchTargets,touchResult,observeTouchTargets,touchTargetsComplete,restoreTouchTargets} from '../src/touch-targets.js';
test('the same offset lands on the neighbor for small targets and the intended larger target',()=>{assert.equal(touchResult('small','center'),'左');assert.equal(touchResult('small','drift'),'右');assert.equal(touchResult('wide','center'),'左');assert.equal(touchResult('wide','drift'),'左');let s=createTouchTargets();for(const layout of ['small','wide'])for(const point of ['center','drift']){s.layout=layout;s.point=point;s=observeTouchTargets(s);}s.answer='size';s.checked=true;assert.equal(touchTargetsComplete(s),true);assert.deepEqual(restoreTouchTargets(s),s);});
test('rejects duplicated or invalid saved observations',()=>{const s=createTouchTargets();assert.throws(()=>restoreTouchTargets({...s,observed:['small:center','small:center']}));assert.throws(()=>touchResult('bad','center'));});
