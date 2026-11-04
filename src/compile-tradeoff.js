export const tradeoffLevel={id:'workshop-compile-tradeoff',number:'1223',kind:'compile-tradeoff',name:'二つの翻訳炉と注文の数',tag:'翻訳費用と生成コード',title:'正しい石を作って注文に備えよう',story:'工房に同じ計算を何度も頼まれました。翻訳の準備と石を使う費用を比べ、正しい翻訳を選びましょう。'};
export const tradeoffModes={quick:{name:'手早く翻訳',build:2,run:5},optimized:{name:'時間をかけて最適化',build:8,run:2},broken:{name:'短くした候補',build:1,run:1}};
export const tradeoffRuns=[1,2,5];
export const tradeoffAnswers={quick:'手早く翻訳',equal:'同じ',optimized:'最適化'};
export function tradeoffEvaluate(mode,x){if(!Object.hasOwn(tradeoffModes,mode)||!Number.isInteger(x)||x<0||x>3)throw new RangeError('条件が不正です。');if(mode==='broken')return x+x;const doubled=x+x;return mode==='quick'?(x+x)+(x+x):doubled+doubled;}
export function tradeoffAudit(mode){if(!Object.hasOwn(tradeoffModes,mode))throw new RangeError('翻訳が不正です。');const rows=[0,1,2,3].map(x=>({x,expected:4*x,actual:tradeoffEvaluate(mode,x)}));return {rows,correct:rows.every(r=>r.expected===r.actual)};}
export function tradeoffTotals(n){if(!tradeoffRuns.includes(n))throw new RangeError('注文数が不正です。');const quick=tradeoffModes.quick.build+n*tradeoffModes.quick.run,optimized=tradeoffModes.optimized.build+n*tradeoffModes.optimized.run;return {quick,optimized,winner:quick<optimized?'quick':quick>optimized?'optimized':'equal'};}
export function tradeoffCreate(){return {mode:'quick',audited:[],runs:1,answer:null,seen:[],reflection:null};}
export function tradeoffCheck(q){if(!Object.keys(tradeoffModes).every(k=>q.audited.includes(k)))throw new RangeError('先に３種類の翻訳を検査してください。');const result=tradeoffTotals(q.runs),correct=q.answer===result.winner;if(correct&&!q.seen.includes(q.runs))q.seen.push(q.runs);return {correct,...result};}
export function tradeoffDone(q){return Object.keys(tradeoffModes).every(k=>q.audited.includes(k))&&tradeoffRuns.every(n=>q.seen.includes(n))&&q.reflection==='scope';}
export function tradeoffRestore(q){
 if(!q||!Object.hasOwn(tradeoffModes,q.mode)||!Array.isArray(q.audited)||new Set(q.audited).size!==q.audited.length||q.audited.some(x=>!Object.hasOwn(tradeoffModes,x))||!tradeoffRuns.includes(q.runs)||!(q.answer===null||Object.hasOwn(tradeoffAnswers,q.answer))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!tradeoffRuns.includes(x))||![null,'scope','always'].includes(q.reflection))throw new RangeError('記録が不正です。');
 return {mode:q.mode,audited:[...q.audited],runs:q.runs,answer:q.answer,seen:[...q.seen],reflection:q.reflection};
}
