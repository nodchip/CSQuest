export const statisticsLevel={id:'arrival-records',number:'47',kind:'statistics',name:'配達時間の記録',tag:'平均と中央値',title:'遅れた伝令を調べよう',story:'ギルドは７回の配達時間から、普段の様子を知りたがっています。一度だけとても遅い記録があると、代表値はどう変わるでしょう。'};
export const samples={regular:{name:'普段の７回',values:[4,1,6,3,7,2,5]},delayed:{name:'１回だけ遅い７回',values:[4,1,6,3,28,2,5]}};
export const meanOptions=[4,5,7,9];
export function sampleSummary(id){
  if(!Object.hasOwn(samples,id))throw new RangeError('未知の記録です。');
  const sorted=samples[id].values.slice().sort((a,b)=>a-b);
  return {sorted,mean:sorted.reduce((total,n)=>total+n,0)/sorted.length,median:sorted[Math.floor(sorted.length/2)]};
}
export function createStatistics(){return {selected:'regular',states:Object.fromEntries(Object.keys(samples).map(id=>[id,{order:[],mean:null,median:null,tested:false}]))};}
export function addRecord(state,id,value){
  const ordered=sampleSummary(id).sorted;
  if(state.order.length>=ordered.length||!samples[id].values.includes(value)||state.order.includes(value))throw new RangeError('その記録は選べません。');
  if(value!==ordered[state.order.length])return {state,message:'まだ選んでいない記録の中で、最も短い時間を選びましょう。'};
  return {state:{...state,order:[...state.order,value]},message:`${value} を順番に加えました。`};
}
export function checkStatistics(id,state){const expected=sampleSummary(id);return {ordered:state.order.length===expected.sorted.length,mean:state.mean===expected.mean,median:state.median===expected.median};}
export function restoreStatistics(saved){
  if(!saved||!Object.hasOwn(samples,saved.selected)||!saved.states)throw new RangeError('途中記録が不正です。');
  const result=createStatistics();result.selected=saved.selected;
  for(const id of Object.keys(samples)){
    const state=saved.states[id],sorted=sampleSummary(id).sorted;
    if(!state||!Array.isArray(state.order)||state.order.length>sorted.length||state.order.some((n,i)=>n!==sorted[i])||!(state.mean===null||meanOptions.includes(state.mean))||!(state.median===null||sorted.includes(state.median))||typeof state.tested!=='boolean'||(state.order.length<sorted.length&&(state.mean!==null||state.median!==null||state.tested)))throw new RangeError('途中記録が不正です。');
    result.states[id]={order:state.order.slice(),mean:state.mean,median:state.median,tested:state.tested};
  }return result;
}
export function statisticsComplete(state){return Object.keys(samples).every(id=>{const trial=state.states[id],check=checkStatistics(id,trial);return trial.tested&&check.ordered&&check.mean&&check.median;});}
