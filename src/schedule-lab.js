export const scheduleLabLevel={id:'forge-schedule-lab',number:'658',kind:'schedule-lab',name:'交差する精霊の試練',tag:'並行処理の試験計画',title:'宝石の記録を再現して守ろう',story:'二人の精霊が運んだ宝石の記録が、ときどき一つ消えます。行動の順序を指定して原因を再現し、鍵をつけた後も試しましょう。'};
export const schedulePaths=['AABB','ABAB','ABBA','BAAB','BABA','BBAA'];
export function runSchedule(path,locked){
 if(!schedulePaths.includes(path)||typeof locked!=='boolean')throw new RangeError('試験条件が不正です。');
 let value=0,owner=null;const local={A:null,B:null},stage={A:0,B:0},counts={A:0,B:0},pending=[],trace=[];
 const attempt=({id,step})=>{
  if(stage[id]!==step||(locked&&owner!==null&&owner!==id))return false;
  if(step===0){if(locked)owner=id;local[id]=value;stage[id]=1;trace.push(`${id} が ${value} を読む${locked?'（鍵を取る）':''}`);}
  else{value=local[id]+1;stage[id]=2;if(locked)owner=null;trace.push(`${id} が ${value} を書く${locked?'（鍵を返す）':''}`);}
  return true;
 };
 for(const id of path){const step=counts[id]++,op={id,step};if(!attempt(op)){pending.push(op);trace.push(`${id} の${step===0?'読取り':'書込み'}は待つ`);}}
 while(pending.length){const index=pending.findIndex(op=>stage[op.id]===op.step&&(!locked||owner===null||owner===op.id));if(index<0)throw new Error('待機中の操作を進められません。');attempt(pending.splice(index,1)[0]);}
 return {value,pass:value===2,trace};
}
export function createScheduleLab(){return {mode:'open',path:'AABB',seen:{open:[],locked:[]},repeated:false,report:null,answer:null,checked:false,history:[]};}
export function scheduleLabAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=128)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:{open:[...s.seen.open],locked:[...s.seen.locked]},history:[...s.history],checked:false};let message='';
 if(['mode:open','mode:locked'].includes(action)){n.mode=action.slice(5);n.report=null;message='試す仕組みを切り替えました。';}
 else if(action.startsWith('path:')&&schedulePaths.includes(action.slice(5))){n.path=action.slice(5);n.report=null;message='試す順序を選びました。';}
 else if(action==='run'){const r=runSchedule(s.path,s.mode==='locked');if(s.mode==='open'&&s.path==='ABAB'&&s.seen.open.includes('ABAB'))n.repeated=true;if(!n.seen[s.mode].includes(s.path))n.seen[s.mode].push(s.path);n.report=r;message=`記録は ${r.value} 個。期待は２個なので${r.pass?'一致':'不一致'}です。`;}
 else if(['answer:controlled','answer:repeat','answer:proof'].includes(action)){n.answer=action.slice(7);message='試験計画を選びました。';}
 else if(action==='check'){n.checked=true;message='試験記録と答えを確認しました。';}
 else return {ok:false,message:'試験条件を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreScheduleLab(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let s=createScheduleLab();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=scheduleLabAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function scheduleLabComplete(s){return schedulePaths.every(p=>s.seen.open.includes(p)&&s.seen.locked.includes(p))&&s.repeated&&s.answer==='controlled'&&s.checked;}
