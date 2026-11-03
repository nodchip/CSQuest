import {vectorAssignment} from './parallel-vector-add.js';
import {coalescedEvaluate} from './coalesced-load.js';
import {cryptoAccelEstimate} from './crypto-acceleration.js';
export const computeRescueLevel={id:'forge-compute-rescue',number:'1089',kind:'compute-rescue',name:'計算炉から塔への伝令',tag:'並列処理・記憶・暗号をつなぐ冒険',title:'三つの工夫で伝令を届ける',story:'計算炉の結果を遠い塔へ届けます。精霊に仕事を分け、棚から読み、伝令を守りましょう。'};
export const rescuePatterns={packed:[0,1,2,3],stride:[0,8,16,24]};
export const rescueModes=['instructions','device'];
export function computeRescueReplay(history){
 if(!Array.isArray(history)||history.length>30)throw new RangeError('遠征の記録が不正です');
 const s={place:'camp',workers:[],patterns:[],memoryChoice:null,modes:[],cryptoChoice:null,sealed:false};
 for(const e of history){
  if(!e||typeof e!=='object')throw new RangeError('遠征の記録が不正です');
  if(e.type==='depart'&&s.place==='camp'){s.place='forge';continue;}
  if(e.type==='worker'&&s.place==='forge'){
   const r=vectorAssignment(e.block,e.lane),key=`${e.block}:${e.lane}`,expected=r.value===null?'skip':String(r.value);if(e.answer!==expected||s.workers.includes(key))throw new RangeError('担当と結果を確かめましょう');s.workers.push(key);continue;
  }
  if(e.type==='leave-forge'&&s.place==='forge'){if(s.workers.length!==8)throw new RangeError('８人全員の担当を確かめましょう');s.place='shelf';continue;}
  if(e.type==='pattern'&&s.place==='shelf'&&Object.hasOwn(rescuePatterns,e.pattern)){
   const r=coalescedEvaluate(rescuePatterns[e.pattern]);if(e.guess!==r.transactions||s.patterns.includes(e.pattern))throw new RangeError('区画の数を確かめましょう');s.patterns.push(e.pattern);continue;
  }
  if(e.type==='memory-choice'&&s.place==='shelf'&&s.memoryChoice===null){if(s.patterns.length!==2)throw new RangeError('まず両方の並びの運搬回数を確かめましょう');if(e.choice!=='packed')throw new RangeError('連続は１回、飛び飛びは４回です。少ない方を選びましょう');s.memoryChoice=e.choice;continue;}
  if(e.type==='leave-shelf'&&s.place==='shelf'&&s.memoryChoice==='packed'){s.place='seal';continue;}
  if(e.type==='mode'&&s.place==='seal'&&rescueModes.includes(e.mode)){
   const r=cryptoAccelEstimate(e.mode,16);if(e.guess!==r.total||s.modes.includes(e.mode))throw new RangeError('準備を含む時間を確かめましょう');s.modes.push(e.mode);continue;
  }
  if(e.type==='crypto-choice'&&s.place==='seal'&&s.cryptoChoice===null){if(s.modes.length!==2)throw new RangeError('まず両方の道具の合計時間を確かめましょう');if(e.choice!=='device')throw new RangeError('専用命令は320刻、外付け装置は228刻です。短い方を選びましょう');s.cryptoChoice=e.choice;continue;}
  if(e.type==='seal'&&s.place==='seal'&&!s.sealed){if(s.cryptoChoice!=='device')throw new RangeError('先に速い道具を選びましょう');if(e.choice!=='auth')throw new RangeError('暗号化だけでは改ざんの検出を保証できません');s.sealed=true;continue;}
  if(e.type==='deliver'&&s.place==='seal'&&s.sealed){s.place='tower';continue;}
  throw new RangeError('先に必要な作業を確かめましょう');
 }
 return s;
}
export function computeRescueCreate(){return {history:[],block:0,lane:0,answer:null,pattern:'packed',memoryGuess:null,mode:'instructions',timeGuess:null};}
export function computeRescueRestore(q){
 if(!q||![0,1].includes(q.block)||![0,1,2,3].includes(q.lane)||![null,'3','5','6','7','8','10','skip'].includes(q.answer)||!Object.hasOwn(rescuePatterns,q.pattern)||![null,1,2,3,4].includes(q.memoryGuess)||!rescueModes.includes(q.mode)||![null,164,228,320,360].includes(q.timeGuess))throw new RangeError('遠征の記録が不正です');computeRescueReplay(q.history);return {...q,history:q.history.map(e=>({...e}))};
}
