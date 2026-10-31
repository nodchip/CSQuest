export const sustainabilityLevel={id:'workshop-lifecycle',number:'91',kind:'sustainability',name:'工房の装置を使い続ける',tag:'ライフサイクルと環境負荷',title:'装置の負荷を比べよう',story:'工房は装置を修理して使う案と新しい装置に替える案を検討します。利用期間と集計範囲を変え、架空の環境負荷を比べましょう。'};
export const sustainPlans={repair:{name:'修理して使う',upfront:20,yearly:12},new:{name:'新しい装置',upfront:80,yearly:4}};
export const sustainYears={one:{name:'１年使う',years:1},five:{name:'５年使う',years:5},ten:{name:'10年使う',years:10}};
export const sustainScopes={operation:'使用中だけ',lifecycle:'修理・製造と使用中'};
export const sustainOptions={repair:'修理案が小さい',new:'新調案が小さい',equal:'同じ'};
export function sustainImpact(plan,years,scope){
  if(!Object.hasOwn(sustainPlans,plan)||!Number.isInteger(years)||years<0||years>10||!Object.hasOwn(sustainScopes,scope))throw new RangeError('比較条件が不正です。');
  const item=sustainPlans[plan],upfront=scope==='lifecycle'?item.upfront:0,operation=item.yearly*years;return {upfront,operation,total:upfront+operation};
}
export function sustainAnswer(id,scope){if(!Object.hasOwn(sustainYears,id))throw new RangeError('未知の期間です。');const years=sustainYears[id].years,a=sustainImpact('repair',years,scope).total,b=sustainImpact('new',years,scope).total;return a<b?'repair':a>b?'new':'equal';}
export function createSustainability(){return {selected:'one',scope:'operation',choices:Object.fromEntries(Object.keys(sustainYears).map(id=>[id,Object.fromEntries(Object.keys(sustainScopes).map(scope=>[scope,{answer:'',checked:false}]))]))};}
export function restoreSustainability(saved){
  if(!saved||!Object.hasOwn(sustainYears,saved.selected)||!Object.hasOwn(sustainScopes,saved.scope)||!saved.choices)throw new RangeError('途中記録が不正です。');const result=createSustainability();result.selected=saved.selected;result.scope=saved.scope;
  for(const id of Object.keys(sustainYears))for(const scope of Object.keys(sustainScopes)){const c=saved.choices[id]?.[scope];if(!c||(c.answer!==''&&!Object.hasOwn(sustainOptions,c.answer))||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');result.choices[id][scope]={answer:c.answer,checked:c.checked};}return result;
}
export function sustainabilityComplete(state){return Object.keys(sustainYears).every(id=>Object.keys(sustainScopes).every(scope=>{const c=state.choices[id][scope];return c.checked&&c.answer===sustainAnswer(id,scope);}));}
