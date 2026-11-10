import {gardenAdvancedIds,gardenAdvancedReady} from './endgame-garden.js';
import {fourRegions} from './four-regions.js';
import {newEntrances} from './new-entrances.js';
const extra={
 garden:[
  {id:'garden-advanced',title:'花の札と灯りの条件を考える',advanced:true,quests:gardenAdvancedIds},
  {id:'color',title:'光と色を作る',quests:['garden-color-light','garden-color-filter','garden-color-compare']},
  {id:'image',title:'灯り絵を作る',quests:['garden-image-fit','garden-image-pixels','garden-image-resample']},
  {id:'depth',title:'重なる灯りを描く',quests:['garden-depth-painter','garden-depth-buffer','garden-depth-equal']},
  {id:'matrix',title:'庭の矢印を動かす',quests:['garden-matrix-shear','garden-matrix-rotate','garden-matrix-compare']},
  {id:'vector',title:'道しるべの矢印を作る',quests:['garden-vector-add','garden-vector-scale','garden-vector-basis']},
  {id:'quantifiers',title:'庭の灯りの知らせを確かめる',quests:['garden-quantifiers-simple','garden-quantifiers-negation','garden-quantifiers-nested']},
  {id:'relations',title:'花の届け先を結ぶ',quests:['garden-relations-relation','garden-relations-function','garden-relations-composition']},
  {id:'logic-rules',title:'花の記録から知らせを導く',quests:['garden-logic-derive','garden-logic-unify','garden-logic-combine']},
 ],
 observatory:[
  {id:'regression',title:'雨の予測のずれを比べる',quests:['observatory-regression-absolute','observatory-regression-square','observatory-regression-compare']},
  {id:'supervised',title:'花札から規則を学ぶ',quests:['observatory-supervised-train','observatory-supervised-evaluate','observatory-supervised-separate']},
  {id:'local-search',title:'探索機で光を探す',quests:['observatory-local-climb','observatory-local-restart','observatory-local-plateau']},
  {id:'agent',title:'案内人形の動きを確かめる',quests:['observatory-agent-rule','observatory-agent-observe','observatory-agent-risk']},
  {id:'planning',title:'配達人形の道順を考える',quests:['observatory-planning-rules','observatory-planning-steps','observatory-planning-plan']},
  {id:'forecast',title:'雲の予測を比べる',quests:['observatory-forecast-lab','observatory-errors-lab']},
  {id:'layers',title:'旅先の観測帳を扱う',quests:['observatory-layers','observatory-offline','observatory-conflict']},
  {id:'probability',title:'観測の札の確かさを調べる',quests:['observatory-probability-weather','observatory-probability-draws','observatory-probability-reports']},
  {id:'statistics',title:'観測記録を整理する',quests:['observatory-statistics-frequency','observatory-statistics-center','observatory-statistics-spread']},
  {id:'variance',title:'観測のばらつきを調べる',requiresStatistics:true,quests:['observatory-variance-deviation','observatory-variance-variance','observatory-variance-compare']},
 ],
 tailor:[{id:'testing',title:'道具を試して直す',quests:['tailor-boundary','tailor-validation','tailor-regression']}],
 guide:[
  {id:'ethics',title:'混雑案内の影響を考える',quests:['guide-ethics-impact','guide-ethics-questions','guide-ethics-decision']},
  {id:'usability',title:'案内の使いやすさを調べる',quests:['guide-accessibility-lab','guide-usability-lab']},
  {id:'privacy',title:'旅人の記録を守る',quests:['guide-privacy-collection','guide-privacy-identity','guide-privacy-safeguards']},
  {id:'requirements',title:'掲示板の相談を聞く',quests:['guide-requirements-interview','guide-requirements-story','guide-requirements-agreement']},
  {id:'study-review',title:'調査の準備を相談する',quests:['guide-study-explain','guide-study-protect','guide-study-review']},
 ],
};
const prerequisites={
 'garden-color-compare':['garden-color-light','garden-color-filter'],
 'garden-image-resample':['garden-image-fit','garden-image-pixels'],
 'garden-depth-equal':['garden-depth-painter','garden-depth-buffer'],
 'garden-matrix-compare':['garden-matrix-shear','garden-matrix-rotate'],
 'garden-vector-basis':['garden-vector-add','garden-vector-scale'],
 'garden-quantifiers-nested':['garden-quantifiers-simple','garden-quantifiers-negation'],
 'garden-relations-composition':['garden-relations-relation','garden-relations-function'],
 'garden-logic-combine':['garden-logic-derive','garden-logic-unify'],
 'observatory-regression-compare':['observatory-regression-absolute','observatory-regression-square'],
 'observatory-supervised-separate':['observatory-supervised-train','observatory-supervised-evaluate'],
 'observatory-local-plateau':['observatory-local-climb','observatory-local-restart'],
 'observatory-agent-risk':['observatory-agent-rule','observatory-agent-observe'],
 'observatory-planning-plan':['observatory-planning-rules','observatory-planning-steps'],
 'observatory-conflict':['observatory-layers','observatory-offline'],
 'observatory-probability-reports':['observatory-probability-weather','observatory-probability-draws'],
 'observatory-statistics-spread':['observatory-statistics-frequency','observatory-statistics-center'],
 'observatory-variance-compare':['observatory-variance-deviation','observatory-variance-variance'],
 'tailor-regression':['tailor-boundary','tailor-validation'],
 'guide-ethics-decision':['guide-ethics-impact','guide-ethics-questions'],
 'guide-privacy-safeguards':['guide-privacy-collection','guide-privacy-identity'],
 'guide-requirements-agreement':['guide-requirements-interview','guide-requirements-story'],
 'guide-study-review':['guide-study-explain','guide-study-protect'],
};
export function lateRegionQuestGroups(region,completed,endgameAvailable){
 const done=new Set(completed),local=[...Object.keys(fourRegions[region].quests),...Object.entries(newEntrances).filter(([,q])=>q.region===region).map(([id])=>id)];
 const titles={tailor:['旅の持ち物を作る','作った道具を試す','仕立ての相談'],guide:['旅人の声と道しるべ','案内を使って確かめる','旅人の知らせを預かる'],garden:['花の札を整える','灯りの門を確かめる','花壇の絵を作る'],observatory:['雲を見分け予測する','予測を確かめる','観測道具を選ぶ']}[region];
 const basics=[];for(let i=0;i<local.length;i+=2)basics.push({id:`local-${i}`,title:titles[i/2],local:true,quests:local.slice(i,i+2)});
 const statisticsReady=['observatory-statistics-frequency','observatory-statistics-center','observatory-statistics-spread'].filter(id=>done.has(id)).length>=2;
 return [...basics,...extra[region]].map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.local||endgameAvailable&&(!g.advanced||gardenAdvancedReady(completed))&&(!g.requiresStatistics||statisticsReady))&&(!prerequisites[id]||prerequisites[id].every(x=>done.has(x))));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
