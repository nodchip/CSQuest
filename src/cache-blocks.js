export const blockLevel={id:'archive-blocks',number:'103',kind:'blocks',name:'まとまりで届く魔導書',tag:'空間的局所性とキャッシュ',title:'近くの頁をまとめて運ぶ',story:'書庫の精霊は頁をまとめて手元の棚に運べます。読み方と一度に運ぶ頁数で、待ち時間がどう変わるか調べましょう。'};
export const blockPatterns={sequential:{name:'隣の頁を順に読む',requests:[0,1,2,3,0,1,2,3]},stride:{name:'１頁おきに読む',requests:[0,2,4,6,0,2,4,6]}};
export const blockSizes=[1,2];
export function createBlockTrial(pattern,size){if(!Object.hasOwn(blockPatterns,pattern)||!blockSizes.includes(size))throw new RangeError('条件が不正です。');return {pattern,size,index:0,cache:[],hits:0,total:0,history:[],message:'手元の棚は空です。'};}
export function blockAccess(state,prediction){
 if(!['hit','miss'].includes(prediction)||state.index>=blockPatterns[state.pattern].requests.length)throw new RangeError('操作できません。');
 const page=blockPatterns[state.pattern].requests[state.index],block=Math.floor(page/state.size)*state.size,hit=state.cache.includes(block);
 if((prediction==='hit')!==hit)return {...state,message:hit?`頁 ${page} を含むまとまりは棚にあります。`:`頁 ${page} を含むまとまりは棚にありません。`};
 const cache=state.cache.filter(start=>start!==block),capacity=4/state.size;let evicted=null;if(!hit&&cache.length===capacity)evicted=cache.shift();cache.push(block);const cost=hit?1:6;
 return {...state,index:state.index+1,cache,hits:state.hits+(hit?1:0),total:state.total+cost,history:[...state.history,{page,block,hit,cost,evicted}],message:hit?`頁 ${page} は棚にあり、１時間で読めました。`:`頁 ${page} を含むまとまりを運び、６時間かかりました。${evicted===null?'':`頁 ${evicted} からのまとまりを外しました。`}`};
}
export function createBlockSet(){return {selected:'sequential',size:1,states:Object.fromEntries(Object.keys(blockPatterns).map(id=>[id,Object.fromEntries(blockSizes.map(n=>[n,createBlockTrial(id,n)]))]))};}
export function restoreBlocks(saved){if(!saved||!Object.hasOwn(blockPatterns,saved.selected)||!blockSizes.includes(saved.size)||!saved.indices)throw new RangeError('途中記録が不正です。');const result=createBlockSet();result.selected=saved.selected;result.size=saved.size;for(const id of Object.keys(blockPatterns))for(const size of blockSizes){const count=saved.indices[id]?.[size];if(!Number.isInteger(count)||count<0||count>blockPatterns[id].requests.length)throw new RangeError('途中記録が不正です。');let state=createBlockTrial(id,size);for(let i=0;i<count;i++){const page=blockPatterns[id].requests[i],block=Math.floor(page/size)*size;state=blockAccess(state,state.cache.includes(block)?'hit':'miss');}result.states[id][size]=state;}return result;}
export function blocksComplete(set){return Object.keys(blockPatterns).every(id=>blockSizes.every(size=>set.states[id][size].index===blockPatterns[id].requests.length));}
