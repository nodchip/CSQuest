import {federatedResult,federatedRoutes} from './federated-db.js';
import {distributedMethods,createDistributedTrial,distributedStep} from './distributed-join.js';
export const distributedJourneyLevel={id:'archive-distributed-data-journey',number:'1124',kind:'distributed-data-journey',name:'二つの村を結ぶ台帳',tag:'接続と分散問い合わせの遠征',title:'遠くの記録を村に届ける',story:'書庫の青い受付から赤い記録庫へ接続し、二つの村の注文と薬草を結びます。伝令の量も比べて、結果をギルドに届けましょう。'};
export const distributedJourneyPlaces={archive:'王立書庫',villages:'東西の村',guild:'冒険者ギルド'};
export function distributedJourneyReplay(history){
 if(!Array.isArray(history)||history.length>80)throw new RangeError('遠征記録が不正です。');
 const s={place:'archive',route:'native',connected:false,method:'all',trials:{all:createDistributedTrial('sparse','all'),semi:createDistributedTrial('sparse','semi')},choice:null,joined:false,won:false,last:''};
 for(const a of history){
  if(typeof a!=='string'||s.won)throw new RangeError('遠征の操作が不正です。');
  if(a==='next'||a==='back'){const places=Object.keys(distributedJourneyPlaces),i=places.indexOf(s.place),j=i+(a==='next'?1:-1);if(j<0||j>=places.length)throw new RangeError('その方向へ進めません。');if(a==='next'&&s.place==='archive'&&!s.connected)throw new RangeError('まず赤い記録庫への接続を確かめましょう。');if(a==='next'&&s.place==='villages'&&!s.joined)throw new RangeError('まず二つの結合方法を試し、伝令の少ない方法を選びましょう。');s.place=places[j];s.last=`${distributedJourneyPlaces[s.place]}へ進みました。`;}
  else if(s.place==='archive'&&!s.connected&&a.startsWith('route:')){const route=a.slice(6);if(!Object.hasOwn(federatedRoutes,route))throw new RangeError('接続が不正です。');s.route=route;s.last='接続を選びました。';}
  else if(s.place==='archive'&&!s.connected&&a==='connect'){const r=federatedResult('different',s.route,'up');if(r.status==='ok'){s.connected=true;s.last='仲介役を通して赤い記録庫から応答を得ました。';}else s.last='青い接続は赤い記録庫に合いません。接続を変えて試しましょう。';}
  else if(s.place==='villages'&&!s.joined&&a.startsWith('method:')){const method=a.slice(7);if(!Object.hasOwn(distributedMethods,method))throw new RangeError('方法が不正です。');s.method=method;s.last='結合方法を選びました。';}
  else if(s.place==='villages'&&!s.joined&&a.startsWith('join:')){const old=s.trials[s.method],next=distributedStep(old,a.slice(5));if(next.history.length===old.history.length)throw new RangeError(next.message);s.trials[s.method]=next;s.last=next.message;}
  else if(s.place==='villages'&&!s.joined&&a.startsWith('choice:')){const choice=a.slice(7);if(!Object.hasOwn(distributedMethods,choice))throw new RangeError('方法が不正です。');s.choice=choice;s.last='届ける方法を選びました。';}
  else if(s.place==='villages'&&!s.joined&&a==='confirm'){if(Object.values(s.trials).some(t=>t.phase!=='done'))throw new RangeError('両方の方法で結合を終えましょう。');if(s.choice!=='semi')s.last='２方式の伝令の数を比較し、少ない方を選びましょう。';else{s.joined=true;s.last='同じ３行を得て、伝令が少ない方法を選びました。';}}
  else if(s.place==='guild'&&a==='report'&&s.connected&&s.joined){s.won=true;s.last='問い合わせの結果を届けました。';}
  else throw new RangeError('今いる場所と操作を確認しましょう。');
 }
 return s;
}
export function distributedJourneyCreate(){return {history:[]};}
export function distributedJourneyAct(q,a){const h=[...q.history,a],s=distributedJourneyReplay(h);q.history=h;return s;}
export function distributedJourneyRestore(q){if(!q)throw new RangeError('遠征記録が不正です。');distributedJourneyReplay(q.history);return {history:[...q.history]};}
