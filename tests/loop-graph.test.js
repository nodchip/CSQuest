import test from 'node:test';
import assert from 'node:assert/strict';
import {loopGraphSolve,loopGraphCreate,loopGraphRun,loopGraphDone,loopGraphRestore} from '../src/loop-graph.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('joint solution satisfies both independent normal equations and improves the three-residual loss',()=>{for(const c of ['return','other']){const j=loopGraphSolve(c,'joint'),fixed=loopGraphSolve(c,'endpoint'),raw=loopGraphSolve(c,'odometry');near(2*j.x1-j.x2,1.8);near(2*j.x2-j.x1,j.z-0.8);assert.ok(j.cost<fixed.cost&&fixed.cost<raw.cost);}const a=loopGraphSolve('return','joint'),b=loopGraphSolve('other','joint');near(a.x1,14/15);near(a.x2,1/15);near(b.x1,17/15);near(b.x2,7/15);});
test('six runs and reflection survive restoration with current display validated',()=>{let q=loopGraphCreate();for(const c of ['return','other'])for(const m of ['odometry','endpoint','joint']){q.candidate=c;q.method=m;loopGraphRun(q);q=loopGraphRestore(q);}assert.equal(loopGraphDone(q),false);q.reflection='association';assert.equal(loopGraphDone(loopGraphRestore(q)),true);assert.throws(()=>loopGraphRestore({...q,shown:'return:joint'}),RangeError);});
