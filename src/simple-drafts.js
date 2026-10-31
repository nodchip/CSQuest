import {roles,resources,evaluatePolicy} from './access.js';
import {filters,ledgers,evaluateQuery} from './catalog.js';
import {villages,orders,evaluateMatches} from './join.js';
import {examples,unknowns,chooseExample} from './classification.js';
import {evaluateSet} from './evaluation.js';

const invalid=()=>{throw new RangeError('途中記録が不正です。');};
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
export function restoreAccess(saved){
  if(!object(saved)||!object(saved.policy)||typeof saved.tested!=='boolean'||Object.keys(saved.policy).length!==Object.keys(roles).length)invalid();
  const policy={};for(const role of Object.keys(roles)){
    const list=saved.policy[role];if(!Array.isArray(list)||new Set(list).size!==list.length||list.some(id=>typeof id!=='string'||!Object.hasOwn(resources,id)))invalid();
    policy[role]=list.slice();
  }
  return {policy,results:saved.tested?evaluatePolicy(policy):null};
}
export function restoreCatalog(saved){
  if(!object(saved)||!object(saved.filters)||Object.entries(saved.filters).some(([key,value])=>!Object.hasOwn(filters,key)||typeof value!=='boolean')||!Number.isInteger(saved.index)||saved.index<0||saved.index>=ledgers.length||typeof saved.tested!=='boolean')invalid();
  const selected={...saved.filters};return {filters:selected,index:saved.index,results:saved.tested?evaluateQuery(selected):null};
}
export function restoreJoin(saved){
  if(!object(saved)||!object(saved.selections)||typeof saved.tested!=='boolean')invalid();
  const allowed=['','none',...villages.map(v=>v.id)];
  if(Object.entries(saved.selections).some(([key,value])=>!orders.some(order=>order.id===key)||!allowed.includes(value)))invalid();
  const selections={...saved.selections};return {selections,results:saved.tested?evaluateMatches(selections):null};
}
export function restoreClassification(saved){
  if(!object(saved)||!Number.isInteger(saved.index)||saved.index<0||saved.index>=unknowns.length||!Array.isArray(saved.attempts)||saved.attempts.length!==unknowns.length)invalid();
  const attempts=saved.attempts.map((attempt,i)=>{
    if(!object(attempt)||!Object.hasOwn(attempt,'last')||!Object.hasOwn(attempt,'solved'))invalid();
    for(const key of ['last','solved'])if(attempt[key]!==null&&!examples.some(point=>point.id===attempt[key]))invalid();
    if(attempt.solved!==null&&!chooseExample(unknowns[i],attempt.solved).correct)invalid();
    return {last:attempt.last,solved:attempt.solved};
  });
  return {index:saved.index,attempts,results:attempts.map((attempt,i)=>attempt.last===null?null:chooseExample(unknowns[i],attempt.last)),solved:attempts.map(attempt=>attempt.solved!==null)};
}
export function restoreEvaluation(saved){
  if(!object(saved)||typeof saved.known!=='boolean'||typeof saved.heldout!=='boolean')invalid();
  return {known:saved.known?evaluateSet('known'):null,heldout:saved.heldout?evaluateSet('heldout'):null};
}
