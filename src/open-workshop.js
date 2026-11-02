export const openWorkshopLevel={id:'guild-open-workshop',number:'959',kind:'open-workshop',name:'みんなの道具を分け合う',tag:'オープンソースと利用の自由',title:'道具を使い、直し、分ける',story:'村の工房が公開された設計を使って道具を直し、他の村にも届けたいと考えています。利用条件を比べましょう。'};
// Fictional terms deliberately isolate selected conditions; these are not
// complete licenses and must not be treated as OSI approval decisions.
export const openTerms={
 view:{label:'閲覧のみの条件',description:'利用と設計の閲覧は許可。改変と再配布は許可しない。'},
 noncommercial:{label:'非商用だけの条件',description:'非商用に限り利用・改変・再配布を許可。配布には表示を残し、非商用の制限も残す。'},
 permissive:{label:'表示を残す条件',description:'商用を含め利用・改変・再配布を許可。配布時に表示を残す。改変版に別の条件を付けることも許可。'},
 reciprocal:{label:'同じ条件で分ける条件',description:'商用を含め利用・改変・再配布を許可。配布時に表示を残し、改変版も同じ条件で許可する。'}
};
export const openActions={study:'設計を読む',shop:'店で使う',modify:'非商用で自分のために改変する',share:'非商用で表示と元の条件を保ち改変版を無料配布する',sell:'表示と元の条件を保ち改変版を販売する',omit:'表示を外して改変版を配る',relicense:'表示を残し別の条件で配る。非商用制限があれば外す'};
export function openOutcome(term,action){
 if(!Object.hasOwn(openTerms,term)||!Object.hasOwn(openActions,action))throw new RangeError('条件が不正です。');
 if(action==='study')return {allowed:true,reason:'４つとも設計の閲覧を許可しています。'};
 if(action==='shop')return term==='noncommercial'?{allowed:false,reason:'この条件では商用利用を許可していません。'}:{allowed:true,reason:'この例の条件は店での利用を禁止していません。'};
 if(term==='view')return {allowed:false,reason:'この条件は改変と再配布を許可していません。'};
 if(action==='modify'||action==='share')return {allowed:true,reason:'この例では非商用の改変や、表示と元の条件を保つ無料配布を許可しています。'};
 if(action==='sell')return term==='noncommercial'?{allowed:false,reason:'この条件では商用の販売を許可していません。'}:{allowed:true,reason:'この例では表示と元の条件を保つ販売を許可しています。'};
 if(action==='omit')return {allowed:false,reason:'この例の配布条件では表示を残す必要があります。'};
 return term==='permissive'?{allowed:true,reason:'この例の条件は表示を残した別条件での配布を許可します。'}:{allowed:false,reason:'この例では元の制限または条件を残す必要があります。'};
}
export const openRequired=['view:study','view:modify','noncommercial:shop','noncommercial:sell','permissive:sell','reciprocal:sell','permissive:relicense','reciprocal:relicense','reciprocal:omit'];
export function openCreate(){return {term:'view',action:'study',seen:[],last:null,definition:null,obligations:null};}
export function openInspect(q){const result=openOutcome(q.term,q.action),key=`${q.term}:${q.action}`;q.last=key;if(!q.seen.includes(key))q.seen.push(key);return result;}
export function openComplete(q){return openRequired.every(k=>q.seen.includes(k))&&q.definition==='freedoms'&&q.obligations==='terms';}
export function openRestore(q){const keys=Object.keys(openTerms).flatMap(t=>Object.keys(openActions).map(a=>`${t}:${a}`));if(!q||!Object.hasOwn(openTerms,q.term)||!Object.hasOwn(openActions,q.action)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||!(q.last===null||q.seen.includes(q.last))||![null,'freedoms','visible','freeprice'].includes(q.definition)||![null,'terms','none','safe'].includes(q.obligations))throw new RangeError('記録が不正です。');return {term:q.term,action:q.action,seen:[...q.seen],last:q.last,definition:q.definition,obligations:q.obligations};}
