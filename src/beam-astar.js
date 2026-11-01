import {beamTree} from './beam-tree.js';
// A tree with unit edge costs. The heuristic is the same one used by beam search.
export function createBeamAstar(){return {open:[{id:'S',g:0,h:0,parent:null}],expanded:[],parents:{S:null},done:false,history:[]};}
export function beamAstarAct(s,id){
 if(!s||!Array.isArray(s.history)||s.history.length>=30||s.done)return {ok:false,message:'探索は終了しています。'};
 const order=[...s.open].sort((a,b)=>a.g+a.h-(b.g+b.h)||(a.id<b.id?-1:a.id>b.id?1:0)),current=order[0];
 if(!current||current.id!==id)return {ok:false,message:'g＋h が最小の候補を選びます。同点ならアルファベット順です。'};
 const open=order.slice(1),parents={...s.parents},expanded=[...s.expanded],history=[...s.history,id];
 if(id==='G')return {ok:true,state:{open,parents,expanded,done:true,history},message:'灯火 G を選びました。'};
 expanded.push(id);for(const [child,h] of beamTree[id]){parents[child]=id;open.push({id:child,g:current.g+1,h,parent:id});}
 return {ok:true,state:{open,parents,expanded,done:false,history},message:`${id} を展開し、子を待機列に加えました。`};
}
export function beamAstarPath(s){if(!s.done)return null;const path=[];for(let id='G';id!==null;id=s.parents[id])path.push(id);return path.reverse();}
export function restoreBeamAstar(s){if(!s||!Array.isArray(s.history)||s.history.length>30)throw new RangeError('途中記録が不正です。');let n=createBeamAstar();for(const id of s.history){if(typeof id!=='string')throw new RangeError('途中記録が不正です。');const r=beamAstarAct(n,id);if(!r.ok)throw new RangeError('途中記録が不正です。');n=r.state;}return n;}
