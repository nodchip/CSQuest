export const hierarchyLabLevel={id:'archive-memory-budget',number:'489',kind:'memory-budget',name:'精霊の棚と予算',tag:'記憶階層の費用と性能',title:'予算に合う棚を選ぼう',story:'書庫の精霊は高価な速い棚を増やすか迷っています。読まれる頁の巡りと予算に合わせ、待ち時間と費用を比べましょう。'};
export const shelfSizes=[1,2,4];
export const shelfCases={
 pair:{name:'２頁を交互に読む',requests:['A','B','A','B','A','B'],budget:8},
 tripleTight:{name:'３頁を巡る・予算８',requests:['A','B','C','A','B','C'],budget:8},
 tripleWide:{name:'３頁を巡る・予算12',requests:['A','B','C','A','B','C'],budget:12}
};
export function shelfRun(id,size){
 if(!Object.hasOwn(shelfCases,id)||!shelfSizes.includes(size))throw new RangeError('依頼または棚の大きさが不正です。');
 const order=[];let misses=0;const steps=shelfCases[id].requests.map(page=>{const index=order.indexOf(page),hit=index>=0;let victim=null;if(hit)order.splice(index,1);else{misses++;if(order.length===size)victim=order.shift();}order.push(page);return {page,hit,victim,order:[...order]};});
 return {cost:4+size*2,misses,time:steps.length+misses*5,steps};
}
export function bestShelves(id){
 if(!Object.hasOwn(shelfCases,id))throw new RangeError('依頼が不正です。');
 const options=shelfSizes.map(size=>({size,...shelfRun(id,size)})).filter(r=>r.cost<=shelfCases[id].budget);
 const minTime=Math.min(...options.map(r=>r.time)),minCost=Math.min(...options.filter(r=>r.time===minTime).map(r=>r.cost));
 return options.filter(r=>r.time===minTime&&r.cost===minCost).map(r=>r.size);
}
export function createShelfQuest(){return {selected:'pair',size:1,trials:Object.fromEntries(Object.keys(shelfCases).map(id=>[id,{seen:[],choice:null,confirmed:false}])),answer:null,checked:false};}
export function shelfTrialComplete(id,t){return shelfSizes.every(n=>t.seen.includes(n))&&t.confirmed&&bestShelves(id).includes(t.choice);}
export function shelfComplete(s){return Object.keys(shelfCases).every(id=>shelfTrialComplete(id,s.trials[id]))&&s.answer==='tradeoff'&&s.checked;}
export function restoreShelfQuest(s){
 if(!s||!Object.hasOwn(shelfCases,s.selected)||!shelfSizes.includes(s.size)||!s.trials||![null,'tradeoff','always','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const n=createShelfQuest();n.selected=s.selected;n.size=s.size;n.answer=s.answer;n.checked=s.checked;
 for(const id of Object.keys(shelfCases)){const t=s.trials[id];if(!t||!Array.isArray(t.seen)||t.seen.some(x=>!shelfSizes.includes(x))||new Set(t.seen).size!==t.seen.length||![null,...shelfSizes].includes(t.choice)||typeof t.confirmed!=='boolean')throw new RangeError('途中記録が不正です。');n.trials[id]={seen:[...t.seen],choice:t.choice,confirmed:t.confirmed};}return n;
}
