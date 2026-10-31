export const processLevel={id:'waiting-workers',number:'53',kind:'process',name:'待っている仕事と動く仕事',tag:'プロセスの状態',title:'一つの炉で二つの仕事',story:'魔法炉は一度に一つの仕事しか進められません。職人Ａが材料の到着を待つ間に、職人Ｂの仕事を進めましょう。'};
export const processActions={runA:'Ａを炉で動かす',runB:'Ｂを炉で動かす',request:'Ａが材料を取り寄せる',arrive:'Ａの材料が届く',finishA:'Ａの仕事を終える',finishB:'Ｂの仕事を終える'};
export function createProcess(){return {A:'ready',B:'ready',cpu:null,io:'idle',overlap:false,history:[],message:'どちらかの仕事を炉で動かしましょう。'};}
export function processStep(state,action){
  if(!Object.hasOwn(processActions,action)||state.A==='done'&&state.B==='done')throw new RangeError('操作できません。');
  const next={...state,history:state.history.slice()};let message='';
  if(action==='runA'||action==='runB'){
    const id=action.slice(3);
    if(state.cpu!==null||state[id]!=='ready')return {...state,message:'炉が空いていて、実行待ちの仕事だけを動かせます。'};
    next[id]='running';next.cpu=id;message=`${id} が炉で動き始めました。`;
  }else if(action==='request'){
    if(state.cpu!=='A'||state.io!=='idle')return {...state,message:'Ａが炉で動き、まだ材料を頼んでいないときに取り寄せます。'};
    next.A='waiting';next.cpu=null;next.io='waiting';message='Ａは材料待ちになり、炉が空きました。';
  }else if(action==='arrive'){
    if(state.io!=='waiting')return {...state,message:'取り寄せ中の材料はありません。'};
    next.A='ready';next.io='done';next.overlap=state.cpu==='B'||state.overlap;message=state.cpu==='B'?'Ｂが動いている間に材料が届き、Ａは実行待ちになりました。':'材料が届き、Ａは実行待ちになりました。';
  }else{
    const id=action==='finishA'?'A':'B';
    if(state.cpu!==id||(id==='A'&&state.io!=='done'))return {...state,message:id==='A'?'Ａは材料が届いてから炉で動くと終えられます。':'Ｂが炉で動いているときに終えられます。'};
    next[id]='done';next.cpu=null;message=`${id} の仕事が終わり、炉が空きました。`;
  }
  next.history.push(action);next.message=message;return next;
}
export function restoreProcess(history){
  if(!Array.isArray(history)||history.length>7)throw new RangeError('途中記録が不正です。');
  let state=createProcess();for(const action of history){const next=processStep(state,action);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}return state;
}
export function processComplete(state){return state.A==='done'&&state.B==='done'&&state.overlap;}
