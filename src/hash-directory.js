export const hashDirectoryLevel={id:'archive-hash-directory',number:'663',kind:'hash-directory',name:'増える桶と案内表',tag:'拡張可能ハッシュ索引',title:'散らばる薬草札を探そう',story:'書庫の札を番号の印から桶へ振り分けます。桶がいっぱいになったら案内表を広げ、等しい番号と範囲を探してみましょう。'};
export const hashKeys=[0,1,2,3,4,8];
export const hashQueries={four:{name:'４を探す',kind:'point',lo:4,hi:4},eight:{name:'８を探す',kind:'point',lo:8,hi:8},range:{name:'１から４を探す',kind:'range',lo:1,hi:4}};
export function createHashDirectory(){return {depth:1,directory:[1,2],nextId:3,buckets:{1:{id:1,depth:1,keys:[]},2:{id:2,depth:1,keys:[]}}};}
const copyHash=t=>({depth:t.depth,directory:[...t.directory],nextId:t.nextId,buckets:Object.fromEntries(Object.entries(t.buckets).map(([id,b])=>[id,{...b,keys:[...b.keys]}]))});
const slot=(key,depth)=>key&((1<<depth)-1);
export function insertHashDirectory(tree,key){
 if(!hashKeys.includes(key))throw new RangeError('札が不正です。');const n=copyHash(tree),trace=[];
 if(Object.values(n.buckets).some(b=>b.keys.includes(key)))throw new RangeError('この札はすでにあります。');
 while(true){const index=slot(key,n.depth),b=n.buckets[n.directory[index]];
  if(b.keys.length<2){b.keys.push(key);b.keys.sort((a,c)=>a-c);trace.push(`印の下 ${n.depth} 桁から桶 ${b.id} を選び、札 ${key} を入れました。`);return {tree:n,trace};}
  if(b.depth>=3)throw new RangeError('この模型の印ではこれ以上分割できません。');
  if(b.depth===n.depth){n.directory=[...n.directory,...n.directory];n.depth++;trace.push(`案内表を倍にし、印の下 ${n.depth} 桁を使います。`);}
  const oldDepth=b.depth;b.depth++;const newer={id:n.nextId++,depth:b.depth,keys:[]};n.buckets[newer.id]=newer;
  for(let i=0;i<n.directory.length;i++)if(n.directory[i]===b.id&&((i>>oldDepth)&1)===1)n.directory[i]=newer.id;
  const previous=b.keys;b.keys=[];for(const value of previous)n.buckets[n.directory[slot(value,n.depth)]].keys.push(value);
  trace.push(`桶 ${b.id} を ${b.id} と ${newer.id} に分け、既存の札を振り分けました。`);
 }
}
export function findHashDirectory(tree,query){
 const q=hashQueries[query];if(!q)throw new RangeError('検索が不正です。');
 if(q.kind==='point'){const index=slot(q.lo,tree.depth),id=tree.directory[index],bucket=tree.buckets[id];return {buckets:[id],found:bucket.keys.filter(k=>k===q.lo),trace:[`印の下 ${tree.depth} 桁から案内表の ${index.toString(2).padStart(tree.depth,'0')} を選び、桶 ${id} を読みました。`]};}
 const buckets=[...new Set(tree.directory)].sort((a,b)=>a-b),found=buckets.flatMap(id=>tree.buckets[id].keys).filter(k=>k>=q.lo&&k<=q.hi).sort((a,b)=>a-b);return {buckets,found,trace:[`この模型では桶は番号順ではないため、重複を除く全 ${buckets.length} 桶を読みます。`]};
}
export function createHashDirectoryQuest(){return {tree:createHashDirectory(),inserted:[],query:'four',results:{},trace:[],answer:null,checked:false,history:[]};}
export function hashDirectoryAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=128)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,inserted:[...s.inserted],results:{...s.results},history:[...s.history],checked:false};let message='';
 if(action.startsWith('insert:')){const raw=action.slice(7),key=Number(raw);if(String(key)!==raw||!hashKeys.includes(key)||s.inserted.includes(key))return {ok:false,message:'まだ入れていない札を選びましょう。'};const r=insertHashDirectory(s.tree,key);n.tree=r.tree;n.trace=r.trace;n.inserted.push(key);n.results={};message=`札 ${key} を追加しました。`;}
 else if(action.startsWith('query:')&&Object.hasOwn(hashQueries,action.slice(6))){n.query=action.slice(6);message='探す札を選びました。';}
 else if(action==='run'&&s.inserted.length===hashKeys.length){const result=findHashDirectory(s.tree,s.query);n.results[s.query]=result;n.trace=result.trace;message=`見つかった札：${result.found.join('・')}。桶 ${result.buckets.join('・')} を読みました。`;}
 else if(['answer:tradeoff','answer:range','answer:duplicate'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='案内表と探索の記録を確認しました。';}
 else return {ok:false,message:'６枚の札を追加してから探索しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreHashQuest(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let s=createHashDirectoryQuest();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=hashDirectoryAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function hashQuestComplete(s){return Object.keys(hashQueries).every(k=>Object.hasOwn(s.results,k))&&s.answer==='tradeoff'&&s.checked;}
