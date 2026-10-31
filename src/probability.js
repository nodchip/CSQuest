export const probabilityLevel={id:'lantern-signals',number:'20',kind:'probability',name:'灯りの鑑定と確率',tag:'条件付き確率',title:'光った品は本物？',story:'鑑定士の灯りは、本物でも見逃すことがあり、普通の品にも反応します。灯りの記録から、本物の割合を見極めましょう。'};
export const scenarios=[
  {id:'village',name:'村の蔵',genuine:10,ordinary:90,trueSignal:8,falseSignal:9},
  {id:'castle',name:'城の蔵',genuine:50,ordinary:50,trueSignal:40,falseSignal:5},
];
export const questions=[
  {kind:'detection',label:'本物だとわかっている品のうち、灯りが反応する割合は？'},
  {kind:'posterior',label:'灯りが反応した品のうち、本物である割合は？'},
];
export function counts(s){
  if(!s || ![s.genuine,s.ordinary,s.trueSignal,s.falseSignal].every(n=>Number.isInteger(n)&&n>=0)||s.trueSignal>s.genuine||s.falseSignal>s.ordinary||s.genuine===0||s.trueSignal+s.falseSignal===0) throw new RangeError('記録の数が不正です。');
  return {genuine:s.genuine,ordinary:s.ordinary,trueSignal:s.trueSignal,falseSignal:s.falseSignal,trueSilent:s.genuine-s.trueSignal,falseSilent:s.ordinary-s.falseSignal,total:s.genuine+s.ordinary,signal:s.trueSignal+s.falseSignal};
}
export function options(s,kind){
  const c=counts(s);
  if(kind!=='detection'&&kind!=='posterior') throw new RangeError('未知の問いです。');
  return [
    {id:'genuine',numerator:c.trueSignal,denominator:c.genuine,label:`${c.trueSignal} / ${c.genuine}`},
    {id:'signal',numerator:c.trueSignal,denominator:c.signal,label:`${c.trueSignal} / ${c.signal}`},
    {id:'all',numerator:c.signal,denominator:c.total,label:`${c.signal} / ${c.total}`},
  ];
}
export function answer(s,kind,id){
  if(!options(s,kind).some(choice=>choice.id===id)) throw new RangeError('未知の選択肢です。');
  return id===(kind==='detection'?'genuine':'signal');
}
export function createProbability(){return {step:0,feedback:''};}
export function chooseProbability(state,id){
  if(!Number.isInteger(state.step)||state.step<0||state.step>=scenarios.length*questions.length) throw new RangeError('依頼は完了しています。');
  const scenario=scenarios[Math.floor(state.step/questions.length)], question=questions[state.step%questions.length];
  if(!answer(scenario,question.kind,id)) return {...state,feedback:question.kind==='detection'?'「本物だとわかっている品」全体を分母にします。反応した本物を数えましょう。':'「灯りが反応した品」全体が分母です。本物にも普通の品にも反応することを忘れずに。'};
  return {step:state.step+1,feedback:question.kind==='detection'?'本物の品の中で、反応した数を数えました。':'反応した品の中で、本物だった数を数えました。'};
}
export function restoreProbability(actions){
  if(!Array.isArray(actions)||actions.length>scenarios.length*questions.length) throw new RangeError('途中記録が不正です。');
  return actions.reduce((state,id)=>{if(typeof id!=='string') throw new RangeError('途中記録が不正です。');const next=chooseProbability(state,id);if(next.step===state.step)throw new RangeError('途中記録が不正です。');return next;},createProbability());
}
