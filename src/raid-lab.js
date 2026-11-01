// One parity stripe, not a full RAID implementation. A and B are data bits.
export const raidValues={a:1,b:0,p:1};
export const raidCases={a:{name:'記録Ａの装置が故障',missing:['a']},b:{name:'記録Ｂの装置が故障',missing:['b']},p:{name:'確認札の装置が故障',missing:['p']},ab:{name:'記録ＡとＢの装置が同時に故障',missing:['a','b']}};
export const raidNames={a:'記録Ａ',b:'記録Ｂ',p:'確認札'};
export function raidValid(bits){return (bits.a^bits.b)===bits.p;}
export function createRaidLab(){return {selected:'a',guesses:{a:0,b:0,p:0},seen:[],answer:'',checked:false,history:[]};}
export function raidAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'記録がいっぱいです。最初からやり直してください。'};
 const n={...s,guesses:{...s.guesses},seen:[...s.seen],history:[...s.history],checked:false};let message='';
 if(action.startsWith('case:')&&Object.hasOwn(raidCases,action.slice(5))){n.selected=action.slice(5);message='故障する装置を選びました。';}
 else if(action.startsWith('toggle:')&&raidCases[s.selected].missing.includes(action.slice(7))){const key=action.slice(7);n.guesses[key]^=1;message='失われた札の候補を変えました。';}
 else if(action==='test'){
  const c=raidCases[s.selected],bits={...raidValues};for(const key of c.missing)bits[key]=s.guesses[key];
  if(raidValid(bits)){const key=s.selected==='ab'?`ab:${bits.a}${bits.b}`:s.selected;if(!n.seen.includes(key))n.seen.push(key);message='確認札の条件に合います。';}
  else message='確認札の条件に合いません。残った札と候補を見直しましょう。';
 }
 else if(['answer:ambiguous','answer:unique'].includes(action)){n.answer=action.slice(7);message='２台故障の場合の判断を選びました。';}
 else if(action==='check'){n.checked=true;message='調査結果を確かめました。';}
 else return {ok:false,message:'操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function raidComplete(s){return ['a','b','p','ab:01','ab:10'].every(k=>s.seen.includes(k))&&s.answer==='ambiguous'&&s.checked;}
export function restoreRaidLab(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createRaidLab();for(const action of saved.history){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=raidAct(s,action);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
