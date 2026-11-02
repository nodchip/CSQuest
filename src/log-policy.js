export const logPolicyLevel={id:'castle-log-policy',number:'988',kind:'log-policy',name:'門の記録を設計する',tag:'セキュリティ・プライバシー',title:'必要な記録だけで門を守ろう',story:'王城の門で不審な試行が報告されました。記録係と一緒に、調査に必要な項目と保存期間を決めましょう。'};
export const logFields={account:'アカウント',time:'時刻',result:'成功・失敗',message:'私的な伝言'};
// Minutes before the inspection. The last login succeeds and the two accounts must not be combined.
export const logEvents=[{age:5768,account:'青',result:'失敗',message:'夕食の伝言'},{age:5764,account:'青',result:'失敗',message:'家族の伝言'},{age:5760,account:'青',result:'失敗',message:'旅行の伝言'},{age:5762,account:'赤',result:'失敗',message:'友人の伝言'},{age:5759,account:'赤',result:'成功',message:'買物の伝言'}];
export function logPolicyCreate(){return {fields:[],days:1,checked:false,reflection:null};}
export function inspectLogPolicy(s){
 const visible=logEvents.filter(e=>e.age<s.days*1440),missing=['account','time','result'].filter(f=>!s.fields.includes(f));
 if(missing.length)return {visible,missing,detected:null,excess:s.fields.includes('message')||s.days>7};
 const failures=visible.filter(e=>e.result==='失敗');
 const detected=failures.some((event,i)=>failures.filter((other,j)=>j!==i&&other.account===event.account&&other.age<=event.age&&event.age-other.age<=10).length>=2);
 return {visible,missing,detected,excess:s.fields.includes('message')||s.days>7};
}
export function logPolicyComplete(s){const r=inspectLogPolicy(s);return s.checked&&r.detected===true&&!r.excess&&s.reflection==='limits';}
export function logPolicyRestore(saved){if(!saved||!Array.isArray(saved.fields)||saved.fields.some(f=>!Object.hasOwn(logFields,f))||new Set(saved.fields).size!==saved.fields.length||![1,7,30].includes(saved.days)||typeof saved.checked!=='boolean'||![null,'limits','absolute','reuse'].includes(saved.reflection))throw new RangeError('途中記録が不正です');return {fields:[...saved.fields],days:saved.days,checked:saved.checked,reflection:saved.reflection};}
