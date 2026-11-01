export const baseRateLevel={id:'beacon-base-rate',number:'683',kind:'base-rate',name:'警報と故障の見込み',tag:'ベイズ則・事前確率・条件付き確率',title:'警報の意味を村ごとに比べよう',story:'二つの村は同じ警報水晶を使いますが、故障の起こりやすさが異なります。記録から警報後の見込みを調べ、点検隊に伝えましょう。'};
export const baseRateVillages={rare:{name:'めったに故障しない村',faults:10},common:{name:'故障の多い村',faults:500}};
export const baseRateNumerators={tp:'故障して警報あり',fp:'正常で警報あり',fn:'故障して警報なし',tn:'正常で警報なし'};
export const baseRateDenominators={alarm:'警報あり全体',silent:'警報なし全体',fault:'故障全体',healthy:'正常全体'};
export function baseRateTable(village){
 if(!Object.hasOwn(baseRateVillages,village))throw new RangeError('村が不正です。');
 const faulty=baseRateVillages[village].faults,healthy=1000-faulty,tp=faulty*9/10,fn=faulty-tp,fp=healthy/10,tn=healthy-fp;
 return {tp,fn,fp,tn,alarm:tp+fp,silent:fn+tn,fault:faulty,healthy,total:1000};
}
export function createBaseRate(){return {village:'rare',signal:'alarm',numerator:null,denominator:null,report:null,solved:[],answer:null,checked:false,history:[]};}
export function baseRateAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=150)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,solved:[...s.solved],history:[...s.history],checked:false};let message='';
 if(action.startsWith('village:')&&Object.hasOwn(baseRateVillages,action.slice(8))){n.village=action.slice(8);n.numerator=null;n.denominator=null;n.report=null;message='村を選びました。';}
 else if(action==='signal:alarm'||action==='signal:silent'){n.signal=action.slice(7);n.numerator=null;n.denominator=null;n.report=null;message='観測する警報を選びました。';}
 else if(action.startsWith('num:')&&Object.hasOwn(baseRateNumerators,action.slice(4))){n.numerator=action.slice(4);n.report=null;message='分子に数える集団を選びました。';}
 else if(action.startsWith('den:')&&Object.hasOwn(baseRateDenominators,action.slice(4))){n.denominator=action.slice(4);n.report=null;message='分母に数える集団を選びました。';}
 else if(action==='calculate'){
  if(!s.numerator||!s.denominator)return {ok:false,message:'分子と分母に数える集団を選びましょう。'};
  const table=baseRateTable(s.village),expectedNumerator=s.signal==='alarm'?'tp':'fn',expectedDenominator=s.signal;
  const correct=s.numerator===expectedNumerator&&s.denominator===expectedDenominator;
  n.report={correct,numerator:table[s.numerator],denominator:table[s.denominator],expectedNumerator,expectedDenominator};
  if(correct){const key=`${s.village}:${s.signal}`;if(!n.solved.includes(key))n.solved.push(key);}
  message=correct?'観測した集団のうち故障している割合を選べました。':'まず観測に合う全体を選び、その中の故障を数えましょう。';
 }
 else if(['answer:prior','answer:same','answer:certain'].includes(action)){n.answer=action.slice(7);message='振り返りの答えを選びました。';}
 else if(action==='check'){n.checked=true;message='４場面と答えを確認しました。';}
 else return {ok:false,message:'操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreBaseRate(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>150)throw new RangeError('途中記録が不正です。');let s=createBaseRate();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=baseRateAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function baseRateComplete(s){return ['rare:alarm','rare:silent','common:alarm','common:silent'].every(k=>s.solved.includes(k))&&s.answer==='prior'&&s.checked;}
