import {createLightDelay,restoreLightDelay} from './light-delay.js';
import {createLatencyPaths,restoreLatencyPaths} from './latency-paths.js';
export const cacheLevel={id:'archive-cache',number:'25',kind:'cache',name:'近くの棚と遠くの書庫',tag:'キャッシュと局所性',title:'魔導書を素早く届けよう',story:'魔導士は同じ三種類の本を繰り返し使います。手元の小さな棚を使って、二通りの依頼の順番を比べましょう。'};
export const patterns={
  grouped:{name:'まとまった依頼',requests:['A','B','A','B','C','C']},
  rotating:{name:'順番に巡る依頼',requests:['A','B','C','A','B','C']},
};
export const HIT_TIME=1, MISS_TIME=6, CAPACITY=2;
export function createCache(pattern){if(!Object.hasOwn(patterns,pattern))throw new RangeError('未知の依頼です。');return {pattern,index:0,shelf:[],history:[],hits:0,time:0,message:'棚は空です。'};}
export function accessNext(state,prediction){
  if(!['hit','miss'].includes(prediction))throw new RangeError('未知の予測です。');
  const requests=patterns[state.pattern]?.requests;
  if(!requests||state.index>=requests.length)throw new RangeError('この依頼は終了しています。');
  const book=requests[state.index],hit=state.shelf.includes(book);
  if((prediction==='hit')!==hit)return {...state,message:hit?`${book} は手元の棚にあります。棚から取れるか確認しましょう。`:`${book} は手元の棚にありません。遠くの書庫を確認しましょう。`};
  const shelf=state.shelf.filter(item=>item!==book);let evicted=null;
  if(!hit&&shelf.length===CAPACITY)evicted=shelf.shift();
  shelf.push(book);const cost=hit?HIT_TIME:MISS_TIME;
  return {...state,index:state.index+1,shelf,hits:state.hits+(hit?1:0),time:state.time+cost,history:[...state.history,{book,hit,cost,evicted}],message:hit?`${book} は手元にあり、${cost} 時間で届けました。`:`${book} は遠くの書庫から ${cost} 時間で届けました。${evicted?`${evicted} を棚から外しました。`:''}`};
}
export function restoreCache(draft){
  if(!draft||!Object.hasOwn(patterns,draft.selected)||!draft.index||typeof draft.index!=='object')throw new RangeError('途中記録が不正です。');
  const states={};
  for(const [id,pattern] of Object.entries(patterns)){
    const count=draft.index[id];if(!Number.isInteger(count)||count<0||count>pattern.requests.length)throw new RangeError('途中記録が不正です。');
    let state=createCache(id);for(let i=0;i<count;i++){const hit=state.shelf.includes(pattern.requests[i]);state=accessNext(state,hit?'hit':'miss');}states[id]=state;
  }
  return {selected:draft.selected,states,light:draft.light===undefined?createLightDelay():restoreLightDelay(draft.light),latency:draft.latency===undefined?createLatencyPaths():restoreLatencyPaths(draft.latency)};
}
