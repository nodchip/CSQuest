export const collisionLevel={id:'spell-collision',number:'94',kind:'collision',name:'壁を通り抜ける魔法',tag:'ゲームの衝突判定',title:'魔法の進み方を確かめよう',story:'工房の魔法がときどき壁を通り抜けます。進む速さと当たりを調べる方法を変えて、原因を探しましょう。'};
export const collisionModes={sample:'移動後の位置だけ',swept:'移動した区間'};
export const collisionSpeeds={slow:{name:'ゆっくり：１回に２',distance:2},fast:{name:'速く：１回に10',distance:10}};
export const collisionCases={miss:{name:'通り抜けを再現',speed:'fast',mode:'sample',result:'passed'},sweep:{name:'区間で見つける',speed:'fast',mode:'swept',result:'detected'},small:{name:'細かく進む',speed:'slow',mode:'sample',result:'detected'}};
export function sweptIntersection(start,end,left,right){
  if(![start,end,left,right].every(Number.isFinite)||left>right)throw new RangeError('区間が不正です。');
  return Math.max(Math.min(start,end),left)<=Math.min(Math.max(start,end),right);
}
export function createCollision(speed='slow',mode='sample'){if(!Object.hasOwn(collisionSpeeds,speed)||!Object.hasOwn(collisionModes,mode))throw new RangeError('設定が不正です。');return {speed,mode,position:0,previous:0,status:'travel',steps:0,message:'魔法を１回進めてみましょう。'};}
export function collisionStep(state){
  if(state.status!=='travel')throw new RangeError('試行は終了しています。');
  const start=state.position,end=Math.min(10,start+collisionSpeeds[state.speed].distance),hit=state.mode==='sample'?end>=4&&end<=6:sweptIntersection(start,end,4,6),position=hit&&state.mode==='swept'?Math.max(start,4):end;
  const status=hit?'detected':end===10?'passed':'travel';
  return {...state,previous:start,position,status,steps:state.steps+1,message:status==='detected'?'壁との接触を見つけました。':status==='passed'?'終点に達しました。壁との接触は検出されませんでした。':`位置 ${end} まで進みました。`};
}
export function collisionCorrect(id,state){if(!Object.hasOwn(collisionCases,id))throw new RangeError('未知の試練です。');const goal=collisionCases[id];return state.speed===goal.speed&&state.mode===goal.mode&&state.status===goal.result;}
export function createCollisionSet(){return {selected:'miss',states:Object.fromEntries(Object.keys(collisionCases).map(id=>[id,createCollision()]))};}
export function restoreCollision(saved){
  if(!saved||!Object.hasOwn(collisionCases,saved.selected)||!saved.states)throw new RangeError('途中記録が不正です。');const result=createCollisionSet();result.selected=saved.selected;
  for(const id of Object.keys(collisionCases)){const t=saved.states[id];if(!t||!Number.isInteger(t.steps)||t.steps<0||t.steps>5)throw new RangeError('途中記録が不正です。');let state=createCollision(t.speed,t.mode);for(let i=0;i<t.steps;i++)state=collisionStep(state);result.states[id]=state;}return result;
}
export function collisionComplete(state){return Object.keys(collisionCases).every(id=>collisionCorrect(id,state.states[id]));}
