export const barrierLevel={id:'forge-barrier',number:'90',kind:'barrier',name:'二人の精霊の待ち合わせ',tag:'バリア同期',title:'集計の前に待ち合わせよう',story:'二人の精霊がそれぞれ宝石を用意し、合計を読み取ります。作業を進める順序を変え、待ち合わせの効果を確かめましょう。'};
export const barrierModes={free:'待ち合わせなし',barrier:'全員で待ち合わせ'};
export const workers={A:{name:'精霊 A',value:2},B:{name:'精霊 B',value:3}};
export function createBarrier(mode){if(!Object.hasOwn(barrierModes,mode))throw new RangeError('未知の方法です。');return {mode,values:{A:0,B:0},workers:{A:{phase:'write',result:null},B:{phase:'write',result:null}},history:[],waited:false,message:'精霊を選び、一段階ずつ進めましょう。'};}
export function barrierStep(state,id){
  if(!Object.hasOwn(workers,id)||state.workers[id].phase==='done')throw new RangeError('その精霊は進められません。');
  const phase=state.workers[id].phase,other=id==='A'?'B':'A';
  if(phase==='wait')return {...state,message:'もう一人が待ち合わせに着くまで進めません。'};
  const next={...state,values:{...state.values},workers:{A:{...state.workers.A},B:{...state.workers.B}},history:[...state.history,id]};
  if(phase==='write'){next.values[id]=workers[id].value;next.workers[id].phase=state.mode==='barrier'?'arrive':'read';next.message=`${workers[id].name}が ${workers[id].value} 個を用意しました。`;}
  else if(phase==='arrive'){
    if(next.workers[other].phase==='wait'){next.workers[id].phase='read';next.workers[other].phase='read';next.message='二人が待ち合わせに到着し、集計へ進めます。';}
    else {next.workers[id].phase='wait';next.waited=true;next.message=`${workers[id].name}は、もう一人を待っています。`;}
  } else if(phase==='read'){const total=next.values.A+next.values.B;next.workers[id]={phase:'done',result:total};next.message=`${workers[id].name}は合計 ${total} 個を読み取りました。`;}
  return next;
}
export function barrierCaseCorrect(id,state){if(id==='free')return Object.values(state.workers).every(w=>w.phase==='done')&&state.workers.A.result!==state.workers.B.result;if(id==='barrier')return state.waited&&Object.values(state.workers).every(w=>w.phase==='done'&&w.result===5);throw new RangeError('未知の方法です。');}
// A deliberately small visibility model, not a simulation of a particular CPU.
export const handoffModes={relaxed:'順序保証のない印',ordered:'Release / Acquire の印'};
export function handoffReplay(mode,history){
 if(!Object.hasOwn(handoffModes,mode)||!Array.isArray(history)||history.length>12)throw new RangeError('引き渡しの記録が不正です。');
 let data=0,pending=false,written=false,flag=false,observed=false,result=null;const trace=[];
 for(const action of history){
  if(action==='write'&&!written){written=true;pending=true;trace.push('Ａがデータ１を書き、一時置き場に置く');}
  else if(action==='signal'&&written&&!flag){if(mode==='ordered'){data=1;pending=false;}flag=true;trace.push(mode==='ordered'?'Ａがデータを反映して完了の印を出す':'Ａが完了の印を出す');}
  else if(action==='flush'&&pending){data=1;pending=false;trace.push('Ａのデータが共有棚に反映される');}
  else if(action==='poll'&&!observed&&result===null){if(flag){observed=true;trace.push('Ｂが完了の印１を確認');}else trace.push('Ｂは印０を見て待つ');}
  else if(action==='read'&&observed&&result===null){result=data;trace.push(`Ｂがデータ ${result} を読む`);}
  else throw new RangeError('引き渡しの順番を確認しましょう。');
 }
 return {data,pending,written,flag,observed,result,trace};
}
export function createBarrierSet(){return {selected:'free',states:{free:createBarrier('free'),barrier:createBarrier('barrier')},handoffSelected:'relaxed',handoffHistory:{relaxed:[],ordered:[]}};}
export function restoreBarrier(saved){
  if(!saved||!Object.hasOwn(barrierModes,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const result=createBarrierSet();result.selected=saved.selected;
  for(const id of Object.keys(barrierModes)){const history=saved.history[id],limit=id==='free'?4:6;if(!Array.isArray(history)||history.length>limit)throw new RangeError('途中記録が不正です。');for(const worker of history){const state=result.states[id],next=barrierStep(state,worker);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');result.states[id]=next;}}
  result.handoffSelected=saved.handoffSelected??'relaxed';if(!Object.hasOwn(handoffModes,result.handoffSelected))throw new RangeError('途中記録が不正です。');for(const mode of Object.keys(handoffModes)){const h=saved.handoffHistory?.[mode]??[];handoffReplay(mode,h);result.handoffHistory[mode]=[...h];}
  return result;
}
export function barrierComplete(value){return Object.keys(barrierModes).every(id=>barrierCaseCorrect(id,value.states[id]));}
