import {test} from 'node:test';
import assert from 'node:assert/strict';
import {responseCases,responseSpeeds,responseResult,createResponse,responseComplete,restoreResponse} from '../src/collision-response.js';

test('all choices yield exactly the expected equal-mass elastic or sticking velocities',()=>{
 const expected={elastic:[0,2],stick:[1,1],moving:[1,2]};for(const id of Object.keys(responseCases))for(const a of responseSpeeds)for(const b of responseSpeeds){const r=responseResult(id,a,b);assert.equal(r.pass,a===expected[id][0]&&b===expected[id][1]);}
 const unchanged=responseResult('elastic',2,0);assert.equal(unchanged.momentum,true);assert.equal(unchanged.collision,false);
});
test('completed trials and drafts are checked and defensively copied',()=>{
 const s=createResponse();s.trials.elastic={a:0,b:2,checked:true};s.trials.stick={a:1,b:1,checked:true};s.trials.moving={a:1,b:2,checked:true};const copy=restoreResponse(s);assert.equal(responseComplete(copy),true);s.trials.moving.b=1;assert.equal(responseComplete(copy),true);assert.throws(()=>restoreResponse(s),RangeError);
});
