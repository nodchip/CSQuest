export const accessDefaultsLevel={id:'castle-access-defaults',number:'1118',kind:'access-defaults',name:'記録庫の新しい番人',tag:'安全側の初期値',title:'許可のない訪問者をどう扱う？',story:'王城の薬師だけが秘密の記録を読めるよう、番人の規則を整えます。登録されていない訪問者も試しましょう。'};
export const defaultPolicies={deny:'許可の記録がなければ拒否',allow:'拒否の記録がなければ許可'};
export const defaultVisitors={healer:'許可を持つ薬師',thief:'拒否の記録がある侵入者',unknown:'記録のない旅人'};
export function defaultDecision(policy,visitor){
 if(!Object.hasOwn(defaultPolicies,policy)||!Object.hasOwn(defaultVisitors,visitor))throw new RangeError('指定が不正です。');
 return visitor==='healer'||(visitor==='unknown'&&policy==='allow');
}
const keys=Object.keys(defaultPolicies).flatMap(p=>Object.keys(defaultVisitors).map(v=>`${p}:${v}`));
export function defaultCreate(){return {policy:'deny',visitor:'healer',answer:null,seen:[],last:null,reflection:null,checked:false};}
export function defaultCheck(q){if(!['allow','deny'].includes(q.answer))throw new RangeError('予測を選んでください。');const key=`${q.policy}:${q.visitor}`,correct=(q.answer==='allow')===defaultDecision(q.policy,q.visitor);q.last={key,answer:q.answer,correct};if(correct&&!q.seen.includes(key))q.seen.push(key);}
export function defaultDone(q){return keys.every(k=>q.seen.includes(k))&&q.reflection==='deny'&&q.checked;}
export function defaultRestore(q){
 if(!q||!Object.hasOwn(defaultPolicies,q.policy)||!Object.hasOwn(defaultVisitors,q.visitor)||![null,'allow','deny'].includes(q.answer)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'deny','allow','either'].includes(q.reflection)||typeof q.checked!=='boolean')throw new RangeError('記録が不正です。');
 if(q.last!==null){const l=q.last;if(!l||!keys.includes(l.key)||!['allow','deny'].includes(l.answer)||typeof l.correct!=='boolean')throw new RangeError('記録が不正です。');const [p,v]=l.key.split(':');if(l.correct!==((l.answer==='allow')===defaultDecision(p,v)))throw new RangeError('記録が不正です。');}
 return {...q,seen:[...q.seen],last:q.last&&{...q.last}};
}
