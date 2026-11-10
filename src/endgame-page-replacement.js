export const pageSequence=['A','B','C','A','D'];
const empty=()=>({index:0,frames:[],waiting:null,hits:0,misses:0,evicted:null});
export function replayPages(kind,history){
 if(!['fifo','lru','compare'].includes(kind)||!Array.isArray(history))return null;
 const modes=kind==='compare'?['fifo','lru']:[kind];let scene=0,state=empty(),results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(action==='answer:different'){done=true;continue;}return null;}
  if(action==='reset'){state=empty();continue;}
  const mode=modes[scene];
  if(action==='next'){
   if(state.index!==pageSequence.length||state.waiting!==null)return null;
   results.push({frames:state.frames.map(x=>x.page),hits:state.hits,misses:state.misses,evicted:state.evicted});scene++;state=empty();if(scene===modes.length&&kind!=='compare')done=true;continue;
  }
  if(state.waiting!==null){
   const order=state.frames.reduce((a,b)=>a[mode==='fifo'?'loaded':'used']<b[mode==='fifo'?'loaded':'used']?a:b),expected=`evict:${order.page}`;
   if(action!==expected)return null;
   const i=state.frames.findIndex(x=>x.page===order.page);state.evicted=order.page;state.frames[i]={page:state.waiting,loaded:state.index,used:state.index};state.waiting=null;state.index++;continue;
  }
  if(state.index>=pageSequence.length||action!==`access:${pageSequence[state.index]}`)return null;
  const page=pageSequence[state.index],present=state.frames.find(x=>x.page===page);
  if(present){state.hits++;present.used=state.index;state.index++;}
  else {state.misses++;if(state.frames.length<3){state.frames.push({page,loaded:state.index,used:state.index});state.index++;}else state.waiting=page;}
 }
 return {scene,mode:modes[scene]??null,state,results,done};
}
