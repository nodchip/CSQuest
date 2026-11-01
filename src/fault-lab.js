export const faultCases={software:'門の条件の書き間違い',hardware:'記憶の上限が壊れる',exception:'０による割り算'};
export const faultModes={raw:'そのまま動かす',guard:'検出して代替処理'};
export function faultResult(id,input,mode){
 if(!Object.hasOwn(faultCases,id)||![0,1,2,3].includes(input)||!Object.hasOwn(faultModes,mode))throw new RangeError('条件が不正です。');
 if(id==='exception'){
  const exceptional=input===0,expected=exceptional?0:10/input,actual=exceptional?(mode==='guard'?0:null):expected;
  return {expected,internal:exceptional?'例外発生':'正常',detected:exceptional,handled:exceptional&&mode==='guard',actual,failure:actual!==expected};
 }
 const expected=input>=1&&input<=5,internal=id==='software'?input>1&&input<=5:input>=1&&input<=2,error=internal!==expected,handled=error&&mode==='guard',actual=handled?expected:internal;
 return {expected,internal,detected:handled,handled,actual,failure:actual!==expected};
}
export function createFaultLab(){return {kind:'software',input:2,mode:'raw',seen:[],report:null,answer:null,checked:false,history:[]};}
export function faultLabAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=150)return {ok:false,message:'記録がいっぱいです。やり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';
 if(action.startsWith('case:')&&Object.hasOwn(faultCases,action.slice(5))){n.kind=action.slice(5);n.report=null;message='調べる仕組みを選びました。';}
 else if(/^input:[0-3]$/.test(action)){n.input=Number(action.slice(6));n.report=null;message='入力を選びました。';}
 else if(action.startsWith('mode:')&&Object.hasOwn(faultModes,action.slice(5))){n.mode=action.slice(5);n.report=null;message='処理方法を選びました。';}
 else if(action==='run'){const key=`${s.kind}:${s.input}:${s.mode}`;if(!n.seen.includes(key))n.seen.push(key);n.report={kind:s.kind,input:s.input,mode:s.mode,...faultResult(s.kind,s.input,s.mode)};message='約束・内部状態・結果を記録しました。';}
 else if(['answer:separate','answer:always','answer:exception'].includes(action)){n.answer=action.slice(7);message='説明を選びました。';}
 else if(action==='check'){n.checked=true;message='試験と説明を確認しました。';}
 else return {ok:false,message:'操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function faultLabComplete(s){return ['software:2:raw','software:1:raw','software:1:guard','hardware:3:raw','hardware:3:guard','exception:0:raw','exception:0:guard'].every(k=>s.seen.includes(k))&&s.answer==='separate'&&s.checked;}
export function restoreFaultLab(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>150)throw new RangeError('途中記録が不正です。');let s=createFaultLab();for(const action of saved.history){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=faultLabAct(s,action);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
