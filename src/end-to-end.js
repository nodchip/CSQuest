export const endToEndLevel={id:'forest-end-to-end',number:'1015',kind:'end-to-end',name:'二つの村と中継塔',tag:'ネットワーク・端点と中継',title:'失われた知らせを届けよう',story:'二つの村が中継塔を通じて知らせを交わします。途中で手紙や返事が消えたとき、誰が何を覚えているか調べましょう。'};
export const endToEndCases={data:{name:'最初の手紙が消える'},ack:{name:'最初の返事が消える'}};
export const endToEndActions={send:'端点Ａが手紙を送る',hop:'次の区間へ進める',timeout:'返事を待つ時間が切れる'};
export function endToEndInitial(id){if(!Object.hasOwn(endToEndCases,id))throw new RangeError('不正な場面');return {id,phase:'ready',attempt:0,packet:null,delivered:0,arrivals:0,dropped:false,acknowledged:false,message:'端点Ａが手紙を送ります。'};}
function apply(s,action){if(action==='send'&&s.phase==='ready'&&!s.packet){s.attempt++;s.phase='waiting';s.packet={kind:'data',at:0};s.message=`Ａが同じ番号の手紙を送信しました（${s.attempt}回目）。`;}
 else if(action==='hop'&&s.packet){const p=s.packet;if(p.kind==='data'){if(s.id==='data'&&s.attempt===1&&p.at===2&&!s.dropped){s.packet=null;s.dropped=true;s.message='中継塔２からＢへ向かう手紙が消えました。Ａは返事を待っています。';}else if(p.at===2){s.arrivals++;if(s.delivered===0){s.delivered=1;s.message='Ｂは手紙を初めて受け取り、返事を出しました。';}else s.message='Ｂは同じ番号の再送と判断し、二重に届けず返事を出しました。';s.packet={kind:'ack',at:3};}else{p.at++;s.message=`手紙が${p.at===1?'中継塔１':'中継塔２'}に届きました。`;}}
 else if(s.id==='ack'&&s.attempt===1&&p.at===1&&!s.dropped){s.packet=null;s.dropped=true;s.message='中継塔１からＡへ向かう返事が消えました。Ｂは手紙を受け取っています。';}else if(p.at===1){s.packet=null;s.acknowledged=true;s.phase='done';s.message='Ａは返事を受け取り、送信が完了しました。';}else{p.at--;s.message=`返事が${p.at===2?'中継塔２':'中継塔１'}に届きました。`;}}
 else if(action==='timeout'&&s.phase==='waiting'&&!s.packet){s.phase='ready';s.message='Ａは返事を受け取れなかったため、同じ手紙を再送できます。';}
 else throw new RangeError('操作順が不正です');return s;}
export function endToEndReplay(id,history){if(!Array.isArray(history)||history.length>15)throw new RangeError('不正な記録');const s=endToEndInitial(id);for(const a of history){if(typeof a!=='string')throw new RangeError('不正な操作');apply(s,a);}return s;}
export function endToEndStep(id,history,action){const s=endToEndReplay(id,history);try{apply(s,action);return {ok:true,history:[...history,action],message:s.message};}catch{return {ok:false,history:[...history],message:'手紙の位置、Ａの待機状態と返事の有無を確認しましょう。'};}}
export function endToEndDone(id,history){return endToEndReplay(id,history).phase==='done';}
export function endToEndCreate(){return {selected:'data',trials:{data:[],ack:[]},reflection:null};}
export function endToEndComplete(q){return q.reflection==='roles'&&Object.keys(endToEndCases).every(id=>endToEndDone(id,q.trials[id]));}
export function endToEndRestore(saved){if(!saved||!Object.hasOwn(endToEndCases,saved.selected)||![null,'roles','router','always'].includes(saved.reflection))throw new RangeError('不正な途中記録');const q=endToEndCreate();q.selected=saved.selected;q.reflection=saved.reflection;for(const id of Object.keys(endToEndCases)){endToEndReplay(id,saved.trials?.[id]);q.trials[id]=[...saved.trials[id]];}return q;}
