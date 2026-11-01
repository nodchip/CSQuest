export const cancelSearchLevel={id:'forge-search-cancellation',number:'502',kind:'search-cancellation',name:'二つの探索隊と帰還の合図',tag:'並列探索と協調的な中止',title:'探索隊の帰還を確かめよう',story:'二つの探索隊が別々の道で鍵を探します。一方が鍵を見つけた時や道具が故障した時に、もう一方をどうするか比べましょう。'};
export const searchEvents={found:'Ａが鍵を発見',error:'Ａの距離計算でゼロ除算'};
export const searchPolicies={cancel:'知らせを受けたらＢに中止を依頼',continue:'Ｂの探索を続ける'};
export function searchMaxTicks(policy){if(!Object.hasOwn(searchPolicies,policy))throw new RangeError('方針が不正です。');return policy==='cancel'?3:4;}
export function searchSnapshot(event,policy,ticks){
 if(!Object.hasOwn(searchEvents,event)||!Object.hasOwn(searchPolicies,policy)||!Number.isInteger(ticks)||ticks<0||ticks>searchMaxTicks(policy))throw new RangeError('条件または時刻が不正です。');
 const aStatus=ticks<2?'searching':event==='found'?'found':'error';
 const requested=policy==='cancel'&&ticks>=2;const bStatus=requested&&ticks>=3?'cancelled':policy==='continue'&&ticks>=4?'found':'searching';
 const aWork=Math.min(ticks,2),bWork=Math.min(ticks,policy==='cancel'?2:4);
 return {aStatus,bStatus,requested,aWork,bWork,cleanup:bStatus==='cancelled',solution:aStatus==='found'||bStatus==='found',error:aStatus==='error',finished:aStatus!=='searching'&&bStatus!=='searching'};
}
export function createCancelSearch(){return {event:'found',policy:'cancel',trials:Object.fromEntries(Object.keys(searchEvents).map(e=>[e,Object.fromEntries(Object.keys(searchPolicies).map(p=>[p,{ticks:0,guess:null,checked:false}]))])),answer:null,checked:false};}
export function cancelSearchTrialComplete(event,policy,t){return t.checked&&searchSnapshot(event,policy,t.ticks).finished&&t.guess===(policy==='cancel'?'cancelled':'found');}
export function cancelSearchComplete(s){return Object.keys(searchEvents).every(e=>Object.keys(searchPolicies).every(p=>cancelSearchTrialComplete(e,p,s.trials[e][p])))&&s.answer==='cooperate'&&s.checked;}
export function restoreCancelSearch(s){if(!s||!Object.hasOwn(searchEvents,s.event)||!Object.hasOwn(searchPolicies,s.policy)||!s.trials||![null,'cooperate','instant','error'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createCancelSearch();n.event=s.event;n.policy=s.policy;n.answer=s.answer;n.checked=s.checked;for(const e of Object.keys(searchEvents))for(const p of Object.keys(searchPolicies)){const t=s.trials[e]?.[p];if(!t||![null,'cancelled','found'].includes(t.guess)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');searchSnapshot(e,p,t.ticks);n.trials[e][p]={ticks:t.ticks,guess:t.guess,checked:t.checked};}return n;}
