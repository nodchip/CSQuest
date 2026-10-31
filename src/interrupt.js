export const interruptLevel={id:'workshop-interrupt',number:'105',kind:'interrupt',name:'鐘で知らせる魔導装置',tag:'ポーリングと割込み',title:'装置の完了を待つには',story:'工房の装置は３刻で宝石を磨きます。待っている精霊は作業を続けられるでしょうか。'};
export const interruptModes={poll:{name:'繰り返し状態を確認'},interrupt:{name:'完了時の鐘を待つ'}};
export function createInterruptTrial(mode){if(!Object.hasOwn(interruptModes,mode))throw new RangeError('方式が不正です。');return {mode,time:0,work:0,done:false,history:[],message:'装置は動き始めました。'};}
export function interruptStep(state,action){
 if(state.done||!['poll','work','service'].includes(action))throw new RangeError('操作できません。');
 const expected=state.time<3?(state.mode==='poll'?'poll':'work'):'service';
 if(action!==expected)return {...state,message:state.time>=3?'装置が完了しています。結果を受け取り、処理を終えましょう。':state.mode==='poll'?'この方式では毎刻、装置の状態を確認します。':'この方式では鐘が鳴るまで別の仕事を進めます。'};
 const time=state.time+1,work=state.work+(action==='work'?1:0),done=action==='service';
 const message=done?'装置の結果を受け取り、元の仕事に戻りました。':time===3?(state.mode==='poll'?'３回目の確認で装置の完了が分かりました。':'装置が完了し、割込みの鐘が鳴りました。'):action==='poll'?'確認しましたが、装置はまだ動いています。':'別の仕事を１刻進めました。';
 return {...state,time,work,done,history:[...state.history,action],message};
}
export function createInterrupt(){return {selected:'poll',states:Object.fromEntries(Object.keys(interruptModes).map(id=>[id,createInterruptTrial(id)]))};}
export function restoreInterrupt(saved){if(!saved||!Object.hasOwn(interruptModes,saved.selected)||!saved.steps)throw new RangeError('途中記録が不正です。');const result=createInterrupt();result.selected=saved.selected;for(const id of Object.keys(interruptModes)){const n=saved.steps[id];if(!Number.isInteger(n)||n<0||n>4)throw new RangeError('途中記録が不正です。');let state=result.states[id];for(let i=0;i<n;i++)state=interruptStep(state,i<3?(id==='poll'?'poll':'work'):'service');result.states[id]=state;}return result;}
export function interruptComplete(set){return Object.values(set.states).every(state=>state.done);}
