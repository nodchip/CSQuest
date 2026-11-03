export const sharedOwnershipLevel={id:'forge-shared-ownership',number:'1003',kind:'shared-ownership',name:'共有札の所有権',tag:'並行処理・参照管理',title:'札の所有権を確保しよう',story:'書記が共有の札を読み、回収係が共有欄から札を外します。参照を取る順番を比べましょう。'};
export const ownershipCases={raw:{name:'生の参照を後で確保'},locked:{name:'鍵で取得を守る'},before:{name:'一体の取得が先'},after:{name:'共有欄から外れた後'}};
export const ownershipActions={lock:'読み手が鍵を取る',read:'読み手が生の参照を見る',retain:'読み手が所有権を増やす',unlock:'読み手が鍵を返す',remove:'回収係が共有欄から外す',acquire:'欄の読取りと所有権取得を一体で行う',touch:'所有した札を読む',release:'読み手が所有権を返す'};
const plans={raw:['read','remove','retain'],locked:['lock','read','retain','unlock','remove','touch','release'],before:['acquire','remove','touch','release'],after:['remove','acquire']};
export function ownershipInitial(id){if(!Object.hasOwn(ownershipCases,id))throw new RangeError('不正な場面');return {id,index:0,slot:true,count:1,freed:false,lock:false,raw:false,owned:false,empty:false,unsafe:false,touched:false,message:'共有欄は札Ａを一つ所有しています。'};}
function applyOwnership(s,action){if(action!==plans[s.id][s.index])throw new RangeError('次に行う仕事を確かめましょう。');
 if(action==='lock'){s.lock=true;s.message='読み手が鍵を取りました。この間、回収係は共有欄を変更できません。';}
 else if(action==='read'){s.raw=true;s.message='読み手は札の位置を見ましたが、まだ所有権はありません。';}
 else if(action==='retain'){if(s.freed){s.unsafe=true;s.message='最後の所有権が既に返され、札は回収済みです。生の参照からの取得は危険なので実行しません。';}else{s.count++;s.owned=true;s.message='回収前に所有権を取得しました。';}}
 else if(action==='unlock'){s.lock=false;s.message='読み手が鍵を返しました。';}
 else if(action==='remove'){s.slot=false;s.count--;if(s.count===0)s.freed=true;s.message=s.freed?'共有欄の最後の所有権が返され、この模型では回収が完了しました。':'共有欄の所有権を返しました。読み手がまだ所有しています。';}
 else if(action==='acquire'){if(s.slot){s.count++;s.owned=true;s.message='欄の読取りと所有権取得を一体で行い、札を所有しました。';}else{s.empty=true;s.message='共有欄は空なので、所有権を取得せず空の結果を受け取りました。';}}
 else if(action==='touch'){s.touched=true;s.message='所有権を持っている間に札を読みました。';}
 else if(action==='release'){s.owned=false;s.count--;if(s.count===0)s.freed=true;s.message='読み手が最後の所有権を返し、この模型では回収が完了しました。';}
 s.index++;return s;
}
export function ownershipReplay(id,history){if(!Array.isArray(history)||history.length>7)throw new RangeError('不正な履歴');const s=ownershipInitial(id);for(const action of history)applyOwnership(s,action);return s;}
export function ownershipStep(id,history,action){const s=ownershipReplay(id,history);try{applyOwnership(s,action);return {ok:true,history:[...history,action],message:s.message};}catch{return {ok:false,history:[...history],message:'この場面の順番と、鍵・所有権の状態を確認しましょう。'};}}
export function ownershipDone(id,history){return ownershipReplay(id,history).index===plans[id].length;}
export function ownershipCreate(){return {selected:'raw',trials:Object.fromEntries(Object.keys(ownershipCases).map(id=>[id,[]])),reflection:null};}
export function ownershipComplete(s){return s.reflection==='acquire'&&Object.keys(ownershipCases).every(id=>ownershipDone(id,s.trials[id]));}
export function ownershipRestore(saved){if(!saved||!Object.hasOwn(ownershipCases,saved.selected)||![null,'acquire','count','forever'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=ownershipCreate();s.selected=saved.selected;s.reflection=saved.reflection;for(const id of Object.keys(ownershipCases)){ownershipReplay(id,saved.trials?.[id]);s.trials[id]=[...saved.trials[id]];}return s;}
