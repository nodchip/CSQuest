import {saasModes,saasNetworks,saasOutcome} from './software-service.js';
import {serviceDesignModes,serviceDesignFaults,serviceDesignOutcome} from './service-boundaries.js';
import {capacityCreate,capacityRestore} from './service-capacity.js';
export const serviceJourneyLevel={id:'village-communications-expedition',number:'1292',kind:'communications-expedition',name:'途切れた伝令と二つの受付',tag:'サービス設計の遠征',title:'村の記録と受付を守ろう',story:'通信が途切れる南村と、受付を止められないギルドを巡ります。二つの方式を試し、依頼人に合う仕組みを届けましょう。'};
export const journeyPlaces={village:'南村の記録所',office:'ギルドの受付',guild:'冒険者ギルド'};
export function serviceJourneyReplay(history){
 if(!Array.isArray(history))throw new RangeError('遠征の記録が不正です。');
 const s={place:'village',mode:'service',networks:[],villageDone:false,design:'monolith',faults:[],officeDone:false,reflection:null,won:false,last:''};
 for(const action of history){
  if(typeof action!=='string'||s.won)throw new RangeError('遠征の操作が不正です。');
  if(action==='next'||action==='back'){
   const places=Object.keys(journeyPlaces),i=places.indexOf(s.place),j=i+(action==='next'?1:-1);
   if(j<0||j>=places.length)throw new RangeError('その方向へは進めません。');
   if(action==='next'&&s.place==='village'&&!s.villageDone)throw new RangeError('南村で通信あり・なしを試し、方式を届けましょう。');
   if(action==='next'&&s.place==='office'&&!s.officeDone)throw new RangeError('受付で３つの状態を試し、構成を届けましょう。');
   s.place=places[j];s.last=`${journeyPlaces[s.place]}へ移動しました。`;
  }else if(s.place==='village'&&!s.villageDone&&action.startsWith('mode:')){
   const mode=action.slice(5);if(!Object.hasOwn(saasModes,mode))throw new RangeError('方式が不正です。');if(s.mode!==mode){s.mode=mode;s.networks=[];}s.last='記録の方式を選びました。';
  }else if(s.place==='village'&&!s.villageDone&&action.startsWith('network:')){
   const net=action.slice(8);if(!Object.hasOwn(saasNetworks,net))throw new RangeError('通信の状態が不正です。');if(!s.networks.includes(net))s.networks.push(net);const result=saasOutcome(s.mode,net);s.last=result==='shared'?'遠隔の共有記録には５束があります。':result==='local'?'南村の端末の記録には２束があります。':'遠隔の記録を開けません。';
  }else if(s.place==='village'&&!s.villageDone&&action==='confirm:village'){
   if(s.networks.length!==2)throw new RangeError('選んだ方式で通信あり・なしを両方試しましょう。');
   if(saasOutcome(s.mode,'offline')!=='local')s.last='通信断で南村の記録を開けません。方式を選び直しましょう。';else{s.villageDone=true;s.last='通信断でも端末内の記録を開ける道具を南村に届けました。';}
  }else if(s.place==='office'&&!s.officeDone&&action.startsWith('design:')){
   const design=action.slice(7);if(!Object.hasOwn(serviceDesignModes,design))throw new RangeError('構成が不正です。');if(s.design!==design){s.design=design;s.faults=[];}s.last='受付の構成を選びました。';
  }else if(s.place==='office'&&!s.officeDone&&action.startsWith('fault:')){
   const fault=action.slice(6);if(!Object.hasOwn(serviceDesignFaults,fault))throw new RangeError('故障の状態が不正です。');if(!s.faults.includes(fault))s.faults.push(fault);const r=serviceDesignOutcome(s.design,fault);s.last=`注文：${r.order?'処理できる':'処理できない'}、報告：${r.report?'処理できる':'処理できない'}。`;
  }else if(s.place==='office'&&!s.officeDone&&action==='confirm:office'){
   if(s.faults.length!==3)throw new RangeError('選んだ構成で３つの状態を試しましょう。');
   if(!serviceDesignOutcome(s.design,'order').report)s.last='注文側が止まると報告も停止します。構成を選び直しましょう。';else{s.officeDone=true;s.last='注文側の作業場が停止しても報告を続ける構成を届けました。共通の門が止まると両方使えません。';}
  }else if(s.place==='guild'&&action.startsWith('reflection:')){const value=action.slice(11);if(!['shared','immune'].includes(value))throw new RangeError('振り返りが不正です。');s.reflection=value;s.last=value==='shared'?'共通の門の停止は両方に影響します。':'受付で試した共通の門を思い出しましょう。';}
  else if(s.place==='guild'&&action==='report'&&s.villageDone&&s.officeDone){if(s.reflection!=='shared')throw new RangeError('共通の門の振り返りを確認しましょう。');s.won=true;s.last='二つの場所の結果と共通の門の限界を報告しました。';}
  else throw new RangeError('今いる場所と操作を確認しましょう。');
 }
 return s;
}
export function serviceJourneyCreate(){return {history:[],capacity:capacityCreate()};}
function compactJourney(history){
 // Keep the final action so its feedback is preserved. A loop returning to the
 // same game state can be removed without changing any later action.
 const seen=new Map();
 for(let i=0;i<history.length;i++){
  const {last,...state}=serviceJourneyReplay(history.slice(0,i));
  const key=JSON.stringify(state);
  if(seen.has(key))return [...history.slice(0,seen.get(key)),...history.slice(i)];
  seen.set(key,i);
 }
 return history;
}
export function serviceJourneyAct(q,action){let next=[...q.history,action];const state=serviceJourneyReplay(next);if(next.length>=100)next=compactJourney(next);q.history=next;return state;}
export function serviceJourneyRestore(q){if(!q)throw new RangeError('遠征記録が不正です。');serviceJourneyReplay(q.history);return {history:[...q.history],capacity:Object.hasOwn(q,'capacity')?capacityRestore(q.capacity):capacityCreate()};}
