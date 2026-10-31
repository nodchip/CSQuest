import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hysteresisReadings,hysteresisNext,hysteresisStep,hysteresisChanges,createHysteresis,hysteresisComplete,restoreHysteresis} from '../src/sensor-hysteresis.js';

test('threshold boundaries and retained state produce the independently expected sequences',()=>{
 for(let reading=0;reading<=5;reading++)for(const previous of [false,true]){assert.equal(hysteresisNext('single',previous,reading),reading>=5);assert.equal(hysteresisNext('band',previous,reading),reading>=5?true:reading<=3?false:previous);}
 const expected={single:[false,true,false,true,false,false],band:[false,true,true,true,true,false]},s=createHysteresis();for(const id of Object.keys(expected)){for(const on of expected[id]){const before=s.trials[id];assert.equal(hysteresisStep(before,!on).history.length,before.history.length);s.trials[id]=hysteresisStep(before,on);}assert.deepEqual(s.trials[id].history,expected[id]);}
 assert.equal(hysteresisReadings.length,6);assert.equal(hysteresisChanges(s.trials.single.history),4);assert.equal(hysteresisChanges(s.trials.band.history),2);assert.equal(hysteresisComplete(s),true);
});
test('history is replayed and invalid predictions are rejected',()=>{
 const saved={selected:'band',histories:{single:[false,true],band:[false,true,true]}};const s=restoreHysteresis(saved);assert.equal(s.trials.band.on,true);assert.equal(s.trials.band.history.length,3);saved.histories.band=[false,true,false];assert.throws(()=>restoreHysteresis(saved),RangeError);
});
