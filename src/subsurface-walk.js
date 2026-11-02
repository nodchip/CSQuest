export const subLevel={id:'ruin-subsurface-walk',number:'883',kind:'subsurface-walk',name:'石の中を巡る光',tag:'表面下散乱',title:'光が出てくる場所を探そう',story:'祭壇の光が白い石へ入りました。石の内側での散乱と吸収を追い、どの場所から出るか調べましょう。'};
export const subEvents={up:'上へ散乱',down:'下へ散乱',left:'左へ散乱',right:'右へ散乱',absorb:'吸収'};
export function subReplay(actions){
 if(!Array.isArray(actions)||actions.length>3)throw new RangeError('経路が不正です。');let x=1,z=0,status='active';const history=[];
 for(const event of actions){if(status!=='active'||!Object.hasOwn(subEvents,event))throw new RangeError('この経路には続けられません。');
  if(event==='absorb')status='absorbed';else if(event==='up'&&z===0)status=x===1?'same':'other';else if(event==='up')z--;else if(event==='down')z=Math.min(1,z+1);else if(event==='left')x=Math.max(0,x-1);else if(event==='right')x=Math.min(2,x+1);
  history.push({event,x,z,status});
 }
 if(status==='active'&&actions.length===3)status='unresolved';return {x,z,status,history,done:status!=='active'};
}
export function subEnumeration(){const counts={same:0,other:0,absorbed:0,unresolved:0},events=Object.keys(subEvents);for(const a of events)for(const b of events)for(const c of events){const actions=[];for(const event of [a,b,c]){if(subReplay(actions).done)break;actions.push(event);}counts[subReplay(actions).status]++;}return counts;}
export function subCreate(){return {mode:'surface',surfaceDone:false,actions:[],seen:[],difference:null,truncation:null};}
export function subAdvance(q,event){if(subReplay(q.actions).done)throw new RangeError('経路を最初に戻してください。');const actions=[...q.actions,event],result=subReplay(actions);q.actions=actions;if(result.done&&!q.seen.includes(result.status))q.seen.push(result.status);}
export function subComplete(q){return q.surfaceDone&&['same','other','absorbed','unresolved'].every(s=>q.seen.includes(s))&&q.difference==='spread'&&q.truncation==='unknown';}
export function subRestore(q){if(!q||!['surface','inside'].includes(q.mode)||typeof q.surfaceDone!=='boolean'||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!['same','other','absorbed','unresolved'].includes(x))||![null,'spread','same','always'].includes(q.difference)||![null,'unknown','absorb','exit'].includes(q.truncation))throw new RangeError('記録が不正です。');subReplay(q.actions);return {mode:q.mode,surfaceDone:q.surfaceDone,actions:[...q.actions],seen:[...q.seen],difference:q.difference,truncation:q.truncation};}
