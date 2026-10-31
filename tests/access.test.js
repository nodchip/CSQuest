import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyPolicy,togglePermission,checkAccess,evaluatePolicy} from '../src/access.js';

test('necessary permissions satisfy all access cases', () => {
  let policy=emptyPolicy();
  for(const [role,resource] of [['keeper','records'],['keeper','supplies'],['courier','supplies']]) policy=togglePermission(policy,role,resource);
  assert.ok(evaluatePolicy(policy).every(item=>item.correct));
  assert.equal(checkAccess(policy,false,'keeper','records'),false);
  assert.equal(checkAccess(policy,true,'courier','records'),false);
});
test('both missing and excessive permissions cause test failures', () => {
  let policy=emptyPolicy();
  assert.ok(evaluatePolicy(policy).some(item=>item.expected && !item.actual));
  policy=togglePermission(policy,'visitor','records');
  assert.ok(evaluatePolicy(policy).some(item=>!item.expected && item.actual));
  policy=togglePermission(policy,'visitor','records');
  assert.deepEqual(policy.visitor,[]);
});
test('unknown identities and resources do not grant access', () => {
  const policy=emptyPolicy();
  assert.equal(checkAccess(policy,true,'unknown','records'),false);
  assert.equal(checkAccess(policy,true,'keeper','unknown'),false);
  assert.throws(()=>togglePermission(policy,'unknown','records'),RangeError);
});
