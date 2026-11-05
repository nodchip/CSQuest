import test from 'node:test';
import assert from 'node:assert/strict';
import {groupDiagram,groupCreate,groupRestore} from '../src/perceptual-grouping.js';
import {createVisualization,restoreVisualization} from '../src/visualization.js';
test('four diagrams independently encode spatial proximity and shape similarity',()=>{for(const near of ['rows','columns'])for(const shape of ['rows','columns']){const d=groupDiagram(near,shape);const dx=d[1].x-d[0].x,dy=d[2].y-d[0].y;assert.equal(dx<dy,near==='rows');assert.equal(d[0].shape===d[1].shape,shape==='rows');assert.equal(d[0].shape===d[2].shape,shape==='columns');}assert.throws(()=>groupDiagram('bad','rows'));});
test('old chart drafts migrate and grouping progress is copied and validated',()=>{const old=createVisualization();delete old.groupLab;assert.deepEqual(restoreVisualization(old).groupLab,groupCreate());const s=groupCreate();s.seen.push('rows:columns');const copy=groupRestore(s);copy.seen.pop();assert.equal(s.seen.length,1);assert.throws(()=>groupRestore({...s,seen:['wrong']}));});
