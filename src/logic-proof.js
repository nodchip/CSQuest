export const proofLevel={id:'lantern-proof',number:'72',kind:'proof',name:'灯りの約束と反例',tag:'推論規則と反例',title:'遺跡の扉を論じよう',story:'遺跡には灯りについての二つの約束が刻まれています。約束と観察から扉を開き、逆向きの推測も確かめましょう。'};
export const proofFacts={sun:'太陽の灯りがついている',sunRune:'太陽がついていれば、紋章もついている',runeDoor:'紋章がついていれば、扉が開いている',rune:'紋章の灯りがついている',door:'扉が開いている'};
const initialFacts=['sun','sunRune','runeDoor'];
const rules=[{premises:['sun','sunRune'],result:'rune'},{premises:['rune','runeDoor'],result:'door'}];
export function createProof(){return {facts:initialFacts.slice(),selected:[],history:[],message:'二つの事実を選んで、導ける結論を確かめましょう。'};}
export function toggleProof(state,id){
  if(!state.facts.includes(id))throw new RangeError('選べない事実です。');
  if(state.selected.includes(id))return {...state,selected:state.selected.filter(x=>x!==id),message:'事実を選び直せます。'};
  if(state.selected.length===2)return {...state,message:'先に選んだ事実を外してから選びましょう。'};
  return {...state,selected:[...state.selected,id],message:'二つの事実を選んで結論を確かめましょう。'};
}
export function applyProof(state){
  if(state.selected.length!==2)return {...state,message:'事実を二つ選びましょう。'};
  const rule=rules.find(item=>item.premises.every(id=>state.selected.includes(id)));
  if(!rule)return {...state,message:'この依頼で使う規則では導けません。「もし〜なら」と、その前提を組み合わせましょう。'};
  if(state.facts.includes(rule.result))return {...state,message:'その結論はすでに分かっています。'};
  return {...state,facts:[...state.facts,rule.result],selected:[],history:[...state.history,state.selected.slice()],message:`導けたこと：${proofFacts[rule.result]}。`};
}
export function counterResult(values){
  if(!values||['sun','rune','door'].some(key=>typeof values[key]!=='boolean'))throw new RangeError('灯りの状態が不正です。');
  return {sunRune:!values.sun||values.rune,runeDoor:!values.rune||values.door,door:values.door,runeFalse:!values.rune};
}
export function createProofSet(){return {selected:'proof',proof:createProof(),counter:{sun:false,rune:false,door:false,checked:false}};}
export function restoreProof(saved){
  if(!saved||!['proof','counter'].includes(saved.selected)||!Array.isArray(saved.history)||saved.history.length>2||!Array.isArray(saved.selectedFacts)||saved.selectedFacts.length>2||new Set(saved.selectedFacts).size!==saved.selectedFacts.length||!saved.counter||typeof saved.counter.checked!=='boolean')throw new RangeError('途中記録が不正です。');
  const result=createProofSet();result.selected=saved.selected;let proof=createProof();for(const pair of saved.history){if(!Array.isArray(pair)||pair.length!==2||pair[0]===pair[1])throw new RangeError('途中記録が不正です。');for(const id of pair)proof=toggleProof(proof,id);const next=applyProof(proof);if(next.history.length!==proof.history.length+1)throw new RangeError('途中記録が不正です。');proof=next;}
  for(const id of saved.selectedFacts)proof=toggleProof(proof,id);result.proof=proof;counterResult(saved.counter);result.counter={sun:saved.counter.sun,rune:saved.counter.rune,door:saved.counter.door,checked:saved.counter.checked};return result;
}
export function proofComplete(value){return value.proof.facts.includes('door')&&value.counter.checked&&Object.values(counterResult(value.counter)).every(Boolean);}
