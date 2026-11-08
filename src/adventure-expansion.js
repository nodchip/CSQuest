export const expansionQuests={
 'search-bfs':{title:'近い中継所から調べよう',short:'道の数で探す',region:'mountain',goal:'待ち列の先頭から順に調べ、集落を見つける'},
 'search-weighted':{title:'一番早い知らせを探そう',short:'時間で探す',region:'mountain',goal:'仮の時間が最も短い場所から調べ、集落までの最短時間を確定する'},
 'search-compare':{title:'二つの探し方を比べよう',short:'二つの方法を比べる',region:'mountain',goal:'道の数が最少の経路と時間が最短の経路を選び、違いを確かめる'},
 'data-record':{title:'届け先の記録を探そう',short:'記録番号で探す',region:'valley',goal:'記録を番号順に並べてから、番号10の届け先を見つける'},
 'data-filter':{title:'山へ届ける荷物を選ぼう',short:'条件で荷物を選ぶ',region:'valley',goal:'届け先が山の集落で、準備が済んだ荷物をすべて選ぶ'},
 'data-join':{title:'荷物と届け先をつなごう',short:'記録を組み合わせる',region:'valley',goal:'届け先番号を手がかりに、荷物と届け先をすべて組み合わせる'},
};
export const expansionIds=Object.keys(expansionQuests);
export const searchIds=['search-bfs','search-weighted','search-compare'];
export const searchButtonOrder=['s','b','a','t','c'];
export const recordNames={s:'中継所',a:'尾根',b:'森の道',c:'小川',t:'山の集落'};
export const roads={s:[['a',2],['b',3]],a:[['t',9]],b:[['c',1]],c:[['t',2]],t:[]};
export const shipments=[{id:'A',dest:'10',ready:true},{id:'B',dest:'20',ready:true},{id:'C',dest:'10',ready:false},{id:'D',dest:'10',ready:true}];
export const destinations=[{id:'10',name:'山の集落'},{id:'20',name:'水辺の村'},{id:'30',name:'山の集落'}];
function searchReplay(id,history){
 let queue=['s'],settled=[],distance={s:0},parent={},steps=[];
 for(const selected of history){
  if(settled.includes('t')||!Object.hasOwn(recordNames,selected))throw new RangeError('調べる場所を選び直してください。');
  const candidates=id==='search-bfs'?[queue[0]]:queue.filter(x=>distance[x]===Math.min(...queue.map(y=>distance[y])));
  if(!candidates.includes(selected))throw new RangeError(id==='search-bfs'?'待ち列の先頭から調べましょう。':'仮の時間が最も短い場所から調べましょう。');
  queue=queue.filter(x=>x!==selected);settled.push(selected);
  const changes=[];
  if(selected!=='t')for(const [next,minutes] of roads[selected]){
   if(settled.includes(next))continue;
   const candidate=distance[selected]+(id==='search-bfs'?1:minutes);
   if(distance[next]===undefined||candidate<distance[next]){distance[next]=candidate;parent[next]=selected;if(!queue.includes(next))queue.push(next);changes.push(next);}
  }
  steps.push({selected,changes});
 }
 let path=[];if(settled.includes('t')){let x='t';while(x){path.unshift(x);x=parent[x];}}
 return {done:settled.includes('t'),queue,settled,distance,parent,path,steps};
}
export function expansionReplay(id,history){
 if(!expansionIds.includes(id)||!Array.isArray(history)||history.length>30||history.some(x=>typeof x!=='string'))throw new RangeError('依頼の記録が不正です。');
 if(id==='search-bfs'||id==='search-weighted')return searchReplay(id,history);
 if(id==='search-compare'){
  const expected=['hops','time'];if(history.some((x,i)=>x!==expected[i])||history.length>2)throw new RangeError('条件を満たす道を選びましょう。');
  return {done:history.length===2,step:history.length};
 }
 if(id==='data-record'){
  const order=['30','10','20'];let done=false;
  for(const action of history){
   if(done)throw new RangeError('すでに達成しています。');
   if(action==='swap:0'||action==='swap:1'){const i=Number(action.slice(5));[order[i],order[i+1]]=[order[i+1],order[i]];}
   else if(action==='find:10'&&order.join(',')==='10,20,30')done=true;
   else throw new RangeError('番号順に並べてから、番号10の記録を選びましょう。');
  }
  return {done,order,sorted:order.join(',')==='10,20,30'};
 }
 if(id==='data-filter'){
  const chosen=new Set();let tested=false,done=false;
  for(const action of history){
   if(done)throw new RangeError('すでに達成しています。');
   if(action==='check'){tested=true;done=chosen.size===2&&chosen.has('A')&&chosen.has('D');}
   else if(action.startsWith('pick:')&&shipments.some(x=>x.id===action.slice(5))){const item=action.slice(5);if(chosen.has(item))chosen.delete(item);else chosen.add(item);tested=false;}
   else throw new RangeError('荷物を選び直してください。');
  }
  return {done,tested,chosen:[...chosen]};
 }
 const pairs={A:'10',B:'20',C:'10',D:'10'},chosen={};
 for(const action of history){const [item,dest,...extra]=action.split(':');if(extra.length||!Object.hasOwn(pairs,item)||pairs[item]!==dest||chosen[item])throw new RangeError('荷物の届け先番号と、届け先の番号を比べましょう。');chosen[item]=dest;}
 return {done:Object.keys(chosen).length===4,chosen};
}
export function validExpansionDrafts(drafts){if(!drafts||typeof drafts!=='object'||Array.isArray(drafts))return false;try{return Object.entries(drafts).every(([id,history])=>{expansionReplay(id,history);return true;});}catch{return false;}}
