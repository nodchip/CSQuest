import test from 'node:test';
import assert from 'node:assert/strict';
import {recommend,validAnnouncements,restoreCitySort,restoreCityQueue} from '../src/workshop-city.js';
import {containerEvents,containerStep} from '../src/containers.js';

test('recommendations respect completed work and are remembered by place and quest',()=>{
  assert.deepEqual(recommend('city',[]),['city-sort','市場の品札を並べる']);
  assert.deepEqual(recommend('city',['city-sort']),['city-queue','ギルドの荷物を届ける']);
  assert.equal(recommend('city',['city-sort','city-queue']),null);
  assert.equal(recommend('river',['river']),null);
  assert.equal(validAnnouncements(['workshop:forest','city:city-sort']),true);
  assert.equal(validAnnouncements(['city:city-sort','city:city-sort']),false);
  assert.equal(validAnnouncements(['city:<bad>']),false);
});

test('adjacent exchanges restore independently and expose the correct completion',()=>{
  assert.deepEqual(restoreCitySort([]),{values:[4,2,3,1],done:false});
  assert.deepEqual(restoreCitySort([0,1,2,1,0]),{values:[1,2,3,4],done:true});
  assert.throws(()=>restoreCitySort([3]),RangeError);
  assert.throws(()=>restoreCitySort(Array(501).fill(0)),RangeError);
});

test('delivery restores only FIFO history and rejects a wrong choice without advancing',()=>{
  const history=['put:A','put:B','put:C'];
  const queue=restoreCityQueue(history);
  const wrong=containerStep(queue,'take:B');
  assert.equal(wrong.history.length,3);
  assert.deepEqual(wrong.items,['A','B','C']);
  assert.throws(()=>restoreCityQueue([...history,'take:B']),RangeError);
  const complete=restoreCityQueue([...history,'take:A','put:D','take:B','take:C','take:D']);
  assert.deepEqual(complete.output,['A','B','C','D']);
  assert.equal(complete.history.length,containerEvents.length);
});
