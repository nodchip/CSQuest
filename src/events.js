import {createMvcLantern,restoreMvcLantern,mvcLanternComplete} from './mvc-lantern.js';
export const eventsLevel={id:'event-lantern',number:'92',kind:'events',name:'印を聞く灯り',tag:'イベントと処理の登録',title:'灯りに反応を教えよう',story:'精霊の灯りに太陽と月の印が届きます。印ごとの処理を登録し、出来事を受け取って順に動かしましょう。'};
export const eventCases={resetLast:{name:'最後に月',events:['sun','sun','moon'],target:0},increaseLast:{name:'最後に太陽',events:['moon','sun','sun'],target:2}};
export const eventSymbols={sun:'太陽',moon:'月'};
export const eventHandlers={none:'何もしない',increment:'灯りを１増やす',reset:'灯りを０に戻す'};
export function createEventTrial(id,handlers={sun:'none',moon:'none'}){
  if(!Object.hasOwn(eventCases,id)||!handlers||Object.keys(eventSymbols).some(s=>!Object.hasOwn(eventHandlers,handlers[s])))throw new RangeError('登録が不正です。');
  return {id,handlers:{sun:handlers.sun,moon:handlers.moon},sent:0,queue:[],value:0,processed:[],history:[],message:'印の処理を登録して、出来事を送ります。'};
}
export function eventStep(state,action){
  if(!['signal','dispatch'].includes(action))throw new RangeError('未知の操作です。');const sequence=eventCases[state.id].events;
  if(action==='signal'){
    if(state.sent>=sequence.length)return {...state,message:'送る印はもうありません。待っている出来事を処理しましょう。'};
    const symbol=sequence[state.sent];return {...state,sent:state.sent+1,queue:[...state.queue,symbol],history:[...state.history,action],message:`${eventSymbols[symbol]}の出来事を待ち行列に加えました。`};
  }
  if(!state.queue.length)return {...state,message:'待っている出来事はありません。先に印を送りましょう。'};
  const [symbol,...queue]=state.queue,handler=state.handlers[symbol],value=handler==='increment'?state.value+1:handler==='reset'?0:state.value;
  return {...state,queue,value,processed:[...state.processed,{symbol,handler,value}],history:[...state.history,action],message:`${eventSymbols[symbol]}に「${eventHandlers[handler]}」を実行し、灯りは ${value} になりました。`};
}
export function eventTrialDone(state){return state.sent===eventCases[state.id].events.length&&state.queue.length===0;}
export function eventTrialCorrect(state){return eventTrialDone(state)&&state.handlers.sun==='increment'&&state.handlers.moon==='reset'&&state.value===eventCases[state.id].target;}
export function createEventSet(){return {mvc:createMvcLantern(),selected:'resetLast',states:Object.fromEntries(Object.keys(eventCases).map(id=>[id,createEventTrial(id)]))};}
export function restoreEvents(saved){
  if(!saved||!Object.hasOwn(eventCases,saved.selected)||!saved.states)throw new RangeError('途中記録が不正です。');const result=createEventSet();result.mvc=restoreMvcLantern(saved.mvc);result.selected=saved.selected;
  for(const id of Object.keys(eventCases)){const item=saved.states[id];if(!item||!Array.isArray(item.history)||item.history.length>eventCases[id].events.length*2)throw new RangeError('途中記録が不正です。');let state=createEventTrial(id,item.handlers);for(const action of item.history){const next=eventStep(state,action);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}result.states[id]=state;}return result;
}
export function eventsComplete(set){return Object.values(set.states).every(eventTrialCorrect)&&mvcLanternComplete(set.mvc);}
