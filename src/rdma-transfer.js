export const rdmaLevel={id:'forest-rdma-transfer',number:'1004',kind:'rdma-transfer',name:'離れた倉庫の書込み',tag:'分散メモリー・RDMA',title:'離れた記録へ届けよう',story:'二つの倉庫が同じ品物の記録を届け合います。伝言と登録された領域への転送を比べましょう。'};
export const rdmaCases={message:{name:'伝言で届ける',kind:'message'},write:{name:'登録領域に書く',kind:'write',key:'current',address:1,permission:'write'},key:{name:'古い鍵',kind:'write',key:'old',address:1,permission:'write'},range:{name:'登録範囲をはみ出す',kind:'write',key:'current',address:0,permission:'write'},permission:{name:'読取り専用',kind:'write',key:'current',address:1,permission:'read'}};
export const rdmaActions={post:'送信側が依頼する',transfer:'転送を完了する',inspect:'送信側が結果を確認する',notify:'別の知らせを送る',process:'受信側が処理する'};
const plans={message:['post','transfer','process','inspect'],write:['post','transfer','inspect','notify','process'],key:['post','transfer','inspect'],range:['post','transfer','inspect'],permission:['post','transfer','inspect']};
export function rdmaAllowed(c){return c.kind==='write'&&c.key==='current'&&c.permission==='write'&&c.address>=1&&c.address+2<=3;}
export function rdmaInitial(id){if(!Object.hasOwn(rdmaCases,id))throw new RangeError('不正な場面');return {id,index:0,posted:false,complete:false,success:null,remote:[0,0,0,0],mailbox:false,notice:false,consumed:false,message:'依頼を出します。'};}
function applyRdma(s,action){const c=rdmaCases[s.id];if(action!==plans[s.id][s.index])throw new RangeError('操作順が不正です');
 if(action==='post'){s.posted=true;s.message='送信側が依頼しました。まだ転送は完了していません。';}
 else if(action==='transfer'){s.complete=true;if(c.kind==='message'){s.success=true;s.mailbox=true;s.message='伝言は受信箱に届きました。受信側はまだ記録に反映していません。';}else if(rdmaAllowed(c)){s.success=true;s.remote[1]=7;s.remote[2]=8;s.message='登録領域への書込みが完了しました。受信側のアプリへの通知はまだありません。';}else{s.success=false;s.message='鍵、範囲、書込み権限の条件を満たさず、この模型では書込みに失敗しました。';}}
 else if(action==='inspect')s.message=s.success?'送信側は完了を確認しました。受信側が処理したかどうかは別です。':'送信側は失敗を確認しました。遠隔の記録は変更されていません。';
 else if(action==='notify'){s.notice=true;s.message='別の知らせを受信側に届けました。';}
 else if(action==='process'){if(c.kind==='message'){s.remote[1]=7;s.remote[2]=8;s.mailbox=false;}s.consumed=true;s.message='受信側が記録を処理しました。';}
 s.index++;return s;
}
export function rdmaReplay(id,history){if(!Array.isArray(history)||history.length>5)throw new RangeError('不正な履歴');const s=rdmaInitial(id);for(const action of history)applyRdma(s,action);return s;}
export function rdmaStep(id,history,action){const s=rdmaReplay(id,history);try{applyRdma(s,action);return {ok:true,history:[...history,action],message:s.message};}catch{return {ok:false,history:[...history],message:'この場面の依頼、転送、結果の確認の順を確かめましょう。'};}}
export function rdmaDone(id,history){return rdmaReplay(id,history).index===plans[id].length;}
export function rdmaCreate(){return {selected:'message',trials:Object.fromEntries(Object.keys(rdmaCases).map(id=>[id,[]])),reflection:null};}
export function rdmaComplete(s){return s.reflection==='distinguish'&&Object.keys(rdmaCases).every(id=>rdmaDone(id,s.trials[id]));}
export function rdmaRestore(saved){if(!saved||!Object.hasOwn(rdmaCases,saved.selected)||![null,'distinguish','notify','anywhere'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=rdmaCreate();s.selected=saved.selected;s.reflection=saved.reflection;for(const id of Object.keys(rdmaCases)){rdmaReplay(id,saved.trials?.[id]);s.trials[id]=[...saved.trials[id]];}return s;}
