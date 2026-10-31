export const syscallLevel={id:'protected-gate',number:'54',kind:'syscall',name:'守られた魔導装置',tag:'システムコールと保護',title:'装置に届く願い',story:'旅人の道具から王城の魔導装置を使うには、守りの門を通る必要があります。'};
export const syscallCases={direct:{name:'直接触れる',description:'旅人が装置に直接触れようとします。',path:['direct','deny']},allowed:{name:'許された依頼',description:'旅人が許可を持って門番に使用を頼みます。',path:['call','allow','return']},denied:{name:'許可のない依頼',description:'旅人は許可を持たずに門番へ使用を頼みます。',path:['call','deny','return']}};
export const syscallActions={direct:'装置に直接触れる',call:'門番へ依頼する',allow:'使用できる',deny:'使用を拒否される',return:'結果を持って戻る'};
export function createSyscall(){return {selected:'direct',actions:{direct:[],allowed:[],denied:[]}};}
export function syscallStatus(id,actions){
  const task=syscallCases[id];if(!task||!Array.isArray(actions)||actions.length>task.path.length||actions.some((a,i)=>a!==task.path[i]))throw new RangeError('途中記録が不正です。');
  const n=actions.length,done=n===task.path.length;
  const mode=id==='direct'||n===0||done?'利用者モード':'カーネルモード';
  const message=n===0?'最初の操作を選びましょう。':id==='direct'?(done?'直接触れる操作は拒否されました。':'保護された装置に直接触れようとしました。結果はどうなるでしょう？'):n===1?'門番に処理が渡りました。許可を確かめた結果は？':done?'結果を受け取り、旅人の処理に戻りました。':id==='allowed'?'許可があるため、門番は装置を使いました。':'許可がないため、門番は装置を使わず拒否しました。';
  return {done,mode,message};
}
export function syscallStep(id,actions,action){
  if(!Object.hasOwn(syscallActions,action))throw new RangeError('未知の操作です。');
  const state=syscallStatus(id,actions);if(state.done)throw new RangeError('試行は終了しています。');
  if(syscallCases[id].path[actions.length]!==action)return {actions:actions.slice(),message:actions.length===0?'この試練で指定されたアクセス方法を選びましょう。':id==='direct'?'利用者モードでは、この保護された装置への直接操作は認められません。':actions.length===1?'依頼には許可の有無が関係します。試練の条件を確認しましょう。':'門番の処理が終わったら、結果を持って旅人に戻ります。'};
  const next=[...actions,action];return {actions:next,message:syscallStatus(id,next).message};
}
export function restoreSyscall(saved){
  if(!saved||!Object.hasOwn(syscallCases,saved.selected)||!saved.actions)throw new RangeError('途中記録が不正です。');
  const actions={};for(const id of Object.keys(syscallCases)){syscallStatus(id,saved.actions[id]);actions[id]=saved.actions[id].slice();}return {selected:saved.selected,actions};
}
export function syscallComplete(state){return Object.keys(syscallCases).every(id=>syscallStatus(id,state.actions[id]).done);}
