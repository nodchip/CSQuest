export const aspectLevel={id:'workshop-aspect-ledger',number:'323',kind:'aspect-ledger',name:'台帳の共通記録',tag:'アスペクトと実行の節目',title:'記録する場面を選ぼう',story:'工房の台帳には預入、引出、閲覧の操作があります。成功した預入と引出だけを、共通の仕掛けで記録しましょう。'};
export const aspectEvents={deposit:{name:'預入（成功）',write:true,success:true},withdraw:{name:'引出（成功）',write:true,success:true},failure:{name:'引出（例外で失敗）',write:true,success:false},read:{name:'閲覧（成功）',write:false,success:true}};
export function aspectLog(pointcut,advice,event){
 if(!['writes','all'].includes(pointcut)||!['before','returning','throwing','finally'].includes(advice)||!Object.hasOwn(aspectEvents,event))throw new RangeError('設定が不正です');
 const e=aspectEvents[event],matched=pointcut==='all'||e.write;
 return matched&&(advice==='returning'?e.success:advice==='throwing'?!e.success:true);
}
export function createAspect(){return {pointcut:'all',advice:'before',done:[],checked:false};}
export function restoreAspect(saved){if(!saved||!['writes','all'].includes(saved.pointcut)||!['before','returning','throwing','finally'].includes(saved.advice)||!Array.isArray(saved.done)||new Set(saved.done).size!==saved.done.length||saved.done.some(x=>!Object.hasOwn(aspectEvents,x))||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です');return {pointcut:saved.pointcut,advice:saved.advice,done:[...saved.done],checked:saved.checked};}
export function aspectComplete(s){return s.pointcut==='writes'&&s.advice==='returning'&&Object.keys(aspectEvents).every(x=>s.done.includes(x))&&s.checked;}
