export const inductionLevel={id:'square-induction',number:'95',kind:'induction',name:'奇数の石と正方形の塔',tag:'数学的帰納法',title:'どの段でも正方形？',story:'遺跡の塔は１段目に１個、次から３個、５個と奇数個の石を足して作られます。どの段でも正方形になる理由を組み立てましょう。'};
export const inductionSteps=[
  {title:'最初の段',prompt:'１段目では石の合計と一辺１の正方形の石の数は？',options:{base:'どちらも１個',two:'合計は１個、正方形は２個',zero:'どちらも０個'},answer:'base',explanation:'１段目は１個で、１×１の正方形です。'},
  {title:'任意の段を仮定',prompt:'次の段を示すため、任意の k 段目について何を仮定しますか？',options:{hypothesis:'k 段目までの石は k × k の正方形になる',future:'示したい k＋１段目が正方形だと最初から仮定する',one:'１段目だけが正方形だと仮定する'},answer:'hypothesis',explanation:'任意の k について、k 段目が正方形だと仮定して次を調べます。'},
  {title:'次に増やす石',prompt:'k × k の正方形の右側に k 個、下側に k＋１個を足すと、増える石は？',options:{twoKOne:'２k＋１個',twoK:'２k 個',kOne:'k＋１個'},answer:'twoKOne',explanation:'右の k 個と下の k＋１個で、次の奇数 ２k＋１個です。'},
  {title:'次の段',prompt:'その石を右と下に足した形は、どんな正方形ですか？',options:{next:'一辺 k＋１ の正方形',same:'一辺 k の正方形のまま',skip:'一辺 k＋２ の正方形'},answer:'next',explanation:'k × k に右と下を足すと、(k＋１) × (k＋１) の正方形になります。'},
  {title:'すべての段へ',prompt:'最初の段と、任意の k から次の段へのつながりを示すと何が言えますか？',options:{induction:'１段目から始めて、すべての正の段で成り立つ',samples:'図に描いた３段目だけで、すべての段が証明できる',none:'最初の段は使わず、つながりだけで十分'},answer:'induction',explanation:'１段目を起点に、任意の段から次へ進む性質を繰り返し使えます。'}
];
export function createInduction(){return {step:0,history:[],message:'最初の段から確かめましょう。'};}
export function inductionStep(state,answer){
  if(state.step>=inductionSteps.length||!Object.hasOwn(inductionSteps[state.step].options,answer))throw new RangeError('選択できません。');
  const item=inductionSteps[state.step];if(answer!==item.answer)return {...state,message:'問いと図を見直し、最初の確認と次へのつながりを区別しましょう。'};
  return {step:state.step+1,history:[...state.history,answer],message:item.explanation};
}
export function restoreInduction(saved){if(!Array.isArray(saved)||saved.length>inductionSteps.length)throw new RangeError('途中記録が不正です。');let state=createInduction();for(const answer of saved){const next=inductionStep(state,answer);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}return state;}
