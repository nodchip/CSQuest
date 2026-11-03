export const teamRelayLevel={id:'village-team-relay',number:'1044',kind:'team-relay',name:'橋の相談をつなぐ',tag:'遠隔協働と未解決事項',title:'違う時間に届く意見をつなぐ',story:'橋の修理について、離れた仲間が異なる時間に相談へ参加します。事情を集め、案と残る課題を共有しましょう。'};
export const teamRelayCases={available:{name:'小舟の予約が取れた',available:true},unavailable:{name:'小舟の予約が取れない',available:false}};
export const teamRelayActions={post:'議題と記録を掲示する',hearEngineer:'技師の事情を読む',hearResident:'通行者の事情を読む',advance:'次の参加時間へ進む',hearCourier:'伝令の事情を読む',propose:'修理と小舟の案を記録',confirm:'小舟の予約と係を確認',tentative:'確認済みの案を暫定案にする',escalate:'未解決として追加相談に回す',share:'結果と次の確認を共有する'};
export function teamRelayState(id,history){if(!Object.hasOwn(teamRelayCases,id)||!Array.isArray(history)||history.length>15)throw new RangeError('履歴が不正です。');const s={posted:false,slot:0,heard:[],proposed:false,confirmed:false,decision:null,shared:false,trace:[]};for(const a of history){if(!Object.hasOwn(teamRelayActions,a))throw new RangeError('操作が不正です。');if(a==='post'&&!s.posted)s.posted=true;
 else if(a==='hearEngineer'&&s.posted&&s.slot===0&&!s.heard.includes('engineer'))s.heard.push('engineer');
 else if(a==='hearResident'&&s.posted&&s.slot===0&&!s.heard.includes('resident'))s.heard.push('resident');
 else if(a==='advance'&&s.slot===0&&s.heard.includes('engineer')&&s.heard.includes('resident'))s.slot=1;
 else if(a==='hearCourier'&&s.posted&&s.slot===1&&!s.heard.includes('courier'))s.heard.push('courier');
 else if(a==='propose'&&s.heard.length===3&&!s.proposed)s.proposed=true;
 else if(a==='confirm'&&s.proposed&&!s.confirmed)s.confirmed=true;
 else if(a==='tentative'&&s.confirmed&&teamRelayCases[id].available&&!s.decision)s.decision='tentative';
 else if(a==='escalate'&&s.confirmed&&!teamRelayCases[id].available&&!s.decision)s.decision='escalate';
 else if(a==='share'&&s.decision&&!s.shared)s.shared=true;
 else throw new RangeError('先に必要な操作があります。');s.trace.push(a);}s.done=s.shared;return s;}
export function teamRelayCreate(){return {case:'available',runs:{available:{history:[],checked:false},unavailable:{history:[],checked:false}},reflection:null};}
export function teamRelayStep(q,a){const r=q.runs[q.case];if(r.checked)return false;try{teamRelayState(q.case,[...r.history,a]);r.history.push(a);return true;}catch{return false;}}
export function teamRelayCheck(q){const r=q.runs[q.case];if(!teamRelayState(q.case,r.history).done)return false;r.checked=true;return true;}
export function teamRelayComplete(q){return Object.keys(teamRelayCases).every(k=>q.runs[k].checked)&&q.reflection==='uncertain';}
export function teamRelayRestore(q){if(!q||!Object.hasOwn(teamRelayCases,q.case)||!q.runs||![null,'uncertain','silence','everyone'].includes(q.reflection))throw new RangeError('記録が不正です。');const runs={};for(const k of Object.keys(teamRelayCases)){const r=q.runs[k];if(!r||typeof r.checked!=='boolean')throw new RangeError('記録が不正です。');const s=teamRelayState(k,r.history);if(r.checked&&!s.done)throw new RangeError('達成記録が不正です。');runs[k]={history:[...r.history],checked:r.checked};}return {case:q.case,runs,reflection:q.reflection};}
