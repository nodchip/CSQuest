export const bracketsLevel={id:'nested-gate',number:'80',kind:'brackets',name:'入れ子の門と記憶の石',tag:'プッシュダウンオートマトン',title:'印の入れ子を確かめよう',story:'遺跡の門には開く印と閉じる印が並んでいます。記憶の石を積み重ね、入れ子が正しく閉じるか確かめましょう。'};
export const bracketCases={balanced:{name:'閉じる入れ子',word:'(()())'},early:{name:'余分な閉じ印',word:'())('},unfinished:{name:'残された開き印',word:'(()'}};
export const bracketActions={push:'石を積み、次の印へ',pop:'石を一つ戻し、次の印へ',accept:'門を開く',reject:'門を開かない'};
export function createBracket(word){if(typeof word!=='string'||word.length>12||!/^[()]*$/.test(word))throw new RangeError('印の列が不正です。');return {word,pos:0,stack:0,status:'playing',history:[],message:'次の印と石の数を確かめましょう。'};}
export function bracketStep(state,action){
  if(state.status!=='playing'||!Object.hasOwn(bracketActions,action))throw new RangeError('操作できません。');
  const symbol=state.word[state.pos],expected=symbol==='('? 'push':symbol===')'?(state.stack?'pop':'reject'):(state.stack?'reject':'accept');
  if(action!==expected)return {...state,message:symbol==='('? '開く印には石を一つ積みます。':symbol===')'?(state.stack?'閉じる印には石を一つ戻します。':'対応する開く印がないので、門は開きません。'):(state.stack?'最後まで読んでも石が残っているので、門は開きません。':'最後まで読んで石がなければ、門は開きます。')};
  const next={...state,history:[...state.history,action]};
  if(action==='push'){next.pos++;next.stack++;next.message='開く印の石を積みました。';}
  if(action==='pop'){next.pos++;next.stack--;next.message='閉じる印と対応する石を一つ戻しました。';}
  if(action==='accept'||action==='reject'){next.status=action==='accept'?'accepted':'rejected';next.message=action==='accept'?'すべての印が対応し、門が開きました。':'対応しない印があるため、門は開きません。';}
  return next;
}
export function createBracketSet(){return {selected:'balanced',states:Object.fromEntries(Object.entries(bracketCases).map(([id,c])=>[id,createBracket(c.word)]))};}
export function restoreBrackets(saved){
  if(!saved||!Object.hasOwn(bracketCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');
  const result=createBracketSet();result.selected=saved.selected;
  for(const id of Object.keys(bracketCases)){const history=saved.history[id];if(!Array.isArray(history)||history.length>bracketCases[id].word.length+1)throw new RangeError('途中記録が不正です。');for(const action of history){const current=result.states[id],next=bracketStep(current,action);if(next.history.length!==current.history.length+1)throw new RangeError('途中記録が不正です。');result.states[id]=next;}}
  return result;
}
export function bracketsComplete(set){return Object.values(set.states).every(state=>state.status!=='playing');}
