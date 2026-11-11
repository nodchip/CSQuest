import {replayNegativeJourney as replay,advanceNegativeJourney as advance} from '../src/endgame-negative-journey.js';
import {strict as assert} from 'node:assert';
let paths=0;
function walk(h){const p=replay('relax',h);if(!p)throw Error('invalid');if(p.trial.done){assert.equal(p.trial.dist.G,3);paths++;return;}if(h.length>=16)throw Error('bound exceeded');for(const e of ['sa','sb','ag','ba']){const next=advance('relax',h,`edge:${e}`);if(next)walk(next);}}
walk([]);console.log(`verified ${paths} edge orders`);
