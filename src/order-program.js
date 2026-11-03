import {herbNames,orderInventoryCases,orderInventoryReplayCase} from './order-inventory.js';
export const orderProgramLevel={id:'village-order-program',number:'1127',kind:'order-program',name:'薬師の自動受付',tag:'条件分岐・繰り返し・試験',title:'注文を処理する手順を組み立てる',story:'薬師が毎回手で行っていた注文の処理を、精霊が繰り返せる手順にします。札を選び、複数の注文で試しましょう。'};
export const orderProgramOptions={positive:{take:'１個渡して数を１減らす',empty:'在庫切れを知らせる'},zero:{empty:'在庫切れを知らせる',take:'１個渡して数を１減らす'},missing:{missing:'未登録として確認する',empty:'在庫切れを知らせる'},advance:{next:'次の注文に進む',stay:'同じ注文にとどまる'}};
const expected={mixed:{results:['take','take','empty'],stock:{sun:0,moon:0}},missing:{results:['empty','missing','empty'],stock:{sun:2,moon:0}},empty:{results:[],stock:{sun:1,moon:1}}};
function validProgram(p){return p&&Object.entries(orderProgramOptions).every(([k,v])=>Object.hasOwn(v,p[k]));}
function simulate(program,c){
 if(!validProgram(program))throw new RangeError('手順が不正です。');orderInventoryReplayCase(c,[]);
 const stock={...c.stock},trace=[];let index=0;
 while(index<c.orders.length&&trace.length<8){const key=c.orders[index],exists=Object.hasOwn(stock,key),before=exists?stock[key]:null,branch=!exists?'missing':before>0?'positive':'zero',action=program[branch];if(action==='take'&&exists)stock[key]--;trace.push({index,key,branch,action,before,after:exists?stock[key]:null});if(program.advance==='next')index++;}
 return {trace,stock,finished:index===c.orders.length};
}
export function orderProgramRun(program,id){if(!Object.hasOwn(orderInventoryCases,id))throw new RangeError('場面が不正です。');const result=simulate(program,orderInventoryCases[id]),e=expected[id],pass=result.finished&&result.trace.length===e.results.length&&result.trace.every((r,i)=>r.action===e.results[i])&&Object.keys(e.stock).every(k=>result.stock[k]===e.stock[k]);return {...result,pass};}
export function orderProgramCustom(program,c){
 const result=simulate(program,c),history=[],stock={...c.stock},expectedActions=[];
 for(const key of c.orders){history.push('read');let a;if(!Object.hasOwn(stock,key))a='missing';else if(stock[key]===0)a='empty';else{a='take';stock[key]--;}history.push(a);expectedActions.push(a);}
 history.push('finish');const expectedResult=orderInventoryReplayCase(c,history);
 return {...result,expected:expectedResult.results,pass:result.finished&&result.trace.length===expectedActions.length&&result.trace.every((t,i)=>t.action===expectedActions[i])&&Object.keys(stock).every(k=>result.stock[k]===stock[k])};
}
export function orderProgramLabCreate(){return {orders:[],stock:{sun:1,moon:1},frame:null,touched:false,suite:[],suiteRun:false};}
export function orderProgramLabEdit(lab,action,value){
 if(action==='append'&&Object.hasOwn(herbNames,value)&&lab.orders.length<4)lab.orders.push(value);
 else if(action==='remove'&&lab.orders.length)lab.orders.pop();
 else if(action==='stock'&&value&&Object.hasOwn(herbNames,value.key)&&['missing','0','1','2'].includes(value.amount)){if(value.amount==='missing')delete lab.stock[value.key];else lab.stock[value.key]=Number(value.amount);}
 else throw new RangeError('注文は４件までです。操作を確認しましょう。');
 lab.frame=null;lab.touched=true;
}
export function orderProgramLabSave(lab){if(lab.suite.length>=6)throw new RangeError('試験は６件までです。');orderInventoryReplayCase(lab,[]);lab.suite.push({orders:[...lab.orders],stock:{...lab.stock}});lab.suiteRun=false;lab.touched=true;}
export function orderProgramLabRemove(lab,index){if(!Number.isInteger(index)||index<0||index>=lab.suite.length)throw new RangeError('試験が不正です。');lab.suite.splice(index,1);lab.suiteRun=false;lab.touched=true;}
export function orderProgramLabLoad(lab,index){if(!Number.isInteger(index)||index<0||index>=lab.suite.length)throw new RangeError('試験が不正です。');const c=lab.suite[index];lab.orders=[...c.orders];lab.stock={...c.stock};lab.frame=null;lab.touched=true;}
export function orderProgramCreate(){return {program:{positive:'take',zero:'take',missing:'empty',advance:'next'},selected:'mixed',frame:null,tested:{mixed:false,missing:false,empty:false},answer:null,checked:false,lab:orderProgramLabCreate()};}
export function orderProgramDone(q){return Object.keys(orderInventoryCases).every(k=>q.tested[k]&&orderProgramRun(q.program,k).pass)&&q.answer==='limits'&&q.checked;}
export function orderProgramRestore(q){if(!q||!validProgram(q.program)||!Object.hasOwn(orderInventoryCases,q.selected)||!q.tested||!Object.keys(orderInventoryCases).every(k=>typeof q.tested[k]==='boolean')||![null,'limits','proof','zero'].includes(q.answer)||typeof q.checked!=='boolean'||(q.frame!==null&&(!Number.isInteger(q.frame)||q.frame<0||q.frame>orderProgramRun(q.program,q.selected).trace.length)))throw new RangeError('手順の記録が不正です。');const lab=q.lab===undefined?orderProgramLabCreate():q.lab;if(!lab||typeof lab.touched!=='boolean')throw new RangeError('試験の記録が不正です。');const run=orderProgramCustom(q.program,lab),suite=lab.suite===undefined?[]:lab.suite,suiteRun=lab.suiteRun===undefined?false:lab.suiteRun;if(!Array.isArray(suite)||suite.length>6||typeof suiteRun!=='boolean'||(suiteRun&&!suite.length))throw new RangeError('試験の記録が不正です。');for(const c of suite)orderInventoryReplayCase(c,[]);if(lab.frame!==null&&(!Number.isInteger(lab.frame)||lab.frame<0||lab.frame>run.trace.length))throw new RangeError('試験の記録が不正です。');return {program:{...q.program},selected:q.selected,frame:q.frame,tested:{...q.tested},answer:q.answer,checked:q.checked,lab:{orders:[...lab.orders],stock:{...lab.stock},frame:lab.frame,touched:lab.touched,suite:suite.map(c=>({orders:[...c.orders],stock:{...c.stock}})),suiteRun}};}
