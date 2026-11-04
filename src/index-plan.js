import {createBufferPool,restoreBufferPool,bufferPoolComplete} from './buffer-pool.js';
import {createComponents,restoreComponents,componentsComplete} from './db-components.js';
import {createQueryPipeline,restoreQueryPipeline,queryPipelineComplete} from './query-pipeline.js';
import {createCoveringIndex,restoreCoveringIndex,coveringComplete} from './covering-index.js';
import {createIndexCommands,restoreIndexCommands} from './index-command.js';
export const indexPlanLevel={id:'herb-index-plan',number:'89',kind:'indexplan',name:'薬師の索引を選ぼう',tag:'問い合わせと複合索引',title:'台帳の探し方を比べよう',story:'薬師は種類と値段で品を探します。台帳全体を調べる方法と、順序の違う索引を比べましょう。'};
export const indexRows=[{id:'A',kind:'herb',price:2},{id:'B',kind:'herb',price:5},{id:'C',kind:'herb',price:7},{id:'D',kind:'herb',price:9},{id:'E',kind:'ore',price:1},{id:'F',kind:'ore',price:6},{id:'G',kind:'ore',price:8},{id:'H',kind:'ore',price:10}];
export const indexKinds={herb:'薬草',ore:'鉱石'};
export const indexMethods={scan:'索引なし',kind:'種類の索引',kindPrice:'種類 → 値段の索引',priceKind:'値段 → 種類の索引'};
export const indexCases={both:{name:'薬草で５以上',kind:'herb',minimum:5},price:{name:'種類を問わず８以上',kind:null,minimum:8}};
export function runIndex(id,method){
  if(!Object.hasOwn(indexCases,id)||!Object.hasOwn(indexMethods,method))throw new RangeError('未知の検索です。');
  const query=indexCases[id],rows=indexRows.slice();
  if(method==='kind'||method==='kindPrice')rows.sort((a,b)=>a.kind.localeCompare(b.kind,'en')||(method==='kindPrice'?a.price-b.price:0));
  if(method==='priceKind')rows.sort((a,b)=>a.price-b.price||a.kind.localeCompare(b.kind,'en'));
  const candidates=rows.filter(row=>method==='scan'?true:method==='kind'?(!query.kind||row.kind===query.kind):method==='kindPrice'?(!query.kind||row.kind===query.kind&&row.price>=query.minimum):row.price>=query.minimum);
  const matches=candidates.filter(row=>(!query.kind||row.kind===query.kind)&&row.price>=query.minimum);
  return {candidates:candidates.map(r=>r.id),matches:matches.map(r=>r.id)};
}
export function indexOptimal(id,method){if(!Object.hasOwn(indexMethods,method))return false;const cost=runIndex(id,method).candidates.length;return cost===Math.min(...Object.keys(indexMethods).map(m=>runIndex(id,m).candidates.length));}
export function createIndexPlan(){return {selected:'both',trials:Object.fromEntries(Object.keys(indexCases).map(id=>[id,{method:'scan',tested:[],checked:false}])),pipeline:createQueryPipeline(),components:createComponents(),covering:createCoveringIndex(),buffer:createBufferPool(),commands:createIndexCommands()};}
export function restoreIndexPlan(saved){
  if(!saved||!Object.hasOwn(indexCases,saved.selected)||!saved.trials)throw new RangeError('途中記録が不正です。');const result=createIndexPlan();result.selected=saved.selected;
  for(const id of Object.keys(indexCases)){const t=saved.trials[id];if(!t||!Object.hasOwn(indexMethods,t.method)||!Array.isArray(t.tested)||new Set(t.tested).size!==t.tested.length||t.tested.some(m=>!Object.hasOwn(indexMethods,m))||typeof t.checked!=='boolean'||(t.checked&&t.tested.length!==Object.keys(indexMethods).length))throw new RangeError('途中記録が不正です。');result.trials[id]={method:t.method,tested:t.tested.slice(),checked:t.checked};}if(saved.pipeline!==undefined)result.pipeline=restoreQueryPipeline(saved.pipeline);if(saved.components!==undefined)result.components=restoreComponents(saved.components);if(saved.covering!==undefined)result.covering=restoreCoveringIndex(saved.covering);if(saved.buffer!==undefined)result.buffer=restoreBufferPool(saved.buffer);result.commands=restoreIndexCommands(saved.commands);return result;
}
export function indexPlanComplete(state){return Object.keys(indexCases).every(id=>{const t=state.trials[id];return t.tested.length===Object.keys(indexMethods).length&&t.checked&&indexOptimal(id,t.method);})&&queryPipelineComplete(state.pipeline)&&componentsComplete(state.components)&&coveringComplete(state.covering)&&bufferPoolComplete(state.buffer);}
