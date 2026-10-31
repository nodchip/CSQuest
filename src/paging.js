export const pagingLevel={id:'page-frames',number:'34',kind:'paging',name:'記憶の三つの台',tag:'ページ置換',title:'記憶の頁を入れ替える',story:'魔法の記憶装置には３枚分の台しかありません。必要な頁を置くため、二つの置換方法を比べましょう。'};
export const pageCases={returnA:{name:'再び A を読む',pages:['A','B','C','A','D','A']},returnB:{name:'続いて B を読む',pages:['A','B','C','A','D','B']}};
export const pagePolicies={fifo:{name:'先に入れた頁から（FIFO）'},lru:{name:'長く使っていない頁から（LRU）'}};
export const FRAMES=3;
export function createPaging(example,policy){if(!Object.hasOwn(pageCases,example)||!Object.hasOwn(pagePolicies,policy))throw new RangeError('未知の試行です。');return {example,policy,index:0,order:[],faults:0,log:[],status:'playing',message:'最初の頁から参照しましょう。'};}
export function nextPage(state){return pageCases[state.example].pages[state.index];}
export function needsVictim(state){const page=nextPage(state);return state.status==='playing'&&!state.order.includes(page)&&state.order.length===FRAMES;}
export function stepPaging(state,action){
  if(state.status!=='playing'||typeof action!=='string')throw new RangeError('試行は終了しています。');
  const page=nextPage(state),hit=state.order.includes(page),needs=needsVictim(state);let evicted=null;
  if(needs){
    if(!action.startsWith('victim:'))return {...state,message:'台がいっぱいです。規則に従って外す頁を選びましょう。'};
    const chosen=action.slice(7);if(!state.order.includes(chosen))throw new RangeError('台にない頁です。');
    if(chosen!==state.order[0])return {...state,message:state.policy==='fifo'?'最も前に入れた頁を外しましょう。':'最後に使った時刻が最も古い頁を外しましょう。'};
    evicted=chosen;
  }else if(action!=='advance')return {...state,message:'頁を外さずに参照できます。'};
  let order=state.order.slice();
  if(hit){if(state.policy==='lru')order=[...order.filter(p=>p!==page),page];}
  else {if(evicted!==null)order=order.filter(p=>p!==evicted);order.push(page);}
  const index=state.index+1,status=index===pageCases[state.example].pages.length?'done':'playing';
  const message=hit?`${page} は台にありました。`:`${page} は台になく、${evicted?`${evicted} を外して`:'空きに'}読み込みました。`;
  return {...state,index,order,faults:state.faults+(hit?0:1),log:[...state.log,{page,hit,evicted}],status,message};
}
export function createPagingSet(){return Object.fromEntries(Object.keys(pageCases).map(example=>[example,Object.fromEntries(Object.keys(pagePolicies).map(policy=>[policy,createPaging(example,policy)]))]));}
export function restorePaging(saved){
  if(!saved||!Object.hasOwn(pageCases,saved.example)||!Object.hasOwn(pagePolicies,saved.policy)||!saved.actions)throw new RangeError('途中記録が不正です。');
  const states=createPagingSet(),actions={};
  for(const example of Object.keys(pageCases)){actions[example]={};for(const policy of Object.keys(pagePolicies)){
    const list=saved.actions[example]?.[policy];if(!Array.isArray(list)||list.length>pageCases[example].pages.length||list.some(x=>typeof x!=='string'))throw new RangeError('途中記録が不正です。');
    let state=states[example][policy];for(const action of list){const next=stepPaging(state,action);if(next.index!==state.index+1)throw new RangeError('途中記録が不正です。');state=next;}states[example][policy]=state;actions[example][policy]=list.slice();
  }}return {example:saved.example,policy:saved.policy,states,actions};
}
