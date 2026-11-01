export const schedulerRolesLevel={id:'archive-scheduler-roles',number:'625',kind:'scheduler-roles',name:'書庫と仕事の受付',tag:'スケジューラの役割',title:'仕事を受付から完了まで導こう',story:'書庫の機械には仕事の受付、作業台、待機室と円盤があります。二つの仕事を整理して届けましょう。'};
export const roleCases={arrival:{name:'ディスクは先着順',order:['A','B']},near:{name:'ディスクは近い場所から',order:['B','A']}};
export const roleActions={admitA:'長期：A を入場',admitB:'長期：B を入場',dispatchA:'短期：A に CPU',dispatchB:'短期：B に CPU',requestA:'A：ディスクを要求',requestB:'B：ディスクを要求',suspendA:'中期：待機中の A を退避',serveA:'I/O：A の要求を処理',serveB:'I/O：B の要求を処理',resumeA:'中期：A を復帰',finishA:'A：仕事を終える',finishB:'B：仕事を終える'};
export function roleSequence(id){const c=roleCases[id];if(!c)throw new RangeError('場面が不正です。');return ['admitA','dispatchA','requestA','suspendA','admitB','dispatchB','requestB',...c.order.map(x=>`serve${x}`),'resumeA','dispatchA','finishA','dispatchB','finishB'];}
export function roleReplay(id,history){
 const sequence=roleSequence(id);if(!Array.isArray(history)||history.length>sequence.length||history.some((a,i)=>a!==sequence[i]))throw new RangeError('操作履歴が不正です。');
 const state={A:'受付待ち',B:'受付待ち',cpu:'空き',pending:[],head:10,movement:0};
 for(const a of history){switch(a){
  case 'admitA':state.A='実行可能';break;case 'admitB':state.B='実行可能';break;
  case 'dispatchA':state.A='実行中';state.cpu='A';break;case 'dispatchB':state.B='実行中';state.cpu='B';break;
  case 'requestA':state.A='I/O 待ち';state.cpu='空き';state.pending.push('A');break;case 'requestB':state.B='I/O 待ち';state.cpu='空き';state.pending.push('B');break;
  case 'suspendA':state.A='退避中・I/O 待ち';break;
  case 'serveA':case 'serveB':{const name=a.slice(-1),track=name==='A'?70:12;state.movement+=Math.abs(state.head-track);state.head=track;state.pending=state.pending.filter(x=>x!==name);state[name]=name==='A'?'退避中・実行可能':'実行可能';break;}
  case 'resumeA':state.A='実行可能';break;case 'finishA':state.A='完了';state.cpu='空き';break;case 'finishB':state.B='完了';state.cpu='空き';break;
 }}
 return state;
}
export function createSchedulerRoles(){return {selected:'arrival',histories:{arrival:[],near:[]},answer:null,checked:false};}
export function schedulerRolesComplete(s){return Object.keys(roleCases).every(k=>s.histories[k].length===roleSequence(k).length)&&s.answer==='roles'&&s.checked;}
export function restoreSchedulerRoles(s){if(!s||!Object.hasOwn(roleCases,s.selected)||!s.histories||![null,'roles','same','swap'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const result=createSchedulerRoles();result.selected=s.selected;result.answer=s.answer;result.checked=s.checked;for(const id of Object.keys(roleCases)){roleReplay(id,s.histories[id]);result.histories[id]=[...s.histories[id]];}return result;}
