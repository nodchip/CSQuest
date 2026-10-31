import test from 'node:test';
import assert from 'node:assert/strict';
import {regions,findRegion,visibleQuests,filterQuests,learningTrails,findTrail,trailQuests} from '../src/world.js';
import {levels} from '../src/engine.js';
const modules=['sorting','circuit','battle','search','routes','delivery','access','catalog','join','scheduling','concurrency','locking','classification','evaluation','hash','probability','depth','inclusive','testing','types','cache','transform','privacy','robot','lookup','deadlock','automaton','bridges','recursion','paging','transaction','binary','adder','isolation','serial','address','expectation','astar','heuristic','minimax','duel','sets','statistics','forwarding','constraints','vectors','pipeline','closures','process','syscall','merge-sort','topology','bst','crypto','revision','usability','prefix','web-request','ethics','projection','objects','scaling','decomposition','rounding','invariant','overfit','robot-energy','logic-proof','machine','qubit','syntax-tree','coins','files','layers','containers','brackets','bayes','injection','raster','variance','key-maze','matrix','requirements','search-growth','index-plan','barrier','sustainability','events','utf8','collision','induction','euclid','pruning','decision','markov','expedition','enrollment','cardinality','cache-blocks','coherence','interrupt','hamming','secded','availability','agent-memory','huffman','visualization','stratification','histogram','quartiles','regression','gradient','game-captions','fairness','retrieval','word-index','word-order','data-life','stable-view','outer-join','ledger-sets','division','entity-match','signatures','channels','reduction','rendezvous','dma','deadlines','inversion','virtual-machines','wal-recovery','working-set','negative-paths','morphology','morph-sequence','highpass','bezier','shape-csg','components','tessellation','unification','horn-routes','horn-search','recursive-path','horn-cut','scroll-pipeline','pipe-status','environment','rune-pattern','guardian-journey','operation-order','future-delivery','instruction-pipeline','branch-predictor','speculative-path','energy-comparison','simd-mimd','accelerator-choice','min-heap','heap-sort','counting-sort','radix-sort','bucket-sort','lcs','transitive-closure','linked-list','adjacency','array-layout','dictionary-adt','fft-four','os-tradeoff','starvation','semaphore-buffer','thread-memory','layered-protection','backup-restore','keyframe-motion','forward-kinematics','inverse-kinematics','linear-skinning','toon-shading','shadow-map','user-needs','nosql-models','replica-lag','shard-routing','graph-records','quorum','data-privacy-security','audit-ledger','aggregate-inference','assignment-swap','counting-loop','function-scope','read-recovery','garbage-collection','reference-counting','dangling-reference','control-flow-map','reaching-definitions','dataflow-loop','dead-writes','write-effects','particle-integration','circle-collision','collision-response','life-garden','smoke-advection','spring-particle','terrain-relaxation','stereo-depth','ar-tracking','ar-occlusion','sensor-servo','sensor-hysteresis','sensor-quantization','sensor-sampling','inventory-contract','module-boundaries','design-impact','message-sequence','bundle-withdrawal','inventory-design','mirror-recovery','threshold-segmentation','region-growing','shape-features','block-motion','api-evolution','rule-refactoring','version-choice','api-migration','failure-domain','error-budget','majority-vote','correlated-failure','model-checking','contract-exhaustive','deadlock-checking','test-first','test-double','diagnostic-logging','work-sequencing','integration-strategies','exception-cleanup','mutation-coverage','verification-validation','test-levels','latency-throughput','pointer-bounds','entropy-seed','puf-measurement','tee-attestation'];
const all=[...levels];for(const module of modules){const exports=await import(`../src/${module}.js`);all.push(Object.values(exports).find(value=>value&&typeof value==='object'&&value.id&&value.number));}
test('every current quest appears in exactly one region and every region entry exists',()=>{
  const assigned=regions.flatMap(region=>region.quests);assert.equal(new Set(assigned).size,assigned.length);
  assert.deepEqual([...assigned].sort(),all.map(level=>level.id).sort());
});
test('filtering preserves the original quest indices and an unknown selection shows every quest',()=>{
  const forest=visibleQuests(all,'wilds');assert.deepEqual(forest.map(x=>x.level.id),['forest-search','weighted-roads','message-delivery','village-bridges','guided-ruins','misleading-stars','routing-towers','address-towers','layered-message','rain-observations','beacon-inspection','mist-markov','beacon-availability','negative-road-costs','forest-transitive-closure','forest-adjacency']);
  assert.ok(forest.every(x=>all[x.index]===x.level));assert.equal(visibleQuests(all,'missing').length,all.length);assert.equal(findRegion('missing'),null);
});
test('quest search combines normalized words, region and completion without changing quest indices',()=>{
  const done=['matrix-mirror'];
  const search=(region,query,status='all')=>filterQuests(all,region,query,status,done);
  assert.deepEqual(search('all','ＱＵＥＳＴ　８６').map(x=>x.level.id),['matrix-mirror','ruin-toon-shading']);
  assert.deepEqual(search('ruins','変換鏡 行列').map(x=>x.level.id),['matrix-mirror']);
  assert.deepEqual(search('wilds','変換鏡 行列'),[]);
  assert.deepEqual(search('all','変換鏡','done').map(x=>x.level.id),['matrix-mirror']);
  assert.deepEqual(search('all','変換鏡','todo'),[]);
  assert.ok(search('all','').every(({level,index})=>all[index]===level));
  assert.deepEqual(search('all','<img src=x>'),[]);
  assert.throws(()=>search('all','', 'invalid'),RangeError);
});
test('optional learning trails cover every existing quest once and preserve their suggested order',()=>{
  const ids=learningTrails.flatMap(trail=>trail.quests);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual([...ids].sort(),all.map(level=>level.id).sort());
  for(const trail of learningTrails){assert.equal(findTrail(trail.id),trail);assert.deepEqual(trailQuests(trail,all).map(item=>item.level.id),trail.quests);assert.ok(trailQuests(trail,all).every(item=>all[item.index]===item.level));}
  assert.equal(findTrail('missing'),null);
});
