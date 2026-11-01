import {createTimerTrial,timerTrialAct} from './timer-protection.js';
import {deputyOutcome} from './deputy-access.js';
import {deviceBridgeRun} from './device-bridge.js';
export const osAdventureLevel={id:'forge-os-adventure',number:'675',kind:'os-adventure',name:'止まった灯火の工房',tag:'OS・割込み・権限・装置',title:'司令室を立て直して灯りを守ろう',story:'工房の灯火が消え、術師 B が作業できずにいます。時計の部屋、受付、水晶室を巡り、皆が安全に使える灯りを取り戻しましょう。'};
export const osAdventurePlaces={camp:'工房入口',clock:'時計の部屋',desk:'記録の受付',machine:'水晶室',beacon:'灯火の塔'};
const edges=[['camp','clock'],['camp','desk'],['clock','desk'],['desk','machine'],['machine','beacon']];
export function osAdventureNeighbors(place){if(!Object.hasOwn(osAdventurePlaces,place))throw new RangeError('場所が不正です。');return edges.flatMap(([a,b])=>a===place?[b]:b===place?[a]:[]);}
export function createOsAdventure(){return {place:'camp',timer:createTimerTrial('protected'),ready:false,mode:'broad',audit:{own:null,other:null},authorized:false,missingSeen:false,driver:false,lit:false,history:[],status:'playing'};}
export function osAdventureAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100||s.status!=='playing')return {ok:false,message:'旅を続けられません。必要なら最初からやり直してください。'};
 const n={...s,history:[...s.history],audit:{...s.audit}};let message='';
 if(action.startsWith('move:')){
  const dest=action.slice(5);if(!osAdventureNeighbors(s.place).includes(dest))return {ok:false,message:'つながっている道を選びましょう。'};
  if(dest==='machine'&&(!s.ready||!s.authorized))return {ok:false,message:'B の仕事と受付の確認を先に済ませましょう。'};
  if(dest==='beacon'&&(!s.ready||!s.authorized||!s.lit))return {ok:false,message:'水晶を安全に点灯してから塔へ進みましょう。'};
  n.place=dest;if(dest==='beacon'){n.status='won';message='灯火の塔に明かりが戻りました！';}else message=`${osAdventurePlaces[dest]}へ進みました。`;
 }
 else if(action.startsWith('timer:')&&s.place==='clock'){
  const r=timerTrialAct(s.timer,action.slice(6));if(!r.ok)return r;n.timer=r.state;n.ready=r.state.bDone;message=r.message;if(n.ready)message+=' B が受付を整える準備を終えました。';
 }
 else if(action.startsWith('mode:')&&s.place==='desk'){
  const mode=action.slice(5);if(!['broad','guarded'].includes(mode))return {ok:false,message:'受付の仕組みを確認しましょう。'};n.mode=mode;n.audit={own:null,other:null};n.authorized=false;n.lit=false;message='受付の仕組みを変えました。二つの依頼を試し直しましょう。';
 }
 else if((action==='test:own'||action==='test:other')&&s.place==='desk'){
  if(!s.ready)return {ok:false,message:'先に時計の部屋で B が仕事を進められるようにしましょう。'};
  const kind=action.slice(5),r=deputyOutcome(s.mode,'service','A',kind==='own'?'A':'B');n.audit[kind]={delivered:r.delivered,leak:r.leak,appAllowed:r.appAllowed};n.authorized=false;n.lit=false;message=r.leak?'他人の記録が渡りました。受付の照合を見直しましょう。':r.delivered?'本人の記録が渡りました。':'受付が他人の記録の依頼を断りました。';
 }
 else if(action==='audit'&&s.place==='desk'){
  if(!s.audit.own||!s.audit.other)return {ok:false,message:'本人と他人への二つの依頼を先に試しましょう。'};
  n.authorized=!!(s.audit.own.delivered&&!s.audit.own.leak&&!s.audit.other.delivered&&s.audit.other.appAllowed===false);message=n.authorized?'本人の依頼を通し、他人への依頼を断れました。水晶室へ進めます。':'二つの結果を見直し、本人を通して他人を断る仕組みに直しましょう。';
 }
 else if(action==='device:try'&&s.place==='machine'){
  const r=deviceBridgeRun('portable','B',true,s.driver);if(r.status==='no-driver')n.missingSeen=true;if(r.lit)n.lit=true;message=r.trace.at(-1);
 }
 else if(action==='device:install'&&s.place==='machine'){
  if(!s.missingSeen)return {ok:false,message:'先に点灯を試し、何が必要か確かめましょう。'};n.driver=true;message='水晶 B の担当を用意しました。もう一度共通の依頼を出しましょう。';
 }
 else return {ok:false,message:'いまいる場所と操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreOsAdventure(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createOsAdventure();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=osAdventureAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
