export const openOsLevel={id:'archive-open-os-history',number:'857',kind:'open-os-history',name:'開かれた核の年代記',tag:'Linux の歴史とサポート',title:'三枚の記録と三つの契約',story:'書庫で基本ソフトの古い記録が見つかりました。出来事を並べ、村ごとの条件に合う更新と支援を選びましょう。'};
export const openOsEvents={gnu:{name:'GNU 計画の発表',year:1983},linux:{name:'Linux 0.01 の公開',year:1991},gpl:{name:'Linux の GNU 条件への移行',year:1992}};
export const openOsOrder=['gnu','linux','gpl'];
export const openOsPlans={community:{name:'共同体版',source:true,cost:0,response:false,tool:false},support:{name:'支援契約付き版',source:true,cost:6,response:true,tool:false},proprietary:{name:'専用版',source:false,cost:6,response:false,tool:true}};
export const openOsCases={budget:{name:'小さな工房',description:'予算０。ソースを調べたいが、応答の約束は求めない。',correct:'community'},service:{name:'診療所の記録係',description:'ソースを調べられ、２日以内の問い合わせ応答が必要。予算６を使える。',correct:'support'},tool:{name:'専用台帳の書庫',description:'専用版でしか動かない架空の台帳が必須。予算６を使える。',correct:'proprietary'}};
export function openOsCreate(){return {order:[],timelineChecked:false,trials:Object.fromEntries(Object.keys(openOsCases).map(id=>[id,{choice:null,checked:false}])),open:null,service:null};}
export function openOsTimelineCorrect(order){return Array.isArray(order)&&order.length===openOsOrder.length&&order.every((id,i)=>id===openOsOrder[i]);}
export function openOsAdd(q,id){if(!Object.hasOwn(openOsEvents,id)||q.order.includes(id)||q.order.length>=3)return false;q.order.push(id);q.timelineChecked=false;return true;}
export function openOsCheckTimeline(q){q.timelineChecked=openOsTimelineCorrect(q.order);return q.timelineChecked;}
export function openOsCheckCase(q,id){if(!Object.hasOwn(openOsCases,id))throw new RangeError('場面が不正です。');const t=q.trials[id];t.checked=t.choice===openOsCases[id].correct;return t.checked;}
export function openOsComplete(q){return q.timelineChecked&&openOsTimelineCorrect(q.order)&&Object.entries(openOsCases).every(([id,c])=>q.trials[id].checked&&q.trials[id].choice===c.correct)&&q.open==='review'&&q.service==='response';}
export function openOsRestore(q){
 if(!q||!Array.isArray(q.order)||q.order.length>3||new Set(q.order).size!==q.order.length||!q.order.every(id=>Object.hasOwn(openOsEvents,id))||typeof q.timelineChecked!=='boolean'||q.timelineChecked&&!openOsTimelineCorrect(q.order)||!q.trials||![null,'review','automatic','nobody'].includes(q.open)||![null,'response','fix','free'].includes(q.service))throw new RangeError('記録が不正です。');
 const n=openOsCreate();n.order=[...q.order];n.timelineChecked=q.timelineChecked;n.open=q.open;n.service=q.service;
 for(const [id,c] of Object.entries(openOsCases)){const t=q.trials[id];if(!t||!(t.choice===null||Object.hasOwn(openOsPlans,t.choice))||typeof t.checked!=='boolean'||t.checked&&t.choice!==c.correct)throw new RangeError('記録が不正です。');n.trials[id]={choice:t.choice,checked:t.checked};}
 return n;
}
