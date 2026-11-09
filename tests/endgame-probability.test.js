import test from 'node:test';
import assert from 'node:assert/strict';
import {replayEvents,replayDraws} from '../src/endgame-probability.js';
const select=ids=>[...ids.map(i=>`toggle:${i}`),'check'];
test('conditions change the denominator for two equally likely boxes',()=>{
 const history=[...select([0,1,2]),...select([0,1]),...select([0,1,2,3]),...select([0])];
 assert.deepEqual(replayEvents('weather',history).results,[{numerator:3,denominator:6},{numerator:2,denominator:3},{numerator:4,denominator:6},{numerator:1,denominator:4}]);
 assert.equal(replayEvents('weather',['toggle:0','check']),null);
 assert.equal(replayEvents('weather',['toggle:0','toggle:0','check']),null);
 assert.equal(replayEvents('weather',[...select([0,1,2]),'toggle:4']),null);
});
test('reverse conditions use different populations',()=>{
 const history=[...select([0,1,2]),...select([0,1,2]),...select([0,1,2,3,4,5,6,7]),...select([0,1,2,3,4,5,6,7])];
 assert.deepEqual(replayEvents('reports',history).results,[{numerator:3,denominator:9},{numerator:3,denominator:4},{numerator:8,denominator:11},{numerator:8,denominator:10}]);
 assert.equal(replayEvents('reports',[...select([0,1,2]),...select([0,1,2]),'toggle:10','check']),null);
});
test('two replacement draws sort outcomes into the number of red draws',()=>{
 const stage=(values)=>values.flatMap(([id,n])=>[`pick:${id}`,`put:${n}`]).concat('check');
 const a=stage([['0-0',2],['0-1',1],['1-0',1],['1-1',0]]);
 const b=stage([['0-0',2],['0-1',1],['0-2',1],['1-0',1],['1-1',0],['1-2',0],['2-0',1],['2-1',0],['2-2',0]]);
 assert.deepEqual(replayDraws([...a,...b]).results,[{counts:[1,2,1],total:4,redTotal:4},{counts:[4,4,1],total:9,redTotal:6}]);
 assert.equal(replayDraws(['pick:0-0','put:0','check']),null);
 assert.equal(replayDraws(['put:1']),null);
 assert.equal(replayDraws(['pick:0-0','put:0','pick:0-0','put:2']).placed['0-0'],2);
});
