import test from 'node:test';
import assert from 'node:assert/strict';
import {regions,findRegion,visibleQuests,learningTrails,findTrail,trailQuests} from '../src/world.js';
import {levels} from '../src/engine.js';
const modules=['sorting','circuit','battle','search','routes','delivery','access','catalog','join','scheduling','concurrency','locking','classification','evaluation','hash','probability','depth','inclusive','testing','types','cache','transform','privacy','robot','lookup','deadlock','automaton','bridges','recursion','paging','transaction','binary','adder','isolation','serial','address','expectation','astar','heuristic','minimax','duel','sets','statistics','forwarding','constraints','vectors','pipeline','closures'];
const all=[...levels];for(const module of modules){const exports=await import(`../src/${module}.js`);all.push(Object.values(exports).find(value=>value&&typeof value==='object'&&value.id&&value.number));}
test('every current quest appears in exactly one region and every region entry exists',()=>{
  const assigned=regions.flatMap(region=>region.quests);assert.equal(new Set(assigned).size,assigned.length);
  assert.deepEqual([...assigned].sort(),all.map(level=>level.id).sort());
});
test('filtering preserves the original quest indices and an unknown selection shows every quest',()=>{
  const forest=visibleQuests(all,'wilds');assert.deepEqual(forest.map(x=>x.level.id),['forest-search','weighted-roads','message-delivery','village-bridges','guided-ruins','misleading-stars','routing-towers']);
  assert.ok(forest.every(x=>all[x.index]===x.level));assert.equal(visibleQuests(all,'missing').length,all.length);assert.equal(findRegion('missing'),null);
});
test('optional learning trails cover every existing quest once and preserve their suggested order',()=>{
  const ids=learningTrails.flatMap(trail=>trail.quests);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual([...ids].sort(),all.map(level=>level.id).sort());
  for(const trail of learningTrails){assert.equal(findTrail(trail.id),trail);assert.deepEqual(trailQuests(trail,all).map(item=>item.level.id),trail.quests);assert.ok(trailQuests(trail,all).every(item=>all[item.index]===item.level));}
  assert.equal(findTrail('missing'),null);
});
