export const hazardScheduleLevel={id:'forge-hazard-scheduler',number:'1296',kind:'hazard-scheduler',name:'二人の精霊と回収の順番',tag:'並行実行と回収延期',title:'操作の順番を組み立てよう',story:'札を読む精霊と回収する精霊が別々に動きます。どちらを先に進めるか選び、目印と再確認の役割を調べましょう。'};
export const hazardScheduleModes={unsafe:'目印を使わない',safe:'目印と再確認を使う'};
export const hazardScheduleActions={read:'読み手：先頭を覚える',publish:'読み手：目印を出す',validate:'読み手：先頭を再確認',touch:'読み手：札を読む',discard:'読み手：古い参照を捨てる',clear:'読み手：目印を消す',retire:'回収係：先頭を外す',scan:'回収係：目印を調べる'};
export function hazardScheduleReplay(mode,history){
 if(!Object.hasOwn(hazardScheduleModes,mode)||!Array.isArray(history)||history.length>10)throw new RangeError('操作記録が不正です。');
 const s={reader:'start',head:'A',hazard:false,retired:false,freed:false,deferred:false,freedBeforePublish:false,touch:null,lastScan:null,message:'読み手が札Ａを覚えるところから始めます。'};
 for(const a of history){
  if(a==='read'&&s.reader==='start'&&s.head==='A'){s.reader='read';s.message='読み手は札Ａの位置を覚えました。';}
  else if(a==='publish'&&mode==='safe'&&s.reader==='read'){s.freedBeforePublish=s.freed;s.hazard=true;s.reader='published';s.message='札Ａを使う可能性を公表しました。まだ札は読めません。';}
  else if(a==='validate'&&mode==='safe'&&s.reader==='published'){s.reader=s.head==='A'?'valid':'stale';s.message=s.reader==='valid'?'先頭はまだＡです。':'先頭は変わりました。古い参照を捨てます。';}
  else if(a==='touch'&&(mode==='unsafe'&&s.reader==='read'||mode==='safe'&&s.reader==='valid')){s.touch=s.freed?'unsafe':'safe';s.reader=mode==='safe'?'used':'done';s.message=s.freed?'既に回収済みです。危険なので実際には触れません。':'回収されていない札を読みました。';}
  else if(a==='discard'&&mode==='safe'&&s.reader==='stale'){s.hazard=false;s.reader='done';s.message='古い参照と目印を捨てました。';}
  else if(a==='clear'&&mode==='safe'&&s.reader==='used'){s.hazard=false;s.reader='done';s.message='読み終えて目印を消しました。';}
  else if(a==='retire'&&s.reader!=='start'&&s.head==='A'){s.head='B';s.retired=true;s.message='Ａを先頭から外し、回収待ちにしました。';}
  else if(a==='scan'&&s.retired&&!s.freed&&s.lastScan!==String(s.hazard)){s.lastScan=String(s.hazard);if(s.hazard){s.deferred=true;s.message='目印があるため回収を延期しました。';}else{s.freed=true;s.retired=false;s.message='目印がないため、この模型では札を回収しました。';}}
  else throw new RangeError('各精霊の状態と、次にできる操作を確かめましょう。');
 }
 return s;
}
export function hazardScheduleOutcome(mode,s){if(mode==='unsafe'&&s.touch==='unsafe')return 'unsafe';if(mode==='safe'&&s.touch==='safe'&&s.deferred&&s.reader==='done'&&s.freed)return 'protected';if(mode==='safe'&&s.freedBeforePublish&&s.reader==='done'&&s.touch===null)return 'late';return null;}
export function hazardScheduleCreate(){return {mode:'unsafe',history:[],seen:{unsafe:false,protected:false,late:false},reflection:null};}
export function hazardScheduleAct(q,action){const history=[...q.history,action],state=hazardScheduleReplay(q.mode,history);q.history=history;return state;}
export function hazardScheduleRecord(q){const outcome=hazardScheduleOutcome(q.mode,hazardScheduleReplay(q.mode,q.history));if(!outcome)throw new RangeError('まだ指定された結果に達していません。目印・再確認・回収の状態を調べましょう。');q.seen[outcome]=true;return outcome;}
export function hazardScheduleDone(q){return Object.values(q.seen).every(Boolean)&&q.reflection==='recheck';}
export function hazardScheduleRestore(q){if(!q||!Object.hasOwn(hazardScheduleModes,q.mode)||!q.seen||!['unsafe','protected','late'].every(k=>typeof q.seen[k]==='boolean')||![null,'recheck','publish'].includes(q.reflection))throw new RangeError('途中記録が不正です。');hazardScheduleReplay(q.mode,q.history);return {mode:q.mode,history:[...q.history],seen:{unsafe:q.seen.unsafe,protected:q.seen.protected,late:q.seen.late},reflection:q.reflection};}
