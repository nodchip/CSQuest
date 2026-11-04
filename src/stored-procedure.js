export const procedureLevel={id:'village-stored-procedure',number:'1293',kind:'stored-procedure',name:'薬草庫の手続き札',tag:'保存された手続き',title:'同じ手続きに依頼を渡そう',story:'村の薬草庫では、決まった手続きを台帳側に置き、届ける数を渡して呼び出します。権限と在庫も確かめましょう。'};
export const procedureRoles={keeper:'呼び出しを許された薬師',guest:'呼び出しを許されていない旅人'};
export const procedureAmounts={small:'２束',large:'７束'};
export const procedureAnswers={sent:'２束を届け、残り３束',short:'在庫不足で届けず、残り５束',denied:'呼び出せず、残り５束'};
export function procedureOutcome(role,amount){
 if(!Object.hasOwn(procedureRoles,role)||!Object.hasOwn(procedureAmounts,amount))throw new RangeError('呼び出しの条件が不正です。');
 return role==='guest'?'denied':amount==='small'?'sent':'short';
}
export function procedureCreate(){return {role:'keeper',amount:'small',trials:Object.fromEntries(Object.keys(procedureRoles).flatMap(r=>Object.keys(procedureAmounts).map(a=>[`${r}:${a}`,{guess:null,checked:false}]))),reflection:null};}
export function procedureCheck(q){const t=q.trials[`${q.role}:${q.amount}`];if(!Object.hasOwn(procedureAnswers,t.guess))throw new RangeError('結果を予想しましょう。');t.checked=t.guess===procedureOutcome(q.role,q.amount);return t.checked;}
export function procedureDone(q){return Object.keys(procedureRoles).every(r=>Object.keys(procedureAmounts).every(a=>{const t=q.trials[`${r}:${a}`];return t.checked&&t.guess===procedureOutcome(r,a);}))&&q.reflection==='shared';}
export function procedureRestore(q){
 if(!q||!Object.hasOwn(procedureRoles,q.role)||!Object.hasOwn(procedureAmounts,q.amount)||!q.trials||![null,'shared','permission'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 const out=procedureCreate();out.role=q.role;out.amount=q.amount;out.reflection=q.reflection;
 for(const r of Object.keys(procedureRoles))for(const a of Object.keys(procedureAmounts)){const k=`${r}:${a}`,t=q.trials[k];if(!t||![null,...Object.keys(procedureAnswers)].includes(t.guess)||typeof t.checked!=='boolean'||t.checked&&t.guess!==procedureOutcome(r,a))throw new RangeError('途中記録が不正です。');out.trials[k]={guess:t.guess,checked:t.checked};}return out;
}
