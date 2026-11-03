export const orderFaultLevel={id:'village-order-fault-journey',number:'1043',kind:'order-fault-journey',name:'二つの台帳と止まる時計',tag:'順序・複製・障害',title:'依頼の順序と故障を調べる',story:'二人の係と二つの村の台帳で、順番、伝達の遅れ、装置の停止を調べましょう。'};
export const orderFaultCases={serial:{name:'順番に処理し停止から再開',description:'二人の加算を順番に終え、停止と再開を試す'},race:{name:'重なった二人の加算',description:'二人が先に読んだ後で書き、更新の消失を観察する'},replica:{name:'遅れる複製と片方の停止',description:'更新前の複製を読み、同期後に主台帳を停止して複製を読む'}};
export const orderFaultActions={readA:'Ａが読む',readB:'Ｂが読む',writeA:'Ａが書く',writeB:'Ｂが書く',crash:'装置を停止',recover:'装置を再開',primary:'主台帳を１に更新',readReplica:'複製を読む',sync:'複製へ届ける',failPrimary:'主台帳を停止'};
export function orderFaultState(id,history){if(!Object.hasOwn(orderFaultCases,id)||!Array.isArray(history)||history.length>20)throw new RangeError('履歴が不正です。');const s={value:0,local:{A:null,B:null},written:{A:false,B:false},up:true,crashed:false,recovered:false,primary:0,replica:0,primaryUp:true,updated:false,staleSeen:false,synced:false,survivorSeen:false,trace:[]};for(const a of history){if(!Object.hasOwn(orderFaultActions,a))throw new RangeError('行動が不正です。');if(id!=='replica'&&['readA','readB'].includes(a)&&s.up){const who=a.at(-1),other=who==='A'?'B':'A';if(s.local[who]!==null||(id==='serial'&&s.local[other]!==null&&!s.written[other]))throw new RangeError('まだ読めません。');s.local[who]=s.value;}
 else if(id!=='replica'&&['writeA','writeB'].includes(a)&&s.up){const who=a.at(-1);if(s.local[who]===null||s.written[who])throw new RangeError('まだ書けません。');s.value=s.local[who]+1;s.written[who]=true;}
 else if(id==='serial'&&a==='crash'&&s.up&&s.written.A&&s.written.B&&!s.crashed){s.up=false;s.crashed=true;s.value=null;}
 else if(id==='serial'&&a==='recover'&&!s.up&&s.crashed&&!s.recovered){s.up=true;s.recovered=true;s.value=0;}
 else if(id==='replica'&&a==='primary'&&s.primaryUp&&!s.updated){s.primary=1;s.updated=true;}
 else if(id==='replica'&&a==='readReplica'&&s.updated&&!s.synced&&!s.staleSeen){s.staleSeen=true;}
 else if(id==='replica'&&a==='sync'&&s.primaryUp&&s.staleSeen&&!s.synced){s.replica=s.primary;s.synced=true;}
 else if(id==='replica'&&a==='failPrimary'&&s.primaryUp&&s.synced){s.primaryUp=false;}
 else if(id==='replica'&&a==='readReplica'&&!s.primaryUp&&s.synced&&!s.survivorSeen){s.survivorSeen=true;}
 else throw new RangeError('前の操作が必要です。');s.trace.push(a);}s.done=id==='serial'?s.recovered:id==='race'?s.written.A&&s.written.B&&s.value===1:s.survivorSeen;return s;}
export function orderFaultCreate(){return {case:'serial',runs:Object.fromEntries(Object.keys(orderFaultCases).map(k=>[k,{history:[],checked:false}])),reflection:null};}
export function orderFaultStep(q,action){const r=q.runs[q.case];if(r.checked)return false;try{orderFaultState(q.case,[...r.history,action]);r.history.push(action);return true;}catch{return false;}}
export function orderFaultCheck(q){const r=q.runs[q.case];if(!orderFaultState(q.case,r.history).done)return false;r.checked=true;return true;}
export function orderFaultComplete(q){return Object.keys(orderFaultCases).every(k=>q.runs[k].checked)&&q.reflection==='scope';}
export function orderFaultRestore(q){if(!q||!Object.hasOwn(orderFaultCases,q.case)||!q.runs||![null,'scope','perfect','none'].includes(q.reflection))throw new RangeError('記録が不正です。');const runs={};for(const k of Object.keys(orderFaultCases)){const r=q.runs[k];if(!r||typeof r.checked!=='boolean')throw new RangeError('記録が不正です。');const s=orderFaultState(k,r.history);if(r.checked&&!s.done)throw new RangeError('達成記録が不正です。');runs[k]={history:[...r.history],checked:r.checked};}return {case:q.case,runs,reflection:q.reflection};}
