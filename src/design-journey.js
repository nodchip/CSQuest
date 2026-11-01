import {designVariants,designSuite} from './design-smells.js';
import {createMigration,stepMigration,migrationResult,migrationComplete} from './api-migration.js';
export const designJourneyLevel={id:'village-design-journey',number:'681',kind:'design-journey',name:'薬草祭りの窓口を守れ',tag:'設計・契約・段階的移行',title:'村の窓口を引き継いで祭りを開こう',story:'薬草祭りに向けて受付を改修します。数量の約束を確かめ、村の内外の利用者を新しい窓口へ案内してから祭りの門を開きましょう。'};
export const designJourneyPlaces={guild:'村の広場',workshop:'受付の工房',desk:'引継ぎの窓口',festival:'祭りの門'};
const paths=[['guild','workshop'],['workshop','desk'],['desk','festival']];
export function designJourneyNeighbors(place){if(!Object.hasOwn(designJourneyPlaces,place))throw new RangeError('場所が不正です。');return paths.flatMap(([a,b])=>a===place?[b]:b===place?[a]:[]);}
export function createDesignJourney(){return {place:'guild',variant:'separate',oldReport:null,newReport:null,migration:createMigration(),history:[],status:'playing'};}
export function designJourneyAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=140||s.status!=='playing')return {ok:false,message:'旅を続けられません。最初からやり直してください。'};
 const n={...s,history:[...s.history]};let message='';
 if(action.startsWith('move:')){
  const dest=action.slice(5);if(!designJourneyNeighbors(s.place).includes(dest))return {ok:false,message:'つながる道を選びましょう。'};
  if(dest==='desk'&&(!s.oldReport?.every(x=>x.pass)||!s.newReport?.every(x=>x.pass)))return {ok:false,message:'先に工房で現在と変更後の両方の約束を確かめましょう。'};
  if(dest==='festival'&&!migrationComplete(s.migration))return {ok:false,message:'利用者の調査、引継ぎと試験を終えてから祭りへ進みましょう。'};
  n.place=dest;if(dest==='festival'){n.status='won';message='利用者を迎えて祭りが始まりました！';}else message=`${designJourneyPlaces[dest]}へ進みました。`;
 }
 else if(s.place==='workshop'&&action.startsWith('design:')&&Object.hasOwn(designVariants,action.slice(7))){n.variant=action.slice(7);n.oldReport=null;n.newReport=null;message='設計を選びました。現在と変更後を試し直しましょう。';}
 else if(s.place==='workshop'&&(action==='test:old'||action==='test:new')){
  const changed=action==='test:new',report=designSuite(s.variant,changed);n[changed?'newReport':'oldReport']=report;const failures=report.filter(r=>!r.pass).length;
  message=failures?`${failures} 件が約束と違います。料金、在庫や両方の受付を見直しましょう。`:'７つの試験では約束どおりです。他の入力の正しさまでは保証しません。';
 }
 else if(s.place==='desk'&&action.startsWith('mig:')){
  const a=action.slice(4);if(!['survey','addNew','screen','desk','traveler','removeOld','restoreOld','test'].includes(a))return {ok:false,message:'引継ぎの操作を確認しましょう。'};
  if(['screen','desk','traveler'].includes(a)&&!s.migration.new)return {ok:false,message:'先に新しい窓口を開きましょう。'};
  if(s.migration.history.length>=50)return {ok:false,message:'引継ぎの記録がいっぱいです。最初からやり直してください。'};
  const m=stepMigration(s.migration,a);n.migration=m;message=m.message;
 }
 else return {ok:false,message:'今いる場所と操作を確かめましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function designJourneyClients(s){const ids=s.migration.discovered?['screen','desk','traveler']:['screen','desk'];return ids.map(id=>({id,...migrationResult(s.migration,id)}));}
export function restoreDesignJourney(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>140)throw new RangeError('途中記録が不正です。');let s=createDesignJourney();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=designJourneyAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
