export const coherenceLevel={id:'shared-cache',number:'104',kind:'coherence',name:'二人の精霊と写しの札',tag:'キャッシュ一貫性',title:'古い写しをどう扱う？',story:'二人の精霊が共有の札を手元に写します。一方が更新した後、もう一方には何が見えるでしょう。'};
export const coherenceModes={silent:{name:'更新を知らせない'},invalidate:{name:'古い写しを無効にする'}};
export const coherenceActions=[{worker:'A',kind:'read'},{worker:'B',kind:'read'},{worker:'A',kind:'write'},{worker:'B',kind:'read'}];
export function createCoherenceTrial(mode){if(!Object.hasOwn(coherenceModes,mode))throw new RangeError('方式が不正です。');return {mode,index:0,memory:0,caches:{A:null,B:null},history:[],message:'共有の札は０、手元の写しは空です。'};}
export function coherenceStep(state,action){
 const task=coherenceActions[state.index];if(!task||!['read0','read1','write'].includes(action))throw new RangeError('操作できません。');
 if(task.kind==='write'){
  if(action!=='write')return {...state,message:'次は A が共有の札を１に書き換えます。'};
  const caches={...state.caches,A:1};if(state.mode==='invalidate')caches.B=null;
  return {...state,index:state.index+1,memory:1,caches,history:[...state.history,{worker:'A',kind:'write',value:1,source:'memory'}],message:state.mode==='invalidate'?'A が共有の札を１に更新し、B の写しを無効にしました。':'A が共有の札を１に更新しました。B の写しには知らせません。'};
 }
 if(action==='write')return {...state,message:`次は ${task.worker} が値を読みます。`};
 const cached=state.caches[task.worker],value=cached===null?state.memory:cached,guess=action==='read0'?0:1;
 if(guess!==value)return {...state,message:`${task.worker} の写しがあればそれを、空なら共有の札を読みます。`};
 return {...state,index:state.index+1,caches:{...state.caches,[task.worker]:value},history:[...state.history,{worker:task.worker,kind:'read',value,source:cached===null?'memory':'cache'}],message:`${task.worker} は${cached===null?'共有の札':'手元の写し'}から ${value} を読みました。`};
}
export function createCoherence(){return {selected:'silent',states:Object.fromEntries(Object.keys(coherenceModes).map(id=>[id,createCoherenceTrial(id)]))};}
export function restoreCoherence(saved){if(!saved||!Object.hasOwn(coherenceModes,saved.selected)||!saved.steps)throw new RangeError('途中記録が不正です。');const result=createCoherence();result.selected=saved.selected;for(const id of Object.keys(coherenceModes)){const n=saved.steps[id];if(!Number.isInteger(n)||n<0||n>coherenceActions.length)throw new RangeError('途中記録が不正です。');let state=result.states[id];for(let i=0;i<n;i++){const task=coherenceActions[i],value=state.caches[task.worker]??state.memory;state=coherenceStep(state,task.kind==='write'?'write':`read${value}`);}result.states[id]=state;}return result;}
export function coherenceComplete(set){return Object.values(set.states).every(state=>state.index===coherenceActions.length);}
