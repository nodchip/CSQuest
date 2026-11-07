import test from 'node:test';
import assert from 'node:assert/strict';
import {mountainIds,mountainRoads,mountainReplay,validMountainRoutes} from '../src/mountain.js';

test('all possible deliveries distinguish connectivity, fewest roads and fastest route',()=>{
  const paths=[];
  function explore(here,path,time){
    if(here==='village'){paths.push({path,time});return;}
    for(const [next,minutes] of mountainRoads[here])explore(next,[...path,next],time+minutes);
  }
  explore('start',[],0);
  assert.deepEqual(paths,[{path:['ridge','village'],time:10},{path:['forest','stream','village'],time:6}]);
  const minHops=Math.min(...paths.map(x=>x.path.length)),minTime=Math.min(...paths.map(x=>x.time));
  for(const {path,time} of paths){
    assert.equal(mountainReplay('mountain-connect',path).done,true);
    assert.equal(mountainReplay('mountain-hops',path).done,path.length===minHops);
    assert.equal(mountainReplay('mountain-time',path).done,time===minTime);
  }
});

test('dead ends, invalid jumps and persisted routes are handled safely',()=>{
  assert.deepEqual(mountainReplay('mountain-connect',['lookout']).next,[]);
  assert.equal(mountainReplay('mountain-hops',['forest','stream','village']).arrived,true);
  assert.equal(mountainReplay('mountain-hops',['forest','stream','village']).done,false);
  assert.throws(()=>mountainReplay('mountain-time',['village']));
  assert.throws(()=>mountainReplay('mountain-connect',['ridge','village','ridge']));
  assert.equal(validMountainRoutes({'mountain-time':['forest','stream']}),true);
  assert.equal(validMountainRoutes({'mountain-time':['forest','village']}),false);
  assert.equal(validMountainRoutes({'unexpected':[]}),false);
  assert.equal(validMountainRoutes([]),false);
  assert.equal(mountainIds.length,3);
});
