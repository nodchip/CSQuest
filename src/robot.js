export const robotLevel={id:'scout-automaton',number:'28',kind:'robot',name:'見習い自動人形の探索',tag:'センサーと移動',title:'人形と障害物を越えよう',story:'自動人形が薬草を届けます。目の前を調べ、向きと移動を選んで、二つの通路を安全に通りましょう。'};
export const maps={upper:{name:'北へ迂回する通路',blocked:[[1,1]]},lower:{name:'南へ迂回する通路',blocked:[[2,1],[1,0],[2,0]]}};
export const directions=[{name:'北',dx:0,dy:-1},{name:'東',dx:1,dy:0},{name:'南',dx:0,dy:1},{name:'西',dx:-1,dy:0}];
export const MAX_ACTIONS=30, MAX_MOVES=6;
const key=(x,y)=>`${x},${y}`;
export function createRobot(map){if(!Object.hasOwn(maps,map))throw new RangeError('未知の通路です。');return {map,x:0,y:1,direction:1,sensed:null,known:{'0,1':'visited'},actions:0,moves:0,status:'playing',message:'進行方向を調べてから進みましょう。'};}
export function ahead(state){const d=directions[state.direction],x=state.x+d.dx,y=state.y+d.dy;return {x,y,blocked:x<0||x>3||y<0||y>2||maps[state.map].blocked.some(([a,b])=>a===x&&b===y)};}
export function robotAction(state,action){
  if(!['left','right','scan','forward'].includes(action)||state.status!=='playing')throw new RangeError('操作できません。');
  if(action==='forward'&&state.sensed===null)return {...state,message:'前を調べてから進みましょう。'};
  const next={...state,known:{...state.known},actions:state.actions+1};
  if(action==='left'||action==='right'){next.direction=(state.direction+(action==='left'?3:1))%4;next.sensed=null;next.message=`${directions[next.direction].name}を向きました。前を調べましょう。`;}
  if(action==='scan'){const point=ahead(state);next.sensed=point.blocked?'blocked':'clear';if(point.x>=0&&point.x<=3&&point.y>=0&&point.y<=2)next.known[key(point.x,point.y)]=point.blocked?'blocked':'clear';next.message=point.blocked?'前方に障害物があります。向きを変えましょう。':'前方は空いています。';}
  if(action==='forward'){
    if(state.sensed==='blocked'){next.status='failed';next.message='障害物にぶつかり、配送を中止しました。もう一度試しましょう。';}
    else {const point=ahead(state);next.x=point.x;next.y=point.y;next.moves++;next.sensed=null;next.known[key(next.x,next.y)]='visited';if(next.x===3&&next.y===1){next.status='found';next.message='目的地に薬草を届けました！';}else if(next.moves>=MAX_MOVES){next.status='failed';next.message='移動の力を使い切りました。もう一度試しましょう。';}else next.message='一歩進みました。もう一度、前を調べましょう。';}
  }
  if(next.status==='playing'&&next.actions>=MAX_ACTIONS){next.status='failed';next.message='操作回数を使い切りました。もう一度試しましょう。';}
  return next;
}
export function restoreRobot(saved){
  if(!saved||!Object.hasOwn(maps,saved.selected)||!saved.steps)throw new RangeError('途中記録が不正です。');
  const states={};
  for(const id of Object.keys(maps)){
    const steps=saved.steps[id];if(!Array.isArray(steps)||steps.length>MAX_ACTIONS||steps.some(a=>typeof a!=='string'))throw new RangeError('途中記録が不正です。');
    let state=createRobot(id);for(const action of steps){const next=robotAction(state,action);if(next.actions!==state.actions+1)throw new RangeError('途中記録が不正です。');state=next;}states[id]=state;
  }
  return {selected:saved.selected,steps:Object.fromEntries(Object.keys(maps).map(id=>[id,saved.steps[id].slice()])),states};
}
