import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {lateRegionQuestGroups} from '../src/late-region-quest-groups.js';
test('仕立て屋と案内所の依頼を重複なく分類し未開放も達成判定に含む',()=>{
 for(const region of ['tailor','guide']){const groups=lateRegionQuestGroups(region,[],false),all=groups.flatMap(g=>g.quests),local=groups.filter(g=>g.local).flatMap(g=>g.quests);
 assert.equal(new Set(all).size,all.length);assert.ok(all.length>local.length);
 assert.equal(lateRegionQuestGroups(region,local,false).every(g=>g.complete),false);
 assert.ok(lateRegionQuestGroups(region,all,true).every(g=>g.complete));}
});
test('追加依頼は対応する二件を達成してから開く',()=>{
 for(const [r,id,needs] of [
 ['tailor','tailor-regression',['tailor-boundary','tailor-validation']],
 ['guide','guide-ethics-decision',['guide-ethics-impact','guide-ethics-questions']],
 ['guide','guide-privacy-safeguards',['guide-privacy-collection','guide-privacy-identity']],
 ['guide','guide-requirements-agreement',['guide-requirements-interview','guide-requirements-story']],
 ['guide','guide-textcontrast-compare',['guide-textcontrast-normal','guide-textcontrast-large']],
 ['guide','guide-study-review',['guide-study-explain','guide-study-protect']]]){
 const available=done=>lateRegionQuestGroups(r,done,true).flatMap(g=>g.available).includes(id);
 assert.equal(available([needs[0]]),false,id);assert.equal(available(needs),true,id);}
});
test('庭園の発展依頼は基礎二件と祭りの両方が必要',()=>{
 const visible=(done,endgame)=>lateRegionQuestGroups('garden',done,endgame).flatMap(g=>g.available);
 assert.equal(visible(['garden-sets'],true).includes('garden-shelter'),false);
 assert.equal(visible(['garden-sets','garden-logic'],false).includes('garden-shelter'),false);
 assert.equal(visible(['garden-sets','garden-logic'],true).includes('garden-shelter'),true);
});
test('庭園と観測所の依頼は重複せず発展依頼の条件を保つ',()=>{
 for(const [r,count] of [['garden',46],['observatory',58]]){
  const groups=lateRegionQuestGroups(r,[],false),all=groups.flatMap(g=>g.quests);
  assert.equal(all.length,count);assert.equal(new Set(all).size,count);
  assert.ok(lateRegionQuestGroups(r,all,true).every(g=>g.complete));
 }
 for(const [r,id,needs] of [
  ['garden','garden-color-compare',['garden-color-light','garden-color-filter']],
  ['garden','garden-image-resample',['garden-image-fit','garden-image-pixels']],
  ['garden','garden-depth-equal',['garden-depth-painter','garden-depth-buffer']],
  ['garden','garden-matrix-compare',['garden-matrix-shear','garden-matrix-rotate']],
  ['garden','garden-pixelwindow-sharp',['garden-pixelwindow-box','garden-pixelwindow-gaussian']],
  ['garden','garden-lightdot-negative',['garden-lightdot-positive','garden-lightdot-zero']],
  ['garden','garden-squareinduction-proof',['garden-squareinduction-one','garden-squareinduction-two']],
  ['garden','garden-rayprojection-compare',['garden-rayprojection-axis','garden-rayprojection-diagonal']],
  ['garden','garden-vector-basis',['garden-vector-add','garden-vector-scale']],
  ['garden','garden-quantifiers-nested',['garden-quantifiers-simple','garden-quantifiers-negation']],
  ['garden','garden-relations-composition',['garden-relations-relation','garden-relations-function']],
  ['garden','garden-modulo-compare',['garden-modulo-positive','garden-modulo-negative']],
  ['garden','garden-logic-combine',['garden-logic-derive','garden-logic-unify']],
  ['observatory','observatory-cluster-compare',['observatory-cluster-far','observatory-cluster-near']],
  ['observatory','observatory-derivative-compare',['observatory-derivative-after','observatory-derivative-before']],
  ['observatory','observatory-reward-compare',['observatory-reward-safe','observatory-reward-room']],
  ['observatory','observatory-descent-compare',['observatory-descent-small','observatory-descent-large']],
  ['observatory','observatory-interquartile-compare',['observatory-interquartile-even','observatory-interquartile-odd']],
  ['observatory','observatory-regression-compare',['observatory-regression-absolute','observatory-regression-square']],
  ['observatory','observatory-supervised-separate',['observatory-supervised-train','observatory-supervised-evaluate']],
  ['observatory','observatory-local-plateau',['observatory-local-climb','observatory-local-restart']],
  ['observatory','observatory-agent-risk',['observatory-agent-rule','observatory-agent-observe']],
  ['observatory','observatory-guardian-horizon',['observatory-guardian-first','observatory-guardian-second']],
  ['observatory','observatory-planning-plan',['observatory-planning-rules','observatory-planning-steps']],
  ['observatory','observatory-conflict',['observatory-layers','observatory-offline']],
  ['observatory','observatory-eventindependence-disjoint',['observatory-eventindependence-balanced','observatory-eventindependence-linked']],
  ['observatory','observatory-warningprior-compare',['observatory-warningprior-rare','observatory-warningprior-common']],
  ['observatory','observatory-probability-reports',['observatory-probability-weather','observatory-probability-draws']],
  ['observatory','observatory-statistics-spread',['observatory-statistics-frequency','observatory-statistics-center']]]){
  const visible=done=>lateRegionQuestGroups(r,done,true).flatMap(g=>g.available).includes(id);
  assert.equal(visible([needs[0]]),false,id);assert.equal(visible(needs),true,id);
 }
});
test('分散の依頼は統計の異なる２件の後に開き、地図の全達成にも含まれる',()=>{
 const ids=['observatory-statistics-frequency','observatory-statistics-center','observatory-statistics-spread'];
 const base=['observatory-variance-deviation','observatory-variance-variance'],advanced='observatory-variance-compare';
 const group=(done,endgame=true)=>lateRegionQuestGroups('observatory',done,endgame).find(g=>g.id==='variance');
 assert.deepEqual(group([ids[0],ids[0]]).available,[]);
 for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){
  const done=[ids[i],ids[j]];
  assert.deepEqual(group(done,false).available,[]);
  assert.deepEqual(group(done).available,base);
  assert.equal(group([...done,base[0]]).available.includes(advanced),false);
  assert.equal(group([...done,...base]).available.includes(advanced),true);
 }
 const all=lateRegionQuestGroups('observatory',[],true).flatMap(g=>g.quests);
 assert.equal(lateRegionQuestGroups('observatory',all.filter(id=>!id.startsWith('observatory-variance-')),true).every(g=>g.complete),false);
 assert.equal(lateRegionQuestGroups('observatory',all,true).every(g=>g.complete),true);
 assert.ok(group([advanced],false).available.includes(advanced));
});
