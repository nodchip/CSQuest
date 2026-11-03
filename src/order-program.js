import {orderInventoryCases} from './order-inventory.js';
export const orderProgramLevel={id:'village-order-program',number:'1127',kind:'order-program',name:'薬師の自動受付',tag:'条件分岐・繰り返し・試験',title:'注文を処理する手順を組み立てる',story:'薬師が毎回手で行っていた注文の処理を、精霊が繰り返せる手順にします。札を選び、複数の注文で試しましょう。'};
export const orderProgramOptions={positive:{take:'１個渡して数を１減らす',empty:'在庫切れを知らせる'},zero:{empty:'在庫切れを知らせる',take:'１個渡して数を１減らす'},missing:{missing:'未登録として確認する',empty:'在庫切れを知らせる'},advance:{next:'次の注文に進む',stay:'同じ注文にとどまる'}};
const expected={mixed:{results:['take','take','empty'],stock:{sun:0,moon:0}},missing:{results:['empty','missing','empty'],stock:{sun:2,moon:0}},empty:{results:[],stock:{sun:1,moon:1}}};
function validProgram(p){return p&&Object.entries(orderProgramOptions).every(([k,v])=>Object.hasOwn(v,p[k]));}
export function orderProgramRun(program,id){
 if(!validProgram(program)||!Object.hasOwn(orderInventoryCases,id))throw new RangeError('手順か場面が不正です。');
 const c=orderInventoryCases[id],stock={...c.stock},trace=[];let index=0;
 while(index<c.orders.length&&trace.length<8){const key=c.orders[index],exists=Object.hasOwn(stock,key),before=exists?stock[key]:null,branch=!exists?'missing':before>0?'positive':'zero',action=program[branch];if(action==='take'&&exists)stock[key]--;trace.push({index,key,branch,action,before,after:exists?stock[key]:null});if(program.advance==='next')index++;}
 const finished=index===c.orders.length,e=expected[id],pass=finished&&trace.length===e.results.length&&trace.every((r,i)=>r.action===e.results[i])&&Object.keys(e.stock).every(k=>stock[k]===e.stock[k]);return {trace,stock,finished,pass};
}
export function orderProgramCreate(){return {program:{positive:'take',zero:'take',missing:'empty',advance:'next'},selected:'mixed',frame:null,tested:{mixed:false,missing:false,empty:false},answer:null,checked:false};}
export function orderProgramDone(q){return Object.keys(orderInventoryCases).every(k=>q.tested[k]&&orderProgramRun(q.program,k).pass)&&q.answer==='limits'&&q.checked;}
export function orderProgramRestore(q){if(!q||!validProgram(q.program)||!Object.hasOwn(orderInventoryCases,q.selected)||!q.tested||!Object.keys(orderInventoryCases).every(k=>typeof q.tested[k]==='boolean')||![null,'limits','proof','zero'].includes(q.answer)||typeof q.checked!=='boolean'||(q.frame!==null&&(!Number.isInteger(q.frame)||q.frame<0||q.frame>orderProgramRun(q.program,q.selected).trace.length)))throw new RangeError('手順の記録が不正です。');return {program:{...q.program},selected:q.selected,frame:q.frame,tested:{...q.tested},answer:q.answer,checked:q.checked};}
