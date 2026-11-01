export const logicTranslationLevel={id:'forest-logic-translation',number:'682',kind:'logic-translation',name:'言葉を刻む四つの門',tag:'自然言語・量化・論理表現',title:'村の約束を論理の札にしよう',story:'森の四つの門には、それぞれ異なる約束があります。言葉に合う論理の札を選び、村人の状態を変えて反例を探しましょう。'};
export const logicStatements={
 all:{text:'すべての薬師は灯りを持っている。',a:'薬師',b:'灯りを持つ',answer:'allAB'},
 some:{text:'灯りを持つ薬師が少なくとも一人いる。',a:'薬師',b:'灯りを持つ',answer:'someBoth'},
 none:{text:'灯りを持つ薬師は一人もいない。',a:'薬師',b:'灯りを持つ',answer:'noBoth'},
 only:{text:'許可を持つ者だけが門を通る。',a:'門を通る',b:'許可を持つ',answer:'allAB'}
};
export const logicCards={allAB:'全員について、A ならば B',allBA:'全員について、B ならば A',everyBoth:'全員が A かつ B',someBoth:'A かつ B の人が少なくとも一人',noBoth:'A かつ B の人は一人もいない',someAwithoutB:'A だが B でない人が少なくとも一人'};
export function logicCardValue(card,people){
 if(!Object.hasOwn(logicCards,card)||!Array.isArray(people)||people.length!==2||!people.every(p=>Number.isInteger(p)&&p>=0&&p<=3))throw new RangeError('札か村の状態が不正です。');
 const both=p=>(p&2)!==0&&(p&1)!==0;
 if(card==='allAB')return people.every(p=>!(p&2)||!!(p&1));
 if(card==='allBA')return people.every(p=>!(p&1)||!!(p&2));
 if(card==='everyBoth')return people.every(both);
 if(card==='someBoth')return people.some(both);
 if(card==='noBoth')return !people.some(both);
 return people.some(p=>!!(p&2)&&!(p&1));
}
export function logicCounterexample(target,card){
 if(!Object.hasOwn(logicStatements,target)||!Object.hasOwn(logicCards,card))throw new RangeError('約束か札が不正です。');
 for(let a=0;a<4;a++)for(let b=0;b<4;b++){const people=[a,b],expected=logicCardValue(logicStatements[target].answer,people),actual=logicCardValue(card,people);if(expected!==actual)return {people,expected,actual};}
 return null;
}
export function createLogicTranslation(){return {target:'all',card:null,people:[0,0],observed:false,report:null,solved:[],history:[]};}
export function logicTranslationAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=150)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,people:[...s.people],solved:[...s.solved],history:[...s.history]};let message='';
 if(action.startsWith('target:')&&Object.hasOwn(logicStatements,action.slice(7))){n.target=action.slice(7);n.card=null;n.observed=false;n.report=null;message='門の約束を選びました。';}
 else if(action.startsWith('card:')&&Object.hasOwn(logicCards,action.slice(5))){n.card=action.slice(5);n.observed=false;n.report=null;message='論理の札を選びました。';}
 else if(/^toggle:[01]:[AB]$/.test(action)){const [,i,bit]=action.split(':');n.people[Number(i)]^=bit==='A'?2:1;n.observed=false;n.report=null;message='村人の状態を変えました。';}
 else if(action==='observe'){
  if(!s.card)return {ok:false,message:'先に論理の札を選びましょう。'};
  n.observed=true;n.report={type:'observation',people:[...s.people],expected:logicCardValue(logicStatements[s.target].answer,s.people),actual:logicCardValue(s.card,s.people)};message='この村の状態で両方の真偽を調べました。';
 }
 else if(action==='check'){
  if(!s.card||!s.observed)return {ok:false,message:'札を選び、村の状態を一度調べましょう。'};
  const witness=logicCounterexample(s.target,s.card);
  if(witness){n.report={type:'counterexample',...witness};message='この村では文章と札の真偽が違います。反例を見直しましょう。';}
  else {n.report={type:'match'};if(!n.solved.includes(s.target))n.solved.push(s.target);message='この約束に合う札です。';}
 }
 else return {ok:false,message:'門の操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreLogicTranslation(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>150)throw new RangeError('途中記録が不正です。');let s=createLogicTranslation();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=logicTranslationAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function logicTranslationComplete(s){return Object.keys(logicStatements).every(k=>s.solved.includes(k));}
