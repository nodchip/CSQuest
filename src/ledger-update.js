export const ledgerUpdateLevel={id:'archive-ledger-update',number:'1073',kind:'ledger-update',name:'更新前に確かめる薬草台帳',tag:'条件付き更新と制約',title:'台帳の変更を安全に試す',story:'薬師の台帳の束数を直します。対象の条件と変更を選び、結果を確かめてから確定しましょう。'};
export const ledgerFilters={lt2:'束数が２未満',eqnull:'束数が NULL と等しい',isnull:'束数が NULL である',all:'条件なし（全行）',ge3:'束数が３以上'};
export const ledgerOperations={plus1:'束数に１を足す',zero:'束数を０にする',minus2:'束数から２を引く'};
export const ledgerMissions=[{name:'増加する札を選ぶ',goal:'全行への加算を取り消してから、２未満の束数だけに１を足す。',target:[3,2,1,null]}, {name:'不明な束数を埋める',goal:'NULL との等値比較を試して取り消し、NULL の行だけ０にする。',target:[3,1,0,0]}, {name:'負数を防ぐ',goal:'全行から２を引くと制約に違反することを確かめ、３以上の行だけ２を引く。',target:[1,1,0,null]}];
export function ledgerUpdate(values,filter,operation){
 if(!Array.isArray(values)||values.length!==4||!values.every(x=>x===null||(Number.isInteger(x)&&x>=0))||!Object.hasOwn(ledgerFilters,filter)||!Object.hasOwn(ledgerOperations,operation))throw new RangeError('更新条件が不正です。');
 const match=x=>filter==='all'||filter==='isnull'&&x===null||filter==='lt2'&&x!==null&&x<2||filter==='ge3'&&x!==null&&x>=3;
 let matched=0;const next=values.map(x=>{if(!match(x))return x;matched++;return operation==='zero'?0:x===null?null:operation==='plus1'?x+1:x-2;});
 return next.some(x=>x!==null&&x<0)?{ok:false,matched,values:[...values]}:{ok:true,matched,values:next};
}
export function ledgerReplay(index,events){
 const mission=ledgerMissions[index];if(!mission||!Array.isArray(events)||events.length>24)throw new RangeError('変更記録が不正です。');
 let values=[3,1,0,null],pending=null,proof=false,committed=false;
 for(const event of events){
  if(!event||typeof event!=='object'||committed)throw new RangeError('変更記録が不正です。');
  if(event.type==='preview'){
   if(pending)throw new RangeError('先に確定か取消しを選びましょう。');const result=ledgerUpdate(values,event.filter,event.operation);
   if(result.ok)pending={...result,filter:event.filter,operation:event.operation};else if(index===2&&event.filter==='all'&&event.operation==='minus2')proof=true;
  }else if(event.type==='rollback'){
   if(!pending)throw new RangeError('取り消す変更がありません。');
   if(index===0&&pending.filter==='all'&&pending.operation==='plus1'||index===1&&pending.filter==='eqnull'&&pending.operation==='zero')proof=true;
   pending=null;
  }else if(event.type==='commit'){
   if(!pending)throw new RangeError('確定する変更がありません。');values=[...pending.values];pending=null;committed=true;
  }else throw new RangeError('操作が不正です。');
 }
 return {values,pending,proof,committed,done:committed&&proof&&values.every((x,i)=>x===mission.target[i])};
}
export function ledgerAppend(index,history,event){
 const state=ledgerReplay(index,history);
 let base=history;
 if(history.length>=24&&!state.committed){
  // Before commit the stored values are unchanged. Preserve the required
  // observation and any pending preview, not the discarded experiments.
  base=state.proof?index===0?[{type:'preview',filter:'all',operation:'plus1'},{type:'rollback'}]:index===1?[{type:'preview',filter:'eqnull',operation:'zero'},{type:'rollback'}]:[{type:'preview',filter:'all',operation:'minus2'}]:[];
  if(state.pending)base.push({type:'preview',filter:state.pending.filter,operation:state.pending.operation});
 }
 const next=[...base,event];ledgerReplay(index,next);return next;
}
export function ledgerCreate(){return {current:0,filter:'all',operation:'plus1',histories:[[],[],[]],reflection:null};}
export function ledgerDone(q){return q.histories.every((h,i)=>ledgerReplay(i,h).done)&&q.reflection==='unknown';}
export function ledgerRestore(q){
 if(!q||![0,1,2].includes(q.current)||!Object.hasOwn(ledgerFilters,q.filter)||!Object.hasOwn(ledgerOperations,q.operation)||!Array.isArray(q.histories)||q.histories.length!==3||![null,'unknown','equal'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 const histories=q.histories.map((h,i)=>{ledgerReplay(i,h);return h.map(x=>({...x}));});return {...q,histories};
}
