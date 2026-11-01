export const lockGranularityLevel={id:'forge-lock-granularity',number:'630',kind:'lock-granularity',name:'二つの棚と鍵の範囲',tag:'ロックの粒度',title:'棚の鍵を使い分けよう',story:'二人の精霊が棚の記録を更新します。一つの鍵で両棚を守る方法と、棚ごとに鍵を分ける方法を比べましょう。'};
export const granularityCases={different:{name:'別々の棚',targets:{A:'red',B:'blue'}},same:{name:'同じ棚',targets:{A:'red',B:'red'}}};
export const granularityModes={coarse:'両棚に１本の鍵',fine:'棚ごとに鍵'};
export const granularityActions={acquireA:'A が鍵を取る',acquireB:'B が鍵を取る',tick:'１刻進める',releaseA:'A が鍵を返す',releaseB:'B が鍵を返す'};
export function createGranularityTrial(mode,id){if(!Object.hasOwn(granularityModes,mode)||!Object.hasOwn(granularityCases,id))throw new RangeError('場面が不正です。');return {mode,id,time:0,workers:{A:{status:'ready',remaining:2},B:{status:'ready',remaining:2}},owners:{all:null,red:null,blue:null},history:[]};}
const lockFor=(s,who)=>s.mode==='coarse'?'all':granularityCases[s.id].targets[who];
export function granularityStep(state,action){
 if(!Object.hasOwn(granularityActions,action))return null;const s=structuredClone(state);
 if(action==='tick'){const working=['A','B'].filter(w=>s.workers[w].status==='working'&&s.workers[w].remaining>0);if(!working.length)return null;for(const w of working)s.workers[w].remaining--;s.time++;}
 else {const who=action.endsWith('A')?'A':'B',worker=s.workers[who],lock=lockFor(s,who);if(action.startsWith('acquire')){if(worker.status!=='ready')return null;if(s.owners[lock]===null){s.owners[lock]=who;worker.status='working';}else worker.status='waiting';}
 else{if(worker.status!=='working'||worker.remaining!==0||s.owners[lock]!==who)return null;worker.status='done';s.owners[lock]=null;const other=who==='A'?'B':'A';if(s.workers[other].status==='waiting'&&lockFor(s,other)===lock){s.owners[lock]=other;s.workers[other].status='working';}}}
 s.history.push(action);return s;
}
export function replayGranularity(mode,id,history){if(!Array.isArray(history)||history.length>20)throw new RangeError('履歴が不正です。');let s=createGranularityTrial(mode,id);for(const action of history){const next=granularityStep(s,action);if(!next)throw new RangeError('履歴が不正です。');s=next;}return s;}
export function createLockGranularity(){return {mode:'coarse',selected:'different',histories:{'coarse:different':[],'coarse:same':[],'fine:different':[],'fine:same':[]},answer:null,checked:false};}
export function granularityTrialComplete(s){const target=s.mode==='fine'&&s.id==='different'?2:4;return s.workers.A.status==='done'&&s.workers.B.status==='done'&&s.time===target;}
export function lockGranularityComplete(s){return Object.keys(granularityModes).every(m=>Object.keys(granularityCases).every(id=>granularityTrialComplete(replayGranularity(m,id,s.histories[`${m}:${id}`]))))&&s.answer==='tradeoff'&&s.checked;}
export function restoreLockGranularity(s){if(!s||!Object.hasOwn(granularityModes,s.mode)||!Object.hasOwn(granularityCases,s.selected)||!s.histories||![null,'tradeoff','always','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const r=createLockGranularity();r.mode=s.mode;r.selected=s.selected;r.answer=s.answer;r.checked=s.checked;for(const m of Object.keys(granularityModes))for(const id of Object.keys(granularityCases)){const key=`${m}:${id}`;replayGranularity(m,id,s.histories[key]);r.histories[key]=[...s.histories[key]];}return r;}
