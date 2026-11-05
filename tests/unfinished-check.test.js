import test from 'node:test';
import assert from 'node:assert/strict';
import {unfinishedResult,createUnfinished,restoreUnfinished} from '../src/unfinished-check.js';
import {createTypeChecking,restoreTypeChecking} from '../src/type-checking.js';
test('a strict precheck blocks an unfinished function; the runtime gate fails only if called',()=>{const expected={"static:hole:skip":"blocked","static:hole:call":"blocked","static:ready:skip":"done","static:ready:call":"done","dynamic:hole:skip":"done","dynamic:hole:call":"error","dynamic:ready:skip":"done","dynamic:ready:call":"done"};for(const [key,value] of Object.entries(expected))assert.equal(unfinishedResult(...key.split(':')),value);assert.throws(()=>unfinishedResult('bad','hole','skip'));});
test('older drafts add independent validated progress',()=>{const q=createTypeChecking();delete q.unfinished;assert.deepEqual(restoreTypeChecking(q).unfinished,createUnfinished());const u=createUnfinished();u.seen=['static:hole:skip'];const c=restoreUnfinished(u);c.seen.push('dynamic:hole:call');assert.equal(u.seen.length,1);assert.throws(()=>restoreUnfinished({...u,seen:['other']}));});
