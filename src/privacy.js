export const privacyLevel={id:'private-ledger',number:'27',kind:'privacy',name:'秘密を守る受取台帳',tag:'情報の収集と公開',title:'薬草の受け取りを支えよう',story:'薬師の工房が、薬草の包みを受け取るための台帳を作ります。仕事に必要な情報と、それを見られる相手を考えましょう。'};
export const fields={
  token:{name:'受取番号',detail:'受取人が選ぶ重複しない番号。準備した包みと受取時の照合に使います。'},
  herb:{name:'薬草の種類',detail:'薬師が包みを作るために使います。'},
  slot:{name:'受取時間',detail:'受付が受取時間を確かめるために使います。'},
  name:{name:'本名',detail:'この手順では番号で照合するため使いません。'},
  address:{name:'自宅の場所',detail:'受取場所は工房で固定されており、配達には使いません。'},
};
export const audiences={
  preparer:{name:'薬師',description:'受取番号で包みを識別し、薬草を準備する。'},
  clerk:{name:'受付',description:'受取番号と時間を照合し、封をした包みを渡す。中身の種類は見ない。'},
  public:{name:'誰でも見られる掲示板',description:'受取人を特定できる情報や個別の注文は載せない。'},
};
const required=['token','herb','slot'];
const expected={preparer:['token','herb'],clerk:['token','slot'],public:[]};
export function createPrivacy(){return {selected:Object.fromEntries(Object.keys(fields).map(id=>[id,true])),grants:Object.fromEntries(Object.keys(audiences).map(role=>[role,Object.fromEntries(Object.keys(fields).map(id=>[id,true]))])),checked:false};}
export function toggleField(state,id){
  if(!Object.hasOwn(fields,id))throw new RangeError('未知の項目です。');
  const selected={...state.selected,[id]:!state.selected[id]},grants=Object.fromEntries(Object.entries(state.grants).map(([role,items])=>[role,{...items,[id]:false}]));
  return {selected,grants,checked:false};
}
export function toggleGrant(state,role,id){
  if(!Object.hasOwn(audiences,role)||!Object.hasOwn(fields,id)||!state.selected[id])throw new RangeError('選べない公開範囲です。');
  return {...state,grants:{...state.grants,[role]:{...state.grants[role],[id]:!state.grants[role][id]}},checked:false};
}
export function assessPrivacy(state){
  const issues=[];
  for(const id of required)if(!state.selected[id])issues.push(`${fields[id].name} がないと、この手順の仕事が進められません。`);
  for(const id of Object.keys(fields))if(state.selected[id]&&!required.includes(id))issues.push(`${fields[id].name} は、この手順には使いません。`);
  for(const [role,needed] of Object.entries(expected))for(const id of required){
    if(!state.selected[id])continue;
    if(needed.includes(id)&&!state.grants[role][id])issues.push(`${audiences[role].name} は仕事のために ${fields[id].name} が必要です。`);
    if(!needed.includes(id)&&state.grants[role][id])issues.push(`${audiences[role].name} に ${fields[id].name} を見せる必要は、この手順ではありません。`);
  }
  return issues;
}
export function restorePrivacy(saved){
  if(!saved||!saved.selected||!saved.grants||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
  const state=createPrivacy();state.checked=saved.checked;
  for(const id of Object.keys(fields)){
    if(typeof saved.selected[id]!=='boolean')throw new RangeError('途中記録が不正です。');state.selected[id]=saved.selected[id];
    for(const role of Object.keys(audiences)){
      if(!saved.grants[role]||typeof saved.grants[role][id]!=='boolean'||(!saved.selected[id]&&saved.grants[role][id]))throw new RangeError('途中記録が不正です。');
      state.grants[role][id]=saved.grants[role][id];
    }
  }
  return state;
}
