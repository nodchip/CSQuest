import test from 'node:test';
import assert from 'node:assert/strict';
import {groupReplay,groupCreate,groupComplete,groupRestore} from '../src/group-communication.js';

test('live delivery depends on presence; posted notice is available on later arrival',()=>{
 for(const [mode,actions,expected] of [
  ['live',[],[]],['live',['send'],['a','c']],['live',['advance','send'],['b','c']],['live',['send','advance'],['a','c']],['live',['send','advance','send'],['a','b','c']],
  ['board',['send'],['a','c']],['board',['send','advance'],['a','b','c']],['board',['advance','send'],['b','c']],['board',['send','advance','send'],['a','b','c']]
 ])assert.deepEqual(groupReplay(mode,actions).read.sort(),expected,`${mode} ${actions}`);
 assert.throws(()=>groupReplay('live',['advance','advance']),RangeError);assert.throws(()=>groupReplay('board',['send','send']),RangeError);assert.throws(()=>groupReplay('other',[]),RangeError);
});
test('both methods and two reflections are required, and restored histories are copied and checked',()=>{
 const q=groupCreate();q.histories.live=['send','advance','send'];q.histories.board=['send','advance'];q.reflection='combine';assert.equal(groupComplete(q),false);q.access='alternatives';assert.equal(groupComplete(q),true);const saved=groupRestore(q);saved.histories.live.push('send');assert.equal(q.histories.live.length,3);assert.throws(()=>groupRestore({...q,histories:{...q.histories,board:['send','send']}}),RangeError);assert.throws(()=>groupRestore({...q,access:'invalid'}),RangeError);
});
