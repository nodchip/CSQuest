export const syntaxLevel={id:'spell-syntax',number:'75',kind:'syntax',name:'呪文の枝をつなぐ',tag:'式の構文木と優先順位',title:'呪文を正しく組み立てよう',story:'精霊の工房に、枝の形で読む呪文が届きました。記号を選んで隣の部分を結び、呪文の構造を確かめましょう。'};
export const syntaxCases={
  priority:{name:'掛け算の優先',expression:'2 + 3 × 4',numbers:[2,3,4],operators:['+','×'],first:1,rule:'× は + より先に結びます。'},
  parentheses:{name:'括弧の優先',expression:'(2 + 3) × 4',numbers:[2,3,4],operators:['+','×'],first:0,rule:'括弧の中を先に結びます。'},
  associativity:{name:'左から結ぶ',expression:'8 − 3 − 2',numbers:[8,3,2],operators:['−','−'],first:0,rule:'同じ優先順位の − は左から結びます。'}
};
export function createSyntax(id){
  if(!Object.hasOwn(syntaxCases,id))throw new RangeError('未知の呪文です。');
  return {id,parts:syntaxCases[id].numbers.map(value=>({value})),remaining:[0,1],history:[]};
}
export function syntaxStep(state,operator){
  const index=state.remaining.indexOf(operator);
  if(index<0||!Number.isInteger(operator))throw new RangeError('選べない記号です。');
  const left=state.parts[index],right=state.parts[index+1],op=syntaxCases[state.id].operators[operator];
  const value=op==='+'?left.value+right.value:op==='×'?left.value*right.value:left.value-right.value;
  const parts=state.parts.slice();parts.splice(index,2,{op,left,right,value});
  return {...state,parts,remaining:state.remaining.filter(x=>x!==operator),history:[...state.history,operator]};
}
export function syntaxCorrect(state){return state.history.length===2&&state.history[0]===syntaxCases[state.id].first;}
export function createSyntaxSet(){return {selected:'priority',states:Object.fromEntries(Object.keys(syntaxCases).map(id=>[id,createSyntax(id)]))};}
export function restoreSyntax(saved){
  if(!saved||!Object.hasOwn(syntaxCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');
  const result=createSyntaxSet();result.selected=saved.selected;
  for(const id of Object.keys(syntaxCases)){const steps=saved.history[id];if(!Array.isArray(steps)||steps.length>2)throw new RangeError('途中記録が不正です。');for(const op of steps)result.states[id]=syntaxStep(result.states[id],op);}
  return result;
}
export function syntaxComplete(value){return Object.values(value.states).every(syntaxCorrect);}
