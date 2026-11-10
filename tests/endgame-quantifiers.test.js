import test from 'node:test';
import assert from 'node:assert/strict';
import {replayQuantifiers} from '../src/endgame-quantifiers.js';

test('all and some require appropriate counterexample and witness',()=>{
  const a=['answer:1:1','counter:none','witness:0','next'];
  assert.equal(replayQuantifiers('simple',['answer:0:1']),null);
  assert.equal(replayQuantifiers('simple',['answer:1:1','counter:0']),null);
  assert.equal(replayQuantifiers('simple',['answer:1:1','counter:none','next']),null);
  const b=['answer:0:1','counter:1','witness:2','next'];
  const c=['answer:0:0','counter:0','witness:none','next'];
  assert.equal(replayQuantifiers('simple',[...a,...b,...c]).done,true);
});

test('negated quantifiers distinguish no witnesses from a counterexample',()=>{
  const h=['answer:1:0','counter:1','witness:0','next','answer:1:1','counter:2','witness:none','next','answer:0:0','counter:none','witness:1','next'];
  assert.equal(replayQuantifiers('negation',h).done,true);
  assert.equal(replayQuantifiers('negation',['answer:1:0','counter:none']),null);
});

test('per-person witnesses need not be one common tool',()=>{
  const h=['answer:1:0','person:0:0','person:1:1','refute:0:1','refute:1:0','next'];
  const h2=[...h,'answer:1:1','person:0:1','person:1:0','common:0','next'];
  assert.equal(replayQuantifiers('nested',[...h2,'answer:0:0','no-person:0','refute:0:0','refute:1:0','next']).done,true);
  assert.equal(replayQuantifiers('nested',[...h2,'answer:0:0','no-person:1']),null);
  assert.equal(replayQuantifiers('nested',['answer:1:1']),null);
  assert.equal(replayQuantifiers('nested',['answer:1:0','person:0:0','person:1:1','refute:0:1','next']),null);
  assert.equal(replayQuantifiers('nested',['answer:1:0','common:0']),null);
  assert.deepEqual(replayQuantifiers('nested',['answer:1:0','person:0:0','reset']).people,[]);
});
