export const dsmLevel={id:'forest-dsm-cache',number:'1005',kind:'dsm-cache',name:'離れた写しの約束',tag:'分散共有メモリー・整合性',title:'倉庫の写しをそろえよう',story:'離れた倉庫で一つの記録を共有するとき、写しがいつ新しくなるか調べましょう。'};
export const dsmCases={delayed:{name:'無効化が遅れる写し'},synchronous:{name:'無効化を待つ書込み'},rdma:{name:'遠隔書込みと手元の写し'}};
export const dsmActions={start:'書込みを始める',write:'記録を書き換える',read:'写しを読む',invalidate:'写しを無効化する',finish:'書込みを完了する'};
const plans={delayed:['write','read','invalidate','read'],synchronous:['start','read','invalidate','finish','read'],rdma:['write','read','invalidate','read']};
export function dsmInitial(id){if(!Object.hasOwn(dsmCases,id))throw new RangeError('不正な場面');return {id,index:0,home:0,cache:0,pending:false,complete:false,reads:[],message:'まず場面の手順を確認しましょう。'};}
function apply(s,action){if(action!==plans[s.id][s.index])throw new RangeError('操作順が不正です');
 if(action==='start'){s.pending=true;s.message='書込みは開始しましたが、まだ完了していません。';}
 if(action==='write'){s.home=1;s.complete=true;s.message='元の記録が１になりました。手元の写しはまだ０です。';}
 if(action==='invalidate'){s.cache=null;s.message='手元の写しを無効にしました。次の読取りは元の記録を取得します。';}
 if(action==='finish'){s.home=1;s.pending=false;s.complete=true;s.message='無効化を待ってから元の記録を１にし、書込みを完了しました。';}
 if(action==='read'){if(s.cache===null)s.cache=s.home;s.reads.push({value:s.cache,afterCompletion:s.complete});s.message=`読み取った値は ${s.cache}。${s.complete?'書込み完了後':'書込み完了前'}の読取りです。`;}
 s.index++;return s;}
export function dsmReplay(id,history){if(!Array.isArray(history)||history.length>5)throw new RangeError('不正な履歴');const s=dsmInitial(id);for(const action of history)apply(s,action);return s;}
export function dsmStep(id,history,action){const s=dsmReplay(id,history);try{apply(s,action);return {ok:true,history:[...history,action],message:s.message};}catch{return {ok:false,history:[...history],message:'場面の手順と、書込みが完了する時点を確認しましょう。'};}}
export function dsmDone(id,history){return dsmReplay(id,history).index===plans[id].length;}
export function dsmCreate(){return {selected:'delayed',trials:Object.fromEntries(Object.keys(dsmCases).map(id=>[id,[]])),reflection:null};}
export function dsmComplete(s){return s.reflection==='ordering'&&Object.keys(dsmCases).every(id=>dsmDone(id,s.trials[id]));}
export function dsmRestore(saved){if(!saved||!Object.hasOwn(dsmCases,saved.selected)||![null,'ordering','always','rdma'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=dsmCreate();s.selected=saved.selected;s.reflection=saved.reflection;for(const id of Object.keys(dsmCases)){dsmReplay(id,saved.trials?.[id]);s.trials[id]=[...saved.trials[id]];}return s;}
