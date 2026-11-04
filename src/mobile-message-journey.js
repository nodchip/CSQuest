export const mobileMessageLevel={id:'guild-mobile-message-journey',number:'1327',kind:'mobile-message-journey',name:'伝言水晶の旅',tag:'モバイル・メッセージ・配達',title:'伝言が届くまでを追おう',story:'離れた仲間に「北門で待つ」という伝言を届けます。圏外での保留、受付、配達、既読通知を確かめましょう。'};
const messagePhases=['empty','queued','sent','delivered','read'];
const messageSeen=['queued','sent','delivered','hidden','visible'];
export function mobileMessageCreate(){return {online:false,phase:'empty',receipts:false,receiptOnRead:null,seen:[],reflection:null,checked:false};}
function mark(q,key){if(!q.seen.includes(key))q.seen.push(key);}
export function mobileMessageSend(q){if(!['empty','queued'].includes(q.phase))throw new RangeError('この伝言はすでに受付に渡しています。');if(!q.online){q.phase='queued';mark(q,'queued');return '圏外なので水晶に保留しました。';}q.phase='sent';mark(q,'sent');return '受付に渡しました。仲間の端末への配達はまだです。';}
export function mobileMessageDeliver(q){if(q.phase!=='sent')throw new RangeError('先に伝言を受付へ送りましょう。');q.phase='delivered';mark(q,'delivered');}
export function mobileMessageRead(q){if(q.phase!=='delivered')throw new RangeError('先に仲間の端末に配達しましょう。');q.phase='read';q.receiptOnRead=q.receipts;mark(q,q.receiptOnRead?'visible':'hidden');}
export function mobileMessageNext(q){if(q.phase!=='read')throw new RangeError('この伝言を読んでから次へ進みましょう。');q.phase='empty';q.receiptOnRead=null;}
export function mobileMessageDisplay(q){return {empty:'伝言なし',queued:'水晶に保留',sent:'受付済み',delivered:'配達済み',read:q.receiptOnRead?'既読通知あり':'配達済み（既読通知なし）'}[q.phase];}
export function mobileMessageDone(q){return messageSeen.every(k=>q.seen.includes(k))&&q.reflection==='limited'&&q.checked;}
export function mobileMessageRestore(q){if(!q||typeof q.online!=='boolean'||!messagePhases.includes(q.phase)||typeof q.receipts!=='boolean'||!(q.phase==='read'?typeof q.receiptOnRead==='boolean':q.receiptOnRead===null)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!messageSeen.includes(k))||![null,'limited','sent','unread'].includes(q.reflection)||typeof q.checked!=='boolean'||q.checked&&q.reflection!=='limited')throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
