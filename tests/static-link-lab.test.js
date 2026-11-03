import test from 'node:test';
import assert from 'node:assert/strict';
import {staticLinkState,staticLinkCreate,staticLinkStep,staticLinkDone,staticLinkRestore} from '../src/static-link-lab.js';

test('static and caller paths can differ and the argument stays in the inner frame',()=>{
 assert.deepEqual(staticLinkState('direct','lexical',['outer']),{current:'outer',result:4,total:6});
 assert.deepEqual(staticLinkState('direct','dynamic',['outer']),{current:'outer',result:4,total:6});
 assert.deepEqual(staticLinkState('relay','lexical',['outer']),{current:'outer',result:4,total:6});
 assert.deepEqual(staticLinkState('relay','dynamic',['helper']),{current:'helper',result:null,total:null});
 assert.deepEqual(staticLinkState('relay','dynamic',['helper','caller']),{current:'caller',result:9,total:11});
 assert.throws(()=>staticLinkState('relay','lexical',['helper']));assert.throws(()=>staticLinkState('relay','dynamic',['helper','outer']));
});
test('wrong routes leave history unchanged and restore rejects impossible paths',()=>{
 const q=staticLinkCreate();q.selected='relay';assert.equal(staticLinkStep(q,'caller'),false);assert.deepEqual(q.trials['relay:lexical'],[]);assert.equal(staticLinkStep(q,'outer'),true);
 q.mode='dynamic';assert.equal(staticLinkStep(q,'helper'),true);assert.equal(staticLinkStep(q,'caller'),true);
 q.selected='direct';q.mode='lexical';assert.equal(staticLinkStep(q,'outer'),true);q.mode='dynamic';assert.equal(staticLinkStep(q,'outer'),true);
 q.answer='lexical';assert.equal(staticLinkDone(q),false);q.checked=true;assert.equal(staticLinkDone(q),true);
 const copy=staticLinkRestore(q);copy.trials['relay:dynamic'].pop();assert.equal(q.trials['relay:dynamic'].length,2);
 q.trials['relay:dynamic']=['caller'];assert.throws(()=>staticLinkRestore(q));
});
