export const euclidLevel={id:'rope-gcd',number:'96',kind:'euclid',name:'遺跡の二本の綱',tag:'最大公約数と互除法',title:'綱を同じ長さに切るには？',story:'遺跡の門を開くには、二本の綱を余りなく切れる最も長い長さが必要です。余りを使って探しましょう。'};
export const euclidCases=[[48,18],[35,12]];
export const euclidOptions=[0,1,2,5,6,11,12,15,18,35,48];
export function createEuclid(){return {trial:0,a:48,b:18,history:[],message:'最初の二本の綱から始めましょう。'};}
export function euclidStep(state,answer){
  if(state.trial>=euclidCases.length||!euclidOptions.includes(answer))throw new RangeError('選択できません。');
  const expected=state.b===0?state.a:state.a%state.b;
  if(answer!==expected)return {...state,message:state.b===0?'余りが０になった直前の割る数が答えです。':'短い綱をできるだけ多く取り、残る長さを考えましょう。'};
  const history=[...state.history,answer];
  if(state.b===0){const trial=state.trial+1;if(trial===euclidCases.length)return {...state,trial,history,message:'二つの門が開きました。'};const [a,b]=euclidCases[trial];return {trial,a,b,history,message:`最大公約数は ${answer}。次の二本を調べましょう。`};}
  return {...state,a:state.b,b:answer,history,message:`余りは ${answer}。短い綱と余りを次の組にします。`};
}
export function restoreEuclid(history){if(!Array.isArray(history)||history.length>20)throw new RangeError('途中記録が不正です。');let state=createEuclid();for(const answer of history){const next=euclidStep(state,answer);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}return state;}
