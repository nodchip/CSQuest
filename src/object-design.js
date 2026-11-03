export const objectDesignLevel={id:'village-object-design',number:'1108',kind:'object-design',name:'二つの薬棚の約束',tag:'オブジェクト指向の分析と設計',title:'棚ごとの状態と操作を設計する',story:'村の受付が二つの薬棚から薬草を渡します。棚ごとの数を守れるよう、持ち物と操作を設計しましょう。'};
export const objectStores={separate:'棚ごとに在庫を持つ',shared:'二つの棚で同じ在庫を使う'};
export const objectAccess={method:'棚の操作を通す',direct:'受付が数を直接変更'};
export const objectActions={takeA:'甲から１個取り出す',takeB:'乙から１個取り出す',addB:'乙へ１個補充する'};
export function objectDesignReplay(store,access,history){
 if(!Object.hasOwn(objectStores,store)||!Object.hasOwn(objectAccess,access)||!Array.isArray(history)||history.length>6)throw new RangeError('設計や履歴が不正です。');
 const counts=store==='separate'?{A:1,B:0}:{shared:1},trace=[];
 for(const action of history){if(!Object.hasOwn(objectActions,action))throw new RangeError('操作が不正です。');const which=action==='takeA'?'A':'B',key=store==='separate'?which:'shared',before=counts[key],rejected=action!=='addB'&&access==='method'&&before===0;if(action==='addB')counts[key]++;else if(!rejected)counts[key]--;trace.push({action,before,after:counts[key],rejected});}
 return {A:counts[store==='separate'?'A':'shared'],B:counts[store==='separate'?'B':'shared'],trace};
}
export function objectDesignCreate(){return {store:'separate',access:'direct',history:[],seen:[],answer:null,checked:false};}
export function objectDesignAct(q,action){const h=[...q.history,action],r=objectDesignReplay(q.store,q.access,h);q.history=h;let k=null;if(q.store==='separate'&&q.access==='direct'&&r.B<0)k='negative';if(q.store==='shared'&&q.access==='method'&&h[0]==='takeB')k='shared';if(q.store==='separate'&&q.access==='method'&&h.join(',')==='takeB,takeA,addB,takeB'&&r.trace[0].rejected&&r.A===0&&r.B===0)k='safe';if(k&&!q.seen.includes(k))q.seen.push(k);return r;}
export function objectDesignDone(q){return ['negative','shared','safe'].every(k=>q.seen.includes(k))&&q.answer==='objects'&&q.checked;}
export function objectDesignRestore(q){if(!q||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!['negative','shared','safe'].includes(k))||![null,'objects','one','direct'].includes(q.answer)||typeof q.checked!=='boolean')throw new RangeError('途中記録が不正です。');objectDesignReplay(q.store,q.access,q.history);return {...q,history:[...q.history],seen:[...q.seen]};}
