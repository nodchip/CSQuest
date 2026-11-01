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
export const identityCases={named:{name:'名前つきの控え',text:'薬師の机に、名前と受取回数を並べた控えがあります。',answer:'named'},pseudonym:{name:'番号の記録と対応表',text:'調査係は名前の代わりに番号を使って受取回数を数えます。工房には番号と名前の対応表が別にあります。',answer:'pseudonym'},aggregate:{name:'合計だけの報告',text:'工房は全員の合計回数だけを数え、報告には個人の記録や番号を含めません。この場面では追加情報から誰かの値を推測できないと仮定します。',answer:'aggregate'}};
export const identityChoices={named:'名前で本人が分かる',pseudonym:'番号で記録をつなげられ、対応表から本人が分かる',aggregate:'この仮定では個人に結び付かない合計だけ'};
export function identityComplete(state){return Object.entries(identityCases).every(([id,c])=>state.identity.answers[id]===c.answer&&state.identity.checked[id]);}
const required=['token','herb','slot'];
const expected={preparer:['token','herb'],clerk:['token','slot'],public:[]};
export function createPrivacy(){return {selected:Object.fromEntries(Object.keys(fields).map(id=>[id,true])),grants:Object.fromEntries(Object.keys(audiences).map(role=>[role,Object.fromEntries(Object.keys(fields).map(id=>[id,true]))])),checked:false,identity:{answers:Object.fromEntries(Object.keys(identityCases).map(id=>[id,null])),checked:Object.fromEntries(Object.keys(identityCases).map(id=>[id,false]))}};}
export function toggleField(state,id){
  if(!Object.hasOwn(fields,id))throw new RangeError('未知の項目です。');
  const selected={...state.selected,[id]:!state.selected[id]},grants=Object.fromEntries(Object.entries(state.grants).map(([role,items])=>[role,{...items,[id]:false}]));
  return {...state,selected,grants,checked:false};
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
  if(saved.identity!==undefined){
    if(!saved.identity||!saved.identity.answers||!saved.identity.checked)throw new RangeError('途中記録が不正です。');
    for(const id of Object.keys(identityCases)){
      const answer=saved.identity.answers[id],checked=saved.identity.checked[id];
      if(!(answer===null||Object.hasOwn(identityChoices,answer))||typeof checked!=='boolean')throw new RangeError('途中記録が不正です。');
      state.identity.answers[id]=answer;state.identity.checked[id]=checked;
    }
  }
  return state;
}
