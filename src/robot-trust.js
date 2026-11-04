export const robotTrustLevel={id:'village-robot-trust',number:'1277',kind:'robot-trust',name:'人形の見立てを確かめる',tag:'人とロボットの信頼',title:'いつ確かめる？',story:'村の人形が荷札を読み、届け先を提案します。提案に任せるか、確認してから届けるかを決めましょう。'};
export const trustCases=[
 {condition:'dry',suggested:'赤',actual:'赤'}, {condition:'dry',suggested:'青',actual:'青'},
 {condition:'dry',suggested:'赤',actual:'赤'}, {condition:'dry',suggested:'青',actual:'青'},
 {condition:'wet',suggested:'赤',actual:'赤'}, {condition:'wet',suggested:'青',actual:'赤'}, {condition:'wet',suggested:'赤',actual:'青'}
];
export const trustPolicies={follow:'すべて任せる',verify:'すべて確認する',wet:'濡れた荷札だけ確認する'};
export function trustExpected(policy,scene){if(policy==='follow')return 'follow';if(policy==='verify')return 'verify';if(policy==='wet')return scene.condition==='wet'?'verify':'follow';throw new RangeError('方法が不正です。');}
export function trustReplay(history){if(!Array.isArray(history)||history.length>trustCases.length||history.some(a=>!['follow','verify'].includes(a)))throw new RangeError('試行が不正です。');let checks=0,errors=0;const rows=history.map((action,i)=>{const scene=trustCases[i];checks+=Number(action==='verify');const delivered=action==='verify'?scene.actual:scene.suggested;const error=delivered!==scene.actual;errors+=Number(error);return {action,delivered,error};});return {checks,errors,rows};}
export function trustCreate(){return {policy:'follow',runs:Object.fromEntries(Object.keys(trustPolicies).map(k=>[k,[]])),recorded:[],reflection:null};}
export function trustAct(q,action){if(!['follow','verify'].includes(action)||q.runs[q.policy].length>=trustCases.length)return false;q.runs[q.policy].push(action);return true;}
export function trustRecord(q){const run=q.runs[q.policy];if(run.length!==trustCases.length||run.some((a,i)=>a!==trustExpected(q.policy,trustCases[i])))return false;if(!q.recorded.includes(q.policy))q.recorded.push(q.policy);return true;}
export function trustRetry(q){q.runs[q.policy]=[];q.recorded=q.recorded.filter(k=>k!==q.policy);}
export function trustDone(q){return Object.keys(trustPolicies).every(k=>q.recorded.includes(k))&&q.reflection==='context';}
export function trustRestore(q){if(!q||!Object.hasOwn(trustPolicies,q.policy)||!q.runs||!Array.isArray(q.recorded)||new Set(q.recorded).size!==q.recorded.length||![null,'context','always'].includes(q.reflection))throw new RangeError('記録が不正です。');const runs={};for(const k of Object.keys(trustPolicies)){trustReplay(q.runs[k]);runs[k]=[...q.runs[k]];}for(const k of q.recorded){if(!Object.hasOwn(trustPolicies,k)||runs[k].length!==trustCases.length||runs[k].some((a,i)=>a!==trustExpected(k,trustCases[i])))throw new RangeError('比較の記録が不正です。');}return {policy:q.policy,runs,recorded:[...q.recorded],reflection:q.reflection};}
