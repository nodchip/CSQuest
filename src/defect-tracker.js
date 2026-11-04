export const defectTrackerLevel={id:'guild-defect-tracker',number:'1260',kind:'defect-tracker',name:'注文の不具合を追う',tag:'欠陥追跡と再試験',title:'記録を残して修理を確かめよう',story:'ギルドの注文札が、在庫と同じ数を受け付けません。失敗を記録し、修理後の確認とほかの条件の試験を進めましょう。'};
export const defectRevisions={A:'最初の版 A',B:'修理案の版 B',C:'再修理の版 C'};
export const defectCases=[0,1,2];
export function defectExpected(qty){if(!defectCases.includes(qty))throw new RangeError('注文数が不正です。');return qty===1?'accept':'reject';}
export function defectActual(rev,qty){if(!Object.hasOwn(defectRevisions,rev)||!defectCases.includes(qty))throw new RangeError('版か注文数が不正です。');if(rev==='A')return 'reject';if(rev==='B')return qty<=1?'accept':'reject';return defectExpected(qty);}
export function defectCreate(){return {revision:'A',status:'unreported',tests:{A:[],B:[],C:[]},answer:null,history:[]};}
export function defectAct(q,action){if(!q||!Array.isArray(q.history)||q.history.length>=128)return {ok:false,message:'記録がいっぱいです。'};const n={...q,tests:Object.fromEntries(Object.entries(q.tests).map(([k,v])=>[k,[...v]])),history:[...q.history]};let message='';
 if(action.startsWith('test:')){const raw=action.slice(5);if(!['0','1','2'].includes(raw))return {ok:false,message:'注文数を選びましょう。'};const value=Number(raw);if(!n.tests[n.revision].includes(value))n.tests[n.revision].push(value);message=`版 ${n.revision} の注文 ${value} 個を試しました。`;}
 else if(action==='report'&&n.status==='unreported'&&n.tests.A.includes(1)){n.status='open';message='版 A、注文１個、期待と実際を記録して追跡を始めました。';}
 else if(action==='fix:B'&&n.status==='open'){n.revision='B';n.status='retest';message='修理案 B を用意しました。記録された条件と他の条件を試しましょう。';}
 else if(action==='reopen'&&n.status==='retest'&&n.revision==='B'&&n.tests.B.includes(1)&&n.tests.B.includes(0)){n.status='reopened';message='版 B の０個の失敗を記録し、再び修理が必要になりました。';}
 else if(action==='fix:C'&&n.status==='reopened'){n.revision='C';n.status='retest';message='再修理の版 C を用意しました。３条件を確かめましょう。';}
 else if(action==='close'&&n.status==='retest'&&n.revision==='C'&&defectCases.every(x=>n.tests.C.includes(x))){n.status='closed';message='版 C の３条件を確認し、記録を完了にしました。';}
 else if(['answer:scope','answer:one'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else return {ok:false,message:'記録の状態と試験した条件を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};}
export function defectRestore(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let q=defectCreate();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=defectAct(q,a);if(!r.ok)throw new RangeError('途中記録が不正です。');q=r.state;}return q;}
export function defectDone(q){return q.status==='closed'&&q.answer==='scope';}
