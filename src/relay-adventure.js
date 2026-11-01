import {createTrial,stepWorker} from './concurrency.js';
import {createLockedTrial,stepLockedWorker} from './locking.js';
export const relayAdventureLevel={id:'forge-relay-adventure',number:'659',kind:'relay-adventure',name:'精霊たちと灯りの塔',tag:'並行処理・排他制御・論理',title:'二つの宝石を灯りの塔へ',story:'消えかけた塔の灯りを戻すため、精霊たちと宝石を運びます。鍵を探し、記録を守って守護者の先へ進みましょう。'};
export const relayPlaces={camp:'野営地',key:'鍵の祭壇',forge:'精霊の工房',spring:'癒やしの泉',gate:'守護者の間',tower:'灯りの塔'};
const edges=[['camp','key'],['camp','forge'],['camp','spring'],['key','forge'],['forge','gate'],['spring','gate'],['gate','tower']];
export function relayNeighbors(place){if(!Object.hasOwn(relayPlaces,place))throw new RangeError('場所が不正です。');return edges.flatMap(([a,b])=>a===place?[b]:b===place?[a]:[]);}
export function createRelayAdventure(){return {place:'camp',key:false,mode:'open',trial:createTrial(),seal:false,guardian:false,hp:3,turn:0,status:'playing',history:[]};}
export function relayAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100||s.status!=='playing')return {ok:false,message:'旅を続けられません。最初からやり直してください。'};
 const n={...s,history:[...s.history]};let message='';
 if(action.startsWith('move:')){
  const dest=action.slice(5);
  if(!relayNeighbors(s.place).includes(dest))return {ok:false,message:'今いる場所からつながる道を選びましょう。'};
  if(s.place==='gate'&&dest==='tower'&&(!s.seal||!s.guardian))return {ok:false,message:'二つの宝石の記録と守護者の突破が必要です。'};
  if(dest==='gate'&&!s.seal)return {ok:false,message:'守護者の間には二つの宝石を記録した証が必要です。工房で精霊たちを手伝いましょう。'};
  if(s.place==='gate'&&!s.guardian&&dest==='tower')return {ok:false,message:'守護者が道をふさいでいます。'};
  n.place=dest;
  if(dest==='key'){n.key=true;message='祭壇で記録を守る鍵を手に入れました。';}
  else if(dest==='spring'){n.hp=3;message='泉で体力が回復しました。';}
  else if(dest==='tower'){n.status='won';message='二つの宝石で塔の灯りが戻りました！';}
  else if(dest==='gate'&&!s.guardian)message='守護者が現れました。二つの灯りを見ましょう。';
  else message=`${relayPlaces[dest]}へ進みました。`;
 }
 else if(action==='mode:open'||action==='mode:locked'){
  if(s.place!=='forge')return {ok:false,message:'精霊の工房で記録を調べましょう。'};
  const mode=action.slice(5);if(mode==='locked'&&!s.key)return {ok:false,message:'先に鍵の祭壇で鍵を見つけましょう。'};
  n.mode=mode;n.trial=mode==='open'?createTrial():createLockedTrial();message=mode==='open'?'鍵を使わず最初から記録を始めます。':'鍵を使って最初から記録を始めます。';
 }
 else if(action==='step:A'||action==='step:B'){
  if(s.place!=='forge'||s.trial.done)return {ok:false,message:'工房で新しい記録を始めましょう。'};
  const id=action.slice(-1);if(s.trial.workers[id].stage==='done')return {ok:false,message:`${id} の作業は終わっています。もう一人を進めましょう。`};
  n.trial=s.mode==='open'?stepWorker(s.trial,id):stepLockedWorker(s.trial,id);
  message=n.trial.log[n.trial.log.length-1];
  if(n.trial.done){if(n.trial.value===2&&s.mode==='locked'){n.seal=true;message+=' ２個の記録が完成し、通行の証を受け取りました。';}else message+=n.trial.value===2?' ２個になりました。鍵を使う仕組みでも試しましょう。':' 期待した２個と違います。順序と鍵を見直しましょう。';}
 }
 else if(action==='attack'||action==='guard'){
  if(s.place!=='gate'||s.guardian)return {ok:false,message:'守護者がいる間で選びましょう。'};
  const lights=[[0,0],[1,0],[1,1]][s.turn%3];n.turn++;
  if(action==='guard')message='身を守り、次の灯りを待ちました。';
  else if(lights[0]!==lights[1]){n.guardian=true;message='片方だけが光る隙を突き、守護者を退けました。';}
  else{n.hp--;message='二つの灯りが同じ状態で攻撃が跳ね返されました。';if(n.hp===0){n.status='lost';message+=' 旅をやり直しましょう。';}}
 }
 else return {ok:false,message:'場所と操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreRelayAdventure(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createRelayAdventure();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=relayAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
