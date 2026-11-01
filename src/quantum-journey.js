import {applyBellGate,runBellGates,bellTargetMatches} from './bell-gates.js';
import {teleportInputs,teleportBranch,teleportCorrect,teleportSame} from './teleport.js';
export const quantumJourneyLevel={id:'ruin-quantum-journey',number:'679',kind:'quantum-journey',name:'水晶を結ぶ遺跡の旅',tag:'量子ゲート・複製・通信',title:'二つの塔に光を届けよう',story:'谷を隔てた塔へ光の状態を届けます。遺跡を巡って水晶を結び、複製の罠を調べ、測定の伝言で灯火を取り戻しましょう。'};
export const quantumPlaces={camp:'遺跡入口',gate:'結びの間',lab:'写しの間',tower:'伝言の塔',beacon:'灯火の祭壇'};
const paths=[['camp','gate'],['gate','lab'],['lab','tower'],['tower','beacon']];
export function quantumNeighbors(place){if(!Object.hasOwn(quantumPlaces,place))throw new RangeError('場所が不正です。');return paths.flatMap(([a,b])=>a===place?[b]:b===place?[a]:[]);}
export function cloneTrial(input){
 if(!Object.hasOwn(teleportInputs,input))throw new RangeError('入力が不正です。');
 const [a,b]=teleportInputs[input].vector,actual=applyBellGate([a,0,b,0],'ab'),target=[a*a,a*b,b*a,b*b];
 const overlap=actual.reduce((sum,x,i)=>sum+x*target[i],0);return {actual,target,fidelity:overlap*overlap};
}
export function createQuantumJourney(){return {place:'camp',gates:[],ready:false,input:'zero',seen:[],cloneReport:null,answer:null,sealed:false,phase:'ready',x:false,z:false,transferReport:null,lit:false,status:'playing',history:[]};}
export function quantumJourneyAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=150||s.status!=='playing')return {ok:false,message:'旅を続けられません。最初からやり直してください。'};
 const n={...s,gates:[...s.gates],seen:[...s.seen],history:[...s.history]};let message='';
 if(action.startsWith('move:')){
  const dest=action.slice(5);if(!quantumNeighbors(s.place).includes(dest))return {ok:false,message:'つながる道を選びましょう。'};
  if(dest==='lab'&&!s.ready)return {ok:false,message:'先に結びの間で水晶の組を作りましょう。'};
  if(dest==='tower'&&!s.sealed)return {ok:false,message:'先に写しの間で４種類を試し、結論を確かめましょう。'};
  if(dest==='beacon'&&!s.lit)return {ok:false,message:'伝言を届け、塔の水晶を修正しましょう。'};
  n.place=dest;if(dest==='beacon'){n.status='won';message='谷の灯火が戻りました！';}else message=`${quantumPlaces[dest]}に進みました。`;
 }
 else if(s.place==='gate'&&['add:ha','add:ab'].includes(action)){
  if(s.gates.length>=4)return {ok:false,message:'門は４枚までです。並びを空にして試しましょう。'};
  n.gates.push(action.slice(4));n.ready=false;n.sealed=false;n.lit=false;message='門を最後に置きました。';
 }
 else if(s.place==='gate'&&action==='clear'){n.gates=[];n.ready=false;n.sealed=false;n.lit=false;message='門の並びを空にしました。';}
 else if(s.place==='gate'&&action==='build'){
  n.ready=bellTargetMatches(runBellGates(s.gates).at(-1),'plus');if(!n.ready){n.sealed=false;n.lit=false;}
  message=n.ready?'同じ光が結ばれました。写しの間へ進めます。':'まだ 00 と 11 が同じ符号で結ばれていません。順序を見直しましょう。';
 }
 else if(s.place==='lab'&&action.startsWith('input:')&&Object.hasOwn(teleportInputs,action.slice(6))){n.input=action.slice(6);n.cloneReport=null;message='試す状態を選びました。';}
 else if(s.place==='lab'&&action==='trial'){
  n.cloneReport=cloneTrial(s.input);if(!n.seen.includes(s.input))n.seen.push(s.input);n.sealed=false;n.lit=false;
  message=n.cloneReport.fidelity>1-1e-9?'この入力は２つの同じ状態になりました。':'この入力は２つの同じ状態にはなりません。';
 }
 else if(s.place==='lab'&&['answer:no','answer:yes'].includes(action)){n.answer=action.slice(7);n.sealed=false;n.lit=false;message='結論を選びました。';}
 else if(s.place==='lab'&&action==='seal'){
  if(!Object.keys(teleportInputs).every(k=>s.seen.includes(k)))return {ok:false,message:'４種類の入力を試してから結論を確かめましょう。'};
  n.sealed=s.answer==='no';message=n.sealed?'決まった入力での成功は、未知の任意の状態を複製できる証拠にはなりません。伝言の塔へ進めます。':'重ね合わせを試した結果を見直しましょう。';
 }
 else if(s.place==='tower'&&action==='measure'&&s.phase==='ready'){n.phase='measured';message='送り手の測定結果は Q=1、A=0 でした。この例の結果の確率は 1/4 です。';}
 else if(s.place==='tower'&&action==='send'&&s.phase==='measured'){n.phase='delivered';message='Q=1、A=0 の２ビットが受け手に届きました。';}
 else if(s.place==='tower'&&s.phase==='delivered'&&(action==='x'||action==='z')){n[action]=!s[action];n.transferReport=null;n.lit=false;message='受け手の修正を切り替えました。';}
 else if(s.place==='tower'&&s.phase==='delivered'&&action==='transfer'){
  const after=teleportCorrect(teleportBranch('plus','10').before,s.x,s.z),same=teleportSame(after,teleportInputs.plus.vector);n.transferReport={after,same};n.lit=same&&!s.x&&s.z;
  message=n.lit?'元の正の重ね合わせが受け手に届きました。祭壇へ進みましょう。':'Q=1 なら Z、A=0 なら X は不要です。伝言と状態を見直しましょう。';
 }
 else return {ok:false,message:'今いる場所と操作を確かめましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreQuantumJourney(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>150)throw new RangeError('途中記録が不正です。');let s=createQuantumJourney();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=quantumJourneyAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
