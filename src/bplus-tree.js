export const bplusLevel={id:'archive-bplus-tree',number:'662',kind:'bplus-tree',name:'分かれる索引の書庫',tag:'B+ 木と範囲走査',title:'薬草の索引を育てて探そう',story:'書庫の薬草札が増え、棚を端から探すのに時間がかかっています。索引の頁に番号を入れて木を育て、必要な札を探しましょう。'};
export const bplusKeys=[10,20,30,40,50,60];
export const bplusQueries={point20:{name:'20 を探す',lo:20,hi:20},point40:{name:'40 を探す',lo:40,hi:40},range:{name:'20 から 50 を探す',lo:20,hi:50}};
export function createBplusTree(){return {root:1,nextId:2,pages:{1:{id:1,leaf:true,keys:[],next:null}}};}
const copyTree=t=>({root:t.root,nextId:t.nextId,pages:Object.fromEntries(Object.entries(t.pages).map(([id,p])=>[id,p.leaf?{...p,keys:[...p.keys]}:{...p,keys:[...p.keys],children:[...p.children]}]))});
const childIndex=(keys,key)=>{let i=0;while(i<keys.length&&key>=keys[i])i++;return i;};
export function insertBplus(tree,key){
 if(!bplusKeys.includes(key))throw new RangeError('札が不正です。');const n=copyTree(tree),stack=[],trace=[];let page=n.pages[n.root];
 while(!page.leaf){const index=childIndex(page.keys,key);stack.push({id:page.id,index});page=n.pages[page.children[index]];}
 if(page.keys.includes(key))throw new RangeError('この札はすでにあります。');page.keys.push(key);page.keys.sort((a,b)=>a-b);trace.push(`葉 ${page.id} に ${key} を入れました。`);
 if(page.keys.length<=2)return {tree:n,trace};
 const right={id:n.nextId++,leaf:true,keys:page.keys.splice(1),next:page.next};page.next=right.id;n.pages[right.id]=right;trace.push(`葉 ${page.id} を分け、葉 ${right.id} をつなぎました。`);let separator=right.keys[0],rightId=right.id,leftId=page.id;
 while(stack.length){const {id,index}=stack.pop(),parent=n.pages[id];parent.keys.splice(index,0,separator);parent.children.splice(index+1,0,rightId);trace.push(`案内頁 ${id} に境目 ${separator} を追加しました。`);if(parent.keys.length<=2)return {tree:n,trace};
  const middle=parent.keys[1],newRight={id:n.nextId++,leaf:false,keys:parent.keys.slice(2),children:parent.children.slice(2)};parent.keys=parent.keys.slice(0,1);parent.children=parent.children.slice(0,2);n.pages[newRight.id]=newRight;trace.push(`案内頁 ${id} を分け、境目 ${middle} を上へ渡します。`);separator=middle;leftId=id;rightId=newRight.id;
 }
 const root={id:n.nextId++,leaf:false,keys:[separator],children:[leftId,rightId]};n.pages[root.id]=root;n.root=root.id;trace.push(`新しい根 ${root.id} を作りました。`);return {tree:n,trace};
}
export function findBplus(tree,lo,hi){
 if(!Number.isInteger(lo)||!Number.isInteger(hi)||lo>hi)throw new RangeError('範囲が不正です。');let page=tree.pages[tree.root];const pages=[],found=[],trace=[];
 while(!page.leaf){pages.push(page.id);const index=childIndex(page.keys,lo);trace.push(`案内頁 ${page.id} の境目 ${page.keys.join('・')} から子 ${page.children[index]} へ進む。`);page=tree.pages[page.children[index]];}
 while(page){pages.push(page.id);trace.push(`葉 ${page.id} を読む：${page.keys.join('・')}。`);let stop=false;for(const key of page.keys){if(key>hi){stop=true;break;}if(key>=lo)found.push(key);if(key===hi){stop=true;break;}}if(stop||page.next===null)break;page=tree.pages[page.next];}
 return {pages,found,trace};
}
export function createBplusQuest(){return {tree:createBplusTree(),inserted:[],query:'point20',results:{},trace:[],answer:null,checked:false,history:[]};}
export function bplusAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=128)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,inserted:[...s.inserted],results:{...s.results},history:[...s.history],checked:false};let message='';
 if(action.startsWith('insert:')){const raw=action.slice(7),key=Number(raw);if(String(key)!==raw||!bplusKeys.includes(key)||s.inserted.includes(key))return {ok:false,message:'まだ入れていない札を選びましょう。'};const r=insertBplus(s.tree,key);n.tree=r.tree;n.trace=r.trace;n.inserted.push(key);n.results={};message=`札 ${key} を追加しました。`;}
 else if(action.startsWith('query:')&&Object.hasOwn(bplusQueries,action.slice(6))){n.query=action.slice(6);message='探す札を選びました。';}
 else if(action==='run'&&s.inserted.length===bplusKeys.length){const q=bplusQueries[s.query],result=findBplus(s.tree,q.lo,q.hi);n.results[s.query]=result;n.trace=result.trace;message=`見つかった札：${result.found.join('・')}。索引では ${result.pages.length} 頁を読みました。`;}
 else if(['answer:tradeoff','answer:always','answer:no-leaves'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='索引と探索の記録を確認しました。';}
 else return {ok:false,message:'６枚の札を追加してから探索しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreBplusQuest(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let s=createBplusQuest();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=bplusAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function bplusComplete(s){return Object.keys(bplusQueries).every(k=>Object.hasOwn(s.results,k))&&s.answer==='tradeoff'&&s.checked;}
