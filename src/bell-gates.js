export const bellGatesLevel={id:'ruin-bell-gates',number:'677',kind:'bell-gates',name:'二つの水晶を結ぶ門',tag:'量子ゲート・ベル状態',title:'水晶の門を並べて光を結ぼう',story:'遺跡の門には二つの水晶があります。門の札を順番に並べ、精霊が求める三つの光のつながりを作りましょう。'};
export const bellGateNames={ha:'A に H（重ね合わせ）',hb:'B に H（重ね合わせ）',xa:'A に X（反転）',xb:'B に X（反転）',za:'A に Z（位相反転）',zb:'B に Z（位相反転）',ab:'A が 1 なら B を反転（制御 NOT）',ba:'B が 1 なら A を反転（制御 NOT）'};
const k=1/Math.sqrt(2);
export const bellTargets={plus:{name:'同じ光・正のつながり',vector:[k,0,0,k]},minus:{name:'同じ光・負のつながり',vector:[k,0,0,-k]},opposite:{name:'異なる光・正のつながり',vector:[0,k,k,0]}};
export function applyBellGate(v,gate){
 if(!Array.isArray(v)||v.length!==4||!v.every(Number.isFinite)||!Object.hasOwn(bellGateNames,gate))throw new RangeError('門または状態が不正です。');
 if(gate==='ha'||gate==='hb'){
  const bit=gate==='ha'?2:1,out=v.slice();
  for(let i=0;i<4;i++)if(!(i&bit)){out[i]=(v[i]+v[i|bit])*k;out[i|bit]=(v[i]-v[i|bit])*k;}return out;
 }
 if(gate==='xa'||gate==='xb'){const bit=gate==='xa'?2:1;return v.map((_,i)=>v[i^bit]);}
 if(gate==='za'||gate==='zb'){const bit=gate==='za'?2:1;return v.map((x,i)=>(i&bit)?-x:x);}
 return v.map((_,i)=>v[gate==='ab'?(i^((i&2)?1:0)):(i^((i&1)?2:0))]);
}
export function runBellGates(gates){if(!Array.isArray(gates)||gates.length>5)throw new RangeError('門の数が不正です。');const trace=[[1,0,0,0]];for(const gate of gates)trace.push(applyBellGate(trace.at(-1),gate));return trace;}
export function bellTargetMatches(vector,target){if(!Object.hasOwn(bellTargets,target)||!Array.isArray(vector)||vector.length!==4||!vector.every(Number.isFinite))return false;const t=bellTargets[target].vector;return [1,-1].some(sign=>vector.every((x,i)=>Math.abs(x-sign*t[i])<1e-9));}
export function createBellGates(){return {target:'plus',gates:[],trace:null,solved:[],answer:null,checked:false,history:[]};}
export function bellGatesAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=150)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,gates:[...s.gates],solved:[...s.solved],history:[...s.history],checked:false};let message='';
 if(action.startsWith('target:')&&Object.hasOwn(bellTargets,action.slice(7))){n.target=action.slice(7);n.gates=[];n.trace=null;message='目標を選び、門の並びを空にしました。';}
 else if(action.startsWith('add:')&&Object.hasOwn(bellGateNames,action.slice(4))){if(s.gates.length>=5)return {ok:false,message:'門は５枚までです。最後の札を戻すか、並びを空にしましょう。'};n.gates.push(action.slice(4));n.trace=null;message='門を最後に追加しました。';}
 else if(action==='undo'){if(!s.gates.length)return {ok:false,message:'戻す門がありません。'};n.gates.pop();n.trace=null;message='最後の門を戻しました。';}
 else if(action==='clear'){n.gates=[];n.trace=null;message='門の並びを空にしました。';}
 else if(action==='run'){
  n.trace=runBellGates(s.gates);const matched=bellTargetMatches(n.trace.at(-1),s.target);
  if(matched&&!n.solved.includes(s.target))n.solved.push(s.target);
  message=matched?'目標のつながりができました。':'まだ目標と違います。途中の光と最後の符号を見比べましょう。';
 }
 else if(['answer:phase','answer:probability','answer:classical'].includes(action)){n.answer=action.slice(7);message='振り返りの答えを選びました。';}
 else if(action==='check'){n.checked=true;message='達成した目標と答えを確認しました。';}
 else return {ok:false,message:'門の操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreBellGates(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>150)throw new RangeError('途中記録が不正です。');let s=createBellGates();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=bellGatesAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function bellGatesComplete(s){return Object.keys(bellTargets).every(k=>s.solved.includes(k))&&s.answer==='phase'&&s.checked;}
