export const eventBatchLevel={id:'forge-event-batch-count',number:'1121',kind:'event-batch-count',name:'二つの塔の知らせを数える',tag:'イベント計数と集約',title:'知らせを数えてまとめよう',story:'甲と乙の塔に知らせが届きます。共通の帳面を毎回更新する方法と、塔ごとに数えてからまとめる方法を比べましょう。'};
export const eventBatchModes={shared:'共通の帳面を毎回更新',local:'塔ごとの小計を後でまとめる'};
export const eventBatchSequence=['A','B','A','B','A','B'];
export function eventBatchReplay(mode,history){
 if(!Object.hasOwn(eventBatchModes,mode)||!Array.isArray(history)||history.length>30)throw new RangeError('計数の記録が不正です。');
 const s={events:0,shared:0,local:{A:0,B:0},writes:0,mid:null,final:null,last:''};
 for(const action of history){
  if(action==='receive'&&s.events<6){const tower=eventBatchSequence[s.events++];if(mode==='shared'){s.shared++;s.writes++;}else s.local[tower]++;s.last=`${tower==='A'?'甲':'乙'}の塔に知らせが届きました。`;}
  else if(mode==='local'&&['flush:A','flush:B'].includes(action)){const tower=action.at(-1);if(!s.local[tower])throw new RangeError('その塔に未集約の小計はありません。');s.shared+=s.local[tower];s.local[tower]=0;s.writes++;s.last=`${tower==='A'?'甲':'乙'}の小計を共通帳面に加えました。`;}
  else if(action==='read'&&(s.events===3||s.events===6)){if(s.events===3)s.mid=s.shared;else s.final=s.shared;s.last=`共通帳面は ${s.shared} 件です。`;}
  else throw new RangeError('知らせを受け取るか、３件目・６件目で帳面を読みましょう。');
 }
 return s;
}
export function eventBatchCreate(){return {mode:'shared',runs:{shared:[],local:[]},answer:null,checked:false};}
export function eventBatchAct(q,action){const h=[...q.runs[q.mode],action],s=eventBatchReplay(q.mode,h);q.runs[q.mode]=h;return s;}
export function eventBatchDone(q){const a=eventBatchReplay('shared',q.runs.shared),b=eventBatchReplay('local',q.runs.local);return a.events===6&&a.mid===3&&a.final===6&&b.events===6&&b.mid!==null&&b.mid<3&&b.final===6&&b.writes<a.writes&&q.answer==='tradeoff'&&q.checked;}
export function eventBatchRestore(q){if(!q||!Object.hasOwn(eventBatchModes,q.mode)||!q.runs||![null,'tradeoff','instant','always'].includes(q.answer)||typeof q.checked!=='boolean')throw new RangeError('計数の記録が不正です。');const r=eventBatchCreate();r.mode=q.mode;r.answer=q.answer;r.checked=q.checked;for(const k of Object.keys(eventBatchModes)){eventBatchReplay(k,q.runs[k]);r.runs[k]=[...q.runs[k]];}return r;}
